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
  trackMetaLead?: boolean;
  trackMetaCompleteRegistration?: boolean;
  onSuccess?: (leadDocId: string, name: string) => void;
  consentNote?: string;
  isScholarshipCheck?: boolean;
  show12thMarks?: boolean;
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
  title = "Admissions Open",
  courses,
  thankYouPath = "/thank-you.php",
  queryLabel = "ASB UG Admissions 2026 Landing",
  id = "enquire",
  className = "",
  variant = "alc",
  submitLabel = "APPLY NOW",
  trackMetaLead = false,
  trackMetaCompleteRegistration = false,
  onSuccess,
  consentNote,
  isScholarshipCheck = false,
  show12thMarks = false,
}: LeadFormProps) {
  const resolvedCourses =
    courses ?? (variant === "alc" ? DEFAULT_COURSES_ALC : DEFAULT_COURSES_ASB);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [course, setCourse] = useState("");
  const [class12Marks, setClass12Marks] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "otp" | "verifying" | "done">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  const [otp, setOtp] = useState("");
  const [otpHint, setOtpHint] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const selectedCourse = resolvedCourses.find((item) => item.value === course);
  const [plbx, setPlbx] = useState("");

  useEffect(() => {
    if (resolvedCourses.length === 1) {
      setCourse(resolvedCourses[0].value);
      return;
    }

    setCourse((current) =>
      resolvedCourses.some((item) => item.value === current) ? current : ""
    );
  }, [resolvedCourses]);

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
    if (show12thMarks && !class12Marks) {
      showStatus("Please enter your Class 12th marks.", "error");
      return;
    }

    if (plbx !== "Y" && consentNote) {
      showStatus("Please read and agree to the privacy policy.", "error");
      return;
    }

    setStatus("sending");
    showStatus("", "success");
    setOtp("");
    setOtpHint(`Sending OTP to +91 ${phone}...`);
    setOtpOpen(true);
    setTimeout(() => otpInputRef.current?.focus(), 150);

    const body = new URLSearchParams({
      name,
      email,
      phone,
      city,
      plbx,
      course,
      course_label: selectedCourse?.label ?? course,
      query: queryLabel,
      source: getUTMParam("utm_source"),
      page_url: typeof window !== "undefined" ? window.location.href : "",
      utm_medium: getUTMParam("utm_medium"),
      utm_campaign: getUTMParam("utm_campaign"),
      utm_content: getUTMParam("utm_content"),
      utm_campaignid: getUTMParam("utm_campaignid"),
      utm_adgroupid: getUTMParam("utm_adgroupid"),
      creativeid: getUTMParam("utm_creativeid"),
      keyword: getUTMParam("utm_keyword"),
      matchtype: getUTMParam("utm_matchtype"),
      network: getUTMParam("utm_network"),
      gclid: getUTMParam("utm_gclid"),
    });

    if (show12thMarks) {
      body.append("class12Marks", class12Marks);
    }

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      const data = await res.json();

      if (data.success) {
        if (trackMetaLead && typeof window !== "undefined") {
          const fbq = (window as typeof window & { fbq?: (...args: unknown[]) => void }).fbq;
          fbq?.("track", "Lead");
        }
        setOtpHint(`Enter the 4-digit code sent to +91 ${phone}`);
        setStatus("otp");
        setTimeout(() => otpInputRef.current?.focus(), 150);
      } else {
        setOtpOpen(false);
        showStatus(data.message || "Failed to send OTP. Please try again.", "error");
        setStatus("idle");
      }
    } catch {
      setOtpOpen(false);
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
      const verifyUrl = onSuccess
        ? `/api/verify-otp?q=${encodeURIComponent(otp)}&returnId=1`
        : `/api/verify-otp?q=${encodeURIComponent(otp)}`;
      const res = await fetch(verifyUrl);
      const text = await res.text();
      const trimmedText = text.trim();
      const isSuccess = trimmedText === "1" || trimmedText.startsWith("1|");

      if (isSuccess) {
        if (trackMetaCompleteRegistration && typeof window !== "undefined") {
          const fbq = (window as typeof window & { fbq?: (...args: unknown[]) => void }).fbq;
          fbq?.("track", "CompleteRegistration");
        }
        setStatus("done");
        setOtpOpen(false);
        if (onSuccess) {
          const parts = trimmedText.split("|");
          const leadDocId = parts[1] || "";
          onSuccess(leadDocId, name);
        } else {
          showStatus("Verified! Redirecting...", "success");
          setTimeout(() => {
            window.location.href = thankYouPath;
          }, 150);
        }
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
      if (!res.ok) {
        showStatus("Failed to resend OTP. Please try again.", "error");
        return;
      }
      setStatusMsg(text);
      setStatusType(text.toLowerCase().includes("success") ? "success" : "error");
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
          padding: 8px;
          margin: 0px !important;
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
        .form-label-top {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 6px;
          text-align: left;
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
        .course-readonly {
          display: flex;
          align-items: center;
          width: 100%;
          min-height: 40px;
          border: 1px solid rgba(71,85,105,.55);
          border-radius: 4px;
          background: #fff;
          color: #334155;
          padding: 0 10px;
          font-size: 15px;
          margin-bottom: 4px;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (min-width: 992px) {
          .frmD {
            width: 100% !important;
            padding: 10px clamp(10px, 1vw, 16px) !important;
            overflow: visible !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) {
            display: grid !important;
            grid-template-columns:
              minmax(290px, 1.25fr)
              repeat(4, minmax(100px, 1fr))
              minmax(145px, 1.05fr)
              minmax(112px, auto) !important;
            align-items: center !important;
            gap: 6px !important;
            width: 100% !important;
            max-width: 1360px !important;
            margin: 0 auto !important;
            padding: 0 !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) .single_form {
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
            flex: unset !important;
            margin: 0 !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) .hero-form-title {
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
            margin: 0 !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) .hero-form-title h3 {
            width: 100% !important;
            margin: 0 !important;
            overflow: visible !important;
            white-space: nowrap !important;
            color: #fff !important;
            font-size: clamp(22px, 2vw, 31px) !important;
            line-height: 1.05 !important;
            letter-spacing: 0 !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) .course-select-wrap {
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
            flex: unset !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) .single_form input,
          #heroLeadForm:not(.lead-form-consent-row) .single_form select,
          #heroLeadForm:not(.lead-form-consent-row) .course-readonly {
            width: 100% !important;
            min-width: 0 !important;
            height: 40px !important;
            min-height: 40px !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            font-size: 15px !important;
            line-height: 40px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) #heroSubmitBtn {
            width: 100% !important;
            min-width: 120px !important;
            height: 40px !important;
            line-height: 40px !important;
            padding: 0 12px !important;
            white-space: nowrap !important;
          }
        }
        @media (min-width: 992px) and (max-width: 1279px) {
          #heroLeadForm:not(.lead-form-consent-row) .hero-form-title h3 {
            font-size: clamp(21px, 1.95vw, 27px) !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) .single_form input,
          #heroLeadForm:not(.lead-form-consent-row) .single_form select,
          #heroLeadForm:not(.lead-form-consent-row) .course-readonly,
          #heroLeadForm:not(.lead-form-consent-row) #heroSubmitBtn {
            font-size: 14px !important;
          }
        }
        @media (min-width: 1280px) and (max-width: 1599px) {
          #heroLeadForm:not(.lead-form-consent-row) .hero-form-title h3 {
            font-size: clamp(23px, 2vw, 30px) !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) .single_form input,
          #heroLeadForm:not(.lead-form-consent-row) .single_form select,
          #heroLeadForm:not(.lead-form-consent-row) .course-readonly,
          #heroLeadForm:not(.lead-form-consent-row) #heroSubmitBtn {
            font-size: 15px !important;
          }
        }
        @media (min-width: 1600px) {
          #heroLeadForm:not(.lead-form-consent-row) {
            grid-template-columns:
              minmax(270px, 1.2fr)
              repeat(4, minmax(110px, 1fr))
              minmax(145px, 1.05fr)
              minmax(130px, auto) !important;
            gap: 8px !important;
            max-width: 1560px !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) .hero-form-title h3 {
            font-size: clamp(25px, 1.9vw, 32px) !important;
            line-height: 1.05 !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) .single_form input,
          #heroLeadForm:not(.lead-form-consent-row) .single_form select,
          #heroLeadForm:not(.lead-form-consent-row) .course-readonly,
          #heroLeadForm:not(.lead-form-consent-row) #heroSubmitBtn {
            font-size: 15px !important;
            height: 42px !important;
            min-height: 42px !important;
            line-height: 42px !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) #heroSubmitBtn {
            min-width: 125px !important;
            padding: 0 14px !important;
          }
        }
        @media (min-width: 1900px) {
          #heroLeadForm:not(.lead-form-consent-row) {
            grid-template-columns:
              minmax(300px, 1.25fr)
              repeat(4, minmax(120px, 1fr))
              minmax(160px, 1.1fr)
              minmax(140px, auto) !important;
            gap: 10px !important;
            max-width: 1800px !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) .hero-form-title h3 {
            font-size: clamp(28px, 2vw, 36px) !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) .single_form input,
          #heroLeadForm:not(.lead-form-consent-row) .single_form select,
          #heroLeadForm:not(.lead-form-consent-row) .course-readonly,
          #heroLeadForm:not(.lead-form-consent-row) #heroSubmitBtn {
            font-size: 16px !important;
            height: 46px !important;
            min-height: 46px !important;
            line-height: 46px !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) #heroSubmitBtn {
            min-width: 135px !important;
            padding: 0 16px !important;
          }
        }
        @media (min-width: 992px) and (max-width: 1180px) {
          #heroLeadForm:not(.lead-form-consent-row) {
            grid-template-columns:
              minmax(255px, 1.05fr)
              repeat(4, minmax(92px, 1fr))
              minmax(132px, 1fr)
              minmax(108px, auto) !important;
            gap: 6px !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) .hero-form-title h3 {
            font-size: clamp(19px, 1.7vw, 23px) !important;
          }
        }
        @media (min-width: 992px) and (max-height: 700px) {
          .frmD {
            padding: 8px clamp(8px, 0.8vw, 12px) !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) {
            grid-template-columns:
              minmax(245px, 1fr)
              repeat(4, minmax(88px, 1fr))
              minmax(124px, 1fr)
              minmax(106px, auto) !important;
            gap: 6px !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) .hero-form-title h3 {
            font-size: clamp(18px, 1.7vw, 22px) !important;
          }
          #heroLeadForm:not(.lead-form-consent-row) .single_form input,
          #heroLeadForm:not(.lead-form-consent-row) .single_form select,
          #heroLeadForm:not(.lead-form-consent-row) .course-readonly,
          #heroLeadForm:not(.lead-form-consent-row) #heroSubmitBtn {
            height: 38px !important;
            min-height: 38px !important;
            line-height: 38px !important;
            font-size: 14px !important;
          }
        }
        @media (max-width: 991px) {
          .course-readonly {
            justify-content: center;
            text-align: center;
            min-height: 52px;
            border-radius: 12px;
            border: 1px solid #d6dae2;
            background: #f0f2f5;
            padding: 0 14px;
            font-size: 16px;
          }
        }
        .lead-form-consent-row {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          gap: 6px;
          width: 100%;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          padding: 0 !important;
          position: static !important;
          margin-top: 0px;
        }
        .consent-empty-title {
          display: block;
        }
        .lead-form-consent-note {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.88);
          font-size: 14px;
          line-height: 1.4;
          text-align: left;
          width: fit-content;
          max-width: 100%;
          margin-left: 0;
          margin-top: 2px;
        }
        .lead-form-consent-note input[type="checkbox"] {
          margin-top: 0px !important;
          flex-shrink: 0 !important;
          width: 16px !important;
          height: 16px !important;
          cursor: pointer !important;
        }
        @media (max-width: 991px) {
          .lead-form-consent-row {
            display: block !important;
            margin-top: 10px !important;
            padding: 0 !important;
            background: transparent !important;
            border: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            position: static !important;
          }
          .consent-empty-title {
            display: none !important;
          }
          .lead-form-consent-note {
            display: flex;
            align-items: flex-start;
            color: #64748b;
            font-size: 11px;
            margin-top: 12px;
            text-align: left;
            width: 100%;
            margin-left: 0;
            padding: 0 4px;
          }
          .lead-form-consent-note input[type="checkbox"] {
            margin-top: 2px !important;
          }
        }

        /* Vertical Form (Scholarship Check) Styles */
        #scholarshipLeadForm {
          display: flex !important;
          flex-direction: column !important;
          gap: 12px !important;
          width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          position: static !important;
        }
        #scholarshipLeadForm .single_form {
          width: 100% !important;
          flex: 0 0 auto !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        #scholarshipLeadForm .course-select-wrap {
          width: 100% !important;
        }
        #scholarshipLeadForm .hero-form-title {
          width: 100% !important;
          margin: 0 0 10px 0 !important;
          display: block !important;
        }
        #scholarshipLeadForm .hero-form-title h3 {
          font-size: 24px !important;
          color: #0f1f45 !important;
          font-weight: 800 !important;
          text-align: center !important;
          margin: 0 !important;
          line-height: 1.3 !important;
        }
        #scholarshipLeadForm .single_form input,
        #scholarshipLeadForm .single_form select {
          height: 48px !important;
          border-radius: 8px !important;
          border: 1px solid #cbd5e1 !important;
          background: #ffffff !important;
          padding: 0 14px !important;
          font-size: 14.5px !important;
          color: #0f172a !important;
          width: 100% !important;
          box-sizing: border-box !important;
          display: block !important;
          margin: 0 !important;
        }
        #scholarshipLeadForm .single_form input:focus,
        #scholarshipLeadForm .single_form select:focus {
          border-color: #006972 !important;
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(0, 105, 114, 0.15) !important;
        }
        #scholarshipLeadForm .single_form label {
          color: #334155 !important;
          font-weight: 700 !important;
          margin-bottom: 6px !important;
          display: block !important;
          text-align: left !important;
        }
        #scholarshipLeadForm #heroSubmitBtn {
          height: 48px !important;
          line-height: 48px !important;
          border-radius: 8px !important;
          background: #006972 !important;
          color: #ffffff !important;
          font-weight: 800 !important;
          width: 100% !important;
          margin-top: 8px !important;
          box-shadow: 0 6px 16px rgba(0, 105, 114, 0.25) !important;
          transition: all 0.2s ease !important;
          border: 0 !important;
          cursor: pointer !important;
        }
        #scholarshipLeadForm #heroSubmitBtn:hover {
          background: #005259 !important;
          box-shadow: 0 8px 20px rgba(0, 105, 114, 0.35) !important;
        }
        #scholarshipLeadForm.lead-form-consent-row {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
          width: 100% !important;
          margin-top: 10px !important;
          background: transparent !important;
          padding: 0 !important;
        }
        #scholarshipLeadForm.lead-form-consent-row .consent-empty-title {
          display: none !important;
        }
        #scholarshipLeadForm.lead-form-consent-row .lead-form-consent-note {
          display: flex !important;
          align-items: flex-start !important;
          gap: 8px !important;
          color: #475569 !important;
          font-size: 11px !important;
          margin-top: 6px !important;
          text-align: left !important;
          width: 100% !important;
        }
        #scholarshipLeadForm.lead-form-consent-row .lead-form-consent-note input[type="checkbox"] {
          margin-top: 2px !important;
          flex-shrink: 0 !important;
          width: 14px !important;
          height: 14px !important;
        }
      `}</style>

      <div className={`frmD ${className}`} id={id}>
        <form onSubmit={handleSubmit} noValidate>
          <div id={isScholarshipCheck ? "scholarshipLeadForm" : "heroLeadForm"}>
            <div className="single_form hero-form-title" style={{ width: "auto" }}>
              <h3>{title}&nbsp;</h3>
            </div>
            <div className="single_form">
              {isScholarshipCheck && <label className="form-label-top">Full Name</label>}
              <input
                type="text"
                placeholder={isScholarshipCheck ? "Enter your full name" : "Name*"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                autoComplete="off"
              />
            </div>
            <div className="single_form">
              {isScholarshipCheck && <label className="form-label-top">Email Address</label>}
              <input
                type="email"
                placeholder={isScholarshipCheck ? "Enter your email address" : "Email*"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={100}
                required
                autoComplete="off"
              />
            </div>
            <div className="single_form">
              {isScholarshipCheck && <label className="form-label-top">Phone Number</label>}
              <input
                type="tel"
                placeholder={isScholarshipCheck ? "Enter your phone number" : "Mobile Number*"}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
                inputMode="numeric"
                required
                autoComplete="off"
              />
            </div>
            <div className="single_form">
              {isScholarshipCheck && <label className="form-label-top">City</label>}
              <input
                type="text"
                placeholder={isScholarshipCheck ? "Enter your city" : "City*"}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={50}
                required
                autoComplete="off"
              />
            </div>
            <div className="single_form course-select-wrap">
              {isScholarshipCheck && <label className="form-label-top">Select Course</label>}
              {resolvedCourses.length === 1 ? (
                <div className="course-readonly" aria-label="Selected Course">
                  {resolvedCourses[0].label}
                </div>
              ) : (
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                  style={{ color: course ? "#334155" : "#767676", marginBottom: "4px" }}
                >
                  <option value="">{isScholarshipCheck ? "Select a course" : "Select Course*"}</option>
                  {resolvedCourses.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {show12thMarks && (
              <div className="single_form">
                {isScholarshipCheck && <label className="form-label-top">Class 12th Marks (%)</label>}
                <input
                  type="text"
                  placeholder={isScholarshipCheck ? "e.g. 92%" : "Class 12th Marks (%)*"}
                  value={class12Marks}
                  onChange={(e) => setClass12Marks(e.target.value)}
                  maxLength={10}
                  required
                  autoComplete="off"
                />
              </div>
            )}

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
          </div>
          {consentNote ? (
            <div id={isScholarshipCheck ? "scholarshipLeadForm" : "heroLeadForm"} className="lead-form-consent-row">
              <div className="single_form hero-form-title consent-empty-title" style={{ width: "auto" }}>
                <h3></h3>
              </div>
              <div className="lead-form-consent-note">
                <input
                  type="checkbox"
                  name="plbx"
                  value="plbx"
                  checked={plbx === "Y"}
                  onChange={(e) => setPlbx(e.target.checked ? "Y" : "N")}
                />
                <span>{consentNote}</span>
              </div>
            </div>
          ) : null}
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
                disabled={status === "sending" || status === "verifying"}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                required
              />
              <button id="otpSubmit" type="submit" disabled={status === "sending" || status === "verifying"}>
                {status === "sending"
                  ? "Sending OTP..."
                  : status === "verifying"
                    ? "Verifying..."
                    : "Verify and Submit"}
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
                aria-disabled={status === "sending" || status === "verifying"}
                onClick={(e) => {
                  e.preventDefault();
                  if (status === "sending" || status === "verifying") return;
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
