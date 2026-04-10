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

async function findLeadSquaredLeadId(phone: string, email?: string) {
  return (
    (phone ? await findLeadSquaredLeadIdByPhone(phone) : "") ||
    (email ? await findLeadSquaredLeadIdByEmail(email) : "")
  );
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

async function recoverAndUpdateLead(
  payload: LeadFormPayload,
  leadAttributes: LeadSquaredAttribute[],
  otpStatus: "Not Verified" | "Verified"
) {
  const recoveredLeadId = await findLeadSquaredLeadId(payload.phone, payload.email);
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

async function upsertLeadInLeadSquared(
  payload: LeadFormPayload,
  otpStatus: "Not Verified" | "Verified"
): Promise<LeadSquaredSyncResult> {
  const leadAttributes = buildLeadSquaredAttributes(payload, otpStatus);
  const existingLeadId = await findLeadSquaredLeadId(payload.phone, payload.email);

  if (existingLeadId) {
    const updated = await updateLeadInLeadSquared(existingLeadId, leadAttributes);
    return {
      leadId: updated.leadId,
      rawResponse: updated.rawResponse,
      statusLabel:
        otpStatus === "Verified" ? "Updated Existing Lead as Verified" : "Updated Existing Lead",
    };
  }

  const captureAttempts: Array<"Phone" | "EmailAddress"> = [];
  if (payload.phone) captureAttempts.push("Phone");
  if (payload.email) captureAttempts.push("EmailAddress");

  let lastFailure = "LeadSquared capture could not be completed";

  for (const searchBy of captureAttempts) {
    const captureRes = await createLeadInLeadSquared(leadAttributes, searchBy);

    if (captureRes.ok) {
      return {
        leadId: parseLeadSquaredLeadId(captureRes.rawResponse),
        rawResponse: captureRes.rawResponse,
        statusLabel:
          otpStatus === "Verified"
            ? "Captured as Verified"
            : searchBy === "EmailAddress"
              ? "Captured via Email Match"
              : "Captured",
      };
    }

    if (captureRes.rawResponse.includes("MXDuplicateEntryException")) {
      const duplicateLeadId = await findLeadSquaredLeadId(payload.phone, payload.email);
      if (duplicateLeadId) {
        const updated = await updateLeadInLeadSquared(duplicateLeadId, leadAttributes);
        return {
          leadId: updated.leadId,
          rawResponse: updated.rawResponse,
          statusLabel:
            otpStatus === "Verified"
              ? "Updated Existing Lead as Verified"
              : "Updated Existing Lead",
        };
      }
    }

    const recoveredLead = await recoverAndUpdateLead(payload, leadAttributes, otpStatus);
    if (recoveredLead) {
      return recoveredLead;
    }

    lastFailure = `LeadSquared capture failed with ${captureRes.status}: ${captureRes.rawResponse.slice(0, 300)}`;
  }

  throw new Error(lastFailure);
}

export async function captureLeadInLeadSquared(payload: LeadFormPayload) {
  return upsertLeadInLeadSquared(payload, "Not Verified");
}

async function verifyLeadInLeadSquared(payload: LeadFormPayload) {
  return upsertLeadInLeadSquared(payload, "Verified");
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

  await sendOtpSms(phone, otp);
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
  return { applicantName, course, courseLabel };
}
