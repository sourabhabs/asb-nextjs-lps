interface ThankYouPageProps {
  applicantName?: string;
  courseLabel: string;
  applyUrl?: string;
}

export default function ThankYouPage({
  applicantName,
  courseLabel,
  applyUrl = "https://admissions.asb.edu.in/portal/",
}: ThankYouPageProps) {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#f4f6f8",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <header>
        <div
          style={{
            background: "#fff",
            borderTop: "5px solid #006972",
            padding: "12px 0 10px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1080px",
              margin: "0 auto",
              padding: "0 20px",
            }}
          >
            <img
              src="/img/logo.jpg"
              alt="Asian School of Business"
              style={{ display: "block", width: "100%", maxWidth: "200px", height: "auto" }}
            />
          </div>
        </div>
        <div
          style={{
            minHeight: "88px",
            display: "flex",
            alignItems: "center",
            background: "#006972",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1080px",
              margin: "0 auto",
              padding: "0 20px",
            }}
          >
            <h1
              style={{
                margin: 0,
                color: "#fff",
                fontSize: "1.12rem",
                fontWeight: 700,
              }}
            >
              Thank You for Query.
            </h1>
          </div>
        </div>
      </header>

      <section
        style={{
          flex: "1 0 auto",
          padding: "62px 0 40px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1080px",
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          <div style={{ maxWidth: "760px" }}>
            <p style={{ margin: "0 0 26px", fontSize: "1rem", lineHeight: 1.75 }}>
              Dear{" "}
              <strong style={{ color: "#005a5a" }}>
                {applicantName || "Applicant"}
              </strong>
              ,
            </p>
            <p style={{ margin: "0 0 26px", fontSize: "1rem", lineHeight: 1.75 }}>
              Thank you for your query.
            </p>
            <p style={{ margin: "0 0 26px", fontSize: "1rem", lineHeight: 1.75 }}>
              Our adviser will contact you at the earliest. Meanwhile you may
              fill in the complete application form for admissions to the ASB
              Full-Time{" "}
              <strong style={{ color: "#005a5a" }}>{courseLabel}</strong>{" "}
              Program.
            </p>
            <p style={{ margin: "0 0 26px", fontSize: "1rem", lineHeight: 1.75 }}>
              Please follow the link to fill in the form by{" "}
              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0d6efd", textDecoration: "none" }}
              >
                clicking here.
              </a>
            </p>
            <p style={{ margin: "0 0 26px", fontSize: "1rem", lineHeight: 1.75 }}>
              Regards,
            </p>
            <p style={{ margin: "0 0 26px", fontSize: "1rem", lineHeight: 1.75 }}>
              Admission&apos;s Desk
            </p>
            <p style={{ margin: "0 0 26px", fontSize: "1rem", lineHeight: 1.75 }}>
              Asian School of Business (ASB)
            </p>
          </div>
        </div>
      </section>

      <footer
        style={{
          marginTop: "auto",
          background: "#006972",
          color: "#ffffff",
          textAlign: "center",
          padding: "36px 18px calc(24px + env(safe-area-inset-bottom))",
          borderTop: "4px solid #18a2ac",
        }}
      >
        <p style={{ margin: "0 0 10px", lineHeight: 1.6, fontSize: "0.98rem", fontWeight: 700, color: "#ffffff" }}>
          ASIAN SCHOOL OF BUSINESS
        </p>
        <p style={{ margin: "0 0 10px", lineHeight: 1.6, fontSize: "0.98rem", color: "#f3f7ff" }}>
          Plot A2, Sector 125, Noida - 201303, Delhi NCR, India
        </p>
        <p style={{ margin: "0 0 10px", lineHeight: 1.6, fontSize: "0.98rem", color: "#f3f7ff" }}>
          Copyright @ ASB. All Rights reserved.
        </p>
        <p style={{ margin: 0, lineHeight: 1.6, fontSize: "0.98rem", color: "#ffffff" }}>
          <a
            href="https://asb.edu.in/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ffe066", textDecoration: "none", fontWeight: 700 }}
          >
            Privacy Policy
          </a>
        </p>
      </footer>
    </main>
  );
}
