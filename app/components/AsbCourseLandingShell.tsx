"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LeadForm from "./LeadForm";
import type { AsbCourseRouteConfig } from "@/lib/asb-routes";

interface AsbCourseLandingShellProps {
  course: AsbCourseRouteConfig;
  forceTealTheme?: boolean;
  customEvents?: ReadonlyArray<EventCard>;
  desktopScholarshipLogoSrc?: string;
  desktopScholarshipLogoAlt?: string;
  showWhatsApp?: boolean;
  formConsentNote?: string;
}

type EventCard = {
  label: string;
  src: string;
  wide?: boolean;
  subLabels?: readonly string[];
};

type CourseDetails = {
  highlight: string;
  contactLabel: string;
  footerDescription: string;
  heroFee?: string;
  options: { value: string; label: string }[];
  cardImage: string;
  cardTitle: string;
  description: string;
  blocks: {
    title: string;
    subtitle?: string;
    showPlusBetweenItems?: boolean;
    items: string[];
  }[];
};

const COURSE_DETAILS: Record<string, CourseDetails> = {
  bba: {
    highlight: "BBA",
    contactLabel: "BBA",
    footerDescription:
      "Admissions open for 2026 intake. Build your future in business, management and global leadership with a globally aware academic ecosystem.",
    heroFee: "Rs. 5.45 Lakh",
    options: [
      { value: "BBA", label: "BBA" },
      { value: "IPM (BBA+PGDM)", label: "IPM (BBA+PGDM)" },
    ],
    cardImage: "/Course/BBA.webp",
    cardTitle: "BBA (General/International)",
    description:
      "ASB Noida is ranked among the best BBA colleges in Noida. Their specialised programs, BBA (General) and BBA (International), are affiliated with CCS university and offer students with the essentials of business management and corporate functioning. Over three years, students receive a well-structured education that equips them with all of the skills and expertise to succeed in a highly complex and competitive business environment.",
    blocks: [
      {
        title: "3 Year BBA Degree Program",
        subtitle: "with major specializations in (anyone)",
        items: [
          "Marketing / Finance / Human Resource Management / Business Analytics / International Business / Supply Chain Management",
        ],
      },
      {
        title: "with specialised certification in (anyone):",
        items: [
          "Artificial Intelligence / Entrepreneurship & New Venture Creation / Family Business Management / Real Estate Management",
        ],
      },
      {
        title: "with Additional Diplomas and Certifications in:",
        items: [
          "*International Certification in Personal & Professional Development from O.B.C., Oxford/London, UK",
          "Social Media Marketing & Business Analytic from NIIT",
          "Media Applications from AAFT",
          "Corporate Communications from CSD",
        ],
      },
    ],
  },
  bca: {
    highlight: "BCA",
    contactLabel: "BCA",
    footerDescription:
      "Admissions open for 2026 intake. Build your future in technology, software and innovation with a globally aware academic ecosystem.",
    heroFee: "Rs. 4.95 Lakh",
    options: [
      { value: "BCA", label: "BCA" },
    ],
    cardImage: "/Course/BCOM.webp",
    cardTitle: "BCA (General/International)",
    description:
      "Bachelor of Computer Applications (BCA) at Asian School of Business is a three years full-time degree course affiliated with CCS University. This course is designed and structured with the intent to provide students a dynamically stimulating environment, where the students can get transformed into highly skilled IT specialists. The curriculum at the best BCA college in Delhi NCR has been designed to give the students an in-depth knowledge of various subjects.",
    blocks: [
      {
        title: "3 Year BCA Degree Program",
        subtitle: "with major specializations in (anyone):",
        items: [
          "Artificial Intelligence & Machine Learning (Using Python) / Full Stack Development / Data Science",
        ],
      },
      {
        title: "with specialised certification in (anyone):",
        items: ["Cloud Computing & DevOps / Cyber Security / Project Management"],
      },
      {
        title: "with Additional Diplomas and Certifications in:",
        items: [
          "*International Certification in Personal & Professional Development from O.B.C., Oxford/London, UK",
          "Web Analytics from NIIT",
          "New Media Applications from AAFT",
          "Corporate Communications from CSD",
        ],
      },
    ],
  },
  bcom: {
    highlight: "B.Com",
    contactLabel: "B.Com",
    footerDescription:
      "Admissions open for 2026 intake. Build your future in commerce, finance and industry with a globally aware academic ecosystem.",
    heroFee: "Rs. 3.25 Lakh",
    options: [
      { value: "BCOM", label: "B.Com" },
    ],
    cardImage: "/Course/BSC.webp",
    cardTitle: "B.Com. (General/International)",
    description:
      "Bachelor of Commerce (B.Com) at Asian School of Business is a three-year full-time degree program affiliated to CCSU. The objective of this program at ASB is to provide the young students with a basic understanding of finance and commerce-related concepts. ASB Noida is one of the best B.Com colleges in NCR and is capable of producing excellent professionals.",
    blocks: [
      {
        title: "3 Year B.Com. Degree Program",
        subtitle: "with specialised certification in (anyone):",
        items: [
          "Financial Markets",
          "Banking and Insurance",
          "Artificial Intelligence (AI)",
          "Entrepreneurship & New Venture Creation",
        ],
      },
      {
        title: "with Additional Diplomas and Certifications in:",
        items: [
          "*International Certification in Personal & Professional Development from O.B.C., Oxford/London, UK",
          "New Media Applications from AAFT",
          "Corporate Communications from CSD",
        ],
      },
    ],
  },
  bsc: {
    highlight: "B.Sc.(CS)",
    contactLabel: "B.Sc. (CS)",
    footerDescription:
      "Admissions open for 2026 intake. Build your future in computing, data and innovation with a globally aware academic ecosystem.",
    heroFee: "Rs. 3.25 Lakh",
    options: [
      { value: "BSc CS", label: "B.Sc. Computer Science" },
    ],
    cardImage: "/Course/BCA.webp",
    cardTitle: "B.Sc.(CS) (General/International)",
    description:
      "Bachelor Of Science (B.Sc.) in Computer Science at Asian School of Business is a three years full time degree course affiliated to CCSU. This course is designed and structured with the intent of providing our students with a dynamically stimulating environment, where they can be transformed into highly skilled IT specialists.",
    blocks: [
      {
        title: "3 Year B.Sc.(CS) Degree Program",
        subtitle: "with specialised certification in (anyone):",
        items: [
          "AI & Machine Learning",
          "Back-End Engineering",
          "IOT (Internet of Things)",
          "Data Science",
        ],
      },
      {
        title: "with Additional Diplomas and Certifications in:",
        items: [
          "*International Certification in Personal & Professional Development from O.B.C., Oxford/London, UK",
          "New Media Applications from AAFT",
          "Corporate Communications from CSD",
        ],
      },
    ],
  },
  "ba-psychology": {
    highlight: "BA (Hons) Psychology",
    contactLabel: "BA (Hons) Psychology",
    footerDescription:
      "Admissions open for 2026 intake. Build your future in psychology, human behavior and personal development with a future-ready academic ecosystem.",
    options: [
      { value: "BA Psychology", label: "BA (Hons) Psychology" },
    ],
    cardImage: "/Course/BBA.webp",
    cardTitle: "BA (Hons) Psychology",
    description:
      "BA (Hons) Psychology at Asian School of Business is a four-year full-time degree program. The program is designed to provide young minds with an intellectually stimulating learning environment while fostering a scientific understanding of human behavior and mental processes. Students develop strong foundations for both personal and professional growth through academic rigor and interdisciplinary learning.",
    blocks: [
      {
        title: "4 Year BA (Hons) Psychology Degree Program",
        items: ["BA (Hons) Psychology"],
      },
      {
        title: "with Additional Diploma/Certification in:",
        showPlusBetweenItems: true,
        items: [
          "AI and Psychology",
          "Psychological First Aid",
          "Consumer Psychology and Advertising",
          "Data Analytics and Research Methods",
          "Corporate Communication",
        ],
      },
    ],
  },
  "ba-psychology-international": {
    highlight: "BA (Hons) Psychology",
    contactLabel: "BA (Hons) Psychology",
    footerDescription:
      "Admissions open for 2026 intake. Build your future in psychology, human behavior and personal development with a globally aware academic ecosystem.",
    options: [
      { value: "BA Psychology", label: "BA (Hons) Psychology" },
    ],
    cardImage: "/Course/BBA.webp",
    cardTitle: "BA (Hons) Psychology (General/International)",
    description:
      "BA (Hons) Psychology at Asian School of Business is a three-year full-time degree program affiliated to CCS University. The program is designed to provide young minds with an intellectually stimulating learning environment while fostering a scientific understanding of human behavior and mental processes. Students develop strong foundations for both personal and professional growth through academic rigor, global exposure and interdisciplinary learning.",
    blocks: [
      {
        title: "4 Year BA (Hons) Psychology Degree Program",
        items: ["BA (Hons) Psychology (General) / BA (Hons) Psychology (International)"],
      },
      {
        title: "with Additional Diploma/Certification in:",
        showPlusBetweenItems: true,
        items: [
          "AI and Psychology",
          "Psychological First Aid",
          "Consumer Psychology and Advertising",
          "Data Analytics and Research Methods",
          "Corporate Communication",
        ],
      },
    ],
  },
  "ba-psychology3": {
    highlight: "BA (Hons) Psychology",
    contactLabel: "BA (Hons) Psychology",
    footerDescription:
      "Admissions open for 2026 intake. Build your future in psychology, human behavior and personal development with a future-ready academic ecosystem.",
    options: [
      { value: "BA Psychology", label: "BA (Hons) Psychology" },
    ],
    cardImage: "/Course/BBA.webp",
    cardTitle: "BA (Hons) Psychology",
    description:
      "BA (Hons) Psychology at Asian School of Business is a four-year full-time degree program. The program is designed to provide young minds with an intellectually stimulating learning environment while fostering a scientific understanding of human behavior and mental processes. Students develop strong foundations for both personal and professional growth through academic rigor and interdisciplinary learning.",
    blocks: [
      {
        title: "4 Year BA (Hons) Psychology Degree Program",
        items: ["BA (Hons) Psychology"],
      },
      {
        title: "with Additional Diploma/Certification in:",
        showPlusBetweenItems: true,
        items: [
          "AI and Psychology",
          "Psychological First Aid",
          "Consumer Psychology and Advertising",
          "Data Analytics and Research Methods",
          "Corporate Communication",
        ],
      },
    ],
  },
};

const INTL_SLIDES = [
  "/img/slider/1 (1).webp",
  "/img/slider/1 (2).webp",
  "/img/slider/1 (3).webp",
  "/img/slider/1 (4).webp",
];

const RECRUITERS = [
  ["Amul", "/recruiters/amul.jpg"],
  ["Berger", "/recruiters/berger-logo.jpg"],
  ["Colgate", "/recruiters/colgate.jpg"],
  ["Dabur", "/recruiters/dabur.jpg"],
  ["Deloitte", "/recruiters/deloitte.jpg"],
  ["EY", "/recruiters/ey.jpg"],
  ["Federal Bank", "/recruiters/federal-logo.jpg"],
  ["KPMG", "/recruiters/kpmg-logo.jpg"],
] as const;

const EVENTS: readonly EventCard[] = [
  { label: "Aman Gupta", src: "/Events/Aman-4.webp" },
  { label: "Vineeta Singh", src: "/Events/Vineeta2.webp" },
  { label: "Vijay Shekhar Sharma", src: "/Events/Vijay2.webp" },
  { label: "Jazzy-B", src: "/Events/jazzy-B.webp" },
  { label: "Jassie Gill", src: "/Events/Jassi-Gill-2024.webp" },
  { label: "Sunanda Sharma", src: "/Events/sunanda-sharma.webp" },
] as const;

const CAMPUS = [
  ["Campus Building", "/Campus/abs-building.jpg"],
  ["Library", "/Campus/library-n1.jpg"],
  ["Lecture Halls", "/Campus/class-room-n1.jpg"],
  ["Auditorium", "/Campus/audi2.jpg"],
  ["Computer Lab", "/Campus/moot-court.jpg"],
  ["Cafeteria", "/Campus/cafe-n1.jpg"],
] as const;

const TESTIMONIALS = [
  ["Nitin", "https://youtu.be/2W8cP2uESnw"],
  ["Orakhya", "https://youtu.be/iUht0CHIlhc"],
  ["Ananya", "https://youtu.be/imyiEVOEogg"],
  ["Jiya", "https://youtu.be/KuZXLkLKCbo"],
  ["Samara", "https://youtu.be/3qi5afViEXc"],
  ["Isha", "https://youtu.be/lYOvjUDaqBU"],
] as const;

function videoEmbed(url: string, autoplay = false) {
  const id =
    url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)?.[1] ||
    url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)?.[1] ||
    "";
  if (!id) return url;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&controls=0&loop=1&playlist=${id}&autoplay=${autoplay ? 1 : 0}`;
}

export default function AsbCourseLandingShell({
  course,
  forceTealTheme = false,
  customEvents,
  desktopScholarshipLogoSrc,
  desktopScholarshipLogoAlt = "Program logo",
  showWhatsApp = true,
  formConsentNote,
}: AsbCourseLandingShellProps) {
  const homeRef = useRef<HTMLElement | null>(null);
  const content = COURSE_DETAILS[course.key];
  const isBaPsychology = course.key === "ba-psychology";
  const isPsychologyRoute = course.key.startsWith("ba-psychology") && !forceTealTheme;
  const isNewPsychology = course.key === "ba-psychology3" || (course.key === "ba-psychology" && !forceTealTheme);
  const showHeroStats = ["bba", "bca", "bcom", "bsc"].includes(course.key);
  const showOxfordLogo = course.key !== "ba-psychology" || isNewPsychology;
  const showHeroOxfordPoint = course.key !== "ba-psychology" && course.key !== "ba-psychology3";
  const showInternationalSection = course.key !== "ba-psychology" && course.key !== "ba-psychology3";
  const hideHeroPromoBlock = ["bca", "bcom", "bsc"].includes(course.key);
  const events = customEvents ?? EVENTS;
  const [intlIdx, setIntlIdx] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const [testModalUrl, setTestModalUrl] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(2);

  useEffect(() => {
    const node = homeRef.current;
    if (!node) return;
    node.id = "home";
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntlIdx((current) => (current + 1) % INTL_SLIDES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onResize = () => setPerPage(window.innerWidth <= 991 ? 1 : 2);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!homeRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => setShowSticky(!entries[0].isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(homeRef.current);
    return () => observer.disconnect();
  }, []);

  function scrollToId(id: string, desktopHome = false) {
    const selector =
      desktopHome && window.matchMedia("(min-width: 992px)").matches ? "home" : id;
    const target = document.getElementById(selector);
    if (!target) return;
    const sticky = document.querySelector<HTMLElement>(".navbar-area");
    const offset = (sticky?.getBoundingClientRect().height ?? 0) + 10;
    window.scrollTo({
      top: Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - offset),
      behavior: "smooth",
    });
  }

  const titleParts = content.cardTitle.split(" (");
  const pageCount = Math.max(1, Math.ceil(TESTIMONIALS.length / perPage));
  const visible = TESTIMONIALS.slice(page * perPage, page * perPage + perPage);

  return (
    <>
      <style>{`
        .alc-desktop-logo-strip{display:flex;align-items:center;gap:20px;margin-left:22px}
        .alc-desktop-logo-strip .logo-alc{height:68px;width:auto;display:block;object-fit:contain}
        .alc-desktop-logo-strip .logo-obc{height:54px;width:auto;display:block;object-fit:contain}
        .alc-mobile-header{padding:10px 14px 8px!important;max-width:420px;margin:0 auto;background:#fff}
        .alc-mobile-header .navbar-brand img{height:46px!important;width:auto}
        .alc-mobile-header .alc-mobile-badge{width:34px;height:34px;object-fit:contain;flex-shrink:0}
        .navbar-area{background:#fff!important}
        .banner-content ul li{display:block!important}
        .banner-content ul li p{background-image:url(/assets/images/arrow-rb.png);background-repeat:no-repeat;background-position:0 13px;padding-left:30px;color:#000;font-size:17px;line-height:1.5;margin:0 0 5px}
        .course-banner{margin:20px 0;padding:10px;background:#0aaeaf;color:#fff;text-align:center;font-weight:400;line-height:23px;font-size:23px}
        .banner-table td{line-height:24px;position:relative;display:block;font-weight:400;font-size:18px}
        .banner-table td.with-plus::after{content:"+";display:block;color:#ff2b2b;font-weight:700;font-size:24px;line-height:1;margin:6px 0 2px}
         .psychology-rhs{display:flex;flex-direction:column;justify-content:flex-start;height:100%}
        @media (min-width: 768px) {
          .psychology-rhs{justify-content:space-between}
        }
        .psychology-rhs .course-banner{margin-top:0!important}
        .psychology-rhs .banner-table td{text-align:center}
        .psychology-rhs .banner-table td:first-child{padding-top:4px}
        .top-recruiters{padding:60px 0;background:#fff}
        .recruiters-head .subtitle{color:#475569;font-size:16px;margin-top:8px}
        .recruiters-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:30px}
        .recruiter-card{background:#fafafa;border:1px solid #f1f5f9;border-radius:12px;padding:25px;display:flex;align-items:center;justify-content:center;transition:all .3s ease;height:110px}
        .recruiter-card:hover{transform:translateY(-3px);box-shadow:0 10px 25px rgba(0,0,0,.05);border-color:#e2e8f0}
        .recruiter-card img{max-width:100%;max-height:50px;object-fit:contain;filter:none;transition:all .3s ease}
        .events-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px;align-items:start}
        .events-card{display:flex;flex-direction:column;height:100%;width:100%}
        .events-card-wide{grid-column:1 / -1}
        .events-img{width:100%;border:1px solid #e5e7eb;background:#fff;overflow:hidden}
        .events-card .events-img{aspect-ratio:3 / 2}
        .events-card-wide .events-img{aspect-ratio:auto}
        .events-img img{display:block;width:100%;height:100%;object-fit:cover}
        .events-card-wide .events-img img{height:auto;object-fit:contain}
        .events-label{margin-top:14px;font-size:16px;font-weight:500;color:#334e68;text-align:center}
        .events-sub-labels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:12px}
        .events-sub-label{font-size:16px;font-weight:500;color:#334e68;text-align:center}
          color: #ffb703;
          border: 1px solid rgba(255, 183, 3, 0.3);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .badge-glowing-dot {
          width: 6px;
          height: 6px;
          background-color: #ffb703;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px #ffb703;
          animation: scholarship-glow 1.5s infinite ease-in-out;
        }
        @keyframes scholarship-glow {
          0%, 100% { opacity: 0.5; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .asb-scholarship-content {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .asb-scholarship-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }
        .asb-scholarship-card:hover .asb-scholarship-icon-box {
          transform: rotate(5deg) scale(1.05);
        }
        .asb-scholarship-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .asb-scholarship-title {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.01em;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
        .asb-scholarship-desc {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85) !important;
          margin: 0 !important;
          line-height: 1.3;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
        }
        .asb-scholarship-card.mobile-style {
          display: flex;
          width: calc(100% - 20px);
          max-width: 390px;
          margin: 12px auto 0;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05);
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
        .asb-scholarship-card.mobile-style:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08);
          border-color: #cbd5e1;
        }
        .asb-scholarship-card.mobile-style .asb-scholarship-title {
          color: #0f1f45;
          font-size: 16px;
          line-height: 1.15;
        }
        .asb-scholarship-card.mobile-style .asb-scholarship-desc {
          color: #475569 !important;
          font-size: 13px;
        }
        .asb-scholarship-card.mobile-style .asb-scholarship-icon-box {
          background: rgba(15, 31, 69, 0.05);
          border: 1px solid rgba(15, 31, 69, 0.08);
          transform: none;
        }
        .asb-scholarship-card.mobile-style:hover .asb-scholarship-icon-box {
          transform: none;
        }
        .asb-mobile-scholarship-row {
          display: flex;
          align-items: stretch;
          justify-content: center;
          gap: 8px;
          width: calc(100% - 20px);
          max-width: 390px;
          margin: 12px auto 0;
        }
        .asb-mobile-scholarship-row .asb-scholarship-card.mobile-style {
          flex: 1 1 auto;
          width: auto;
          margin: 0;
        }
        .asb-mobile-scholarship-logo {
          flex: 0 0 68px;
          width: 68px;
          min-height: 100%;
          padding: 6px;
          border-radius: 12px;
          background: #fff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .asb-mobile-scholarship-logo img {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
        }
        .asb-desktop-scholarship-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 24px;
          width: fit-content;
          max-width: 100%;
        }
        .asb-desktop-scholarship-row .asb-scholarship-card {
          margin-top: 0;
        }
        .asb-desktop-scholarship-logo {
          margin-top: 0;
          width: 74px;
          padding: 2px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.92);
          flex: 0 0 auto;
        }
        .asb-desktop-scholarship-logo img {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        /* BA Psychology Theme Overrides (#791F70) */
        .asb-psychology-theme .bnrbg {
          background-image: none !important;
        }
        .asb-psychology-theme .course-banner {
          background: #791F70 !important;
        }
        .asb-psychology-theme #heroSubmitBtn {
          background: #791F70 !important;
        }
        .asb-psychology-theme #otpSubmit {
          background: #791F70 !important;
        }
        .asb-psychology-theme .otp-resend a {
          color: #791F70 !important;
        }
        .asb-psychology-theme .frmD {
          background-color: rgba(121, 31, 112, 0.66) !important;
        }
        .asb-psychology-theme div[style*="background: #006972"],
        .asb-psychology-theme div[style*="background:#006972"],
        .asb-psychology-theme div[style*="background: rgb(0, 105, 114)"] {
          background: #791F70 !important;
        }
        .asb-psychology-theme .main-btn {
          background: #791F70 !important;
          border-color: #791F70 !important;
        }
        .asb-psychology-theme .btn-gold {
          background: #791F70 !important;
        }
        .asb-psychology-theme .btn-gold:hover {
          background: #5d1555 !important;
        }
        .asb-psychology-theme .tag {
          color: #791F70 !important;
        }
        .asb-psychology-theme .header-hero {
          min-height: clamp(430px, 42vw, 620px) !important;
        }
        .asb-psychology-theme .header-hero-content {
          min-height: clamp(320px, 30vw, 420px) !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
        }
        .asb-psychology-theme .asb-psychology-hero-stack {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          width: min(100%, 720px);
          max-width: min(100%, 720px);
        }
        .asb-psychology-theme .asb-desktop-hero-header-text {
          max-width: min(100%, 720px) !important;
          margin: 0 0 18px !important;
          color: #fff !important;
          text-shadow: 0 12px 28px rgba(6, 16, 38, 0.35);
        }
        .asb-psychology-theme .asb-desktop-hero-top-small {
          margin: 0 0 4px !important;
          color: #fff !important;
          font-size: clamp(18px, 1.28vw, 24px) !important;
          line-height: 1.06 !important;
          font-weight: 800 !important;
          letter-spacing: -0.02em !important;
        }
        .asb-psychology-theme .asb-desktop-hero-main-title {
          margin: 0 !important;
          color: #fff !important;
          font-size: clamp(40px, 3.25vw, 52px) !important;
          line-height: 0.98 !important;
          font-weight: 900 !important;
          letter-spacing: -0.04em !important;
        }
        .asb-psychology-theme .asb-desktop-hero-bottom-small {
          margin: 6px 0 0 !important;
          color: #fff !important;
          font-size: clamp(16px, 1.05vw, 20px) !important;
          line-height: 1.08 !important;
          font-weight: 800 !important;
          letter-spacing: -0.02em !important;
        }
        .asb-psychology-theme .asb-desktop-hero-header-text::after {
          content: "";
          display: block;
          width: 92px;
          height: 7px;
          border-radius: 999px;
          margin: 14px 0 0;
          background: linear-gradient(90deg, #f9b4ef 0%, #ffffff 100%);
        }
        .asb-psychology-theme .asb-desktop-hero-pill-badge {
          display: inline-flex !important;
          align-items: center !important;
          flex-wrap: wrap !important;
          gap: 4px !important;
          max-width: min(100%, 720px) !important;
          padding: 8px 14px !important;
          border: 2px solid #f0b7ea !important;
          border-radius: 15px !important;
          background: rgba(121, 31, 112, 0.28) !important;
          box-shadow: 0 12px 28px rgba(6, 16, 38, 0.18) !important;
          color: #fff !important;
          font-size: clamp(13px, 0.88vw, 16px) !important;
          line-height: 1.18 !important;
          font-weight: 700 !important;
          margin-bottom: 0 !important;
        }
        .asb-psychology-theme .asb-desktop-hero-pill-badge span {
          color: #fff1fd !important;
        }
        .asb-psychology-theme .asb-desktop-scholarship-row {
          margin-top: 12px !important;
        }
        .asb-psychology-theme .asb-scholarship-card {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.97);
          border: 1px solid #e6d7e5;
          border-radius: 14px;
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
          padding: 12px 16px;
        }
        .asb-psychology-theme .asb-scholarship-icon-box {
          background: rgba(121, 31, 112, 0.08);
          border: 1px solid rgba(121, 31, 112, 0.12);
        }
        .asb-psychology-theme .asb-scholarship-title {
          color: #102044 !important;
          font-size: clamp(16px, 1.12vw, 24px) !important;
          text-shadow: none !important;
          line-height: 1.15 !important;
        }
        .asb-course-shell-ba-psychology #heroLeadForm .hero-form-title,
        .asb-course-shell-ba-psychology3 #heroLeadForm .hero-form-title,
        .asb-psychology-theme #heroLeadForm .hero-form-title {
          min-width: 236px !important;
        }
        .asb-course-shell-ba-psychology #heroLeadForm .course-select-wrap,
        .asb-course-shell-ba-psychology3 #heroLeadForm .course-select-wrap,
        .asb-psychology-theme #heroLeadForm .course-select-wrap {
          width: auto !important;
          min-width: 180px !important;
          max-width: 230px !important;
        }
        .asb-course-shell-ba-psychology .course-readonly,
        .asb-course-shell-ba-psychology3 .course-readonly,
        .asb-psychology-theme .course-readonly {
          white-space: nowrap !important;
          font-size: 14px !important;
          padding: 0 8px !important;
        }
        .asb-psychology3-theme .asb-desktop-hero-highlight {
          font-size: 1.8em !important;
        }
        .asb-psychology-theme .contact-grid {
          grid-template-columns: minmax(0, 1fr) minmax(320px, 520px);
          gap: 48px;
          align-items: center;
        }
        .asb-psychology-theme .cta {
          display: flex;
          justify-content: flex-end;
        }
        .asb-psychology-theme .cta-box {
          width: 100%;
          max-width: 420px;
          padding: 14px 16px;
        }
        .asb-psychology-theme .cta-box .btn {
          width: 100%;
        }
        @media (max-width:991px) {
          .asb-desktop-scholarship-row {
            display: block;
            margin-top: 0;
          }
          .asb-desktop-scholarship-logo {
            display: none;
          }
          .asb-mobile-scholarship-row {
            gap: 8px;
          }
          .asb-mobile-scholarship-logo {
            flex-basis: 68px;
            width: 68px;
          }
          .asb-psychology-theme .frmD {
            background-color: #fff !important;
          }
          .asb-psychology-theme #heroSubmitBtn {
            background: #791F70 !important;
          }
          .asb-psychology-theme .contact-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .asb-psychology-theme .cta {
            justify-content: stretch;
          }
          .asb-psychology-theme .cta-box {
            max-width: 100%;
          }
          .asb-psychology3-theme .bnrbg {
            background: #7B1E72 !important;
          }
          .asb-psychology3-theme .mobV {
            margin-top: 12px !important;
          }
        }

        /* BA Psychology Certifications Section Styling */
        .psychology-certifications-block {
          background: #791F70;
          border-radius: 12px;
          padding: 24px 20px;
          text-align: center;
          margin-top: 25px;
          box-shadow: 0 10px 30px rgba(121, 31, 112, 0.15);
        }
        .psychology-certifications-block .course-banner {
          background: transparent !important;
          color: #fff !important;
          text-decoration: underline !important;
          font-weight: 700;
          font-size: clamp(20px, 4vw, 24px) !important;
          margin: 0 0 24px !important;
          padding: 0 !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .psychology-certifications-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 15px;
          justify-content: center;
          align-items: stretch;
        }
         @media (max-width: 991px) {
          .psychology-certifications-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
        }
        @media (max-width: 767px) {
          .psychology-certifications-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px 12px;
          }
          .psychology-certifications-grid .psy-cert-card:last-child {
            grid-column: span 2;
            justify-self: center;
          }
        }
        .psy-cert-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          color: #fff;
          gap: 12px;
        }
        .psy-cert-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: transform 0.3s ease;
        }
        .psy-cert-card:hover .psy-cert-icon {
          transform: scale(1.1) rotate(2deg);
        }
        .psy-cert-icon svg {
          width: 50px;
          height: 50px;
          stroke: #fff;
          stroke-width: 1.5;
        }
        .psy-cert-name {
          font-size: 14px;
          font-weight: 700;
          line-height: 1.35;
          color: #ffffff;
          max-width: 120px;
        }

        /* Renowned Psychologists Section Styling */
        .psychologists-section {
          background: #791F70;
          padding: 60px 0;
          color: #fff;
          text-align: center;
        }
        .psychologists-head {
          margin-bottom: 40px;
        }
        .psychologists-head .tag {
          color: #ffb703 !important;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 8px;
        }
        .psychologists-head .title {
          color: #fff !important;
          font-size: clamp(24px, 5vw, 36px) !important;
          font-weight: 800 !important;
          margin: 0 !important;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .psychologists-head .line {
          width: 60px;
          height: 3px;
          background: #ffb703;
          margin: 15px auto 0;
          border-radius: 2px;
        }
        .psychologists-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
          justify-content: center;
          align-items: start;
        }
        @media (max-width: 1199px) {
          .psychologists-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
          }
        }
        @media (max-width: 767px) {
          .psychologists-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px 12px;
          }
          .psychologists-grid .psychologist-card:last-child {
            grid-column: span 2;
            justify-self: center;
          }
          .psychologist-photo-wrapper {
            width: 130px;
            height: 145px;
            border-radius: 28px;
            border-width: 3px;
            margin-bottom: 12px;
          }
          .psychologist-name {
            font-size: 14px;
          }
          .psychologist-role {
            font-size: 11px;
            max-width: 140px;
          }
        }
        .psychologist-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .psychologist-photo-wrapper {
          width: 170px;
          height: 190px;
          border-radius: 40px;
          border: 4px solid #fff;
          overflow: hidden;
          position: relative;
          margin-bottom: 18px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          background: #fff;
        }
        .psychologist-photo-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .psychologist-card:hover .psychologist-photo-wrapper img {
          transform: scale(1.08);
        }
        .psychologist-name {
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 6px 0;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          line-height: 1.25;
        }
        .psychologist-role {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.4;
          max-width: 180px;
          margin: 0;
        }
      `}</style>

      <main className={`asb-course-shell-${course.key} ${isPsychologyRoute ? "asb-psychology-theme" : ""} ${isNewPsychology ? "asb-psychology3-theme" : ""}`} style={{ paddingBottom: isPsychologyRoute ? "0" : "88px" }}>
        <header className="header-area">
          <div className="navbar-area">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <nav className="navbar navbar-expand-lg" style={{ display: "flex", justifyContent: "space-between", width: "100%", minHeight: "78px" }}>
                    <div className="d-none d-lg-flex align-items-center">
                      <div className="alc-desktop-logo-strip">
                        <Image src="/img/logo.jpg" alt="Asian School of Business" className="logo-alc" width={200} height={68} priority />
                        {showOxfordLogo ? (
                          <Image src="/img/OBC-Logo.png" style={{ display: "none" }} alt="Oxford Business College" className="logo-obc" width={160} height={54} priority />
                        ) : null}
                      </div>
                    </div>
                    <div className="d-flex d-lg-none w-100 align-items-center justify-content-between alc-mobile-header">
                      <Image className="alc-mobile-badge" src="/assets/images/aicte.jpg" alt="AICTE" width={34} height={34} priority />
                      <a href="#home" className="navbar-brand mx-auto" style={{ display: "flex", alignItems: "center" }}>
                        <Image src="/img/logo.jpg" alt="Asian School of Business" width={160} height={68} priority />
                      </a>
                      <Image className="alc-mobile-badge" src="/img/naac.webp" alt="NAAC" width={34} height={34} priority />
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <section
            ref={homeRef}
            className="header-hero bg_cover d-flex align-items-center bnrbg"
            style={{ position: "relative", overflow: "hidden", backgroundColor: "#f4f4f5" }}
          >
            <div
              className="mobH"
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
            >
              <Image
                src={course.heroImage}
                alt=""
                fill
                priority
                fetchPriority="high"
                unoptimized
                sizes="100vw"
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.28))",
                }}
              />
            </div>
            <div className="container-l banner-content" style={{ width: "auto" }}>
              <div className="row" style={{ width: "100%", marginRight: 0, marginLeft: 0 }}>
                <div className="col-lg-12">
                  <div
                    className="header-hero-content"
                    style={{ paddingLeft: "35px", paddingRight: "30px", position: "relative", zIndex: 1 }}
                  >
                    {!hideHeroPromoBlock ? (
                      isPsychologyRoute ? (
                      <div className="mobH asb-psychology-hero-stack">
                        <div className="asb-desktop-hero-header-text">
                          <div className="asb-desktop-hero-top-small">Join the best</div>
                          <h1 className="asb-desktop-hero-main-title">Undergrad College</h1>
                          <div className="asb-desktop-hero-bottom-small">in Delhi-NCR</div>
                          <div className="asb-desktop-hero-pill-badge">
                            Pursue Full-Time <span>{content.highlight}</span> Degree Program.
                          </div>
                        </div>
                        <div className="asb-desktop-scholarship-row">
                          <div className="asb-scholarship-card">
                            <div className="asb-scholarship-content">
                              <div className="asb-scholarship-icon-box">
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" fill="#ffb703" />
                                  <path d="M5 12.18V17.18L12 21L19 17.18V12.18L12 16L5 12.18Z" fill="#ffb703" />
                                </svg>
                              </div>
                              <h4 className="asb-scholarship-title">{course.hasScholarshipAsterisk ? "Upto 100% Scholarship*" : "Upto 100% Scholarship*"}</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                      ) : (
                      <div className="mobH asb-desktop-hero-copy" style={{ maxWidth: "760px" }}>
                        <h1 className="asb-desktop-hero-title">Join the best<br />Undergrad College in Delhi-NCR</h1>
                        <p className="asb-desktop-hero-subtitle">Pursue Full-Time <span className="asb-desktop-hero-highlight">{content.highlight}</span> Degree Program.</p>
                        {showHeroOxfordPoint ? (
                          <ul className="asb-desktop-hero-points">
                            <li style={{ fontSize: "20px" }}>15 Days Study Trip to Oxford Business College, Oxford & London, U.K.</li>
                          </ul>
                        ) : null}
                        {showHeroStats ? (
                          <div className="asb-hero-stats" aria-label="Course highlights">
                            <div className="asb-hero-stat-box">
                              <p className="asb-hero-stat-value">100%</p>
                              <p className="asb-hero-stat-label">Placement Assistance</p>
                            </div>
                            <div className="asb-hero-stat-box">
                              <p className="asb-hero-stat-value">{content.heroFee}</p>
                              <p className="asb-hero-stat-label">Total Fees</p>
                            </div>
                          </div>
                        ) : null}
                        <div className="asb-desktop-scholarship-row">
                          <div className="asb-scholarship-card">
                            <div className="asb-scholarship-content">
                              <div className="asb-scholarship-icon-box">
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" fill="#ffb703" />
                                  <path d="M5 12.18V17.18L12 21L19 17.18V12.18L12 16L5 12.18Z" fill="#ffb703" />
                                </svg>
                              </div>
                              <h4 className="asb-scholarship-title">{course.hasScholarshipAsterisk ? "Upto 100% Scholarship*" : "Upto 100% Scholarship*"}</h4>
                            </div>
                          </div>
                          {desktopScholarshipLogoSrc ? (
                            <div className="asb-desktop-scholarship-logo mobH">
                              <Image
                                src={desktopScholarshipLogoSrc}
                                alt={desktopScholarshipLogoAlt}
                                width={420}
                                height={200}
                                sizes="118px"
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>
                      )
                    ) : null}
                    <div className="mobV" style={{ textAlign: "center", marginBottom: "10px", marginTop: "-4px" }}>
                      <Image
                        src={course.mobileHeroImage ?? course.heroImage}
                        alt="ASB Admissions 2026"
                        width={390}
                        height={520}
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 420px) 390px, 100vw"
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                      {!hideHeroPromoBlock && showHeroStats ? (
                        <div className="asb-hero-stats" aria-label="Course highlights">
                          <div className="asb-hero-stat-box">
                            <p className="asb-hero-stat-value">100%</p>
                            <p className="asb-hero-stat-label">Placement Assistance</p>
                          </div>
                          <div className="asb-hero-stat-box">
                            <p className="asb-hero-stat-value">{content.heroFee}</p>
                            <p className="asb-hero-stat-label">Total Fees</p>
                          </div>
                        </div>
                      ) : null}
                      {!hideHeroPromoBlock ? (
                        <div className="asb-mobile-scholarship-row">
                          <div className="asb-scholarship-card mobile-style">
                            <div className="asb-scholarship-content">
                              <div className="asb-scholarship-icon-box">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" fill="#ffb703" />
                                  <path d="M5 12.18V17.18L12 21L19 17.18V12.18L12 16L5 12.18Z" fill="#ffb703" />
                                </svg>
                              </div>
                              <h4 className="asb-scholarship-title">{course.hasScholarshipAsterisk ? "Upto 100% Scholarship*" : "Upto 100% Scholarship"}</h4>
                            </div>
                          </div>
                          {desktopScholarshipLogoSrc ? (
                            <div className="asb-mobile-scholarship-logo">
                              <Image
                                src={desktopScholarshipLogoSrc}
                                alt={desktopScholarshipLogoAlt}
                                width={180}
                                height={180}
                                sizes="58px"
                              />
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <LeadForm
                id="enquire"
                title="Admissions Open 2026"
                courses={content.options}
                queryLabel={course.queryLabel}
                thankYouPath={course.thankYouPath}
                submitLabel="Enquire Now"
                consentNote={formConsentNote}
              />
            </div>
          </section>
        </header>

        {showInternationalSection ? (
          <section className="international" id="international">
            <div className="container intl-grid">
              <div>
                <span className="tag">Global Exposure</span>
                <h2 className="title1" style={{ fontSize: "33px" }}><span className="title1" style={{ fontSize: "24px" }}>15 Day Fully Paid Study Trip to</span><br />Oxford & London,U.K.</h2>
                <ul className="intl-list">
                  <li><span className="check"></span>International Certification in Personal & Professional Development</li>
                  <li><span className="check"></span>Hands-on project work and industry exposure</li>
                  <li><span className="check"></span>Networking with Oxford faculty and fellow learners</li>
                  <li><span className="check"></span>Academic immersion across Oxford and London</li>
                </ul>
                <button className="btn btn-gold" type="button" onClick={() => scrollToId("enquire", true)}>Explore Program</button>
              </div>
              <div className="intl-image-wrap"><div className="intl-image">
                {INTL_SLIDES.map((src, index) => <img key={src} className={`intl-slide${index === intlIdx ? " active" : ""}`} src={src} alt="Oxford residential program" width="800" height="500" />)}
              </div></div>
            </div>
          </section>
        ) : null}

        {!isNewPsychology ? (
          <section className="top-recruiters" id="recruiters"><div className="container"><div className="recruiters-head text-center pb-20"><h2 className="title">Top Recruiters at ASB</h2><p className="subtitle">Renowned brands hiring ASB talent for dynamic roles across diverse fields</p><div className="line mx-auto"></div></div><div className="recruiters-grid">{RECRUITERS.map(([alt, src]) => <div key={alt} className="recruiter-card"><img src={src} alt={alt} /></div>)}</div></div></section>
        ) : null}

        <section style={{ textAlign: "center", padding: "36px 20px 14px", background: "#fff" }}>
          <div style={{ width: "48px", height: "3px", background: "#006972", margin: "0 auto 18px", borderRadius: "2px" }}></div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 800, color: "#0f1f45", margin: "0 0 10px", lineHeight: 1.15 }}>
            Asian School of Business
          </h2>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "clamp(18px, 3vw, 24px)", color: "#0f1f45", margin: "0 0 14px" }}>
            {content.highlight} Program
          </p>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "clamp(16px, 2.5vw, 20px)", color: "#0f1f45", maxWidth: "520px", margin: "0 auto", lineHeight: 1.5 }}>
            {course.key.startsWith("ba-psychology") ? (
              <>
                Asian School of Business is one of the top
                <br />
                BA (Hons) Psychology Colleges in Delhi-NCR.
              </>
            ) : (
              <>Asian School of Business is one of the top {content.highlight} Colleges in Delhi-NCR.</>
            )}
          </p>
        </section>

        <section id="courses" className="courses_area" style={{ paddingTop: "20px" }}>
          <div className="container">
            <div className="row">
              <div className="col-md-6 h-100 mb-4">
                <div className="single_courses mt-30 h-100 d-flex flex-column">
                  <img src={content.cardImage} alt="courses" className="w-100" />
                  {!isPsychologyRoute && (
                    <>
                      <h4 className="title"><a href="javascript:void(0)">{titleParts[0]}{titleParts[1] ? <> <span style={{ fontSize: "19px" }}>{`(${titleParts[1]}`}</span></> : null}</a></h4>
                      <p>{content.description}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-6 h-100 mb-4">
                <div className={`single_courses mt-30 h-100 d-flex flex-column${course.key.startsWith("ba-psychology") ? " psychology-rhs" : ""}`}>
                  {content.blocks.filter((_, bIdx) => !isPsychologyRoute || bIdx === 0).map((block, bIdx) => (
                    <div key={block.title}>
                      <h3 className="course-banner">
                        {block.title}
                        {block.subtitle ? <><br /><span style={{ fontSize: "15px" }}>{block.subtitle}</span></> : null}
                      </h3>
                      {!isPsychologyRoute && (
                        <div className="additionalimg" style={{ textAlign: "center" }}>
                          <table className="banner-table" style={{ width: "100%" }}>
                            <tbody>
                              {block.items.map((item, index) => (
                                <tr key={item} style={index === block.items.length - 1 ? { border: "solid 0px #fff" } : undefined}>
                                  <td className={block.showPlusBetweenItems && index < block.items.length - 1 ? "with-plus" : undefined}>
                                    {item}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                  {isPsychologyRoute && (
                    <div style={{ marginTop: "24px", padding: "0 10px" }}>
                      <p style={{ fontSize: "16px", fontWeight: 500, lineHeight: "1.7", color: "#1e293b", textAlign: "justify", margin: 0 }}>
                        {content.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {isPsychologyRoute && (
                <div className="col-12 mt-4">
                  <div className="psychology-certifications-block">
                    <h3 className="course-banner">WITH ADDITIONAL CERTIFICATIONS</h3>
                    <div className="psychology-certifications-grid">
                      <div className="psy-cert-card">
                        <div className="psy-cert-icon">
                          <img src="/icons/AI and.png" alt="AI and Psychology" style={{ width: "50px", height: "50px", objectFit: "contain" }} />
                        </div>
                        <div className="psy-cert-name">AI and Psychology</div>
                      </div>

                      <div className="psy-cert-card">
                        <div className="psy-cert-icon">
                          <img src="/icons/Psychological.png" alt="Psychological First Aid" style={{ width: "50px", height: "50px", objectFit: "contain" }} />
                        </div>
                        <div className="psy-cert-name">Psychological First Aid</div>
                      </div>

                      <div className="psy-cert-card">
                        <div className="psy-cert-icon">
                          <img src="/icons/Consumer.png" alt="Consumer Psychology and Advertising" style={{ width: "50px", height: "50px", objectFit: "contain" }} />
                        </div>
                        <div className="psy-cert-name">Consumer Psychology and Advertising</div>
                      </div>

                      <div className="psy-cert-card">
                        <div className="psy-cert-icon">
                          <img src="/icons/Data Analytics.png" alt="Data Analytics and Research Methods" style={{ width: "50px", height: "50px", objectFit: "contain" }} />
                        </div>
                        <div className="psy-cert-name">Data Analytics and Research Methods</div>
                      </div>

                      <div className="psy-cert-card">
                        <div className="psy-cert-icon">
                          <img src="/icons/Corporate.png" alt="Corporate Communication" style={{ width: "50px", height: "50px", objectFit: "contain" }} />
                        </div>
                        <div className="psy-cert-name">Corporate Communication</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="col-md-12 active" style={{ textAlign: "center", marginBottom: "40px" }}>
                <button type="button" className="main-btn" style={{ marginTop: "30px" }} onClick={() => scrollToId("home", true)}>Enquire Now</button>
              </div>
            </div>
          </div>
        </section>

        {!isPsychologyRoute && (
          <>
            <section className="testimonials" id="testimonials"><div className="container"><div className="test-head"><span className="tag">What Our Students Say</span><h2 className="title">Student Testimonials</h2><div className="line"></div></div><div className="test-wrap"><div className="test-track">{visible.map(([name, url]) => <button key={url} type="button" className="test-video-card" onClick={() => setTestModalUrl(url)} aria-label={`Play testimonial by ${name}`}><span className="test-video-preview"><iframe src={videoEmbed(url)} title={`${name} preview`} frameBorder="0" loading="lazy" tabIndex={-1} aria-hidden="true" sandbox="allow-scripts allow-same-origin allow-presentation"></iframe></span></button>)}</div>{pageCount > 1 ? <div className="test-dots">{Array.from({ length: pageCount }).map((_, index) => <button key={index} type="button" className={`test-dot${index === page ? " is-active" : ""}`} onClick={() => setPage(index)} aria-label={`Go to testimonial page ${index + 1}`}></button>)}</div> : null}</div></div></section>
            {testModalUrl ? <div className="test-modal is-open" aria-hidden="false"><div className="test-modal-overlay" onClick={() => setTestModalUrl("")}></div><div className="test-modal-dialog" role="dialog" aria-modal="true"><button type="button" className="test-modal-close" onClick={() => setTestModalUrl("")}>x</button><div className="test-modal-media"><iframe title="Student testimonial player" src={videoEmbed(testModalUrl, true)} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" sandbox="allow-scripts allow-same-origin allow-presentation" allowFullScreen></iframe></div></div></div> : null}
          </>
        )}

        {isPsychologyRoute && (
          <section className="psychologists-section" id="psychologists">
            <div className="container">
              <div className="psychologists-head">
                <span className="tag">Faculty & Experts</span>
                <h2 className="title">Renowned Psychologists @ ASB</h2>
                <div className="line"></div>
              </div>
              <div className="psychologists-grid">
                <div className="psychologist-card">
                  <div className="psychologist-photo-wrapper">
                    <img src="/icons/psyImages/DR. ARUNA.png" alt="Dr. Aruna Broota" />
                  </div>
                  <h4 className="psychologist-name">Dr. Aruna Broota</h4>
                  <p className="psychologist-role">Globally acclaimed Clinical Psychologist</p>
                </div>

                <div className="psychologist-card">
                  <div className="psychologist-photo-wrapper">
                    <img src="/icons/psyImages/DR. SUSHMA.png" alt="Dr. Sushma Suri" />
                  </div>
                  <h4 className="psychologist-name">Dr. Sushma Suri</h4>
                  <p className="psychologist-role">Professor - Psychology<br />Jamia Millia Islamia</p>
                </div>

                <div className="psychologist-card">
                  <div className="psychologist-photo-wrapper">
                    <img src="/icons/psyImages/DR. JITENDRA.png" alt="Dr. Jitendra Nagpal" />
                  </div>
                  <h4 className="psychologist-name">Dr. Jitendra Nagpal</h4>
                  <p className="psychologist-role">Senior Consultant - Mental Health<br />Moolchand Medicity</p>
                </div>

                <div className="psychologist-card">
                  <div className="psychologist-photo-wrapper">
                    <img src="/icons/psyImages/DR. MEGHA.png" alt="Dr. Megha Pushkarna" />
                  </div>
                  <h4 className="psychologist-name">Dr. Megha Pushkarna</h4>
                  <p className="psychologist-role">Renowned<br />Counseling Psychologist</p>
                </div>

                <div className="psychologist-card">
                  <div className="psychologist-photo-wrapper">
                    <img src="/icons/psyImages/ABSY.png" alt="Absy Sam" />
                  </div>
                  <h4 className="psychologist-name">Absy Sam</h4>
                  <p className="psychologist-role">Renowned Counseling Psychologist,<br />Founder of Bright Counselling</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="chair" id="leadership"><div className="container"><div className="chair-grid"><div className="chair-media"><div className="chair-photo"><img src="/assets/images/sandeep-marwah.webp" alt="Dr. Sandeep Marwah" /></div></div><div className="chair-content"><h2 className="chair-name">Dr. Sandeep Marwah</h2><p className="chair-role">Founder & President</p><div className="chair-divider"></div><p className="chair-message">At Asian School of Business (ASB), we believe that education in business management is not merely about management itself, but also about how management principles can enhance various disciplines and functions that constitute the business world. We also believe in adapting the Western education model to suit the socio-economic conditions prevailing in this part of the world.</p>
<p className="chair-message">We are aware that, with globalisation and the dismantling of rigid regulatory frameworks across the world, the business environment has become highly dynamic. Therefore, the modern-day manager must be capable of adapting to a fast-changing business landscape.</p></div></div></div></section>

        <section className="campus" id="campus"><div className="container"><div className="campus-head"><div className="line"></div><h2 className="title">Our Campus</h2></div><div className="campus-grid">{CAMPUS.map(([label, src]) => <div key={label} className="campus-card"><div className="campus-img"><img src={src} alt={label} width="400" height="300" /></div><div className="campus-label">{label}</div></div>)}</div></div></section>

        <section className="events" id="events"><div className="container"><div className="events-head"><div className="line"></div><h2 className="title">Events at Asian School of Business</h2></div><div className="events-grid">{events.map((event, index) => <div key={`${event.label || "event"}-${index}`} className={`events-card${event.wide ? " events-card-wide" : ""}`}><div className="events-img"><img src={event.src} alt={event.label || "Event"} width="300" height="200" /></div>{event.subLabels?.length ? <div className="events-sub-labels">{event.subLabels.map((subLabel) => <div key={subLabel} className="events-sub-label">{subLabel}</div>)}</div> : <div className="events-label">{event.label}</div>}</div>)}</div></div></section>

        <section className="contact" id="contact"><div className="container contact-grid"><div><span className="tag">Get In Touch</span><h2 className="title">Start Your ASB Journey</h2><p>Admissions are open for {content.contactLabel} Batch 2026. Fill in the form and our admissions team will get in touch with you.</p></div><div className="cta"><div className="cta-box"><button type="button" className="btn btn-gold" onClick={() => scrollToId("enquire", true)}>Enquire Now</button></div></div></div></section>

        <footer className="footer"><div className="container footer-inner"><div className="footer-grid"><div><h4 style={{ color: "#fff" }}>Asian School of Business</h4><p>{content.footerDescription}</p></div><div><div className="f-title">Quick Links</div><ul className="f-links"><li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToId("home", true); }}>Home</a></li><li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollToId("courses"); }}>Programs Offered</a></li>{showInternationalSection ? <li><a href="#international" onClick={(e) => { e.preventDefault(); scrollToId("international"); }}>International Exposure</a></li> : null}<li><a href="#enquire" onClick={(e) => { e.preventDefault(); scrollToId("enquire", true); }}>Enquire Now</a></li></ul></div><div><div className="f-title">Admissions Office</div><p>Asian School of Business, Noida, Uttar Pradesh</p></div></div><div className="f-bottom"><span>(c) 2026 Asian School of Business. All rights reserved.</span>{showInternationalSection ? <span>International association with Oxford Business College</span> : null}</div></div></footer>

        {!isPsychologyRoute ? <div className="desktop-cta" style={{ opacity: showSticky ? "1" : "0", pointerEvents: showSticky ? "auto" : "none", transform: showSticky ? "translateY(0)" : "translateY(20px)" }} aria-label="Desktop actions">
          <div className="desktop-cta-strip">
            <button type="button" className="btn btn-enq" onClick={() => scrollToId("enquire", true)}>Enquire Now</button>
            {showWhatsApp && (
              <a
                href="https://api.whatsapp.com/send?phone=918376025740&text=Hi,%20I%20would%20like%20to%20know%20more%20about%20ASB%203%20year%20degree%20programs"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa"
                title="WhatsApp Us"
              >
                <Image src="/whatsapp.png" alt="WhatsApp Us" width={52} height={52} />
              </a>
            )}
            <a href="tel:+918037898031" className="btn btn-call" title="Call Us"><svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z" /></svg></a>
          </div>
        </div> : null}
        {!isPsychologyRoute ? <div className={`mobile-cta${showSticky ? " is-visible" : ""}`} aria-label="Mobile actions">
          <div className="mobile-cta-strip">
            <button type="button" className="mobile-btn-enq" onClick={() => scrollToId("enquire", true)}>Enquire Now</button>
            {showWhatsApp && (
              <a
                href="https://api.whatsapp.com/send?phone=918376025740&text=Hi,%20I%20would%20like%20to%20know%20more%20about%20ASB%203%20year%20degree%20programs"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-btn-wa"
                title="WhatsApp Us"
                aria-label="WhatsApp Us"
              >
                <Image src="/whatsapp.png" alt="WhatsApp Us" width={48} height={48} />
              </a>
            )}
            <a href="tel:+918037898031" className="mobile-btn-call" title="Call Us" aria-label="Call Us"><svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z" /></svg></a>
          </div>
        </div> : null}
      </main>
    </>
  );
}
