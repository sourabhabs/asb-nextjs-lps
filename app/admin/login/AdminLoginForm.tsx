"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("username", username);
    formData.set("password", password);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ message: "Login failed." }));
      setError(data.message || "Login failed.");
      setLoading(false);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={inputStyle}
        autoComplete="username"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
        autoComplete="current-password"
        required
      />
      {error ? <div style={{ color: "#b91c1c", fontWeight: 700, marginBottom: "12px" }}>{error}</div> : null}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          height: "46px",
          border: 0,
          borderRadius: "12px",
          background: "#006972",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "46px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  padding: "0 14px",
  marginBottom: "14px",
};
