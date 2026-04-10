"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={busy}
      style={{
        border: 0,
        borderRadius: "12px",
        background: "#e2e8f0",
        color: "#0f172a",
        padding: "12px 16px",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {busy ? "Signing out..." : "Logout"}
    </button>
  );
}
