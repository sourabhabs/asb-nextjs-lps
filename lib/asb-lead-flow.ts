import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { getMongoDb } from "@/lib/mongodb";

const LEADS_COLLECTION = "asb_leads";

export type LeadFormPayload = {
  name: string;
  email: string;
  phone: string;
  city: string;
  course: string;
  courseLabel: string;
  query: string;
  source: string;
  pageUrl: string;
  utm: Record<string, string>;
};

type LeadFlowEnv = {
  lsqAccessKey: string;
  lsqSecretKey: string;
  smsUsername: string;
  smsPassword: string;
  smsSenderId: string;
  smsTemplateId: string;
};

type LeadCaptureResult = {
  leadDocId: string;
  leadId: string;
  otp: string;
};

type LeadSquaredSyncResult = {
  leadId: string;
  rawResponse: string;
  statusLabel: string;
};

type LeadSquaredAttribute = {
  Attribute: string;
  Value: string;
};

const COURSE_LABEL_BY_VALUE: Record<string, string> = {
  BBA: "BBA",
  IBBA: "BBA International",
  BCA: "BCA",
  IBCA: "BCA International",
  BCOM: "B.Com",
  IBCOM: "B.Com International",
  "BSc CS": "B.Sc. Computer Science",
  "IBSc CS": "B.Sc. Computer Science International",
  "B.Com (Hons)": "B.Com (Hons)",
  "B.Sc (Hons)": "B.Sc (Hons)",
  "IPM (BBA+PGDM)": "IPM (BBA+PGDM)",
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getLeadFlowEnv(): LeadFlowEnv {
  return {
    lsqAccessKey: requireEnv("LSQ_ACCESS_KEY"),
    lsqSecretKey: requireEnv("LSQ_SECRET_KEY"),
    smsUsername: requireEnv("SMS_USERNAME"),
    smsPassword: requireEnv("SMS_PASSWORD"),
    smsSenderId: requireEnv("SMS_SENDER_ID"),
    smsTemplateId: requireEnv("SMS_TEMPLATE_ID"),
  };
}

function getLeadSource(source: string, pageUrl: string) {
  return [source, pageUrl].filter(Boolean).join(" - ");
}

function getClientIp(forwardedFor: string | null) {
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

export function normalizeLeadPayload(formData: FormData): LeadFormPayload {
  const f = (key: string) => (formData.get(key) as string | null)?.trim() ?? "";
  const course = f("course");
  const courseLabel = f("course_label") || COURSE_LABEL_BY_VALUE[course] || course;
  return {
    name: f("name"),
    email: f("email"),
    phone: f("phone").replace(/\D/g, ""),
    city: f("city"),
    course,
    courseLabel,
    query: f("query") || "ASB UG Admissions 2026 Landing",
    source: f("source"),
    pageUrl: f("page_url"),
    utm: {
      medium: f("utm_medium"),
      campaign: f("utm_campaign"),
      content: f("utm_content"),
      campaignid: f("utm_campaignid"),
      adgroupid: f("utm_adgroupid"),
      creativeid: f("utm_creativeid"),
      keyword: f("utm_keyword"),
      matchtype: f("utm_matchtype"),
      network: f("utm_network"),
      gclid: f("utm_gclid"),
    },
  };
}

export function validateLeadPayload(payload: LeadFormPayload) {
  if (
    !payload.name ||
    !payload.email ||
    !payload.phone ||
    payload.phone.length !== 10 ||
    !payload.city ||
    !payload.course
  ) {
    return "Missing required fields";
  }

  return "";
}

async function insertLeadRecord(
  payload: LeadFormPayload,
  forwardedFor: string | null,
  otp: string
) {
  const db = await getMongoDb();
  const result = await db.collection(LEADS_COLLECTION).insertOne({
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    city: payload.city,
    course: payload.course,
    courseLabel: payload.courseLabel,
    query: payload.query,
    source: getLeadSource(payload.source, payload.pageUrl),
    sourceRaw: payload.source,
    pageUrl: payload.pageUrl,
    utm: payload.utm,
    ip: getClientIp(forwardedFor),
    otp,
    otpStatus: "Not Verified",
    smsStatus: "Pending",
    leadSquaredLeadId: "",
    leadSquaredCaptureStatus: "Pending",
    leadSquaredCaptureError: "",
    leadSquaredVerifyStatus: "Pending",
    leadSquaredVerifyError: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    otpVerifiedAt: null,
  });

  return result.insertedId.toString();
}

async function updateLeadRecord(leadDocId: string, fields: Record<string, unknown>) {
  const db = await getMongoDb();
  await db.collection(LEADS_COLLECTION).updateOne(
    { _id: new ObjectId(leadDocId) },
    {
      $set: {
        ...fields,
        updatedAt: new Date(),
      },
    }
  );
}

export async function sendOtpSms(phone: string, otp: string) {
  const env = getLeadFlowEnv();
  const params = new URLSearchParams({
    username: env.smsUsername,
    password: env.smsPassword,
    senderid: env.smsSenderId,
    dndrefund: "1",
    tid: env.smsTemplateId,
    message: `${otp} is your OTP. It will be valid for 5 minutes - Asian School of Business, Noida`,
    numbers: phone,
  });

  const res = await fetch(`https://web.insignsms.com/api/sendsms?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`SMS provider responded with ${res.status}`);
  }
}

function buildLeadSquaredAttributes(
  payload: LeadFormPayload,
  otpStatus: "Not Verified" | "Verified"
): LeadSquaredAttribute[] {
  return [
    { Attribute: "FirstName", Value: payload.name },
    { Attribute: "EmailAddress", Value: payload.email },
    { Attribute: "Phone", Value: payload.phone },
    { Attribute: "mx_City", Value: payload.city },
    { Attribute: "mx_Course_Interested_In", Value: payload.courseLabel || payload.course },
    { Attribute: "Source", Value: payload.source },
    { Attribute: "SourceCampaign", Value: payload.utm.campaign ?? "" },
    { Attribute: "SourceMedium", Value: payload.utm.medium ?? "" },
    { Attribute: "SourceContent", Value: payload.utm.content ?? "" },
    { Attribute: "mx_campaignid", Value: payload.utm.campaignid ?? "" },
    { Attribute: "mx_adgroupid", Value: payload.utm.adgroupid ?? "" },
    { Attribute: "mx_creativeid", Value: payload.utm.creativeid ?? "" },
    { Attribute: "mx_keyword", Value: payload.utm.keyword ?? "" },
    { Attribute: "mx_matchtype", Value: payload.utm.matchtype ?? "" },
    { Attribute: "mx_network", Value: payload.utm.network ?? "" },
    { Attribute: "mx_GCLID", Value: payload.utm.gclid ?? "" },
    { Attribute: "mx_OTP_Status", Value: otpStatus },
  ];
}

function toLeadPayloadFromRecord(
  lead: Partial<{
    name: string;
    email: string;
    phone: string;
    city: string;
    course: string;
    courseLabel: string;
    query: string;
    sourceRaw: string;
    pageUrl: string;
    utm: Record<string, string | undefined>;
  }>
): LeadFormPayload {
  return {
    name: String(lead.name ?? ""),
    email: String(lead.email ?? ""),
    phone: String(lead.phone ?? ""),
    city: String(lead.city ?? ""),
    course: String(lead.course ?? ""),
    courseLabel: String(lead.courseLabel ?? lead.course ?? ""),
    query: String(lead.query ?? "ASB UG Admissions 2026 Landing"),
    source: String(lead.sourceRaw ?? ""),
    pageUrl: String(lead.pageUrl ?? ""),
    utm: {
      medium: String(lead.utm?.medium ?? ""),
      campaign: String(lead.utm?.campaign ?? ""),
      content: String(lead.utm?.content ?? ""),
      campaignid: String(lead.utm?.campaignid ?? ""),
      adgroupid: String(lead.utm?.adgroupid ?? ""),
      creativeid: String(lead.utm?.creativeid ?? ""),
      keyword: String(lead.utm?.keyword ?? ""),
      matchtype: String(lead.utm?.matchtype ?? ""),
      network: String(lead.utm?.network ?? ""),
      gclid: String(lead.utm?.gclid ?? ""),
    },
  };
}

async function createLeadInLeadSquared(
  leadAttributes: LeadSquaredAttribute[],
  searchBy: "Phone" | "EmailAddress"
) {
  const env = getLeadFlowEnv();
  const res = await fetch(
    `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture?accessKey=${encodeURIComponent(
      env.lsqAccessKey
    )}&secretKey=${encodeURIComponent(env.lsqSecretKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        ...leadAttributes,
        { Attribute: "SearchBy", Value: searchBy },
      ]),
    }
  );

  return {
    ok: res.ok,
    status: res.status,
    rawResponse: await res.text(),
  };
}

async function updateLeadInLeadSquared(
  leadId: string,
  leadAttributes: LeadSquaredAttribute[]
) {
  const env = getLeadFlowEnv();
  const res = await fetch(
    `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Update?accessKey=${encodeURIComponent(
      env.lsqAccessKey
    )}&secretKey=${encodeURIComponent(env.lsqSecretKey)}&leadId=${encodeURIComponent(leadId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadAttributes),
    }
  );

  const rawResponse = await res.text();
  if (!res.ok) {
    throw new Error(
      `LeadSquared update failed with ${res.status}: ${rawResponse.slice(0, 300)}`
    );
  }

  const json = JSON.parse(rawResponse) as { Status?: string };
  if (json.Status !== "Success") {
    throw new Error(`LeadSquared update did not succeed: ${rawResponse.slice(0, 300)}`);
  }

  return {
    leadId,
    rawResponse,
  };
}

function parseLeadSquaredLeadId(rawResponse: string) {
  const json = JSON.parse(rawResponse) as { Message?: { Id?: string } };
  return json.Message?.Id ?? "";
}

function isLeadSquaredDuplicateError(rawResponse: string) {
  return rawResponse.includes("MXDuplicateEntryException");
}

function isLeadSquaredDuplicateEmailError(rawResponse: string) {
  return rawResponse.includes("same Email already exists");
}

function isLeadSquaredDuplicatePhoneError(rawResponse: string) {
  return rawResponse.includes("same Phone Number already exists");
}

async function findLeadSquaredLeadIdByPhone(phone: string) {
  const env = getLeadFlowEnv();
  const searchRes = await fetch(
    `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Leads.GetByPhoneNumber?accessKey=${encodeURIComponent(
      env.lsqAccessKey
    )}&secretKey=${encodeURIComponent(env.lsqSecretKey)}&phone=${encodeURIComponent(phone)}`
  );

  const rawResponse = await searchRes.text();
  if (searchRes.status === 404) {
    return "";
  }

  if (!searchRes.ok) {
    throw new Error(
      `LeadSquared phone search failed with ${searchRes.status}: ${rawResponse.slice(0, 300)}`
    );
  }

  const json = JSON.parse(rawResponse) as Array<{ ProspectID?: string }>;
  return json[0]?.ProspectID ?? "";
}

async function findLeadSquaredLeadIdByEmail(email: string) {
  const env = getLeadFlowEnv();
  const searchRes = await fetch(
    `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Leads.GetByEmailaddress?accessKey=${encodeURIComponent(
      env.lsqAccessKey
    )}&secretKey=${encodeURIComponent(env.lsqSecretKey)}&emailaddress=${encodeURIComponent(
      email
    )}`
  );

  const rawResponse = await searchRes.text();
  if (searchRes.status === 404) {
    return "";
  }

  if (!searchRes.ok) {
    throw new Error(
      `LeadSquared email search failed with ${searchRes.status}: ${rawResponse.slice(0, 300)}`
    );
  }

  const json = JSON.parse(rawResponse) as Array<{ ProspectID?: string }>;
  return json[0]?.ProspectID ?? "";
}

function filterLeadSquaredAttributes(
  leadAttributes: LeadSquaredAttribute[],
  excluded: string[]
) {
  const excludedSet = new Set(excluded);
  return leadAttributes.filter((attribute) => !excludedSet.has(attribute.Attribute));
}

async function updateExistingLeadByEmail(
  payload: LeadFormPayload,
  leadAttributes: LeadSquaredAttribute[],
  otpStatus: "Not Verified" | "Verified"
) {
  if (!payload.email) {
    return null;
  }

  const leadId = await findLeadSquaredLeadIdByEmail(payload.email);
  if (!leadId) {
    return null;
  }

  const updated = await updateLeadInLeadSquared(
    leadId,
    filterLeadSquaredAttributes(leadAttributes, ["Phone"])
  );
  return {
    leadId: updated.leadId,
    rawResponse: updated.rawResponse,
    statusLabel:
      otpStatus === "Verified"
        ? "Updated Existing Lead by Email as Verified"
        : "Updated Existing Lead by Email",
  } satisfies LeadSquaredSyncResult;
}

async function updateExistingLeadByPhone(
  payload: LeadFormPayload,
  leadAttributes: LeadSquaredAttribute[],
  otpStatus: "Not Verified" | "Verified"
) {
  if (!payload.phone) {
    return null;
  }

  const leadId = await findLeadSquaredLeadIdByPhone(payload.phone);
  if (!leadId) {
    return null;
  }

  const updated = await updateLeadInLeadSquared(
    leadId,
    filterLeadSquaredAttributes(leadAttributes, ["EmailAddress"])
  );
  return {
    leadId: updated.leadId,
    rawResponse: updated.rawResponse,
    statusLabel:
      otpStatus === "Verified"
        ? "Updated Existing Lead by Phone as Verified"
        : "Updated Existing Lead by Phone",
  } satisfies LeadSquaredSyncResult;
}

async function recoverAndUpdateLead(
  payload: LeadFormPayload,
  leadAttributes: LeadSquaredAttribute[],
  otpStatus: "Not Verified" | "Verified"
) {
  const recoveredLeadId = payload.phone
    ? await findLeadSquaredLeadIdByPhone(payload.phone)
    : "";
  if (!recoveredLeadId) {
    return null;
  }

  const updated = await updateLeadInLeadSquared(recoveredLeadId, leadAttributes);
  return {
    leadId: updated.leadId,
    rawResponse: updated.rawResponse,
    statusLabel:
      otpStatus === "Verified"
        ? "Recovered and Updated as Verified"
        : "Recovered and Updated Existing Lead",
  } satisfies LeadSquaredSyncResult;
}

export async function captureLeadInLeadSquared(payload: LeadFormPayload) {
  const leadAttributes = buildLeadSquaredAttributes(payload, "Not Verified");
  let lastFailure = "LeadSquared capture could not be completed";

  if (payload.phone) {
    const captureByPhone = await createLeadInLeadSquared(leadAttributes, "Phone");
    if (captureByPhone.ok) {
      return {
        leadId: parseLeadSquaredLeadId(captureByPhone.rawResponse),
        rawResponse: captureByPhone.rawResponse,
        statusLabel: "Captured",
      };
    }

    if (isLeadSquaredDuplicateError(captureByPhone.rawResponse)) {
      if (payload.email && isLeadSquaredDuplicateEmailError(captureByPhone.rawResponse)) {
        const updatedByEmail = await updateExistingLeadByEmail(
          payload,
          leadAttributes,
          "Not Verified"
        );
        if (updatedByEmail) {
          return updatedByEmail;
        }
      }

      if (isLeadSquaredDuplicatePhoneError(captureByPhone.rawResponse)) {
        const updatedByPhone = await updateExistingLeadByPhone(
          payload,
          leadAttributes,
          "Not Verified"
        );
        if (updatedByPhone) {
          return updatedByPhone;
        }
      }

      const duplicatePhoneLeadId = await findLeadSquaredLeadIdByPhone(payload.phone);
      if (duplicatePhoneLeadId) {
        const updated = await updateLeadInLeadSquared(
          duplicatePhoneLeadId,
          filterLeadSquaredAttributes(leadAttributes, ["EmailAddress"])
        );
        return {
          leadId: updated.leadId,
          rawResponse: updated.rawResponse,
          statusLabel: "Updated Existing Lead",
        };
      }
    }

    lastFailure = `LeadSquared capture failed with ${captureByPhone.status}: ${captureByPhone.rawResponse.slice(0, 300)}`;
  }

  if (!payload.phone && payload.email) {
    const captureByEmail = await createLeadInLeadSquared(leadAttributes, "EmailAddress");
    if (captureByEmail.ok) {
      return {
        leadId: parseLeadSquaredLeadId(captureByEmail.rawResponse),
        rawResponse: captureByEmail.rawResponse,
        statusLabel: "Captured via Email Match",
      };
    }
    lastFailure = `LeadSquared capture failed with ${captureByEmail.status}: ${captureByEmail.rawResponse.slice(0, 300)}`;
  }

  const recoveredLead = await recoverAndUpdateLead(payload, leadAttributes, "Not Verified");
  if (recoveredLead) {
    return recoveredLead;
  }

  throw new Error(lastFailure);
}

async function verifyLeadInLeadSquared(payload: LeadFormPayload) {
  const otpOnlyAttributes: LeadSquaredAttribute[] = [
    { Attribute: "mx_OTP_Status", Value: "Verified" },
  ];

  if (payload.phone) {
    const phoneLeadId = await findLeadSquaredLeadIdByPhone(payload.phone);
    if (phoneLeadId) {
      const updated = await updateLeadInLeadSquared(phoneLeadId, otpOnlyAttributes);
      return {
        leadId: updated.leadId,
        rawResponse: updated.rawResponse,
        statusLabel: "Updated Existing Lead as Verified",
      };
    }

    const verifyCaptureAttributes: LeadSquaredAttribute[] = [
      { Attribute: "mx_OTP_Status", Value: "Verified" },
      { Attribute: "EmailAddress", Value: payload.email },
      { Attribute: "Phone", Value: payload.phone },
    ];
    const captureByPhone = await createLeadInLeadSquared(verifyCaptureAttributes, "Phone");
    if (captureByPhone.ok) {
      return {
        leadId: parseLeadSquaredLeadId(captureByPhone.rawResponse),
        rawResponse: captureByPhone.rawResponse,
        statusLabel: "Captured as Verified",
      };
    }

    if (payload.email && isLeadSquaredDuplicateEmailError(captureByPhone.rawResponse)) {
      const updatedByEmail = await updateExistingLeadByEmail(
        payload,
        verifyCaptureAttributes,
        "Verified"
      );
      if (updatedByEmail) {
        return updatedByEmail;
      }
    }

    if (isLeadSquaredDuplicatePhoneError(captureByPhone.rawResponse)) {
      const updatedByPhone = await updateExistingLeadByPhone(
        payload,
        verifyCaptureAttributes,
        "Verified"
      );
      if (updatedByPhone) {
        return updatedByPhone;
      }
    }
  }

  if (!payload.phone && payload.email) {
    const verifyCaptureAttributes: LeadSquaredAttribute[] = [
      { Attribute: "mx_OTP_Status", Value: "Verified" },
      { Attribute: "EmailAddress", Value: payload.email },
    ];
    const captureByEmail = await createLeadInLeadSquared(verifyCaptureAttributes, "EmailAddress");
    if (captureByEmail.ok) {
      return {
        leadId: parseLeadSquaredLeadId(captureByEmail.rawResponse),
        rawResponse: captureByEmail.rawResponse,
        statusLabel: "Captured as Verified",
      };
    }
  }

  throw new Error("LeadSquared verify sync could not be completed");
}

export async function startLeadCapture(
  payload: LeadFormPayload,
  forwardedFor: string | null
): Promise<LeadCaptureResult> {
  const otp = String(Math.floor(1000 + Math.random() * 9000));
  const leadDocId = await insertLeadRecord(payload, forwardedFor, otp);

  try {
    await sendOtpSms(payload.phone, otp);
    await updateLeadRecord(leadDocId, {
      smsStatus: "Sent",
    });
  } catch (error) {
    await updateLeadRecord(leadDocId, {
      smsStatus: "Failed",
    });
    throw error;
  }

  const cookieStore = await cookies();
  cookieStore.set("asb_lead_doc_id", leadDocId, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  cookieStore.set("asb_lead_otp", otp, { httpOnly: true, path: "/", sameSite: "lax" });
  cookieStore.set("asb_lead_phone", payload.phone, { httpOnly: true, path: "/", sameSite: "lax" });
  cookieStore.set("asb_lead_email", payload.email, { httpOnly: true, path: "/", sameSite: "lax" });
  cookieStore.set("asb_lead_name", encodeURIComponent(payload.name), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  cookieStore.set("asb_lead_course", encodeURIComponent(payload.course), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  cookieStore.set("asb_lead_course_label", encodeURIComponent(payload.courseLabel), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  void syncLeadSquaredCapture(leadDocId, payload);

  return { leadDocId, leadId: "", otp };
}

export async function resendLeadOtp() {
  const cookieStore = await cookies();
  const phone = cookieStore.get("asb_lead_phone")?.value ?? "";
  const otp = cookieStore.get("asb_lead_otp")?.value ?? "";

  if (!phone || !otp) {
    throw new Error("Session expired. Please fill the form again.");
  }

  void sendOtpSms(phone, otp).catch((error) => {
    console.error("Failed to resend OTP SMS", error);
  });
}

export async function verifyLeadOtp(otp: string) {
  const cookieStore = await cookies();
  const savedOtp = cookieStore.get("asb_lead_otp")?.value ?? "";
  const leadDocId = cookieStore.get("asb_lead_doc_id")?.value ?? "";
  const phone = cookieStore.get("asb_lead_phone")?.value ?? "";
  if (!otp || otp !== savedOtp || !leadDocId || !phone) {
    return false;
  }

  const db = await getMongoDb();
  const objectId = new ObjectId(leadDocId);
  const existingLead = await db.collection(LEADS_COLLECTION).findOne({ _id: objectId });
  if (!existingLead || existingLead.otp !== otp) {
    return false;
  }

  await updateLeadRecord(leadDocId, {
    otpStatus: "Verified",
    otpVerifiedAt: new Date(),
  });

  cookieStore.delete("asb_lead_otp");
  cookieStore.delete("asb_lsq_lead_id");

  void syncLeadSquaredVerify(leadDocId);

  return true;
}

async function syncLeadSquaredCapture(leadDocId: string, payload: LeadFormPayload) {
  try {
    const captureResult = await captureLeadInLeadSquared(payload);
    await updateLeadRecord(leadDocId, {
      leadSquaredLeadId: captureResult.leadId,
      leadSquaredCaptureStatus:
        captureResult.statusLabel || (captureResult.leadId ? "Captured" : "No Lead Id Returned"),
      leadSquaredCaptureError: "",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "LeadSquared capture failed";

    await updateLeadRecord(leadDocId, {
      leadSquaredCaptureStatus: "Failed",
      leadSquaredCaptureError: message,
    });
  }
}

async function syncLeadSquaredVerify(leadDocId: string) {
  const db = await getMongoDb();
  const objectId = new ObjectId(leadDocId);
  const lead = await db.collection(LEADS_COLLECTION).findOne({ _id: objectId });

  if (!lead) {
    return;
  }

  try {
    const payload = toLeadPayloadFromRecord(
      lead as Parameters<typeof toLeadPayloadFromRecord>[0]
    );
    const verifyResult = await verifyLeadInLeadSquared(payload);
    const priorCaptureStatus = String(lead.leadSquaredCaptureStatus ?? "");
    const shouldRecoverCaptureStatus =
      !priorCaptureStatus ||
      priorCaptureStatus === "Pending" ||
      priorCaptureStatus === "Failed";

    await updateLeadRecord(leadDocId, {
      leadSquaredLeadId: verifyResult.leadId,
      leadSquaredVerifyStatus: verifyResult.statusLabel,
      leadSquaredVerifyError: "",
      ...(shouldRecoverCaptureStatus
        ? {
            leadSquaredCaptureStatus: "Recovered via Verify Sync",
            leadSquaredCaptureError: "",
          }
        : {}),
    });
  } catch (error) {
    await updateLeadRecord(leadDocId, {
      leadSquaredVerifyStatus: "Failed",
      leadSquaredVerifyError:
        error instanceof Error ? error.message : "LeadSquared verify sync failed",
    });
  }
}

export async function getThankYouLeadCookieData() {
  const cookieStore = await cookies();
  const applicantName = decodeURIComponent(cookieStore.get("asb_lead_name")?.value ?? "").trim();
  const course = decodeURIComponent(cookieStore.get("asb_lead_course")?.value ?? "").trim();
  const courseLabel = decodeURIComponent(
    cookieStore.get("asb_lead_course_label")?.value ?? ""
  ).trim();
  const email = cookieStore.get("asb_lead_email")?.value?.trim() ?? "";
  const phoneDigits = (cookieStore.get("asb_lead_phone")?.value ?? "").replace(/\D/g, "");

  let phoneE164 = "";
  if (phoneDigits.length === 10) {
    phoneE164 = `+91${phoneDigits}`;
  } else if (phoneDigits.length >= 11 && phoneDigits.length <= 15) {
    phoneE164 = `+${phoneDigits}`;
  }

  return { applicantName, course, courseLabel, email, phoneE164 };
}
