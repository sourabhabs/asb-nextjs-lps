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
          }
          .asb-course-shell-ba-psychology .asb-psychology-hero-stack {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            width: min(100%, 660px) !important;
            max-width: 660px !important;
            min-width: 660px !important;
            padding-top: 14px !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-header-text {
            display: block !important;
            max-width: 660px !important;
            min-width: 660px !important;
            width: 660px !important;
            margin: 0 0 14px !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-top-small {
            font-size: clamp(17px, 1.18vw, 21px) !important;
            line-height: 1.05 !important;
            margin: 0 0 4px !important;
            white-space: nowrap !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-main-title {
            font-size: clamp(34px, 2.9vw, 44px) !important;
            line-height: 0.98 !important;
            letter-spacing: -0.04em !important;
            margin: 0 !important;
            white-space: nowrap !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-bottom-small {
            font-size: clamp(14px, 0.96vw, 18px) !important;
            line-height: 1.05 !important;
            margin: 6px 0 0 !important;
            white-space: nowrap !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-header-text::after {
            width: 92px !important;
            height: 7px !important;
            margin: 12px 0 14px !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-hero-pill-badge {
            display: inline-flex !important;
            max-width: 660px !important;
            min-width: 0 !important;
            padding: 7px 12px !important;
            border-radius: 14px !important;
            font-size: clamp(12px, 0.82vw, 14px) !important;
            line-height: 1.16 !important;
            white-space: normal !important;
          }
          .asb-course-shell-ba-psychology .asb-desktop-scholarship-row {
            display: flex !important;
            align-items: stretch !important;
            gap: 16px !important;
            margin: 0 0 18px 0 !important;
            width: fit-content !important;
            max-width: 100% !important;
          }
          .asb-course-shell-ba-psychology .asb-scholarship-card {
            margin-top: 0 !important;
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
          .asb-course-shell-ba-psychology .asb-psychology-hero-stack {
            padding-top: 22px !important;
          }
        }
      `}</style>
      <AsbCourseLandingShell course={course} />
    </>
  );
}
