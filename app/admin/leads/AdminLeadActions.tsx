"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLeadActions({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    const ok = window.confirm("Delete this lead from your MongoDB records?");
    if (!ok) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: "Delete failed." }));
        window.alert(data.message || "Delete failed.");
        setBusy(false);
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={busy}
      style={{
        border: 0,
        borderRadius: "8px",
        background: "#dc2626",
        color: "#fff",
        fontWeight: 700,
        padding: "8px 10px",
        cursor: busy ? "not-allowed" : "pointer",
        opacity: busy ? 0.7 : 1,
      }}
    >
      {busy ? "Deleting..." : "Delete"}
    </button>
  );
}
