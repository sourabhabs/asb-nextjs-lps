import type { CSSProperties } from "react";
import Link from "next/link";
import {
  fetchAdminLeads,
  fetchLeadSummary,
  LeadAdminDoc,
  normalizeAdminFilters,
} from "@/lib/asb-admin-leads";
import AdminLeadActions from "@/app/admin/leads/AdminLeadActions";
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

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
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
            <h1 style={{ margin: 0, fontSize: "32px", color: "#0f172a" }}>ASB Leads Admin</h1>
            <p style={{ margin: "8px 0 0", color: "#475569" }}>
              Independent MongoDB lead store with OTP and UTM visibility.
            </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href={makeExportHref(filters)}
              style={{
                textDecoration: "none",
                background: "#006972",
                color: "#fff",
                padding: "12px 16px",
                borderRadius: "12px",
                fontWeight: 700,
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
                padding: "12px 16px",
                borderRadius: "12px",
                fontWeight: 700,
              }}
            >
              Back to Site
            </Link>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          {[
            { label: "Total Leads", value: summary.total },
            { label: "OTP Verified", value: summary.verified },
            { label: "OTP Not Verified", value: summary.notVerified },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "18px 20px",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
              }}
            >
              <div style={{ color: "#64748b", fontSize: "14px" }}>{item.label}</div>
              <div style={{ color: "#0f172a", fontSize: "30px", fontWeight: 800, marginTop: "6px" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <form
          method="GET"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto auto",
            gap: "12px",
            background: "#fff",
            padding: "16px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            name="q"
            defaultValue={filters.q}
            placeholder="Search name, email, phone, city, course or UTM"
            style={{ height: "44px", borderRadius: "10px", border: "1px solid #cbd5e1", padding: "0 12px" }}
          />
          <input
            type="text"
            name="course"
            defaultValue={filters.course}
            placeholder="Filter by course"
            style={{ height: "44px", borderRadius: "10px", border: "1px solid #cbd5e1", padding: "0 12px" }}
          />
          <select
            name="otpStatus"
            defaultValue={filters.otpStatus}
            style={{ height: "44px", borderRadius: "10px", border: "1px solid #cbd5e1", padding: "0 12px" }}
          >
            <option value="">All OTP statuses</option>
            <option value="Verified">Verified</option>
            <option value="Not Verified">Not Verified</option>
          </select>
          <button
            type="submit"
            style={{
              height: "44px",
              borderRadius: "10px",
              border: 0,
              background: "#0f172a",
              color: "#fff",
              padding: "0 16px",
              fontWeight: 700,
              cursor: "pointer",
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
              height: "44px",
              borderRadius: "10px",
              background: "#e2e8f0",
              color: "#0f172a",
              padding: "0 16px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Reset
          </Link>
        </form>

        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
            overflow: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1500px" }}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                {[
                  "Date & Time",
                  "Name",
                  "Email",
                  "Phone",
                  "City",
                  "Course",
                  "OTP Status",
                  "SMS",
                  "LS Capture",
                  "LS Verify",
                  "UTM Source",
                  "UTM Medium",
                  "UTM Campaign",
                  "UTM Content",
                  "UTM GCLID",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: "left",
                      padding: "14px 12px",
                      borderBottom: "1px solid #e2e8f0",
                      color: "#334155",
                      fontSize: "13px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: LeadAdminDoc) => (
                <tr key={String(lead._id)}>
                  <td style={cellStyle}>{formatDate(lead.createdAt)}</td>
                  <td style={cellStyle}>{lead.name || "-"}</td>
                  <td style={cellStyle}>{lead.email || "-"}</td>
                  <td style={cellStyle}>{lead.phone || "-"}</td>
                  <td style={cellStyle}>{lead.city || "-"}</td>
                  <td style={cellStyle}>{lead.courseLabel || lead.course || "-"}</td>
                  <td style={cellStyle}>{lead.otpStatus || "-"}</td>
                  <td style={cellStyle}>{lead.smsStatus || "-"}</td>
                  <td style={cellStyle}>
                    <div>{lead.leadSquaredCaptureStatus || "-"}</div>
                    {lead.leadSquaredCaptureError ? (
                      <div style={errorTextStyle}>{lead.leadSquaredCaptureError}</div>
                    ) : null}
                  </td>
                  <td style={cellStyle}>
                    <div>{lead.leadSquaredVerifyStatus || "-"}</div>
                    {lead.leadSquaredVerifyError ? (
                      <div style={errorTextStyle}>{lead.leadSquaredVerifyError}</div>
                    ) : null}
                  </td>
                  <td style={cellStyle}>{lead.sourceRaw || "-"}</td>
                  <td style={cellStyle}>{lead.utm?.medium || "-"}</td>
                  <td style={cellStyle}>{lead.utm?.campaign || "-"}</td>
                  <td style={cellStyle}>{lead.utm?.content || "-"}</td>
                  <td style={cellStyle}>{lead.utm?.gclid || "-"}</td>
                  <td style={cellStyle}>
                    <AdminLeadActions leadId={String(lead._id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 ? (
            <div style={{ padding: "24px", color: "#64748b" }}>No leads found for the current filters.</div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

const cellStyle: CSSProperties = {
  padding: "14px 12px",
  borderBottom: "1px solid #eef2f7",
  color: "#0f172a",
  fontSize: "14px",
  verticalAlign: "top",
};

const errorTextStyle: CSSProperties = {
  marginTop: "4px",
  color: "#b91c1c",
  fontSize: "12px",
  lineHeight: 1.4,
  maxWidth: "280px",
  whiteSpace: "normal",
  wordBreak: "break-word",
};
