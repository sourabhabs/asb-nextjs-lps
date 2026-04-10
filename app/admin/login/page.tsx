import AdminLoginForm from "@/app/admin/login/AdminLoginForm";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolved = await searchParams;
  const nextValue = Array.isArray(resolved.next) ? resolved.next[0] : resolved.next;
  const nextPath = nextValue || "/admin/leads";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "20px",
          padding: "28px",
          boxShadow: "0 18px 50px rgba(15, 23, 42, 0.12)",
        }}
      >
        <img
          src="/img/logo.jpg"
          alt="Asian School of Business"
          style={{ display: "block", width: "180px", maxWidth: "100%", marginBottom: "20px" }}
        />
        <h1 style={{ margin: 0, fontSize: "28px", color: "#0f172a" }}>Admin Login</h1>
        <p style={{ margin: "8px 0 20px", color: "#475569", lineHeight: 1.6 }}>
          Sign in to view, export, and delete ASB lead records.
        </p>
        <AdminLoginForm nextPath={nextPath} />
      </section>
    </main>
  );
}
