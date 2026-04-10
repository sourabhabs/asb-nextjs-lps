import { getMongoDb } from "@/lib/mongodb";

const LEADS_COLLECTION = "asb_leads";

export type LeadAdminDoc = {
  _id: unknown;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  course?: string;
  courseLabel?: string;
  otpStatus?: string;
  smsStatus?: string;
  leadSquaredCaptureStatus?: string;
  leadSquaredCaptureError?: string;
  leadSquaredVerifyStatus?: string;
  leadSquaredVerifyError?: string;
  sourceRaw?: string;
  source?: string;
  pageUrl?: string;
  createdAt?: string | Date;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    campaignid?: string;
    adgroupid?: string;
    creativeid?: string;
    keyword?: string;
    matchtype?: string;
    network?: string;
    gclid?: string;
  };
};

export type LeadAdminFilters = {
  q?: string;
  course?: string;
  otpStatus?: string;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildLeadQuery(filters: LeadAdminFilters) {
  const query: Record<string, unknown> = {};

  if (filters.q) {
    const regex = new RegExp(escapeRegex(filters.q), "i");
    query.$or = [
      { name: regex },
      { email: regex },
      { phone: regex },
      { city: regex },
      { course: regex },
      { courseLabel: regex },
      { "utm.campaign": regex },
      { "utm.medium": regex },
      { "utm.source": regex },
    ];
  }

  if (filters.course) {
    query.course = filters.course;
  }

  if (filters.otpStatus) {
    query.otpStatus = filters.otpStatus;
  }

  return query;
}

export async function fetchAdminLeads(filters: LeadAdminFilters, limit = 300) {
  const db = await getMongoDb();
  return db
    .collection(LEADS_COLLECTION)
    .find(buildLeadQuery(filters))
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function fetchLeadSummary() {
  const db = await getMongoDb();
  const [total, verified, notVerified] = await Promise.all([
    db.collection(LEADS_COLLECTION).countDocuments({}),
    db.collection(LEADS_COLLECTION).countDocuments({ otpStatus: "Verified" }),
    db.collection(LEADS_COLLECTION).countDocuments({ otpStatus: "Not Verified" }),
  ]);

  return { total, verified, notVerified };
}

export function normalizeAdminFilters(searchParams: Record<string, string | string[] | undefined>) {
  const read = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    q: read("q")?.trim() ?? "",
    course: read("course")?.trim() ?? "",
    otpStatus: read("otpStatus")?.trim() ?? "",
  };
}

export function toLeadCsvRows(leads: LeadAdminDoc[]) {
  const headers = [
    "Created At",
    "Name",
    "Email",
    "Phone",
    "City",
    "Course",
    "OTP Status",
    "SMS Status",
    "LeadSquared Capture Status",
    "LeadSquared Capture Error",
    "LeadSquared Verify Status",
    "LeadSquared Verify Error",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "UTM Content",
    "UTM Campaign ID",
    "UTM Ad Group ID",
    "UTM Creative ID",
    "UTM Keyword",
    "UTM Match Type",
    "UTM Network",
    "UTM GCLID",
    "Landing Source",
    "Page URL",
  ];

  const escapeCell = (value: unknown) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  const rows = leads.map((lead) =>
    [
      lead.createdAt ? new Date(lead.createdAt).toISOString() : "",
      lead.name,
      lead.email,
      lead.phone,
      lead.city,
      lead.courseLabel || lead.course,
      lead.otpStatus,
      lead.smsStatus,
      lead.leadSquaredCaptureStatus,
      lead.leadSquaredCaptureError,
      lead.leadSquaredVerifyStatus,
      lead.leadSquaredVerifyError,
      lead.sourceRaw,
      lead.utm?.medium,
      lead.utm?.campaign,
      lead.utm?.content,
      lead.utm?.campaignid,
      lead.utm?.adgroupid,
      lead.utm?.creativeid,
      lead.utm?.keyword,
      lead.utm?.matchtype,
      lead.utm?.network,
      lead.utm?.gclid,
      lead.source,
      lead.pageUrl,
    ].map(escapeCell).join(",")
  );

  return [headers.map(escapeCell).join(","), ...rows].join("\n");
}
