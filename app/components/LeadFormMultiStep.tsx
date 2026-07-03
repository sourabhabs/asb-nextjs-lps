"use client";

import { useEffect, useState } from "react";

interface LeadFormMultiStepProps {
  title?: string;
  courses?: { value: string; label: string }[];
  thankYouPath?: string;
  queryLabel?: string;
  id?: string;
  className?: string;
  submitLabel?: string;
}

const DEFAULT_COURSES = [
  { value: "BBA", label: "BBA" },
  { value: "BCA", label: "BCA" },
  { value: "B.Com (Hons)", label: "B.Com (Hons)" },
  { value: "B.Sc (Hons)", label: "B.Sc (Hons)" },
];

function getUTMParam(name: string): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(name) ?? "";
}

export default function LeadFormMultiStep({
  title = "Start Your Application",
  courses = DEFAULT_COURSES,
  queryLabel = "ASB Pmax campaign 2026 Landing",
  id = "enquire",
  className = "",
  submitLabel = "Continue Application",
}: LeadFormMultiStepProps) {
  // Step state: 0 = contact form, 1 = completed Class 12, 2 = score, 3 = English, 4 = planning, 5 = thank you
  const [step, setStep] = useState(0);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [course, setCourse] = useState("");

  // Questionnaire fields
  const [completedClass12, setCompletedClass12] = useState("");
  const [class12Score, setClass12Score] = useState("");
  const [englishComfort, setEnglishComfort] = useState("");
  const [higherEducationPlanning, setHigherEducationPlanning] = useState("");

  // System states
  const [leadDocId, setLeadDocId] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const selectedCourse = courses.find((item) => item.value === course);

  useEffect(() => {
    if (courses.length === 1) {
      setCourse(courses[0].value);
    }
  }, [courses]);

  function showError(msg: string) {
    setStatusMsg(msg);
    setStatus("error");
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !phone || phone.length !== 10 || !city || !course) {
      showError("Please fill all required fields correctly.");
      return;
    }

    setStatus("sending");
    setStatusMsg("");

    const body = new URLSearchParams({
      name,
      email,
      phone,
      city,
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
      utm_creativeid: getUTMParam("utm_creativeid"),
      utm_keyword: getUTMParam("utm_keyword"),
      utm_matchtype: getUTMParam("utm_matchtype"),
      utm_network: getUTMParam("utm_network"),
      utm_gclid: getUTMParam("utm_gclid"),
    });

    try {
      const res = await fetch("/api/homepage2/start", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      const data = await res.json();

      if (data.success && data.leadDocId) {
        setLeadDocId(data.leadDocId);
        setStatus("idle");
        setStep(1); // Go to step 1 of questionnaire
      } else {
        showError(data.message || "Something went wrong. Please try again.");
        setStatus("idle");
      }
    } catch {
      showError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  async function handleQuestionnaireSubmit() {
    if (!completedClass12 || !class12Score || !englishComfort || !higherEducationPlanning) {
      showError("Please answer all questions before submitting.");
      return;
    }

    setStatus("sending");
    setStatusMsg("");

    try {
      const res = await fetch("/api/homepage2/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadDocId,
          completedClass12,
          class12Score,
          englishComfort,
          higherEducationPlanning,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("idle");
        setStep(5); // Thank you page step
      } else {
        showError(data.message || "Failed to submit questionnaire. Please try again.");
        setStatus("idle");
      }
    } catch {
      showError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  const isLoading = status === "sending";

  return (
    <>
      <style>{`
        .pmax-form-status {
          font-size: 14px;
          font-weight: 700;
          line-height: 1.3;
          padding: 8px 2px 0;
          color: #cc2f2f;
          text-align: center;
        }
        .q-container {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          padding: 24px 20px;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1);
          color: #0f172a;
          text-align: left;
        }
        @media (min-width: 992px) {
          .q-container {
            width: 480px;
            margin: 0 0 0 auto;
          }
        }
        .q-title {
          font-size: 26px;
          font-weight: 800;
          color: #0f1f45;
          margin: 0 0 4px;
          line-height: 1.15;
          text-align: center;
        }
        .q-sub {
          font-size: 14px;
          color: #475569;
          margin: 0 0 20px;
          line-height: 1.45;
          text-align: center;
        }
        .q-input-group {
          margin-bottom: 14px;
        }
        .q-input {
          width: 100%;
          height: 48px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          padding: 0 14px;
          font-size: 15px;
          color: #0f172a;
          background: #fff;
          outline: none;
          transition: border-color 0.2s;
        }
        .q-input:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 1px #0d9488;
        }
        .course-readonly {
          display: flex;
          align-items: center;
          width: 100%;
          height: 48px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 0 14px;
          font-size: 15px;
          color: #64748b;
          font-weight: 600;
        }
        .q-submit-btn {
          width: 100%;
          height: 48px;
          border: none;
          border-radius: 12px;
          background: #0d9488;
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          transition: opacity 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15);
        }
        .q-submit-btn:hover {
          opacity: 0.95;
        }
        .q-submit-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
        }
        .progress-wrapper {
          margin-bottom: 24px;
        }
        .progress-text {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 6px;
        }
        .progress-bar-bg {
          width: 100%;
          height: 6px;
          background: #e2e8f0;
          border-radius: 99px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: #0d9488;
          border-radius: 99px;
          transition: width 0.3s ease;
        }
        .q-card {
          margin-bottom: 20px;
        }
        .q-question {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px;
          line-height: 1.3;
        }
        .q-qsub {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 16px;
          line-height: 1.4;
        }
        .option-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 14px 18px;
          margin-bottom: 10px;
          background: #fff;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          color: #334155;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .option-button:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }
        .option-button.active {
          background: #f0fdfa;
          border-color: #0d9488;
          color: #0f766e;
          box-shadow: 0 0 0 1px #0d9488;
        }
        .option-circle {
          width: 18px;
          height: 18px;
          border: 2px solid #cbd5e1;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
          position: relative;
        }
        .option-button.active .option-circle {
          border-color: #0d9488;
        }
        .option-button.active .option-circle::after {
          content: "";
          position: absolute;
          inset: 3px;
          background: #0d9488;
          border-radius: 50%;
        }
        .q-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .btn-back {
          flex: 1;
          height: 48px;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          background: #fff;
          color: #475569;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-back:hover {
          background: #f8fafc;
        }
        .btn-continue {
          flex: 2;
          height: 48px;
          border: none;
          border-radius: 12px;
          background: #0f1f45;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-continue:hover {
          opacity: 0.95;
        }
        .btn-continue:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }
        .thank-you-card {
          text-align: center;
          padding: 30px 10px;
        }
        .thank-you-icon {
          width: 64px;
          height: 64px;
          background: #dcfce7;
          color: #15803d;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .thank-you-title {
          font-size: 28px;
          font-weight: 800;
          color: #0f1f45;
          margin-bottom: 12px;
        }
        .thank-you-desc {
          font-size: 16px;
          color: #475569;
          line-height: 1.6;
        }
      `}</style>

      {step === 0 && (
        <div className={`q-container ${className}`} id={id}>
          <h3 className="q-title">{title}</h3>
          <p className="q-sub">
            Takes under a minute. Our admissions team will guide you on the next steps.
          </p>
          <form onSubmit={handleContactSubmit} noValidate>
            <div className="q-input-group">
              <input
                className="q-input"
                type="text"
                placeholder="Name*"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                autoComplete="off"
              />
            </div>
            <div className="q-input-group">
              <input
                className="q-input"
                type="email"
                placeholder="Email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={100}
                required
                autoComplete="off"
              />
            </div>
            <div className="q-input-group">
              <input
                className="q-input"
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
            <div className="q-input-group">
              <input
                className="q-input"
                type="text"
                placeholder="City*"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={50}
                required
                autoComplete="off"
              />
            </div>
            <div className="q-input-group">
              {courses.length === 1 ? (
                <div className="course-readonly" aria-label="Selected Course">
                  {courses[0].label}
                </div>
              ) : (
                <select
                  className="q-input"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                  style={{ color: course ? "#334155" : "#767676" }}
                >
                  <option value="">Select Course*</option>
                  {courses.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {statusMsg && (
              <div className="pmax-form-status" style={{ marginBottom: "12px" }}>
                {statusMsg}
              </div>
            )}

            <button type="submit" className="q-submit-btn" disabled={isLoading}>
              {isLoading ? "SAVING..." : submitLabel}
            </button>
          </form>
        </div>
      )}

      {step >= 1 && step <= 4 && (
        <div className="q-container">
          <h3 className="q-title">Complete Your Application Profile</h3>
          <p className="q-sub">
            Answer a few quick questions to help us guide you towards the right program and scholarship opportunities.
          </p>

          <div className="progress-wrapper">
            <div className="progress-text">
              <span>Step {step} of 4</span>
              <span>Hi {name}!</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {step === 1 && (
            <div className="q-card">
              <h4 className="q-question">Have you completed Class 12?</h4>
              <p className="q-qsub">This helps us confirm eligibility for our undergraduate programs.</p>

              {["Yes", "No"].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`option-button${completedClass12 === val ? " active" : ""}`}
                  onClick={() => setCompletedClass12(val)}
                >
                  <span>{val}</span>
                  <span className="option-circle"></span>
                </button>
              ))}

              {statusMsg && <div className="pmax-form-status" style={{ marginTop: "10px" }}>{statusMsg}</div>}

              <div className="q-actions">
                <button type="button" className="btn-back" onClick={() => setStep(0)}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn-continue"
                  disabled={!completedClass12}
                  onClick={() => {
                    setStatusMsg("");
                    setStep(2);
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="q-card">
              <h4 className="q-question">What was your Class 12 score?</h4>
              <p className="q-qsub">This helps us calculate any scholarship you may be eligible for.</p>

              {["Below 80%", "80 - 84.9%", "85 - 89.9%", "90 - 94.9%", "95 - 100%"].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`option-button${class12Score === val ? " active" : ""}`}
                  onClick={() => setClass12Score(val)}
                >
                  <span>{val}</span>
                  <span className="option-circle"></span>
                </button>
              ))}

              {statusMsg && <div className="pmax-form-status" style={{ marginTop: "10px" }}>{statusMsg}</div>}

              <div className="q-actions">
                <button type="button" className="btn-back" onClick={() => setStep(1)}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn-continue"
                  disabled={!class12Score}
                  onClick={() => {
                    setStatusMsg("");
                    setStep(3);
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="q-card">
              <h4 className="q-question">ASB programs are delivered in English. Are you comfortable studying in English?</h4>
              <p className="q-qsub">This helps us understand if you require additional language assistance.</p>

              {[
                { value: "Yes", label: "Yes" },
                { value: "Need additional support", label: "Need additional support" },
                { value: "No", label: "No" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`option-button${englishComfort === opt.value ? " active" : ""}`}
                  onClick={() => setEnglishComfort(opt.value)}
                >
                  <span>{opt.label}</span>
                  <span className="option-circle"></span>
                </button>
              ))}

              {statusMsg && <div className="pmax-form-status" style={{ marginTop: "10px" }}>{statusMsg}</div>}

              <div className="q-actions">
                <button type="button" className="btn-back" onClick={() => setStep(2)}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn-continue"
                  disabled={!englishComfort}
                  onClick={() => {
                    setStatusMsg("");
                    setStep(4);
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="q-card">
              <h4 className="q-question">Are you actively planning to pursue higher education within the next 12 months?</h4>
              <p className="q-qsub">This helps us gauge your admission timeline.</p>

              {["Yes", "Exploring Options", "No"].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`option-button${higherEducationPlanning === val ? " active" : ""}`}
                  onClick={() => setHigherEducationPlanning(val)}
                >
                  <span>{val}</span>
                  <span className="option-circle"></span>
                </button>
              ))}

              {statusMsg && <div className="pmax-form-status" style={{ marginTop: "10px" }}>{statusMsg}</div>}

              <div className="q-actions">
                <button type="button" className="btn-back" onClick={() => setStep(3)}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn-continue"
                  disabled={!higherEducationPlanning || isLoading}
                  onClick={handleQuestionnaireSubmit}
                >
                  {isLoading ? "SUBMITTING..." : "Submit Application"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 5 && (
        <div className="q-container">
          <div className="thank-you-card">
            <div className="thank-you-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill="currentColor" />
              </svg>
            </div>
            <h3 className="thank-you-title">Thank You!</h3>
            <p className="thank-you-desc">
              Your application profile has been submitted successfully. Our admissions team will guide you on the next steps.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
