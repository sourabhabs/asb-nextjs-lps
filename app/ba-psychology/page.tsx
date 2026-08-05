import type { Metadata } from "next";
import AsbCourseLandingShell from "@/app/components/AsbCourseLandingShell";
import { ASB_COURSE_ROUTES } from "@/lib/asb-routes";

const course = ASB_COURSE_ROUTES["ba-psychology"];

export const metadata: Metadata = {
  title: course.title,
  description: course.description,
};

export default function BaPsychologyPage() {
  return (
    <>
      <style>{`
        @media (min-width: 992px) {
          .asb-course-shell-ba-psychology .header-hero {
            height: calc(45.42vw + 146px) !important;
          }
          .asb-course-shell-ba-psychology .header-hero-content {
            padding-left: 30px !important;
            padding-right: 24px !important;
            min-height: clamp(318px, 30vw, 430px) !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
          }
          .asb-course-shell-ba-psychology .admissions-timer-desktop-lhs {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            width: fit-content !important;
            max-width: min(720px, 56vw) !important;
            padding-top: 14px !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-header-text {
            display: block !important;
            max-width: min(720px, 56vw) !important;
            margin: 0 0 14px !important;
            text-shadow: 0 10px 28px rgba(6, 16, 38, 0.32) !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-top-small {
            font-size: clamp(22px, 1.6vw, 28px) !important;
            line-height: 1.1 !important;
            margin: 0 0 4px !important;
            white-space: nowrap !important;
            color: #fff !important;
            font-weight: 800 !important;
            letter-spacing: -0.02em !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-main-title {
            font-size: clamp(44px, 3.5vw, 58px) !important;
            line-height: 1.02 !important;
            letter-spacing: -0.03em !important;
            margin: 0 !important;
            white-space: nowrap !important;
            color: #fff !important;
            font-weight: 900 !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-bottom-small {
            font-size: clamp(20px, 1.4vw, 26px) !important;
            line-height: 1.1 !important;
            margin: 6px 0 0 !important;
            white-space: nowrap !important;
            color: #fff !important;
            font-weight: 800 !important;
            letter-spacing: -0.02em !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-header-text::after {
            content: "" !important;
            display: block !important;
            width: 110px !important;
            height: 6px !important;
            border-radius: 999px !important;
            margin: 12px 0 14px !important;
            background: linear-gradient(90deg, #f0b7ea 0%, #791F70 100%) !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-pill-badge {
            display: inline-flex !important;
            align-items: center !important;
            flex-wrap: wrap !important;
            gap: 6px !important;
            max-width: min(720px, 56vw) !important;
            padding: 8px 16px !important;
            border: 2px solid #f0b7ea !important;
            border-radius: 30px !important;
            background: rgba(121, 31, 112, 0.35) !important;
            box-shadow: 0 12px 28px rgba(6, 16, 38, 0.18) !important;
            color: #fff !important;
            font-size: clamp(15px, 1.1vw, 19px) !important;
            line-height: 1.2 !important;
            font-weight: 700 !important;
            white-space: normal !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-pill-badge span {
            color: #fff1fd !important;
            font-weight: 900 !important;
            font-size: 1.1em !important;
            letter-spacing: -0.01em !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-meta-row {
            display: flex !important;
            align-items: stretch !important;
            gap: 14px !important;
            flex-wrap: nowrap !important;
            margin: 0 !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-scholarship-badge {
            display: flex !important;
            align-items: center !important;
            gap: clamp(10px, 0.8vw, 18px) !important;
            padding: clamp(10px, 0.8vw, 18px) clamp(14px, 1vw, 24px) !important;
            background: rgba(15, 31, 69, 0.95) !important;
            border: 1.5px solid #ffb703 !important;
            border-radius: clamp(12px, 0.8vw, 18px) !important;
            box-shadow: 0 0 12px rgba(255, 183, 3, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2) !important;
            width: fit-content !important;
            margin: 0 !important;
            text-align: left !important;
            align-self: stretch !important;
            min-height: clamp(108px, 7.5vw, 148px) !important;
            box-sizing: border-box !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-left {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex: 0 0 auto !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-left svg {
            width: clamp(34px, 2.4vw, 50px) !important;
            height: clamp(34px, 2.4vw, 50px) !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-divider {
            width: 1px !important;
            height: clamp(48px, 3.2vw, 70px) !important;
            background: rgba(255, 183, 3, 0.4) !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-right {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            line-height: 1 !important;
            justify-content: center !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-upto {
            color: #ffb703 !important;
            font-size: clamp(10px, 0.7vw, 14px) !important;
            font-weight: 800 !important;
            letter-spacing: 0.05em !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-percent {
            color: #ffb703 !important;
            font-size: clamp(26px, 1.9vw, 42px) !important;
            font-weight: 900 !important;
            line-height: 0.95 !important;
            margin: 2px 0 !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-title {
            color: #ffffff !important;
            font-size: clamp(13px, 0.9vw, 19px) !important;
            font-weight: 800 !important;
            letter-spacing: 0.05em !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-sub {
            color: #ffffff !important;
            font-size: clamp(8px, 0.55vw, 12px) !important;
            font-weight: 700 !important;
            letter-spacing: 0.02em !important;
            margin-top: 1px !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-pill {
            background: #ffb703 !important;
            color: #000000 !important;
            font-size: clamp(8px, 0.55vw, 12px) !important;
            font-weight: 900 !important;
            padding: clamp(2px, 0.2vw, 4px) clamp(7px, 0.5vw, 11px) !important;
            border-radius: 99px !important;
            margin-top: 3px !important;
            letter-spacing: 0.03em !important;
          }
          .asb-course-shell-ba-psychology .frmD {
            padding: 14px 8px !important;
            background-color: rgba(121, 31, 112, 0.88) !important;
          }
          .asb-course-shell-ba-psychology #heroLeadForm:not(.lead-form-consent-row) {
            display: grid !important;
            grid-template-columns:
              minmax(290px, 1.25fr)
              repeat(4, minmax(100px, 1fr))
              minmax(190px, 1.2fr)
              minmax(112px, auto) !important;
            align-items: center !important;
            gap: 6px !important;
            width: 100% !important;
            max-width: 1360px !important;
            margin: 0 auto !important;
            padding: 0 !important;
          }
          .asb-course-shell-ba-psychology #heroLeadForm:not(.lead-form-consent-row) .hero-form-title {
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
            margin: 0 !important;
          }
          .asb-course-shell-ba-psychology #heroLeadForm:not(.lead-form-consent-row) .hero-form-title h3 {
            width: 100% !important;
            margin: 0 !important;
            color: #fff !important;
            font-size: clamp(20px, 2vw, 30px) !important;
            line-height: 1 !important;
            white-space: nowrap !important;
          }
          .asb-course-shell-ba-psychology #heroLeadForm:not(.lead-form-consent-row) .single_form,
          .asb-course-shell-ba-psychology #heroLeadForm:not(.lead-form-consent-row) .course-select-wrap {
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
            margin: 0 !important;
            flex: unset !important;
          }
          .asb-course-shell-ba-psychology #heroLeadForm:not(.lead-form-consent-row) .single_form input,
          .asb-course-shell-ba-psychology #heroLeadForm:not(.lead-form-consent-row) .single_form select,
          .asb-course-shell-ba-psychology #heroLeadForm:not(.lead-form-consent-row) .course-readonly {
            width: 100% !important;
            min-width: 0 !important;
            height: 40px !important;
            min-height: 40px !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            font-size: 15px !important;
            line-height: 40px !important;
          }
          .asb-course-shell-ba-psychology #heroLeadForm:not(.lead-form-consent-row) #heroSubmitBtn {
            width: 100% !important;
            min-width: 120px !important;
            height: 40px !important;
            line-height: 40px !important;
            padding: 0 12px !important;
            white-space: nowrap !important;
          }
        }
        @media (min-width: 992px) and (max-height: 820px) {
          .asb-course-shell-ba-psychology .header-hero-content {
            min-height: clamp(318px, 30vw, 430px) !important;
            justify-content: center !important;
            padding-top: 0 !important;
          }
          .asb-course-shell-ba-psychology .admissions-timer-desktop-lhs {
            padding-top: 0 !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-top-small {
            font-size: 20px !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-main-title {
            font-size: clamp(38px, 3.4vw, 52px) !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-bottom-small {
            font-size: 17px !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-header-text::after {
            width: 92px !important;
            height: 6px !important;
            margin: 10px 0 12px !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-pill-badge {
            padding: 7px 12px !important;
            border-radius: 14px !important;
            font-size: clamp(14px, .98vw, 17px) !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-pill-badge span {
            font-size: 1.12em !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-scholarship-badge {
            width: clamp(270px, 21vw, 330px) !important;
            min-width: clamp(270px, 21vw, 330px) !important;
            padding: 10px 12px !important;
            min-height: 102px !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-percent {
            font-size: clamp(28px, 2vw, 36px) !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-title {
            font-size: clamp(13px, .92vw, 16px) !important;
          }
        }
        @media (min-width: 992px) and (max-width: 1600px) {
          .asb-course-shell-ba-psychology .header-hero-content {
            min-height: clamp(318px, 30vw, 430px) !important;
          }
          .asb-course-shell-ba-psychology .admissions-timer-desktop-lhs {
            justify-content: flex-start !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-top-small {
            font-size: clamp(16px, 0.96vw, 19px) !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-main-title {
            font-size: clamp(31px, 2.4vw, 38px) !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-bottom-small {
            font-size: clamp(13px, 0.8vw, 16px) !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-header-text::after {
            width: 84px !important;
            height: 6px !important;
            margin: 10px 0 12px !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-pill-badge {
            padding: 6px 10px !important;
            border-width: 2px !important;
            border-radius: 12px !important;
            font-size: clamp(10px, 0.64vw, 12px) !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-scholarship-badge {
            width: clamp(214px, 16vw, 266px) !important;
            min-width: clamp(214px, 16vw, 266px) !important;
            padding: 8px 10px !important;
            gap: 8px !important;
            min-height: 88px !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-left svg {
            width: 28px !important;
            height: 28px !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-divider {
            height: 38px !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-upto {
            font-size: 8px !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-percent {
            font-size: clamp(19px, 1.28vw, 24px) !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-title {
            font-size: clamp(9px, 0.6vw, 11px) !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-sub {
            font-size: clamp(6px, 0.42vw, 8px) !important;
          }
          .asb-course-shell-ba-psychology .asb-bba2-sch-pill {
            font-size: 7px !important;
            padding: 2px 6px !important;
          }
        }
        @media (max-width: 991px) {
          .asb-course-shell-ba-psychology .navbar-area { position:relative!important;top:auto!important;left:auto!important;background:#fff!important;box-shadow:none!important }
          .asb-course-shell-ba-psychology .navbar-area .container-fluid { padding-left:0!important;padding-right:0!important }
          .asb-course-shell-ba-psychology .navbar-area .row { margin-left:0!important;margin-right:0!important }
          .asb-course-shell-ba-psychology .navbar-area .col-lg-12 { padding-left:0!important;padding-right:0!important }
          .asb-course-shell-ba-psychology .navbar-area .navbar { padding:0!important;min-height:auto!important }
          .asb-course-shell-ba-psychology .frmD { position:relative!important;border:1px solid #e2e8f0!important;border-radius:22px!important;padding:18px 14px 16px!important;max-width:420px!important;margin:10px auto 0!important;box-shadow:0 10px 25px rgba(15,23,42,.12)!important;overflow:visible!important;background:#fff!important }
          .asb-course-shell-ba-psychology #heroLeadForm { display:block!important;padding-top:15px!important;margin-top:0!important }
          .asb-course-shell-ba-psychology .hero-form-title { width:100%!important;margin:0 auto 15px!important;padding-top:0!important;display:block!important }
          .asb-course-shell-ba-psychology .hero-form-title h3 { text-align:center!important;margin:0!important;padding:0!important;width:100%!important;color:#0f1f45!important;font-size:2.35rem!important;font-weight:800!important;line-height:1.02!important }
          .asb-course-shell-ba-psychology .alc-mobile-header { padding:10px 14px 8px!important;max-width:420px!important;margin:0 auto!important;background:#fff!important }
          .asb-course-shell-ba-psychology .alc-mobile-header .navbar-brand { margin:0!important }
          .asb-course-shell-ba-psychology .alc-mobile-header .navbar-brand img { height:46px!important }
          .asb-course-shell-ba-psychology .alc-mobile-header .alc-mobile-badge { width:34px!important;height:34px!important }
          .asb-course-shell-ba-psychology .bnrbg { background:#f4f4f5!important }
          .asb-course-shell-ba-psychology .header-hero { height:auto!important;padding-top:0!important;padding-bottom:10px!important }
          .asb-course-shell-ba-psychology .header-hero .container-l { width:100%!important;max-width:420px!important;margin:0 auto!important;padding:0!important }
          .asb-course-shell-ba-psychology .header-hero-content { padding:0!important;margin:0 auto!important;text-align:center!important;max-width:420px!important }
          .asb-course-shell-ba-psychology .mobH { display:none!important }
          .asb-course-shell-ba-psychology .mobV { display:block!important;max-width:420px!important;margin:0 auto 10px!important;padding:0 0!important }
          .asb-course-shell-ba-psychology .mobV img { width:100%!important;max-width:390px!important;height:auto!important;display:block!important;margin:0 auto!important }
          .asb-course-shell-ba-psychology .asb-hero-stats { display:flex!important;justify-content:center!important;width:min(100%,170px)!important;margin:14px auto 24px!important }
          .asb-course-shell-ba-psychology .asb-hero-stat-box { display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;min-height:104px!important;padding:16px 10px!important;border:1px solid rgba(180,246,242,.95)!important;border-radius:12px!important;background:linear-gradient(180deg,rgba(255,255,255,.99) 0%,rgba(245,255,254,.98) 36%,rgba(228,255,252,.95) 72%,rgba(214,252,248,.92) 100%)!important;backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important;box-shadow:0 0 0 1px rgba(131,234,228,.12),0 10px 20px rgba(15,31,69,.1),0 0 20px rgba(137,255,244,.16)!important;text-align:center!important }
          .asb-course-shell-ba-psychology .asb-hero-stat-value { margin:0 0 4px!important;color:#791F70!important;font-size:clamp(19px,5.8vw,24px)!important;line-height:1.05!important;font-weight:800!important;white-space:nowrap!important;text-shadow:0 0 8px rgba(164,255,247,.14)!important }
          .asb-course-shell-ba-psychology .asb-hero-stat-label { margin:0!important;color:#25434b!important;font-size:13px!important;line-height:1.15!important;font-weight:700!important;white-space:normal!important }
          .asb-course-shell-ba-psychology #heroLeadForm .single_form { width:100%!important;margin-top:10px!important }
          .asb-course-shell-ba-psychology #heroLeadForm .single_form input, .asb-course-shell-ba-psychology #heroLeadForm .single_form select { height:52px!important;border-radius:12px!important;border:1px solid #d6dae2!important;background:#f0f2f5!important;padding:0 14px!important;font-size:16px!important;color:#475569!important }
          .asb-course-shell-ba-psychology #heroSubmitBtn { height:48px!important;line-height:48px!important;border-radius:12px!important;background:#791F70!important;font-weight:800!important;letter-spacing:.02em!important;box-shadow:0 10px 18px rgba(121, 31, 112, 0.28)!important }
          .asb-course-shell-ba-psychology .mobile-cta { display:flex!important;position:fixed!important;left:14px!important;right:14px!important;bottom:12px!important;z-index:9999!important;opacity:0!important;pointer-events:none!important;transform:translateY(18px)!important;transition:opacity .3s ease,transform .3s ease!important }
          .asb-course-shell-ba-psychology .mobile-cta.is-visible { opacity:1!important;pointer-events:auto!important;transform:translateY(0)!important }
          .asb-course-shell-ba-psychology .mobile-cta-strip { display:flex!important;align-items:center!important;gap:10px!important;width:100%!important;padding:10px 12px!important;background:#ffffff!important;border-radius:18px!important;box-shadow:0 12px 32px rgba(15,31,69,.18)!important }
          .asb-course-shell-ba-psychology .mobile-btn-enq { flex:1!important;height:48px!important;border:none!important;border-radius:999px!important;background:#0f1f45!important;color:#fff!important;font-weight:800!important;font-size:15px!important;text-transform:uppercase!important }
          .asb-course-shell-ba-psychology .mobile-btn-call { width:48px!important;height:48px!important;border-radius:50%!important;display:flex!important;align-items:center!important;justify-content:center!important;text-decoration:none!important;background:radial-gradient(circle at 30% 30%,#e3fff0,#7ff0ab)!important;color:#0f1f45!important;box-shadow:0 8px 18px rgba(50,205,125,.24)!important }
          .asb-course-shell-ba-psychology .mobile-btn-wa { width:48px!important;height:48px!important;display:flex!important;align-items:center!important;justify-content:center!important;text-decoration:none!important;transition:transform 0.2s ease!important }
          .asb-course-shell-ba-psychology .mobile-btn-wa img { width:100%!important;height:100%!important;object-fit:contain!important }
        }
        @media (max-width:767px) {
          .asb-course-shell-ba-psychology .recruiters-grid { grid-template-columns:repeat(2,1fr)!important;gap:12px!important }
          .asb-course-shell-ba-psychology .top-recruiters { padding:40px 0!important }
        }
      `}</style>
      <AsbCourseLandingShell course={course} />
    </>
  );
}
