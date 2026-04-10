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
  return {
    name: f("name"),
    email: f("email"),
    phone: f("phone").replace(/\D/g, ""),
    city: f("city"),
    course: f("course"),
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

export async function captureLeadInLeadSquared(payload: LeadFormPayload) {
  const env = getLeadFlowEnv();
  const leadAttributes = [
    { Attribute: "FirstName", Value: payload.name },
    { Attribute: "EmailAddress", Value: payload.email },
    { Attribute: "Phone", Value: payload.phone },
    { Attribute: "mx_City", Value: payload.city },
    { Attribute: "mx_Course_Interested_In", Value: payload.course },
    { Attribute: "Source", Value: payload.source },
    { Attribute: "SourceCampaign", Value: payload.utm.campaign },
    { Attribute: "SourceMedium", Value: payload.utm.medium },
    { Attribute: "SourceContent", Value: payload.utm.content },
    { Attribute: "mx_campaignid", Value: payload.utm.campaignid },
    { Attribute: "mx_adgroupid", Value: payload.utm.adgroupid },
    { Attribute: "mx_creativeid", Value: payload.utm.creativeid },
    { Attribute: "mx_keyword", Value: payload.utm.keyword },
    { Attribute: "mx_matchtype", Value: payload.utm.matchtype },
    { Attribute: "mx_network", Value: payload.utm.network },
    { Attribute: "mx_GCLID", Value: payload.utm.gclid },
    { Attribute: "mx_OTP_Status", Value: "Not Verified" },
  ];
  const data = JSON.stringify([
    ...leadAttributes,
    { Attribute: "SearchBy", Value: "Phone" },
  ]);

  const res = await fetch(
    `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture?accessKey=${encodeURIComponent(
      env.lsqAccessKey
    )}&secretKey=${encodeURIComponent(env.lsqSecretKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    }
  );

  const rawResponse = await res.text();
  if (!res.ok) {
    if (rawResponse.includes("MXDuplicateEntryException")) {
      const updatedLead = await updateExistingLeadInLeadSquared(
        payload,
        leadAttributes
      );
      return {
        leadId: updatedLead.leadId,
        rawResponse: updatedLead.rawResponse,
        statusLabel: "Updated Existing Lead",
      };
    }

    throw new Error(
      `LeadSquared capture failed with ${res.status}: ${rawResponse.slice(0, 300)}`
    );
  }

  const json = JSON.parse(rawResponse) as { Message?: { Id?: string } };
  return {
    leadId: json.Message?.Id ?? "",
    rawResponse,
    statusLabel: "Captured",
  };
}

async function updateExistingLeadInLeadSquared(
  payload: LeadFormPayload,
  leadAttributes: Array<{ Attribute: string; Value: string }>
) {
  const env = getLeadFlowEnv();
  const searchRes = await fetch(
    `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Leads.GetByPhoneNumber?accessKey=${encodeURIComponent(
      env.lsqAccessKey
    )}&secretKey=${encodeURIComponent(env.lsqSecretKey)}&phone=${encodeURIComponent(
      payload.phone
    )}`
  );

  const searchRawResponse = await searchRes.text();
  if (!searchRes.ok) {
    throw new Error(
      `LeadSquared phone search failed with ${searchRes.status}: ${searchRawResponse.slice(
        0,
        300
      )}`
    );
  }

  const searchJson = JSON.parse(searchRawResponse) as Array<{ ProspectID?: string }>;
  const leadId = searchJson[0]?.ProspectID ?? "";

  if (!leadId) {
    throw new Error("LeadSquared duplicate detected but no existing phone lead was found");
  }

  const updateRes = await fetch(
    `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Update?accessKey=${encodeURIComponent(
      env.lsqAccessKey
    )}&secretKey=${encodeURIComponent(env.lsqSecretKey)}&leadId=${encodeURIComponent(leadId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadAttributes),
    }
  );

  const rawResponse = await updateRes.text();
  if (!updateRes.ok) {
    throw new Error(
      `LeadSquared update failed with ${updateRes.status}: ${rawResponse.slice(0, 300)}`
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

export async function startLeadCapture(
  payload: LeadFormPayload,
  forwardedFor: string | null
): Promise<LeadCaptureResult> {
  const otp = String(Math.floor(1000 + Math.random() * 9000));
  const leadDocId = await insertLeadRecord(payload, forwardedFor, otp);
  const db = await getMongoDb();

  try {
    await sendOtpSms(payload.phone, otp);
    await db.collection(LEADS_COLLECTION).updateOne(
      { _id: new ObjectId(leadDocId) },
      {
        $set: {
          smsStatus: "Sent",
          updatedAt: new Date(),
        },
      }
    );
  } catch (error) {
    await db.collection(LEADS_COLLECTION).updateOne(
      { _id: new ObjectId(leadDocId) },
      {
        $set: {
          smsStatus: "Failed",
          updatedAt: new Date(),
        },
      }
    );
    throw error;
  }

  let leadId = "";

  try {
    const captureResult = await captureLeadInLeadSquared(payload);
    leadId = captureResult.leadId;
    await db.collection(LEADS_COLLECTION).updateOne(
      { _id: new ObjectId(leadDocId) },
      {
        $set: {
          leadSquaredLeadId: leadId,
          leadSquaredCaptureStatus:
            captureResult.statusLabel ??
            (leadId ? "Captured" : "No Lead Id Returned"),
          leadSquaredCaptureError: "",
          updatedAt: new Date(),
        },
      }
    );
  } catch (error) {
    await db.collection(LEADS_COLLECTION).updateOne(
      { _id: new ObjectId(leadDocId) },
      {
        $set: {
          leadSquaredCaptureStatus: "Failed",
          leadSquaredCaptureError:
            error instanceof Error ? error.message : "LeadSquared capture failed",
          updatedAt: new Date(),
        },
      }
    );
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
  if (leadId) {
    cookieStore.set("asb_lsq_lead_id", leadId, { httpOnly: true, path: "/", sameSite: "lax" });
  }

  return { leadDocId, leadId, otp };
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
  const email = cookieStore.get("asb_lead_email")?.value ?? "";
  const leadId = cookieStore.get("asb_lsq_lead_id")?.value ?? "";

  if (!otp || otp !== savedOtp || !leadDocId || !phone) {
    return false;
  }

  const db = await getMongoDb();
  const objectId = new ObjectId(leadDocId);
  const existingLead = await db.collection(LEADS_COLLECTION).findOne({ _id: objectId });
  if (!existingLead || existingLead.otp !== otp) {
    return false;
  }

  await db.collection(LEADS_COLLECTION).updateOne(
    { _id: objectId },
    {
      $set: {
        otpStatus: "Verified",
        otpVerifiedAt: new Date(),
        updatedAt: new Date(),
      },
    }
  );

  let leadUpdated = false;

  try {
    if (leadId) {
      leadUpdated = await updateLeadSquaredOtpStatusByLeadId(leadId);
    }

    if (!leadUpdated) {
      leadUpdated = await updateLeadSquaredOtpStatusByPhone(phone);
    }

    if (!leadUpdated) {
      await captureLeadSquaredVerifiedFallback(phone, email);
    }

    await updateLeadSquaredVerifyState(
      leadDocId,
      leadUpdated ? "Verified Synced" : "Fallback Capture Attempted"
    );
  } catch (error) {
    await updateLeadSquaredVerifyState(
      leadDocId,
      "Failed",
      error instanceof Error ? error.message : "LeadSquared verify sync failed"
    );
  }

  cookieStore.delete("asb_lead_otp");

  return true;
}

async function updateLeadSquaredOtpStatusByLeadId(leadId: string) {
  const env = getLeadFlowEnv();
  const res = await fetch(
    `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Update?accessKey=${encodeURIComponent(
      env.lsqAccessKey
    )}&secretKey=${encodeURIComponent(env.lsqSecretKey)}&leadId=${encodeURIComponent(leadId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ Attribute: "mx_OTP_Status", Value: "Verified" }]),
    }
  );

  if (!res.ok) {
    return false;
  }

  const json = (await res.json()) as { Status?: string };
  return json.Status === "Success";
}

async function updateLeadSquaredOtpStatusByPhone(phone: string) {
  const env = getLeadFlowEnv();
  const searchRes = await fetch(
    `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Leads.GetByPhoneNumber?accessKey=${encodeURIComponent(
      env.lsqAccessKey
    )}&secretKey=${encodeURIComponent(env.lsqSecretKey)}&phone=${encodeURIComponent(phone)}`
  );

  if (!searchRes.ok) {
    return false;
  }

  const searchJson = (await searchRes.json()) as Array<{ ProspectID?: string }>;
  const foundLeadId = searchJson[0]?.ProspectID;
  if (!foundLeadId) {
    return false;
  }

  return updateLeadSquaredOtpStatusByLeadId(foundLeadId);
}

async function captureLeadSquaredVerifiedFallback(phone: string, email: string) {
  const env = getLeadFlowEnv();
  await fetch(
    `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture?accessKey=${encodeURIComponent(
      env.lsqAccessKey
    )}&secretKey=${encodeURIComponent(env.lsqSecretKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        { Attribute: "mx_OTP_Status", Value: "Verified" },
        { Attribute: "EmailAddress", Value: email },
        { Attribute: "Phone", Value: phone },
        { Attribute: "SearchBy", Value: "Phone" },
      ]),
    }
  );
}

async function updateLeadSquaredVerifyState(
  leadDocId: string,
  status: string,
  error = ""
) {
  const db = await getMongoDb();
  await db.collection(LEADS_COLLECTION).updateOne(
    { _id: new ObjectId(leadDocId) },
    {
      $set: {
        leadSquaredVerifyStatus: status,
        leadSquaredVerifyError: error,
        updatedAt: new Date(),
      },
    }
  );
}

export async function getThankYouLeadCookieData() {
  const cookieStore = await cookies();
  const applicantName = decodeURIComponent(cookieStore.get("asb_lead_name")?.value ?? "").trim();
  const course = decodeURIComponent(cookieStore.get("asb_lead_course")?.value ?? "").trim();
  return { applicantName, course };
}
