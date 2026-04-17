import Link from "next/link";
import {
  fetchAdminLeads,
  fetchLeadSummary,
  LeadAdminDoc,
  normalizeAdminFilters,
} from "@/lib/asb-admin-leads";
import AdminLeadsTable, { SerializableLead } from "@/app/admin/leads/AdminLeadsTable";
import AdminLogoutButton from "@/app/admin/leads/AdminLogoutButton";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function formatDate(value: unknown) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Calcutta",
  }).format(new Date(String(value)));
}

function serializeLead(lead: LeadAdminDoc): SerializableLead {
  return {
    id: String(lead._id),
    date: formatDate(lead.createdAt),
    name: lead.name || "-",
    email: lead.email || "-",
    phone: lead.phone || "-",
    city: lead.city || "-",
    course: lead.courseLabel || lead.course || "-",
    otpStatus: lead.otpStatus || "-",
    smsStatus: lead.smsStatus || "-",
    lsCaptureStatus: lead.leadSquaredCaptureStatus || "-",
    lsCaptureError: lead.leadSquaredCaptureError || "",
    lsVerifyStatus: lead.leadSquaredVerifyStatus || "-",
    lsVerifyError: lead.leadSquaredVerifyError || "",
    utmSource: lead.sourceRaw || lead.utm?.source || "-",
    utmMedium: lead.utm?.medium || "-",
    utmCampaign: lead.utm?.campaign || "-",
    utmContent: lead.utm?.content || "-",
    utmGclid: lead.utm?.gclid || "-",
  };
}

function makeExportHref(filters: { q?: string; course?: string; otpStatus?: string }) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.course) params.set("course", filters.course);
  if (filters.otpStatus) params.set("otpStatus", filters.otpStatus);
  const query = params.toString();
  return `/api/admin/leads/export${query ? `?${query}` : ""}`;
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = normalizeAdminFilters(await searchParams);
  const [leads, summary] = await Promise.all([
    fetchAdminLeads(filters),
    fetchLeadSummary(),
  ]);

  const serialized = leads.map(serializeLead);

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <img
              src="/img/logo.jpg"
              alt="Asian School of Business"
              style={{ width: "150px", maxWidth: "100%", height: "auto", background: "#fff", padding: "8px", borderRadius: "12px" }}
            />
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", color: "#0f172a", fontWeight: 800 }}>ASB Leads Admin</h1>
              <p style={{ margin: "4px 0 0", color: "#475569", fontSize: "14px" }}>
                MongoDB lead store with OTP and UTM visibility.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              href={makeExportHref(filters)}
              style={{
                textDecoration: "none",
                background: "#006972",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              Export CSV
            </Link>
            <AdminLogoutButton />
            <Link
              href="/"
              style={{
                textDecoration: "none",
                background: "#e2e8f0",
                color: "#0f172a",
                padding: "10px 16px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              Back to Site
            </Link>
          </div>
        </div>

        {/* Summary cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          {[
            { label: "Total Leads", value: summary.total, color: "#0f172a" },
            { label: "OTP Verified", value: summary.verified, color: "#15803d" },
            { label: "OTP Not Verified", value: summary.notVerified, color: "#dc2626" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "#fff",
                borderRadius: "14px",
                padding: "16px 20px",
                boxShadow: "0 4px 16px rgba(15, 23, 42, 0.06)",
              }}
            >
              <div style={{ color: "#64748b", fontSize: "13px", fontWeight: 600 }}>{item.label}</div>
              <div style={{ color: item.color, fontSize: "32px", fontWeight: 800, marginTop: "4px" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filter form */}
        <form
          method="GET"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto auto",
            gap: "10px",
            background: "#fff",
            padding: "14px",
            borderRadius: "14px",
            boxShadow: "0 4px 16px rgba(15, 23, 42, 0.06)",
            marginBottom: "16px",
          }}
        >
          <input
            type="text"
            name="q"
            defaultValue={filters.q}
            placeholder="Search name, email, phone, city, course or UTM"
            style={{ height: "42px", borderRadius: "8px", border: "1px solid #cbd5e1", padding: "0 12px", fontSize: "14px" }}
          />
          <input
            type="text"
            name="course"
            defaultValue={filters.course}
            placeholder="Filter by course"
            style={{ height: "42px", borderRadius: "8px", border: "1px solid #cbd5e1", padding: "0 12px", fontSize: "14px" }}
          />
          <select
            name="otpStatus"
            defaultValue={filters.otpStatus}
            style={{ height: "42px", borderRadius: "8px", border: "1px solid #cbd5e1", padding: "0 12px", fontSize: "14px" }}
          >
            <option value="">All OTP statuses</option>
            <option value="Verified">Verified</option>
            <option value="Not Verified">Not Verified</option>
          </select>
          <button
            type="submit"
            style={{
              height: "42px",
              borderRadius: "8px",
              border: 0,
              background: "#0f172a",
              color: "#fff",
              padding: "0 18px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Filter
          </button>
          <Link
            href="/admin/leads"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "42px",
              borderRadius: "8px",
              background: "#e2e8f0",
              color: "#0f172a",
              padding: "0 16px",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Reset
          </Link>
        </form>

        {/* Leads table (client component) */}
        <AdminLeadsTable leads={serialized} />
      </div>
    </main>
  );
}
