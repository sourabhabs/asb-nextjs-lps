"use client";

import { useEffect, useRef, useState } from "react";
import LeadForm from "./LeadForm";
import type { AsbCourseRouteConfig } from "@/lib/asb-routes";

interface AsbCourseLandingShellProps {
  course: AsbCourseRouteConfig;
}

type CourseDetails = {
  highlight: string;
  options: { value: string; label: string }[];
  cardImage: string;
  cardTitle: string;
  description: string;
  blocks: {
    title: string;
    subtitle?: string;
    items: string[];
  }[];
};

const COURSE_DETAILS: Record<AsbCourseRouteConfig["key"], CourseDetails> = {
  bba: {
    highlight: "BBA",
    options: [
      { value: "BBA", label: "BBA" },
      { value: "IBBA", label: "BBA International" },
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
    options: [
      { value: "BCA", label: "BCA" },
      { value: "IBCA", label: "BCA International" },
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
    options: [
      { value: "BCOM", label: "B.Com" },
      { value: "IBCOM", label: "B.Com International" },
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
    options: [
      { value: "BSc CS", label: "B.Sc. Computer Science" },
      { value: "IBSc CS", label: "B.Sc. Computer Science International" },
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

export default function AsbCourseLandingShell({ course }: AsbCourseLandingShellProps) {
  const homeRef = useRef<HTMLElement | null>(null);
  const content = COURSE_DETAILS[course.key];
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
        .top-recruiters{padding:60px 0;background:#fff}
        .recruiters-head .subtitle{color:#475569;font-size:16px;margin-top:8px}
        .recruiters-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:30px}
        .recruiter-card{background:#fafafa;border:1px solid #f1f5f9;border-radius:12px;padding:25px;display:flex;align-items:center;justify-content:center;transition:all .3s ease;height:110px}
        .recruiter-card:hover{transform:translateY(-3px);box-shadow:0 10px 25px rgba(0,0,0,.05);border-color:#e2e8f0}
        .recruiter-card img{max-width:100%;max-height:50px;object-fit:contain;filter:none;transition:all .3s ease}
        .desktop-cta{display:none}
        @media (min-width:992px){
          .navbar-area,.navbar-area .navbar{background:#ffffff!important;box-shadow:0 1px 0 rgba(15,23,42,.08)}
          .bnrbg{background-image:linear-gradient(rgba(0,0,0,.28),rgba(0,0,0,.28)),url("/ASB-BG-D.webp")!important;background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important}
          .asb-desktop-hero-copy{max-width:660px;margin-top:18px;margin-bottom:28px;text-align:left;color:#fff}
          .asb-desktop-hero-title{margin:0 0 12px;font-size:54px;line-height:1.12;font-weight:800;color:#fff}
          .asb-desktop-hero-subtitle{margin:0 0 10px;font-size:22px;line-height:1.35;color:#ffffff!important;font-weight:600}
          .asb-desktop-hero-highlight{font-weight:800;color:#22f0ff!important;font-size:1.38em!important;display:inline-block}
          .asb-desktop-hero-points{list-style:none;padding:0;margin:8px 0 0}
          .asb-desktop-hero-points li{position:relative;padding-left:30px;margin:0 0 3px;font-size:16px;line-height:1.45;color:#fff}
          .asb-desktop-hero-points li::before{content:"\\00BB";position:absolute;left:6px;top:-1px;font-size:24px;color:#fff}
          #heroLeadForm{display:flex;flex-wrap:nowrap;align-items:center;gap:6px;width:100%;background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important;padding:0!important;position:static!important}
          #heroLeadForm .single_form{margin-top:0;width:138px;flex:0 0 auto}
          #heroLeadForm .course-select-wrap{width:165px}
          #heroLeadForm .hero-form-title{width:auto;min-width:190px;margin-right:2px}
          #heroLeadForm .hero-form-title h3{margin:0;color:#fff;font-size:33px;line-height:1;font-weight:800}
          .frmD{padding:14px 8px;background-color:rgba(0,105,113,.66)}
          #heroLeadForm .single_form input,#heroLeadForm .single_form select{display:block;width:100%;box-sizing:border-box;height:40px;border-radius:4px;border:1px solid rgba(71,85,105,.55);background:#fff;color:#334155;padding:0 10px;font-size:15px;margin:0}
          #heroSubmitBtn{height:40px;line-height:40px;background:#006972!important;font-weight:700;padding:0 10px;min-width:92px;border-radius:4px}
          .desktop-cta{display:flex!important;justify-content:flex-end;position:fixed;bottom:25px;left:25px;right:25px;z-index:9999;pointer-events:none;transition:opacity .3s ease,transform .3s ease}
          .desktop-cta-strip{display:flex;align-items:center;background:#fff;border-radius:80px;padding:8px 10px;box-shadow:0 15px 35px rgba(15,31,69,.2);pointer-events:auto;gap:12px}
          .btn-enq{background:#0f1f45!important;color:#fff!important;border-radius:50px!important;padding:14px 35px!important;font-weight:700;font-size:16px;text-transform:uppercase;border:none;cursor:pointer;white-space:nowrap}
          .btn-call{width:52px;height:52px;background:#0f1f45!important;color:#fff!important;border-radius:50%!important;display:flex;align-items:center;justify-content:center;text-decoration:none}
        }
        @media (max-width:991px){
          .navbar-area{position:relative!important;top:auto!important;left:auto!important;background:#fff!important;box-shadow:none!important}
          .navbar-area .container-fluid,.navbar-area .col-lg-12{padding-left:0!important;padding-right:0!important}
          .navbar-area .row{margin-left:0!important;margin-right:0!important}
          .navbar-area .navbar{padding:0!important;min-height:auto!important}
          .bnrbg{background:#f4f4f5!important}
          .header-hero,.header-hero-content{padding-top:0!important}
          .header-hero .container-l{width:100%!important;max-width:420px!important;margin:0 auto!important;padding:0!important}
          .header-hero-content{padding:0!important;margin:0 auto!important;text-align:center!important;max-width:420px}
          .mobH{display:none!important}
          .mobV{display:block!important;max-width:420px;margin:0 auto 10px!important}
          .mobV img{width:100%!important;max-width:390px!important;height:auto!important;display:block!important;margin:0 auto!important}
          .frmD{position:relative!important;border:1px solid #e2e8f0;border-radius:22px;padding:18px 14px 16px!important;max-width:420px;margin:10px auto 0;box-shadow:0 10px 25px rgba(15,23,42,.12);overflow:visible;background:#fff!important}
          #heroLeadForm{display:block;padding-top:15px!important;margin-top:0!important}
          .hero-form-title{width:100%!important;margin:0 auto 15px!important;padding-top:0!important;display:block!important}
          .hero-form-title h3{text-align:center!important;margin:0!important;padding:0!important;width:100%!important;color:#0f1f45!important;font-size:2.35rem!important;font-weight:800!important;line-height:1.02!important}
          #heroLeadForm .single_form{width:100%;margin-top:10px}
          #heroLeadForm .single_form input,#heroLeadForm .single_form select{height:52px;border-radius:12px;border:1px solid #d6dae2;background:#f0f2f5;padding:0 14px;font-size:16px;color:#475569}
          #heroSubmitBtn{height:48px;line-height:48px;border-radius:12px;background:#ff1b23!important;font-weight:800;letter-spacing:.02em;box-shadow:0 10px 18px rgba(255,27,35,.28)}
        }
        @media (max-width:767px){.recruiters-grid{grid-template-columns:repeat(2,1fr);gap:12px}.top-recruiters{padding:40px 0}}
      `}</style>

      <main>
        <header className="header-area">
        <div className="navbar-area">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <nav className="navbar navbar-expand-lg" style={{ display: "flex", justifyContent: "space-between", width: "100%", minHeight: "78px" }}>
                  <div className="d-none d-lg-flex align-items-center">
                    <div className="alc-desktop-logo-strip">
                      <img src="/img/logo.jpg" alt="Asian School of Business" className="logo-alc" />
                      <img src="/img/OBC-Logo.png" alt="Oxford Business College" className="logo-obc" />
                    </div>
                  </div>
                  <div className="d-flex d-lg-none w-100 align-items-center justify-content-between alc-mobile-header">
                    <img className="alc-mobile-badge" src="/assets/images/aicte.jpg" alt="AICTE" />
                    <a href="#home" className="navbar-brand mx-auto" style={{ display: "flex", alignItems: "center" }}>
                      <img src="/img/logo.jpg" alt="Asian School of Business" width="160" height="68" />
                    </a>
                    <img className="alc-mobile-badge" src="/img/naac.webp" alt="NAAC" />
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <section ref={homeRef} className="header-hero bg_cover d-flex align-items-center bnrbg" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.28)), url("/ASB-BG-D.webp")', backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat" }}>
          <div className="container-l banner-content" style={{ width: "auto" }}>
            <div className="row" style={{ width: "100%", marginRight: 0, marginLeft: 0 }}>
              <div className="col-lg-12">
                <div className="header-hero-content" style={{ paddingLeft: "35px", paddingRight: "30px" }}>
                  <div className="mobH asb-desktop-hero-copy" style={{ maxWidth: "760px" }}>
                    <h1 className="asb-desktop-hero-title">Join the best<br />Undergrad College in Delhi-NCR</h1>
                    <p className="asb-desktop-hero-subtitle">Pursue Full-Time <span className="asb-desktop-hero-highlight">{content.highlight}</span> Degree Program.</p>
                    <ul className="asb-desktop-hero-points">
                      <li style={{ fontSize: "20px" }}>15 Days Study Trip to Oxford Business College, Oxford & London, U.K.</li>
                    </ul>
                  </div>
                  <div className="mobV" style={{ textAlign: "center", marginBottom: "10px", marginTop: "-4px" }}>
                    <img src={course.heroImage} alt="ASB Admissions 2026" style={{ width: "100%", height: "auto", display: "block" }} />
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
            />
          </div>
        </section>
        </header>

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
            <div className="row">
              <div className="col-md-6 h-100 mb-4">
                <div className="single_courses mt-30 h-100 d-flex flex-column">
                  <img src={content.cardImage} alt="courses" className="w-100" />
                  <h4 className="title"><a href="javascript:void(0)">{titleParts[0]} <span style={{ fontSize: "19px" }}>{titleParts[1] ? `(${titleParts[1]}` : ""}</span></a></h4>
                  <p>{content.description}</p>
                </div>
              </div>
              <div className="col-md-6 h-100 mb-4">
                <div className="single_courses mt-30 h-100 d-flex flex-column">
                  {content.blocks.map((block) => (
                    <div key={block.title}>
                      <h3 className="course-banner">
                        {block.title}
                        {block.subtitle ? <><br /><span style={{ fontSize: "15px" }}>{block.subtitle}</span></> : null}
                      </h3>
                      <div className="additionalimg" style={{ textAlign: "center" }}>
                        <table className="banner-table" style={{ width: "100%" }}>
                          <tbody>
                            {block.items.map((item, index) => (
                              <tr key={item} style={index === block.items.length - 1 ? { border: "solid 0px #fff" } : undefined}>
                                <td>{item}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-12 active" style={{ textAlign: "center" }}>
                <button type="button" className="main-btn" style={{ marginTop: "30px" }} onClick={() => scrollToId("home", true)}>Enquire Now</button>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonials" id="testimonials"><div className="container"><div className="test-head"><span className="tag">What Our Students Say</span><h2 className="title">Student Testimonials</h2><div className="line"></div></div><div className="test-wrap"><div className="test-track">{visible.map(([name, url]) => <button key={url} type="button" className="test-video-card" onClick={() => setTestModalUrl(url)} aria-label={`Play testimonial by ${name}`}><span className="test-video-preview"><iframe src={videoEmbed(url)} title={`${name} preview`} frameBorder="0" loading="lazy" tabIndex={-1} aria-hidden="true" sandbox="allow-scripts allow-same-origin allow-presentation"></iframe></span></button>)}</div>{pageCount > 1 ? <div className="test-dots">{Array.from({ length: pageCount }).map((_, index) => <button key={index} type="button" className={`test-dot${index === page ? " is-active" : ""}`} onClick={() => setPage(index)} aria-label={`Go to testimonial page ${index + 1}`}></button>)}</div> : null}</div></div></section>

        {testModalUrl ? <div className="test-modal is-open" aria-hidden="false"><div className="test-modal-overlay" onClick={() => setTestModalUrl("")}></div><div className="test-modal-dialog" role="dialog" aria-modal="true"><button type="button" className="test-modal-close" onClick={() => setTestModalUrl("")}>x</button><div className="test-modal-media"><iframe title="Student testimonial player" src={videoEmbed(testModalUrl, true)} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" sandbox="allow-scripts allow-same-origin allow-presentation" allowFullScreen></iframe></div></div></div> : null}

        <section className="chair" id="leadership"><div className="container"><div className="chair-grid"><div className="chair-media"><div className="chair-photo"><img src="/assets/images/sandeep-marwah.webp" alt="Dr. Sandeep Marwah" /></div></div><div className="chair-content"><h2 className="chair-name">Dr. Sandeep Marwah</h2><p className="chair-role">Founder & President</p><div className="chair-divider"></div><p className="chair-message">We at Asian School of Business believe that education in business management is not just about management itself, but about improving the many disciplines and functions that shape business.</p></div></div></div></section>

        <section className="campus" id="campus"><div className="container"><div className="campus-head"><div className="line"></div><h2 className="title">Our Campus</h2></div><div className="campus-grid">{CAMPUS.map(([label, src]) => <div key={label} className="campus-card"><div className="campus-img"><img src={src} alt={label} width="400" height="300" /></div><div className="campus-label">{label}</div></div>)}</div></div></section>

        <section className="events" id="events"><div className="container"><div className="events-head"><div className="line"></div><h2 className="title">Events at Asian School of Business</h2></div><div className="events-grid">{EVENTS.map(([label, src]) => <div key={label} className="events-card"><div className="events-img"><img src={src} alt={label} width="300" height="200" /></div><div className="events-label">{label}</div></div>)}</div></div></section>

        <section className="contact" id="contact"><div className="container contact-grid"><div><span className="tag">Get In Touch</span><h2 className="title">Start Your ASB Journey</h2><p>Admissions are open for BBA / BCA / B.Com / B.Sc. (CS) Batch 2026. Fill in the form and our admissions team will get in touch with you.</p></div><div className="cta"><div className="cta-box"><button type="button" className="btn btn-gold" onClick={() => scrollToId("enquire", true)}>Enquire Now</button></div></div></div></section>

        <footer className="footer"><div className="container footer-inner"><div className="footer-grid"><div><h4 style={{ color: "#fff" }}>Asian School of Business</h4><p>Admissions open for 2026 intake. Build your future in business, commerce and technology with a globally aware academic ecosystem.</p></div><div><div className="f-title">Quick Links</div><ul className="f-links"><li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToId("home", true); }}>Home</a></li><li><a href="#courses" onClick={(e) => { e.preventDefault(); scrollToId("courses"); }}>Programs Offered</a></li><li><a href="#international" onClick={(e) => { e.preventDefault(); scrollToId("international"); }}>International Exposure</a></li><li><a href="#enquire" onClick={(e) => { e.preventDefault(); scrollToId("enquire", true); }}>Enquire Now</a></li></ul></div><div><div className="f-title">Admissions Office</div><p>Asian School of Business, Noida, Uttar Pradesh</p></div></div><div className="f-bottom"><span>(c) 2026 Asian School of Business. All rights reserved.</span><span>International association with Oxford Business College</span></div></div></footer>

        <div className="desktop-cta" style={{ opacity: showSticky ? "1" : "0", pointerEvents: showSticky ? "auto" : "none", transform: showSticky ? "translateY(0)" : "translateY(20px)" }} aria-label="Desktop actions"><div className="desktop-cta-strip"><button type="button" className="btn btn-enq" onClick={() => scrollToId("enquire", true)}>Enquire Now</button><a href="tel:8448334130" className="btn btn-call" title="Call Us"><svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z" /></svg></a></div></div>
      </main>
    </>
  );
}
