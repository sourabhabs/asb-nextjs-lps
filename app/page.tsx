"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LandingPageTracking from "./components/LandingPageTracking";
import LeadForm from "./components/LeadForm";
import AdmissionsTimer from "./components/AdmissionsTimer";

const PlacementBadge = () => (
  <div className="asb-placement-badge">
    <span className="asb-placement-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    </span>
    <span className="asb-placement-text">100% Placement Assistance</span>
  </div>
);

const ScholarshipBadgeBba2 = () => (
  <div className="asb-bba2-scholarship-badge">
    <div className="asb-bba2-sch-left">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" fill="#ffb703" />
        <path d="M5 12.18V17.18L12 21L19 17.18V12.18L12 16L5 12.18Z" fill="#ffb703" />
      </svg>
    </div>
    <div className="asb-bba2-sch-divider"></div>
    <div className="asb-bba2-sch-right">
      <div className="asb-bba2-sch-upto">GET UPTO</div>
      <div className="asb-bba2-sch-percent">100%</div>
      <div className="asb-bba2-sch-title">SCHOLARSHIPS*</div>
      <div className="asb-bba2-sch-sub">BASED ON YOUR 12TH SCORE</div>
      <div className="asb-bba2-sch-pill">AVAILABLE FOR ALL</div>
    </div>
  </div>
);

const HERO_COURSES = [
  { value: "BBA", label: "BBA" },
  { value: "BCA", label: "BCA" },
  { value: "BCOM", label: "B.Com" },
  { value: "BSc CS", label: "B.Sc. Computer Science" },
  // { value: "BA Psychology", label: "B.A. Psychology" },
  { value: "IPM (BBA+PGDM)", label: "IPM (BBA+PGDM)" },
];

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

const EVENTS = [
  ["Aman Gupta", "/Events/Aman-4.webp"],
  ["Vineeta Singh", "/Events/Vineeta2.webp"],
  ["Vijay Shekhar Sharma", "/Events/Vijay2.webp"],
  ["Jazzy-B", "/Events/jazzy-B.webp"],
  ["Jassie Gill", "/Events/Jassi-Gill-2024.webp"],
  ["Sunanda Sharma", "/Events/sunanda-sharma.webp"],
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

export default function Page() {
  const homeRef = useRef<HTMLElement | null>(null);
  const [intlIdx, setIntlIdx] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const [testModalUrl, setTestModalUrl] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(2);

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

  const pageCount = Math.max(1, Math.ceil(TESTIMONIALS.length / perPage));
  const visible = TESTIMONIALS.slice(page * perPage, page * perPage + perPage);

  return (
    <>
      <LandingPageTracking googleTagId="AW-18057910395" />
      <style>{`
        .alc-desktop-logo-strip{display:flex;align-items:center;gap:20px;margin-left:22px}
        .alc-desktop-logo-strip .logo-alc{height:68px;width:auto;display:block;object-fit:contain}
        .alc-desktop-logo-strip .logo-obc{height:54px;width:auto;display:block;object-fit:contain}
        .alc-mobile-header{padding-top:6px!important;padding-bottom:6px!important}
        .alc-mobile-header .navbar-brand img{height:34px;width:auto}
        .alc-mobile-header .alc-mobile-badge{width:32px;height:32px;object-fit:contain;flex-shrink:0}
        .banner-content ul li{display:block!important}
        .banner-content ul li p{background-image:url(/assets/images/arrow-rb.png);background-repeat:no-repeat;background-position:0 13px;padding-left:30px;color:#000;font-size:17px;line-height:1.5;margin:0 0 5px}
        .top-recruiters{padding:60px 0;background:#fff}
        .recruiters-head .subtitle{color:#475569;font-size:16px;margin-top:8px}
        .recruiters-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:30px}
        .recruiter-card{background:#fafafa;border:1px solid #f1f5f9;border-radius:12px;padding:25px;display:flex;align-items:center;justify-content:center;transition:all .3s ease;height:110px}
        .recruiter-card:hover{transform:translateY(-3px);box-shadow:0 10px 25px rgba(0,0,0,.05);border-color:#e2e8f0}
        .recruiter-card img{max-width:100%;max-height:50px;object-fit:contain;filter:none;transition:all .3s ease}
        .asb-hero-stats{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;align-items:stretch;margin-top:22px}
        .asb-hero-stat-box{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
        .asb-hero-stat-value{line-height:1;font-weight:800;letter-spacing:-.02em}
        .asb-hero-stat-label{line-height:1.15;font-weight:700}
        .desktop-cta{display:none}
        .mobile-cta{display:none}
        @media (min-width:992px){
          .header-hero {
            height: calc(45.42vw + 146px) !important;
          }
          .navbar-area,.navbar-area .navbar{background:#ffffff!important;box-shadow:0 1px 0 rgba(15,23,42,.08)}
          .bnrbg{background-image:none!important;background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important}
          .asb-desktop-hero-copy{max-width:660px;margin-top:18px;margin-bottom:28px;text-align:left;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.2)}
          .asb-desktop-hero-title{margin:0 0 12px;font-size:54px;line-height:1.12;font-weight:800;color:#fff;letter-spacing:-.02em}
          .asb-desktop-hero-subtitle{margin:0 0 10px;font-size:22px;line-height:1.35;color:#ffffff!important;font-weight:600;text-shadow:0 2px 10px rgba(0,0,0,.22)}
          .asb-desktop-hero-highlight{font-weight:800;color:#22f0ff!important;font-size:1.38em!important;line-height:1;text-shadow:none;display:inline-block}
          .asb-desktop-hero-points{list-style:none;padding:0;margin:8px 0 0}
          .asb-desktop-hero-points li{position:relative;padding-left:30px;margin:0 0 3px;font-size:16px;line-height:1.45;color:#fff;font-weight:400!important}
          .asb-desktop-hero-points li::before{content:"\\00BB";position:absolute;left:6px;top:-1px;font-size:24px;line-height:1;color:#fff;opacity:.95}
          .asb-hero-stats{justify-content:flex-start;width:min(100%,205px);margin-top:24px}
          .asb-hero-stat-box{min-width:0;width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:12px 16px;border:1px solid rgba(255,255,255,.6);border-radius:12px;background:linear-gradient(180deg,rgba(255,255,255,.24) 0%,rgba(255,255,255,.12) 100%);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 8px 18px rgba(15,31,69,.16);text-align:center}
          .asb-hero-stat-box::before,.asb-hero-stat-box::after{content:none}
          .asb-hero-stat-value{margin:0 0 4px!important;color:#ffffff!important;font-size:29px;line-height:1;font-weight:800;text-shadow:0 1px 6px rgba(15,31,69,.22);white-space:nowrap}
          .asb-hero-stat-label{margin:0!important;color:rgba(255,255,255,.95)!important;font-size:15px;line-height:1.2;font-weight:700;text-shadow:0 1px 4px rgba(15,31,69,.18);white-space:normal}
          #heroLeadForm{display:flex;flex-wrap:nowrap;align-items:center;gap:6px;width:100%;background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important;padding:0!important;position:static!important}
          #heroLeadForm::before{display:none!important;content:none!important}
          #heroLeadForm .single_form{margin-top:0;width:138px;flex:0 0 auto}
          #heroLeadForm .course-select-wrap{width:165px}
          #heroLeadForm .hero-form-title{width:auto;min-width:350px;margin-right:2px}
          #heroLeadForm .hero-form-title h3{margin:0;color:#fff;font-size:33px;line-height:1;font-weight:800;letter-spacing:-.01em}
          .frmD{padding:14px 8px;background-color:rgba(0,105,113,.66)}
          #heroLeadForm .single_form input,#heroLeadForm .single_form select{display:block;width:100%;box-sizing:border-box;height:40px;border-radius:4px;border:1px solid rgba(71,85,105,.55);background:#fff;color:#334155;padding:0 10px;font-size:15px;margin:0;vertical-align:middle}
          #heroLeadForm .single_form input::placeholder{font-size:14px;color:#6b7280}
          #heroLeadForm #Phone{width:100%!important;padding:0 10px!important;font-size:15px!important}
          #heroLeadForm #Phone::placeholder{font-size:14px!important}
          #heroSubmitBtn{height:40px;line-height:40px;background:#006972!important;font-weight:700;padding:0 10px;min-width:92px;border-radius:4px}
          #heroLeadForm .course-select-wrap select{margin-bottom:0!important;position:relative;top:0}
          .desktop-cta{display:flex!important;justify-content:flex-end;position:fixed;bottom:25px;left:25px;right:25px;z-index:9999;pointer-events:none;transition:opacity .3s ease,transform .3s ease}
          .desktop-cta-strip{display:flex;align-items:center;background:#fff;border-radius:80px;padding:8px 10px;box-shadow:0 15px 35px rgba(15,31,69,.2);pointer-events:auto;gap:12px}
          .btn-enq{background:#0f1f45!important;color:#fff!important;border-radius:50px!important;padding:14px 35px!important;font-weight:700;font-size:16px;text-transform:uppercase;border:none;cursor:pointer;white-space:nowrap}
          .btn-call{width:52px;height:52px;background:#0f1f45!important;color:#fff!important;border-radius:50%!important;display:flex;align-items:center;justify-content:center;text-decoration:none}
          .btn-wa{display:flex;align-items:center;justify-content:center;transition:transform 0.2s ease}
          .btn-wa:hover{transform:scale(1.05)}
        }
        @media (max-width:991px){
          .navbar-area{position:relative!important;top:auto!important;left:auto!important;background:#fff!important;box-shadow:none!important}
          .navbar-area .container-fluid{padding-left:0!important;padding-right:0!important}
          .navbar-area .row{margin-left:0!important;margin-right:0!important}
          .navbar-area .col-lg-12{padding-left:0!important;padding-right:0!important}
          .navbar-area .navbar{padding:0!important;min-height:auto!important}
          .frmD{position:relative!important;border:1px solid #e2e8f0;border-radius:22px;padding:18px 14px 16px!important;max-width:420px;margin:10px auto 0;box-shadow:0 10px 25px rgba(15,23,42,.12);overflow:visible;background:#fff!important}
          #heroLeadForm{display:block;padding-top:15px!important;margin-top:0!important}
          .hero-form-title{width:100%!important;margin:0 auto 15px!important;padding-top:0!important;display:block!important}
          .hero-form-title h3{text-align:center!important;margin:0!important;padding:0!important;width:100%!important;color:#0f1f45!important;font-size:2.35rem!important;font-weight:800!important;line-height:1.02!important}
          .alc-mobile-header{padding:10px 14px 8px!important;max-width:420px;margin:0 auto;background:#fff}
          .alc-mobile-header .navbar-brand{margin:0!important}
          .alc-mobile-header .navbar-brand img{height:46px!important}
          .alc-mobile-header .alc-mobile-badge{width:34px;height:34px}
          .bnrbg{background:#f4f4f5!important}
          .header-hero{height:auto!important;padding-top:0!important;padding-bottom:10px}
          .header-hero .container-l{width:100%!important;max-width:420px!important;margin:0 auto!important;padding:0!important}
          .header-hero-content{padding:0!important;margin:0 auto!important;text-align:center!important;max-width:420px}
          .mobH{display:none!important}
          .mobV{display:block!important;max-width:420px;margin:0 auto 10px!important;padding:0 0!important}
          .mobV img{width:100%!important;max-width:390px!important;height:auto!important;display:block!important;margin:0 auto!important}
          .asb-hero-stats{justify-content:center;width:min(100%,170px);margin:14px auto 24px}
          .asb-hero-stat-box{display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:104px;padding:16px 10px;border:1px solid rgba(180,246,242,.95);border-radius:12px;background:linear-gradient(180deg,rgba(255,255,255,.99) 0%,rgba(245,255,254,.98) 36%,rgba(228,255,252,.95) 72%,rgba(214,252,248,.92) 100%);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 0 0 1px rgba(131,234,228,.12),0 10px 20px rgba(15,31,69,.1),0 0 20px rgba(137,255,244,.16);text-align:center}
          .asb-hero-stat-value{margin:0 0 4px!important;color:#0b7b89!important;font-size:clamp(19px,5.8vw,24px);line-height:1.05;font-weight:800;white-space:nowrap;text-shadow:0 0 8px rgba(164,255,247,.14)}
          .asb-hero-stat-label{margin:0!important;color:#25434b!important;font-size:13px;line-height:1.15;font-weight:700;white-space:normal}
          #heroLeadForm .single_form{width:100%;margin-top:10px}
          #heroLeadForm .single_form input,#heroLeadForm .single_form select{height:52px;border-radius:12px;border:1px solid #d6dae2;background:#f0f2f5;padding:0 14px;font-size:16px;color:#475569}
          #heroSubmitBtn{height:48px;line-height:48px;border-radius:12px;background:#ff1b23!important;font-weight:800;letter-spacing:.02em;box-shadow:0 10px 18px rgba(255,27,35,.28)}
          .mobile-cta{display:flex;position:fixed;left:14px;right:14px;bottom:12px;z-index:9999;opacity:0;pointer-events:none;transform:translateY(18px);transition:opacity .3s ease,transform .3s ease}
          .mobile-cta.is-visible{opacity:1;pointer-events:auto;transform:translateY(0)}
          .mobile-cta-strip{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;background:#ffffff;border-radius:18px;box-shadow:0 12px 32px rgba(15,31,69,.18)}
          .mobile-btn-enq{flex:1;height:48px;border:none;border-radius:999px;background:#0f1f45;color:#fff;font-weight:800;font-size:15px;text-transform:uppercase}
          .mobile-btn-call{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;background:radial-gradient(circle at 30% 30%,#e3fff0,#7ff0ab);color:#0f1f45;box-shadow:0 8px 18px rgba(50,205,125,.24)}
          .mobile-btn-wa{width:48px;height:48px;display:flex;align-items:center;justify-content:center;text-decoration:none;transition:transform 0.2s ease}
          .mobile-btn-wa:hover{transform:scale(1.05)}
          .mobile-btn-wa img{width:100%;height:100%;object-fit:contain}
        @media (max-width:767px){.recruiters-grid{grid-template-columns:repeat(2,1fr);gap:12px}.top-recruiters{padding:40px 0}}
        }

        .admissions-timer-desktop-lhs {
          position: absolute;
          bottom: -85px;
          left: 35px !important;
          right: auto !important;
          z-index: 5;
        }
        .asb-bba2-scholarship-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: rgba(15, 31, 69, 0.95);
          border: 1.5px solid #ffb703;
          border-radius: 12px;
          box-shadow: 0 0 12px rgba(255, 183, 3, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2);
          width: fit-content;
          margin: 10px auto;
          text-align: left;
        }
        .asb-bba2-sch-left {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .asb-bba2-sch-divider {
          width: 1px;
          height: 48px;
          background: rgba(255, 183, 3, 0.4);
        }
        .asb-bba2-sch-right {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1;
        }
        .asb-bba2-sch-upto {
          color: #ffb703;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .asb-bba2-sch-percent {
          color: #ffb703;
          font-size: 22px;
          font-weight: 900;
          line-height: 0.95;
          margin: 2px 0;
        }
        .asb-bba2-sch-title {
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .asb-bba2-sch-sub {
          color: #ffffff;
          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.02em;
          margin-top: 1px;
        }
        .asb-bba2-sch-pill {
          background: #ffb703;
          color: #000000;
          font-size: 7px;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 99px;
          margin-top: 3px;
          letter-spacing: 0.03em;
        }
        @media (min-width: 992px) {
          .asb-bba2-scholarship-badge {
            margin: 0 0 8px 0;
            padding: 16px 24px;
            gap: 20px;
            border-radius: 16px;
            border-width: 2px;
          }
          .asb-bba2-sch-left svg {
            width: 48px !important;
            height: 48px !important;
          }
          .asb-bba2-sch-divider {
            height: 68px;
            width: 1.5px;
          }
          .asb-bba2-sch-upto {
            font-size: 12px;
          }
          .asb-bba2-sch-percent {
            font-size: 36px;
          }
          .asb-bba2-sch-title {
            font-size: 17px;
          }
          .asb-bba2-sch-sub {
            font-size: 9.5px;
          }
          .asb-bba2-sch-pill {
            font-size: 9.5px;
            padding: 3px 10px;
            margin-top: 5px;
          }
        }
        .asb-placement-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 14px;
          background: rgba(15, 31, 69, 0.92);
          border: 1.5px solid rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          color: #ffffff;
          font-weight: 800;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          width: fit-content;
          margin: 10px auto;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
        .asb-placement-icon svg {
          stroke: #24f6f2;
          width: 16px;
          height: 16px;
          display: block;
        }
        @media (min-width: 992px) {
          .asb-placement-badge {
            margin: 0 0 8px 0;
            padding: 12px 22px;
            font-size: 16px;
            justify-content: flex-start;
            border-radius: 14px;
            border-width: 2px;
            gap: 10px;
          }
          .asb-placement-icon svg {
            width: 20px !important;
            height: 20px !important;
          }
        }
        .admissions-timer-title {
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          margin: 0 0 8px 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        @media (min-width: 992px) {
          .admissions-timer-title {
            font-size: 18px;
            margin-bottom: 12px;
          }
        }
        .admissions-timer-digits-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        @media (min-width: 992px) {
          .admissions-timer-digits-row {
            gap: 8px;
          }
        }
        .admissions-timer-item-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        @media (min-width: 992px) {
          .admissions-timer-item-group {
            gap: 8px;
          }
        }
        .admissions-timer-card-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }
        .admissions-timer-card {
          background: #ffffff;
          border-radius: 8px;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        @media (min-width: 992px) {
          .admissions-timer-card {
            width: 58px;
            height: 58px;
            border-radius: 12px;
          }
        }
        .admissions-timer-digit {
          color: #990000;
          font-size: 18px;
          font-weight: 800;
          font-family: 'Inter', sans-serif;
          line-height: 1;
        }
        @media (min-width: 992px) {
          .admissions-timer-digit {
            font-size: 26px;
          }
        }
        .admissions-timer-colon {
          color: #ffffff;
          font-size: 18px;
          font-weight: 800;
          line-height: 1;
          margin-top: -12px;
        }
        @media (min-width: 992px) {
          .admissions-timer-colon {
            font-size: 26px;
            margin-top: -16px;
          }
        }
        .admissions-timer-label {
          color: rgba(255, 255, 255, 0.85);
          font-size: 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        @media (min-width: 992px) {
          .admissions-timer-label {
            font-size: 11px;
          }
        }

        /* Scholarship Waiver Banner */
        .asb-scholarship-waiver-banner {
          background-color: #f7f6f2;
          padding: 50px 20px;
          text-align: center;
        }
        .waiver-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(24px, 4vw, 42px);
          font-weight: 800;
          color: #0f1f45;
          line-height: 1.25;
          margin: 0 auto 12px;
          max-width: 900px;
        }
        .waiver-highlight {
          color: #008a96;
        }
        .waiver-sub {
          font-size: clamp(11px, 2.5vw, 15px);
          font-weight: 700;
          color: #475569;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Scholarship Criteria & Slabs */
        .asb-scholarship-slabs-section {
          background-color: #ffffff;
          padding: 60px 20px;
        }
        .criteria-header {
          margin-bottom: 50px;
        }
        .criteria-tag {
          font-size: 13px;
          font-weight: 800;
          color: #008a96;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 8px;
        }
        .criteria-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(26px, 3.5vw, 36px);
          font-weight: 800;
          color: #0f1f45;
          margin: 0 auto 16px;
          max-width: 800px;
          line-height: 1.2;
        }
        .criteria-desc {
          font-size: clamp(14px, 2vw, 17px);
          color: #475569;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .slabs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          width: 100%;
          margin: 0 auto;
          align-items: flex-end;
        }
        @media (max-width: 767px) {
          .slabs-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .slab-card {
            display: grid !important;
            grid-template-columns: 1fr auto !important;
            grid-template-rows: auto auto auto !important;
            grid-template-areas: 
              "range percentage"
              "bar bar"
              "label label" !important;
            gap: 8px !important;
            align-items: center !important;
            text-align: left !important;
            background: #f8fafc !important;
            padding: 16px !important;
            border-radius: 12px !important;
            border: 1px solid #cbd5e1 !important;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04) !important;
            width: 100% !important;
          }
          .slab-percentage {
            grid-area: percentage !important;
            font-size: 20px !important;
            margin: 0 !important;
            color: #008a96 !important;
            font-weight: 800 !important;
          }
          .slab-bar-wrapper {
            grid-area: bar !important;
            width: 100% !important;
            max-width: none !important;
            height: 12px !important;
            margin: 4px 0 6px 0 !important;
            background-color: #e2e8f0 !important;
            border-radius: 999px !important;
            overflow: hidden !important;
            display: block !important;
          }
          .slab-bar {
            height: 100% !important;
            border-radius: 999px !important;
          }
          .bar-100 { width: 100% !important; height: 100% !important; }
          .bar-75 { width: 75% !important; height: 100% !important; }
          .bar-50 { width: 50% !important; height: 100% !important; }
          .bar-25 { width: 25% !important; height: 100% !important; }
          
          .slab-divider {
            display: none !important;
          }
          .slab-range {
            grid-area: range !important;
            font-size: 16px !important;
            font-weight: 800 !important;
            color: #0f1f45 !important;
            margin: 0 !important;
          }
          .slab-label {
            grid-area: label !important;
            font-size: 13px !important;
            color: #64748b !important;
            font-weight: 500 !important;
            margin: 0 !important;
          }
        }
        .slab-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .slab-percentage {
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 900;
          color: #0f1f45;
          margin-bottom: 8px;
        }
        .slab-bar-wrapper {
          width: 100%;
          max-width: 80px;
          height: 160px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          margin-bottom: 16px;
        }
        .slab-bar {
          width: 100%;
          border-radius: 6px 6px 0 0;
          background: linear-gradient(180deg, #0aaeaf 0%, #006972 100%);
          box-shadow: 0 4px 15px rgba(0, 105, 114, 0.2);
        }
        .bar-100 { height: 100%; }
        .bar-75 { height: 75%; }
        .bar-50 { height: 50%; }
        .bar-25 { height: 25%; }

        .slab-divider {
          width: 100%;
          height: 2px;
          background-color: #006972;
          margin-bottom: 12px;
        }
        .slab-range {
          font-size: clamp(15px, 2.5vw, 19px);
          font-weight: 800;
          color: #0f1f45;
          margin-bottom: 4px;
        }
        .slab-label {
          font-size: clamp(12px, 2vw, 14px);
          color: #64748b;
          font-weight: 500;
        }

        .criteria-note-box {
          max-width: 1000px;
          margin: 40px auto 0;
          background-color: #fcfbfa;
          border-left: 4px solid #008a96;
          padding: 16px 20px;
          border-radius: 0 8px 8px 0;
          text-align: left;
        }
        .criteria-note-box p {
          font-size: 13.5px;
          color: #475569;
          margin: 0;
          line-height: 1.5;
        }

        /* Scholarship Check Section */
        .asb-scholarship-check-section {
          background: linear-gradient(135deg, #091e42 0%, #051024 100%);
          padding: 60px 20px;
          color: #ffffff;
        }
        .check-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 40px;
          width: 100%;
          margin: 0 auto;
          align-items: center;
        }
        @media (max-width: 991px) {
          .check-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }
        .check-content-col {
          text-align: left;
        }
        .check-brand-accent {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .accent-line {
          width: 24px;
          height: 2px;
          background-color: #008a96;
          display: inline-block;
        }
        .accent-text {
          font-size: 12px;
          font-weight: 800;
          color: #008a96;
          letter-spacing: 0.1em;
        }
        .check-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 16px;
        }
        .check-text {
          font-size: 17px;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          margin-bottom: 8px;
        }
        .check-text-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.7);
          line-height: 1.5;
          margin: 0;
        }
        .check-form-card {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
          color: #000000;
        }
        .check-form-card .frmD {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          position: relative !important;
        }
        .check-form-card .hero-form-title {
          margin-bottom: 20px !important;
          text-align: left !important;
        }
        .check-form-card .hero-form-title h3 {
          font-size: 24px !important;
          color: #0f1f45 !important;
          font-weight: 800 !important;
          text-align: left !important;
        }
        .check-form-card #heroLeadForm,
        .check-form-card #scholarshipLeadForm {
          display: flex !important;
          flex-direction: column !important;
          flex-wrap: wrap !important;
          gap: 12px !important;
          width: 100% !important;
          padding-top: 0 !important;
          background: transparent !important;
        }
        .check-form-card #heroLeadForm .single_form,
        .check-form-card #scholarshipLeadForm .single_form {
          width: 100% !important;
          flex: 0 0 auto !important;
          margin: 0 !important;
        }
        .check-form-card #heroLeadForm .course-select-wrap,
        .check-form-card #scholarshipLeadForm .course-select-wrap {
          width: 100% !important;
        }
        .check-form-card #heroLeadForm .hero-form-title,
        .check-form-card #scholarshipLeadForm .hero-form-title {
          width: 100% !important;
          margin: 0 0 15px 0 !important;
        }
        .check-form-card .lead-form-consent-row {
          display: block !important;
          width: 100% !important;
          margin-top: 10px !important;
        }
        .check-form-card .lead-form-consent-note {
          display: flex !important;
          color: #475569 !important;
          font-size: 11px !important;
          margin-top: 6px !important;
          text-align: left !important;
        }
        .check-form-card #heroLeadForm .single_form input,
        .check-form-card #heroLeadForm .single_form select,
        .check-form-card #scholarshipLeadForm .single_form input,
        .check-form-card #scholarshipLeadForm .single_form select {
          height: 46px !important;
          border-radius: 8px !important;
          border: 1px solid #cbd5e1 !important;
          background: #ffffff !important;
          padding: 0 12px !important;
          font-size: 14.5px !important;
          color: #0f172a !important;
          width: 100% !important;
          box-sizing: border-box !important;
          display: block !important;
        }
        .check-form-card #heroLeadForm .single_form input:focus,
        .check-form-card #heroLeadForm .single_form select:focus,
        .check-form-card #scholarshipLeadForm .single_form input:focus,
        .check-form-card #scholarshipLeadForm .single_form select:focus {
          border-color: #006972 !important;
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(0, 105, 114, 0.15) !important;
        }
        .check-form-card #heroLeadForm .single_form label,
        .check-form-card #scholarshipLeadForm .single_form label {
          color: #334155 !important;
          font-weight: 700 !important;
          margin-bottom: 6px !important;
          display: block !important;
          text-align: left !important;
        }
        .check-form-card #heroSubmitBtn {
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
        }
        .check-form-card #heroSubmitBtn:hover {
          background: #005259 !important;
          box-shadow: 0 8px 20px rgba(0, 105, 114, 0.35) !important;
        }
        .asb-scholarship-card {
          margin-top: 24px;
          padding: 16px 20px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
          border: 1px solid rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: 480px;
          text-align: left;
        }
        .asb-scholarship-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 12px 40px 0 rgba(0, 105, 113, 0.3);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.08) 100%);
        }
        .asb-scholarship-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 183, 3, 0.15);
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
          font-size: 19px;
        }
        .asb-scholarship-card.mobile-style .asb-scholarship-desc {
          color: #475569 !important;
          font-size: 13px;
        }
        .asb-scholarship-card.mobile-style .asb-scholarship-icon-box {
          background: rgba(15, 31, 69, 0.05);
          border: 1px solid rgba(15, 31, 69, 0.08);
        }
      `}</style>

      <header className="header-area">
        <div className="navbar-area">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <nav className="navbar navbar-expand-lg" style={{ display: "flex", justifyContent: "space-between", width: "100%", minHeight: "78px" }}>
                  <div className="d-none d-lg-flex align-items-center">
                    <div className="alc-desktop-logo-strip">
                      <Image src="/img/logo.jpg" alt="Asian School of Business" className="logo-alc" width={200} height={68} priority />
                      <Image style={{ display: "none" }} src="/img/OBC-Logo.png" alt="Oxford Business College" className="logo-obc" width={160} height={54} priority />
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
          id="home"
          ref={homeRef}
          className="header-hero bg_cover d-flex align-items-center bnrbg"
          style={{ position: "relative", overflow: "hidden", backgroundColor: "#f4f4f5" }}
        >
          <div
            className="mobH"
            aria-hidden="true"
            style={{ position: "absolute", top: "78px", left: 0, right: 0, bottom: "68px", zIndex: 0, pointerEvents: "none" }}
          >
            <Image
              src="/banner-main.jpg"
              alt=""
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="container-l banner-content" style={{ width: "auto" }}>
            <div className="row" style={{ width: "100%", marginRight: 0, marginLeft: 0 }}>
              <div className="col-lg-12">
                <div
                  className="header-hero-content"
                  style={{ paddingLeft: "35px", paddingRight: "30px", position: "relative", zIndex: 1 }}
                >
                  <div className="mobH" style={{ height: "460px" }} />
                  <div className="mobH admissions-timer-desktop-lhs">
                    <ScholarshipBadgeBba2 />
                    <PlacementBadge />
                    <AdmissionsTimer />
                  </div>
                  <div className="mobV" style={{ textAlign: "center", marginBottom: "10px", marginTop: "-4px" }}>
                    <Image
                      src="/main-mobile.jpg"
                      alt="ASB Admissions 2026"
                      width={390}
                      height={520}
                      priority
                      fetchPriority="high"
                      sizes="(max-width: 420px) 390px, 100vw"
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                    <AdmissionsTimer />
                  </div>
                </div>
              </div>
            </div>
            <LeadForm
              id="enquire"
              title="Admissions Open 2026"
              courses={HERO_COURSES}
              queryLabel="ASB UG Admissions 2026 Landing"
              thankYouPath="/thank-you.php"
              submitLabel="ENQUIRE NOW"
              trackMetaLead
              trackMetaCompleteRegistration
            />
          </div>
        </section>
      </header>

      {/* Component 1: Waiver Banner */}
      <section className="asb-scholarship-waiver-banner">
        <div className="container text-center">
          <h2 className="waiver-title">
            Your 12th board marks <br />
            could waive <span className="waiver-highlight">upto 100%</span> of your tuition fee.
          </h2>
          <div className="waiver-sub">
            BATCH 2026–2029 &bull; BBA &bull; BCA &bull; B.COM &bull; B.Sc. (CS)
          </div>
        </div>
      </section>

      {/* Component 2: Slabs & Criteria */}
      <section className="asb-scholarship-slabs-section">
        <div className="container">
          <div className="criteria-header text-center">
            <span className="criteria-tag">Scholarship Criteria</span>
            <h3 className="criteria-title">Four slabs. One simple rule: your marks decide.</h3>
            <p className="criteria-desc">
              Scholarship on tuition fee is awarded based on marks obtained in the Class 12th Board (Intermediate) Examination.
            </p>
          </div>

          <div className="slabs-grid">
            {/* Slab 1 */}
            <div className="slab-card">
              <span className="slab-percentage">100%</span>
              <div className="slab-bar-wrapper">
                <div className="slab-bar bar-100"></div>
              </div>
              <div className="slab-divider"></div>
              <span className="slab-range">95% – 100%</span>
              <span className="slab-label">100% Scholarship</span>
            </div>

            {/* Slab 2 */}
            <div className="slab-card">
              <span className="slab-percentage">75%</span>
              <div className="slab-bar-wrapper">
                <div className="slab-bar bar-75"></div>
              </div>
              <div className="slab-divider"></div>
              <span className="slab-range">90% – 94.9%</span>
              <span className="slab-label">75% Scholarship</span>
            </div>

            {/* Slab 3 */}
            <div className="slab-card">
              <span className="slab-percentage">50%</span>
              <div className="slab-bar-wrapper">
                <div className="slab-bar bar-50"></div>
              </div>
              <div className="slab-divider"></div>
              <span className="slab-range">85% – 89.9%</span>
              <span className="slab-label">50% Scholarship</span>
            </div>

            {/* Slab 4 */}
            <div className="slab-card">
              <span className="slab-percentage">25%</span>
              <div className="slab-bar-wrapper">
                <div className="slab-bar bar-25"></div>
              </div>
              <div className="slab-divider"></div>
              <span className="slab-range">80% – 84.9%</span>
              <span className="slab-label">25% Scholarship</span>
            </div>
          </div>

          <div className="criteria-note-box">
            <p>
              <strong>Note:</strong> Scholarship will be awarded subject to verification of academic records and fulfilment of the institution's admission requirements. For the international programme, the scholarship will be given in 6 parts.
            </p>
          </div>
        </div>
      </section>

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

      <section className="top-recruiters" id="recruiters"><div className="container"><div className="recruiters-head text-center pb-20"><h2 className="title">Top Recruiters at ASB</h2><p className="subtitle">Renowned brands hiring ASB talent for dynamic roles across diverse fields</p><div className="line mx-auto"></div></div><div className="recruiters-grid">{RECRUITERS.map(([alt, src]) => <div key={alt} className="recruiter-card"><img src={src} alt={alt} /></div>)}</div></div></section>

      <section id="courses" className="courses_area pt-105">
        <div className="container">
          <div className="row justify-content-center"><div className="col-lg-12 col-md-12"><div className="section_title text-center pb-25"><span className="line"></span><h3 className="title" style={{ lineHeight: "35px" }}>Asian School of Business<br /><span style={{ fontSize: "25px" }}>Programme Offered</span></h3><h3 className="title" style={{ fontSize: "20px", lineHeight: "25px" }}>Asian School of Business is one of the top <span style={{ borderBottom: "solid 2px #ff0000" }}>BBA/BCA/B.Com/B.Sc.(CS)</span> Colleges in Delhi-NCR.</h3></div></div></div>
          <div className="row">
            <div className="col-md-6 h-100 mb-4">
              <div className="single_courses mt-30 h-100 d-flex flex-column">
                <img src="/Course/BBA.webp" alt="courses" className="w-100" loading="lazy" decoding="async" />
                <h4 className="title"><a href="javascript:void(0)">BBA <span style={{ fontSize: "19px" }}>(General/International)</span></a></h4>
                <p>ASB Noida is ranked among the best BBA colleges in Noida. Their specialised programs, BBA (General) and BBA (International), are affiliated with CCS university and offer students with the essentials of business management &amp; corporate functioning. Over three years, students receive a well-structured education that equips them with all of the skills and expertise to succeed in a highly complex and competitive business environment.</p>
                <h3 className="course-banner" style={{ textAlign: "center", fontWeight: "normal", lineHeight: "23px", fontSize: "23px", padding: "10px", backgroundColor: "#0aaeaf", color: "#fff", marginTop: "20px", marginBottom: "20px" }}>3 Year BBA Degree Program<br /><span style={{ fontSize: "15px" }}>with major specializations in (anyone)</span></h3>
                <div className="additionalimg" style={{ textAlign: "center" }}>
                  <table style={{ width: "100%" }}><tbody><tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>Marketing / Finance / Human Resource Management / Business Analytics / International Business / <br /> Supply Chain Management</td></tr></tbody></table>
                </div>
                <h3 className="course-banner" style={{ textAlign: "center", fontWeight: "normal", lineHeight: "23px", fontSize: "23px", padding: "10px", backgroundColor: "#0aaeaf", color: "#fff", marginTop: "20px", marginBottom: "20px" }}>with specialised certification in (anyone):<span style={{ fontSize: "15px" }}></span></h3>
                <div className="additionalimg" style={{ textAlign: "center" }}>
                  <table style={{ width: "100%" }}><tbody><tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>Artificial Intelligence / Entrepreneurship &amp; New Venture Creation / Family Business Management / Real Estate Management</td></tr></tbody></table>
                </div>
                <h3 className="course-banner" style={{ textAlign: "center", fontWeight: "normal", lineHeight: "23px", fontSize: "23px", padding: "10px", backgroundColor: "#0aaeaf", color: "#fff", marginTop: "20px", marginBottom: "20px" }}>with Additional Diplomas and Certifications in:</h3>
                <div className="additionalimg" style={{ textAlign: "center" }}>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400 }}>*International Certification in Personal &amp; Professional Development from O.B.C., Oxford/London, UK<div className="course-plus"><img src="https://alc.edu.in/images/plus.jpg" alt="Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400 }}>Social Media Marketing &amp; Business Analytic from NIIT<div className="course-plus"><img src="https://alc.edu.in/images/plus.jpg" alt="ALC Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400 }}>Media Applications from AAFT<div className="course-plus"><img src="https://alc.edu.in/images/plus.jpg" alt="ALC Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr style={{ border: "solid 0px #fff" }}><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400 }}>Corporate Communications from CSD</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-6 h-100 mb-4">
              <div className="single_courses mt-30 h-100 d-flex flex-column">
                <img src="/Course/BCOM.webp" alt="courses" className="w-100" loading="lazy" decoding="async" />
                <h4 className="title"><a href="javascript:void(0)">BCA <span style={{ fontSize: "19px" }}>(General/International)</span></a></h4>
                <p>Bachelor of Computer Applications (BCA) at Asian School of Business is a three years full-time degree course affiliated with CCS University. This course is designed and structured with the intent to provide students a dynamically stimulating environment, where the students can get transformed into highly skilled IT specialists. The curriculum at the best BCA college in Delhi NCR has been designed to give the students an in-depth knowledge of various subjects.</p>
                <h3 className="course-banner" style={{ textAlign: "center", fontWeight: "normal", lineHeight: "23px", fontSize: "23px", padding: "10px", backgroundColor: "#0aaeaf", color: "#fff", marginTop: "20px", marginBottom: "20px" }}>3 Year BCA Degree Program<br /><span style={{ fontSize: "15px" }}>with major specializations in (anyone):</span></h3>
                <div className="additionalimg" style={{ textAlign: "center" }}>
                  <table style={{ width: "100%" }}><tbody><tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>Artificial Intelligence &amp; Machine Learning (Using Python) / Full Stack Development / Data Science</td></tr></tbody></table>
                </div>
                <h3 className="course-banner" style={{ textAlign: "center", fontWeight: "normal", lineHeight: "23px", fontSize: "23px", padding: "10px", backgroundColor: "#0aaeaf", color: "#fff", marginTop: "20px", marginBottom: "20px" }}>with specialised certification in (anyone):<span style={{ fontSize: "15px" }}></span></h3>
                <div className="additionalimg" style={{ textAlign: "center" }}>
                  <table style={{ width: "100%" }}><tbody><tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>Cloud Computing &amp; DevOps / Cyber Security / <br /> Project Management</td></tr></tbody></table>
                </div>
                <h3 className="course-banner" style={{ textAlign: "center", fontWeight: "normal", lineHeight: "23px", fontSize: "23px", padding: "10px", backgroundColor: "#0aaeaf", color: "#fff", marginTop: "20px", marginBottom: "20px" }}>with Additional Diplomas and Certifications in:</h3>
                <div className="additionalimg" style={{ textAlign: "center" }}>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>*International Certification in Personal &amp; Professional Development from O.B.C., Oxford/London, UK<div className="course-plus"><img src="https://alc.edu.in/images/plus.jpg" alt="Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>Web Analytics from NIIT<div className="course-plus"><img src="https://alc.edu.in/images/plus.jpg" alt="ALC Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>New Media Applications from AAFT<div className="course-plus"><img src="https://alc.edu.in/images/plus.jpg" alt="ALC Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr style={{ border: "solid 0px #fff" }}><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400 }}>Corporate Communications from CSD</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-6 h-100 mb-4">
              <div className="single_courses mt-30 h-100 d-flex flex-column">
                <img src="/Course/BSC.webp" alt="courses" className="w-100" loading="lazy" decoding="async" />
                <h4 className="title"><a href="javascript:void(0)">B.Com. <span style={{ fontSize: "19px" }}>(General/International)</span></a></h4>
                <p>Bachelor of Commerce (B.Com) at Asian School of Business is a three-year full-time degree program affiliated to CCSU. The objective of this program at ASB is to provide the young students with a basic understanding of finance and commerce-related concepts. ASB Noida is one of the best B.Com colleges in NCR and is capable of producing excellent professionals.</p>
                <h3 className="course-banner" style={{ textAlign: "center", fontWeight: "normal", lineHeight: "23px", fontSize: "23px", padding: "10px", backgroundColor: "#0aaeaf", color: "#fff", marginTop: "20px", marginBottom: "20px" }}>3 Year B.Com. Degree Program<br /><span style={{ fontSize: "15px" }}>with specialised certification in (anyone):</span></h3>
                <div className="additionalimg" style={{ textAlign: "center" }}>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>Financial Markets<div className="course-plus"><img src="https://asb.edu.in/option.jpg" alt="Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>Banking and Insurance<div className="course-plus"><img src="https://asb.edu.in/option.jpg" alt="ALC Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>Artificial Intelligence (AI)<div className="course-plus"><img src="https://asb.edu.in/option.jpg" alt="ALC Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr style={{ border: "solid 0px #fff" }}><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>Entrepreneurship &amp; New Venture Creation</td></tr>
                    </tbody>
                  </table>
                </div>
                <h3 className="course-banner" style={{ textAlign: "center", fontWeight: "normal", lineHeight: "23px", fontSize: "23px", padding: "10px", backgroundColor: "#0aaeaf", color: "#fff", marginTop: "20px", marginBottom: "20px" }}>with Additional Diplomas and Certifications in:</h3>
                <div className="additionalimg" style={{ textAlign: "center" }}>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>*International Certification in Personal &amp; Professional Development from O.B.C., Oxford/London, UK<div className="course-plus"><img src="https://alc.edu.in/images/plus.jpg" alt="Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>New Media Applications from AAFT<div className="course-plus"><img src="https://alc.edu.in/images/plus.jpg" alt="ALC Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr style={{ border: "solid 0px #fff" }}><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>Corporate Communications from CSD</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-6 h-100 mb-4">
              <div className="single_courses mt-30 h-100 d-flex flex-column">
                <img src="/Course/BCA.webp" alt="courses" className="w-100" loading="lazy" decoding="async" />
                <h4 className="title"><a href="javascript:void(0)">B.Sc.(CS) <span style={{ fontSize: "19px" }}>(General/International)</span></a></h4>
                <p>Bachelor Of Science (B.Sc.) in Computer Science at Asian School of Business is a three years full time degree course affiliated to CCSU. This course is designed and structured with the intent of providing our students with a dynamically stimulating environment, where they can be transformed into highly skilled IT specialists.</p>
                <h3 className="course-banner" style={{ textAlign: "center", fontWeight: "normal", lineHeight: "23px", fontSize: "23px", padding: "10px", backgroundColor: "#0aaeaf", color: "#fff", marginTop: "20px", marginBottom: "20px" }}>3 Year B.Sc.(CS) Degree Program<br /><span style={{ fontSize: "15px" }}>with specialised certification in (anyone):</span></h3>
                <div className="additionalimg" style={{ textAlign: "center" }}>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>AI &amp; Machine Learning<div className="course-plus"><img src="https://asb.edu.in/option.jpg" alt="Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>Back-End Engineering<div className="course-plus"><img src="https://asb.edu.in/option.jpg" alt="ALC Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>IOT (Internet of Things)<div className="course-plus"><img src="https://asb.edu.in/option.jpg" alt="ALC Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr style={{ border: "solid 0px #fff" }}><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>Data Science</td></tr>
                    </tbody>
                  </table>
                </div>
                <h3 className="course-banner" style={{ textAlign: "center", fontWeight: "normal", lineHeight: "23px", fontSize: "23px", padding: "10px", backgroundColor: "#0aaeaf", color: "#fff", marginTop: "20px", marginBottom: "20px" }}>with Additional Diplomas and Certifications in:</h3>
                <div className="additionalimg" style={{ textAlign: "center" }}>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>*International Certification in Personal &amp; Professional Development from O.B.C., Oxford/London, UK<div className="course-plus"><img src="https://alc.edu.in/images/plus.jpg" alt="Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>New Media Applications from AAFT<div className="course-plus"><img src="https://alc.edu.in/images/plus.jpg" alt="ALC Course Highlights" style={{ padding: "5px" }} /></div></td></tr>
                      <tr style={{ border: "solid 0px #fff" }}><td style={{ lineHeight: "24px", position: "relative", display: "block", fontWeight: 400, fontSize: "18px" }}>Corporate Communications from CSD</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-12 active" style={{ textAlign: "center", marginBottom: "40px" }}><button type="button" className="main-btn" style={{ marginTop: "30px" }} onClick={() => scrollToId("home", true)}>Enquire Now</button></div>
          </div>
        </div>
      </section>

      <section className="testimonials" id="testimonials"><div className="container"><div className="test-head"><span className="tag">What Our Students Say</span><h2 className="title">Student Testimonials</h2><div className="line"></div></div><div className="test-wrap"><div className="test-track">{visible.map(([name, url]) => <button key={url} type="button" className="test-video-card" onClick={() => setTestModalUrl(url)} aria-label={`Play testimonial by ${name}`}><span className="test-video-preview"><iframe src={videoEmbed(url)} title={`${name} preview`} frameBorder="0" loading="lazy" tabIndex={-1} aria-hidden="true" sandbox="allow-scripts allow-same-origin allow-presentation"></iframe></span></button>)}</div>{pageCount > 1 ? <div className="test-dots">{Array.from({ length: pageCount }).map((_, index) => <button key={index} type="button" className={`test-dot${index === page ? " is-active" : ""}`} onClick={() => setPage(index)} aria-label={`Go to testimonial page ${index + 1}`}></button>)}</div> : null}</div></div></section>

      {testModalUrl ? <div className="test-modal is-open" aria-hidden="false"><div className="test-modal-overlay" onClick={() => setTestModalUrl("")}></div><div className="test-modal-dialog" role="dialog" aria-modal="true"><button type="button" className="test-modal-close" onClick={() => setTestModalUrl("")}>x</button><div className="test-modal-media"><iframe title="Student testimonial player" src={videoEmbed(testModalUrl, true)} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" sandbox="allow-scripts allow-same-origin allow-presentation" allowFullScreen></iframe></div></div></div> : null}

      <section className="chair" id="leadership"><div className="container"><div className="chair-grid"><div className="chair-media"><div className="chair-photo"><img src="/assets/images/sandeep-marwah.webp" alt="Dr. Sandeep Marwah" /></div></div><div className="chair-content"><h2 className="chair-name">Dr. Sandeep Marwah</h2><p className="chair-role">Founder & President</p><div className="chair-divider"></div><p className="chair-message">At Asian School of Business (ASB), we believe that education in business management is not merely about management itself, but also about how management principles can enhance various disciplines and functions that constitute the business world. We also believe in adapting the Western education model to suit the socio-economic conditions prevailing in this part of the world.</p><p className="chair-message" style={{ marginTop: "14px" }}>We are aware that, with globalisation and the dismantling of rigid regulatory frameworks across the world, the business environment has become highly dynamic. Therefore, the modern-day manager must be capable of adapting to a fast-changing business landscape.</p></div></div></div></section>

      <section className="campus" id="campus"><div className="container"><div className="campus-head"><div className="line"></div><h2 className="title">Our Campus</h2></div><div className="campus-grid">{CAMPUS.map(([label, src]) => <div key={label} className="campus-card"><div className="campus-img"><img src={src} alt={label} width="400" height="300" /></div><div className="campus-label">{label}</div></div>)}</div></div></section>

      <section className="events" id="events"><div className="container"><div className="events-head"><div className="line"></div><h2 className="title">Events at Asian School of Business</h2></div><div className="events-grid">{EVENTS.map(([label, src]) => <div key={label} className="events-card"><div className="events-img"><img src={src} alt={label} width="300" height="200" /></div><div className="events-label">{label}</div></div>)}</div></div></section>

      <section className="asb-scholarship-check-section">
        <div className="container">
          <div className="check-grid">
            <div className="check-content-col">
              <div className="check-brand-accent">
                <span className="accent-line"></span>
                <span className="accent-text">START YOUR ASB JOURNEY</span>
              </div>
              <h2 className="check-title">Find out how much scholarship you qualify for</h2>
              <p className="check-text">
                Admissions are open for BBA / BCA / B.Com / B.Sc. (CS), Batch 2026-2029.
              </p>
              <p className="check-text-sub">
                Share your Class 12th marks and our admissions team will confirm your scholarship slab and fee plan within one working day.
              </p>
            </div>
            <div className="check-form-col">
              <div className="check-form-card">
                <LeadForm
                  id="scholarship-check-enquire"
                  title="Admissions Open 2026"
                  courses={HERO_COURSES}
                  queryLabel="ASB UG Admissions 2026 Landing - Scholarship Check"
                  thankYouPath="/thank-you.php"
                  submitLabel="Enquire Now"
                  consentNote="I have read and agree to the Privacy Policy and the collection of my personal information."
                  isScholarshipCheck={true}
                  show12thMarks={false}
                  trackMetaLead
                  trackMetaCompleteRegistration
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer"><div className="container footer-inner"><div className="footer-grid"><div><h4 style={{ color: "#fff" }}>Asian School of Business</h4><p>Admissions open for 2026 intake. Build your future in business, commerce and technology with a globally aware academic ecosystem.</p></div><div><div className="f-title">Quick Links</div><ul className="f-links"><li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToId("home", true); }}>Home</a></li><li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollToId("courses"); }}>Programs Offered</a></li><li><a href="#international" onClick={(e) => { e.preventDefault(); scrollToId("international"); }}>International Exposure</a></li><li><a href="#enquire" onClick={(e) => { e.preventDefault(); scrollToId("enquire", true); }}>Enquire Now</a></li></ul></div><div><div className="f-title">Admissions Office</div><p>Asian School of Business, Noida, Uttar Pradesh</p></div></div><div className="f-bottom"><span>(c) 2026 Asian School of Business. All rights reserved.</span><span>International association with Oxford Business College</span></div></div></footer>

       <div className="desktop-cta" style={{ opacity: showSticky ? "1" : "0", pointerEvents: showSticky ? "auto" : "none", transform: showSticky ? "translateY(0)" : "translateY(20px)" }} aria-label="Desktop actions">
         <div className="desktop-cta-strip">
           <button type="button" className="btn btn-enq" onClick={() => scrollToId("enquire", true)}>Enquire Now</button>
           <a
             href="https://api.whatsapp.com/send?phone=918376025740&text=Hi,%20I%20would%20like%20to%20know%20more%20about%20ASB%203%20year%20degree%20programs"
             target="_blank"
             rel="noopener noreferrer"
             className="btn-wa"
             title="WhatsApp Us"
           >
             <Image src="/whatsapp.png" alt="WhatsApp Us" width={52} height={52} />
           </a>
           <a href="tel:+918037898031" className="btn btn-call" title="Call Us"><svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z" /></svg></a>
         </div>
       </div>
       <div className={`mobile-cta${showSticky ? " is-visible" : ""}`} aria-label="Mobile actions">
         <div className="mobile-cta-strip">
           <button type="button" className="mobile-btn-enq" onClick={() => scrollToId("enquire", true)}>Enquire Now</button>
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
           <a href="tel:+918037898031" className="mobile-btn-call" title="Call Us" aria-label="Call Us"><svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z" /></svg></a>
         </div>
       </div>
    </>
  );
}
