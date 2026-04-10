"use client";

import { useEffect, useRef, useState } from "react";

interface LeadFormProps {
  title?: string;
  courses?: { value: string; label: string }[];
  thankYouPath?: string;
  queryLabel?: string;
  id?: string;
  className?: string;
  variant?: "alc" | "bba" | "bca" | "bcom" | "bsc";
  submitLabel?: string;
}

const DEFAULT_COURSES_ALC = [
  { value: "BALLB", label: "B.A.LL.B." },
  { value: "BALLB International", label: "B.A.LL.B. International" },
  { value: "BComLLB", label: "B.Com. LL.B." },
  { value: "BComLLB International", label: "B.Com. LL.B. International" },
  { value: "LLB", label: "LL.B." },
  { value: "LLB International", label: "LL.B. International" },
];

const DEFAULT_COURSES_ASB = [
  { value: "BBA", label: "BBA" },
  { value: "BCA", label: "BCA" },
  { value: "B.Com (Hons)", label: "B.Com (Hons)" },
  { value: "B.Sc (Hons)", label: "B.Sc (Hons)" },
];

function getUTMParam(name: string): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(name) ?? "";
}

export default function LeadForm({
  title = "Admissions Open 2026",
  courses,
  thankYouPath = "/thank-you",
  queryLabel = "ASB UG Admissions 2026 Landing",
  id = "enquire",
  className = "",
  variant = "alc",
  submitLabel = "APPLY NOW",
}: LeadFormProps) {
  const resolvedCourses =
    courses ?? (variant === "alc" ? DEFAULT_COURSES_ALC : DEFAULT_COURSES_ASB);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "otp" | "verifying" | "done">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  const [otp, setOtp] = useState("");
  const [otpHint, setOtpHint] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);
  const otpInputRef = useRef<HTMLInputElement>(null);

  function showStatus(msg: string, type: "success" | "error") {
    setStatusMsg(msg);
    setStatusType(type);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !phone || phone.length !== 10 || !city || !course) {
      showStatus("Please fill all required fields correctly.", "error");
      return;
    }

    setStatus("sending");
    showStatus("", "success");

    const body = new URLSearchParams({
      name,
      email,
      phone,
      city,
      course,
      query: queryLabel,
      source: getUTMParam("utm_source"),
      page_url: typeof window !== "undefined" ? window.location.href : "",
      utm_medium: getUTMParam("utm_medium"),
      utm_campaign: getUTMParam("utm_campaign"),
      utm_content: getUTMParam("utm_content"),
      utm_campaignid: getUTMParam("utm_campaignid"),
      utm_adgroupid: getUTMParam("utm_adgroupid"),
      utm_creativeid: getUTMParam("utm_creativeid"),
      utm_keyword: getUTMParam("utm_keyword"),
      utm_matchtype: getUTMParam("utm_matchtype"),
      utm_network: getUTMParam("utm_network"),
      utm_gclid: getUTMParam("utm_gclid"),
    });

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      const data = await res.json();

      if (data.success) {
        setOtp("");
        setOtpHint(`Enter the 4-digit code sent to +91 ${phone}`);
        setOtpOpen(true);
        setStatus("otp");
        setTimeout(() => otpInputRef.current?.focus(), 150);
      } else {
        showStatus(data.message || "Failed to send OTP. Please try again.", "error");
        setStatus("idle");
      }
    } catch {
      showStatus("Network error. Please try again.", "error");
      setStatus("idle");
    }
  }

  async function handleOTPVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!otp || otp.length !== 4) {
      showStatus("Please enter the 4-digit OTP.", "error");
      return;
    }

    setStatus("verifying");
    showStatus("", "success");

    try {
      const res = await fetch(`/api/verify-otp?q=${encodeURIComponent(otp)}`);
      const text = await res.text();
      if (text.trim() === "1") {
        setStatus("done");
        setOtpOpen(false);
        showStatus("Verified! Redirecting...", "success");
        setTimeout(() => {
          window.location.href = thankYouPath;
        }, 600);
      } else {
        showStatus("Invalid OTP. Please try again.", "error");
        setStatus("otp");
      }
    } catch {
      showStatus("Network error. Please try again.", "error");
      setStatus("otp");
    }
  }

  async function handleResend() {
    try {
      const res = await fetch("/api/verify-otp?q=resend");
      const text = await res.text();
      setStatusMsg(text);
      setStatusType("success");
    } catch {
      showStatus("Failed to resend OTP. Please try again.", "error");
    }
  }

  function closeOTP() {
    setOtpOpen(false);
    setStatus("idle");
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && otpOpen) closeOTP();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [otpOpen]);

  useEffect(() => {
    if (!otpOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [otpOpen]);

  const isLoading = status === "sending" || status === "verifying";

  return (
    <>
      <style>{`
        #heroFormStatus.status,
        #otpStatus.status {
          font-size: 14px;
          font-weight: 700;
          line-height: 1.3;
          padding: 8px 2px 0;
        }
        #heroFormStatus.status.success,
        #otpStatus.status.success {
          color: #0f7a3d;
        }
        #heroFormStatus.status.error,
        #otpStatus.status.error {
          color: #cc2f2f;
        }
        .alc-otp-modal {
          position: fixed;
          inset: 0;
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(15, 23, 42, 0.68);
          padding: 16px;
          z-index: 10000;
        }
        .alc-otp-modal.open {
          display: flex;
        }
        .alc-otp-card {
          width: min(420px, 100%);
          background: #fff;
          border-radius: 14px;
          padding: 22px 20px 18px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.22);
          position: relative;
        }
        .alc-otp-close {
          position: absolute;
          right: 10px;
          top: 8px;
          border: 0;
          background: transparent;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          color: #334155;
        }
        .alc-otp-title {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .alc-otp-sub {
          font-size: 14px;
          color: #475569;
          margin: 8px 0 16px;
          line-height: 1.5;
        }
        #otpInput {
          width: 100%;
          height: 48px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          padding: 0 14px;
          font-size: 22px;
          color: #0f172a;
          letter-spacing: 0.25em;
          text-align: center;
        }
        #otpSubmit {
          width: 100%;
          margin-top: 12px;
          height: 46px;
          border: 0;
          border-radius: 10px;
          background: #006972;
          color: #fff;
          font-weight: 700;
          cursor: pointer;
        }
        #otpSubmit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        #changePhone {
          margin-top: 12px;
          border: 0;
          background: transparent;
          color: #334155;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        .otp-resend {
          margin-top: 10px;
          font-size: 0.95rem;
          color: #475569;
        }
      `}</style>

      <div className={`frmD ${className}`} id={id}>
        <form id="heroLeadForm" onSubmit={handleSubmit} noValidate>
          <div className="single_form hero-form-title" style={{ width: "auto" }}>
            <h3>{title}&nbsp;</h3>
          </div>
          <div className="single_form">
            <input
              type="text"
              placeholder="Name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
              autoComplete="off"
            />
          </div>
          <div className="single_form">
            <input
              type="email"
              placeholder="Email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={100}
              required
              autoComplete="off"
            />
          </div>
          <div className="single_form">
            <input
              type="tel"
              placeholder="Mobile Number*"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              maxLength={10}
              inputMode="numeric"
              required
              autoComplete="off"
            />
          </div>
          <div className="single_form">
            <input
              type="text"
              placeholder="City*"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              maxLength={50}
              required
              autoComplete="off"
            />
          </div>
          <div className="single_form course-select-wrap">
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              style={{ color: course ? "#334155" : "#767676", marginBottom: "4px" }}
            >
              <option value="">Select Course*</option>
              {resolvedCourses.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {statusMsg && !otpOpen ? (
            <div className="hero-form-status-wrap">
              <div className={`status ${statusType}`} id="heroFormStatus" style={{ display: "block" }}>
                {statusMsg}
              </div>
            </div>
          ) : null}

          <div className="single_form">
            <button id="heroSubmitBtn" type="submit" className="main-btn" disabled={isLoading}>
              {status === "sending" ? "SENDING OTP..." : submitLabel}
            </button>
          </div>
        </form>
      </div>

      {otpOpen ? (
        <div
          className="alc-otp-modal open"
          id="otpModal"
          aria-hidden="false"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeOTP();
          }}
        >
          <div className="alc-otp-card">
            <button
              type="button"
              className="alc-otp-close"
              onClick={closeOTP}
              aria-label="Close"
            >
              x
            </button>
            <h3 className="alc-otp-title">Verify Your Number</h3>
            <p className="alc-otp-sub" id="otpHint">
              {otpHint || "Enter the 4-digit code sent to your number."}
            </p>
            <form id="otpForm" onSubmit={handleOTPVerify} noValidate>
              <input
                ref={otpInputRef}
                id="otpInput"
                className="js-otp"
                type="text"
                maxLength={4}
                inputMode="numeric"
                placeholder="0000"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                required
              />
              <button id="otpSubmit" type="submit" disabled={status === "verifying"}>
                {status === "verifying" ? "Verifying..." : "Verify and Submit"}
              </button>
              {statusMsg ? (
                <div className={`status ${statusType}`} id="otpStatus" style={{ display: "block" }}>
                  {statusMsg}
                </div>
              ) : null}
            </form>
            <button id="changePhone" type="button" onClick={closeOTP}>
              Change Phone Number
            </button>
            <p className="otp-resend">
              Didn&apos;t receive the code?{" "}
              <a
                href="#"
                style={{ color: "#02858f", fontWeight: 700, textDecoration: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  handleResend();
                }}
              >
                Resend
              </a>
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
