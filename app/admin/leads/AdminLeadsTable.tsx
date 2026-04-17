"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type SerializableLead = {
  id: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  course: string;
  otpStatus: string;
  smsStatus: string;
  lsCaptureStatus: string;
  lsCaptureError: string;
  lsVerifyStatus: string;
  lsVerifyError: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmGclid: string;
};

function ErrorCell({ status, error }: { status: string; error: string }) {
  const [open, setOpen] = useState(false);
  const isFailed = status.toLowerCase().includes("fail");
  const color = isFailed ? "#dc2626" : status === "-" ? "#94a3b8" : "#16a34a";

  return (
    <div style={{ minWidth: "80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <span style={{ color, fontWeight: 600, fontSize: "12px", whiteSpace: "nowrap" }}>
          {status}
        </span>
        {error && (
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            title={open ? "Hide error" : "Show error"}
            style={{
              border: "1px solid #fca5a5",
              borderRadius: "4px",
              background: "#fef2f2",
              color: "#dc2626",
              fontSize: "10px",
              padding: "1px 4px",
              cursor: "pointer",
              fontWeight: 700,
              lineHeight: 1.4,
              flexShrink: 0,
            }}
          >
            {open ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {open && error && (
        <div
          style={{
            marginTop: "4px",
            fontSize: "11px",
            color: "#b91c1c",
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "6px",
            padding: "6px 8px",
            maxWidth: "200px",
            wordBreak: "break-word",
            lineHeight: 1.4,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

const stickyLeft: React.CSSProperties = {
  position: "sticky",
  left: 0,
  background: "#fff",
  zIndex: 2,
};

const stickyRight: React.CSSProperties = {
  position: "sticky",
  right: 0,
  background: "#fff",
  zIndex: 2,
  boxShadow: "-2px 0 6px rgba(0,0,0,0.06)",
};

const stickyLeftHead: React.CSSProperties = {
  ...stickyLeft,
  background: "#f8fafc",
  zIndex: 3,
};

const stickyRightHead: React.CSSProperties = {
  ...stickyRight,
  background: "#f8fafc",
  zIndex: 3,
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 10px",
  borderBottom: "2px solid #e2e8f0",
  color: "#475569",
  fontSize: "12px",
  fontWeight: 700,
  whiteSpace: "nowrap",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const td: React.CSSProperties = {
  padding: "10px 10px",
  borderBottom: "1px solid #f1f5f9",
  color: "#0f172a",
  fontSize: "13px",
  verticalAlign: "top",
};

export default function AdminLeadsTable({ leads }: { leads: SerializableLead[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const allIds = leads.map((lead) => lead.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const someSelected = selected.size > 0;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(allIds));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function deleteLead(id: string) {
    if (!window.confirm("Delete this lead?")) return;
    setBusyIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: "Delete failed." }));
        window.alert(data.message || "Delete failed.");
        return;
      }
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      router.refresh();
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  async function bulkDelete() {
    if (!selected.size) return;
    if (!window.confirm(`Delete ${selected.size} selected lead(s)? This cannot be undone.`)) return;
    setBulkBusy(true);
    try {
      const res = await fetch("/api/admin/leads/bulk-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: "Bulk delete failed." }));
        window.alert(data.message || "Bulk delete failed.");
        return;
      }
      setSelected(new Set());
      router.refresh();
    } finally {
      setBulkBusy(false);
    }
  }

  return (
    <>
      {someSelected && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#0f172a",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: "12px",
            marginBottom: "12px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          <span>{selected.size} lead{selected.size > 1 ? "s" : ""} selected</span>
          <button
            type="button"
            onClick={bulkDelete}
            disabled={bulkBusy}
            style={{
              background: "#dc2626",
              color: "#fff",
              border: 0,
              borderRadius: "8px",
              padding: "7px 16px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: bulkBusy ? "not-allowed" : "pointer",
              opacity: bulkBusy ? 0.7 : 1,
            }}
          >
            {bulkBusy ? "Deleting..." : `Delete ${selected.size} selected`}
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            style={{
              background: "transparent",
              color: "#94a3b8",
              border: "1px solid #334155",
              borderRadius: "8px",
              padding: "7px 12px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          overflow: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1100px" }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={{ ...th, ...stickyLeftHead, width: "40px", padding: "12px 8px 12px 14px" }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  title="Select all"
                  style={{ cursor: "pointer", width: "15px", height: "15px" }}
                />
              </th>
              <th style={th}>Date &amp; Time</th>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Phone</th>
              <th style={th}>City</th>
              <th style={th}>Course</th>
              <th style={th}>OTP</th>
              <th style={th}>SMS</th>
              <th style={th}>LS Capture</th>
              <th style={th}>LS Verify</th>
              <th style={th}>UTM Source</th>
              <th style={th}>UTM Medium</th>
              <th style={th}>UTM Campaign</th>
              <th style={th}>UTM Content</th>
              <th style={th}>GCLID</th>
              <th style={{ ...th, ...stickyRightHead, width: "60px", textAlign: "center" }}>Del</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const isSelected = selected.has(lead.id);
              const isBusy = busyIds.has(lead.id);

              return (
                <tr key={lead.id} style={{ background: isSelected ? "#eff6ff" : undefined }}>
                  <td
                    style={{
                      ...td,
                      ...stickyLeft,
                      background: isSelected ? "#eff6ff" : "#fff",
                      padding: "10px 8px 10px 14px",
                      width: "40px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOne(lead.id)}
                      style={{ cursor: "pointer", width: "15px", height: "15px" }}
                    />
                  </td>
                  <td style={{ ...td, whiteSpace: "nowrap", fontSize: "12px", color: "#475569" }}>
                    {lead.date}
                  </td>
                  <td style={{ ...td, fontWeight: 600, whiteSpace: "nowrap" }}>{lead.name}</td>
                  <td style={{ ...td, fontSize: "12px" }}>{lead.email}</td>
                  <td style={{ ...td, whiteSpace: "nowrap" }}>{lead.phone}</td>
                  <td style={{ ...td, whiteSpace: "nowrap" }}>{lead.city}</td>
                  <td style={{ ...td, whiteSpace: "nowrap", fontWeight: 600 }}>{lead.course}</td>
                  <td style={td}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: "99px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background: lead.otpStatus === "Verified" ? "#dcfce7" : "#fee2e2",
                        color: lead.otpStatus === "Verified" ? "#15803d" : "#dc2626",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lead.otpStatus}
                    </span>
                  </td>
                  <td style={{ ...td, fontSize: "12px" }}>{lead.smsStatus}</td>
                  <td style={td}>
                    <ErrorCell status={lead.lsCaptureStatus} error={lead.lsCaptureError} />
                  </td>
                  <td style={td}>
                    <ErrorCell status={lead.lsVerifyStatus} error={lead.lsVerifyError} />
                  </td>
                  <td style={{ ...td, fontSize: "12px" }}>{lead.utmSource}</td>
                  <td style={{ ...td, fontSize: "12px" }}>{lead.utmMedium}</td>
                  <td
                    style={{
                      ...td,
                      fontSize: "12px",
                      maxWidth: "120px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {lead.utmCampaign}
                  </td>
                  <td style={{ ...td, fontSize: "12px" }}>{lead.utmContent}</td>
                  <td
                    style={{
                      ...td,
                      fontSize: "11px",
                      color: "#64748b",
                      maxWidth: "80px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {lead.utmGclid}
                  </td>
                  <td
                    style={{
                      ...td,
                      ...stickyRight,
                      background: isSelected ? "#eff6ff" : "#fff",
                      textAlign: "center",
                      width: "60px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => deleteLead(lead.id)}
                      disabled={isBusy}
                      title="Delete lead"
                      style={{
                        border: 0,
                        borderRadius: "8px",
                        background: "#fee2e2",
                        color: "#dc2626",
                        fontWeight: 700,
                        fontSize: "12px",
                        minWidth: "32px",
                        height: "32px",
                        cursor: isBusy ? "not-allowed" : "pointer",
                        opacity: isBusy ? 0.5 : 1,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 8px",
                      }}
                    >
                      {isBusy ? "..." : "Del"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {leads.length === 0 && (
          <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "15px" }}>
            No leads found for the current filters.
          </div>
        )}
      </div>
    </>
  );
}
