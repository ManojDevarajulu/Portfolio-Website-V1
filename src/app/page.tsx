"use client";

import { useState, useEffect, useRef } from "react";
import ReactGA from "react-ga4";

// Initialize GA4 with your Measurement ID
if (typeof window !== "undefined") {
  ReactGA.initialize("G-H8RF0XHJZV");
  // Send the initial pageview
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
}
import dynamic from "next/dynamic";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import LenisProvider from "@/components/LenisProvider";
import HeroCanvas from "@/components/HeroCanvas";
import { skillList } from "@/components/SkillIcons";
import SkillCard from "@/components/SkillCard";
import ProjectCard, { ProjectData } from "@/components/ProjectCard";
import PreviewModal from "@/components/PreviewModal";

// RoleCycler is client-only — dynamic import with ssr:false avoids any hydration tree mismatch
const RoleCycler = dynamic(() => import("@/components/RoleCycler"), { ssr: false });

const projects: ProjectData[] = [
  {
    num: "01",
    title: "GravLens-MMA — AI Gravitational-Wave Follow-up Pipeline",
    desc: "Building an AI-powered ranking pipeline for gravitational-wave telescope follow-up using Python, PostgreSQL, Astropy, HEALPix, and the GLADE+ catalog. Focuses on scalable data ingestion, feature engineering, and graph-based machine learning ranked by Hit Rate@K and MRR.",
    tags: ["Python", "Astropy", "HEALPix", "PostgreSQL", "Graph ML"],
    outcome: "Helps telescopes decide where to look — ranking the galaxy most likely to host a gravitational wave source",
    link: "",
    type: "Astro AI Research",
    isFeatured: true,
    inProgress: true,
    mediumLink: "https://medium.com/@ManojDevarajulu/why-im-building-an-ai-to-decide-where-telescopes-should-look-2521890ee7fc",
    canvasId: "pc1",
  },
  {
    num: "02",
    title: "Zen AI — Healthcare Automation Platform",
    desc: "A production OCR + LLM platform that automates healthcare referral document processing. Reduces processing time by ~90% and saves ~400 hours/month. Built with HIPAA-compliant PHI classification, Azure blob storage, and structured prompt-engineering pipelines.",
    tags: ["GPT-4o", "Tesseract OCR", "FastAPI", "Azure"],
    outcome: "~90% reduction in processing time · ~400 hrs/month saved",
    link: "https://zenai-fax-referral-extractor.onrender.com/",
    type: "Healthcare AI",
    canvasId: "pc2",
  },
  {
    num: "03",
    title: "Sentinel — Developer Intelligence Copilot",
    desc: "A developer copilot that combines dependency graph analysis with Retrieval-Augmented Generation (RAG) to enable natural-language code search. Maps architectures, visualizes module dependencies, and helps developers navigate large codebases conversationally.",
    tags: ["Next.js", "FastAPI", "RAG", "Dependency Graphs"],
    outcome: "Improves developer cognition and codebase navigability",
    link: "https://sentinel-teal-two.vercel.app/",
    type: "Dev Infrastructure",
    canvasId: "pc3",
  },
  {
    num: "04",
    title: "En Passant — Territory Chess Ecosystem",
    desc: "A territory-based chess ecosystem combining competitive chess strategy, geolocation, real-time multiplayer interactions, and persistent world mechanics. Python chess engine with full rule enforcement and Minimax AI using alpha-beta pruning.",
    tags: ["Python", "Game Systems", "Minimax AI", "Multiplayer"],
    outcome: "Competitive chess strategy mapped to real-world geolocation",
    link: "",
    type: "Game Ecosystem",
    inProgress: true,
    canvasId: "pc4",
  },
];

const marqueeItems = skillList.map((skill) => skill.name);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Custom Preview Modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Page Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Handle client-side mounts
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setLoading(false), 800);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const triggerPreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setPreviewOpen(true);
  };


  // NOTE: We do NOT return null before mounted.
  // Returning null on the server causes a hydration mismatch (server: full HTML, client: null → boom).
  // Instead we render the full structure and gate only client-only elements (cursor) inside JSX.

  return (
    <LenisProvider>
      {/* ── Page Loader ── */}
      <div
        className={`page-loader fixed inset-0 z-[10000] bg-bg flex items-center justify-center transition-all duration-700 ease-in-out ${
          !loading ? "opacity-0 invisible pointer-events-none" : ""
        }`}
      >
        <span className="font-mono text-[11px] text-text-custom3 tracking-[0.3em] uppercase animate-loader-pulse">
          Loading Portfolio…
        </span>
      </div>

      {/* ── Scroll Progress Bar ── */}
      <motion.div
        className="scroll-progress fixed top-0 left-0 right-0 h-[2px] bg-mono z-[1000] origin-left"
        style={{ scaleX }}
      />


      {/* ── Header / Navigation ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 md:py-6 flex justify-between items-center border-b transition-all duration-500 ${scrolled
            ? "border-border-custom bg-bg/85 backdrop-blur-xl shadow-lg"
            : "border-transparent bg-transparent"
          }`}
      >
        <div className="flex items-center gap-3">
          <a href="#home" className="nav-logo font-mono text-[13px] text-text-custom2 hover:text-text-custom tracking-wider font-light transition-colors duration-200">
            MD_
          </a>
          <div className="flex items-center gap-2 border border-mono/20 px-2.5 py-0.5 rounded-full bg-mono/5 select-none">
            <div className="ticker-dot w-1.5 h-1.5 bg-mono rounded-full animate-ping" />
            <span className="font-mono text-[8px] text-mono uppercase tracking-widest font-normal">Open to Work</span>
          </div>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-10 list-none items-center">
          {(["work", "about", "experience", "stack", "contact"] as const).map((section) => (
            <li key={section}>
              <a
                href={`#${section}`}
                className="font-mono text-[12px] text-text-custom2 hover:text-text-custom capitalize tracking-wide font-light transition-colors duration-200"
              >
                {section}
              </a>
            </li>
          ))}
          {[
            { label: "Resume", href: "/Manoj_Resume.docx", download: "Manoj_Resume.docx" }
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                download={item.download}
                className="font-mono text-[11px] text-mono border border-mono/30 px-3 py-1.5 hover:bg-mono hover:text-bg transition-all duration-300 uppercase tracking-wider"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-text-custom2 hover:text-text-custom transition-colors duration-200 z-50"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 bg-bg/97 backdrop-blur-2xl z-40 flex flex-col justify-center items-center gap-8 transition-all duration-500 ease-in-out md:hidden ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
      >
        {["work", "about", "experience", "stack", "contact"].map((section) => (
          <a
            key={section}
            href={`#${section}`}
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-light text-text-custom2 hover:text-text-custom tracking-wide capitalize transition-colors duration-200"
          >
            {section}
          </a>
        ))}
        <a
          href="/Manoj_Resume.docx"
          download="Manoj_Resume.docx"
          onClick={() => setMenuOpen(false)}
          className="text-xl font-mono text-mono border border-mono/30 px-6 py-2 hover:bg-mono hover:text-bg transition-all duration-300 uppercase tracking-wider mt-4"
        >
          Resume
        </a>
      </div>

      <main className="relative z-10 flex-grow">
        {/* ══════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════ */}
        <section
          id="home"
          className="hero min-h-[100dvh] flex flex-col justify-center px-6 md:px-12 pt-24 pb-16 md:pt-28 md:pb-20 relative overflow-hidden"
        >
          <HeroCanvas />
          <div className="hero-gradient absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_88%_4%,rgba(52,52,52,0.4)_0%,transparent_60%),radial-gradient(ellipse_55%_50%_at_4%_96%,rgba(107,143,113,0.09)_0%,transparent_55%),radial-gradient(ellipse_40%_40%_at_50%_50%,rgba(10,10,10,0.55)_0%,transparent_100%)]" />
          <div className="hero-vignette absolute inset-0 z-2 pointer-events-none bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_35%,rgba(10,10,10,0.75)_100%)]" />
          <div className="hero-bottom-fade absolute bottom-0 left-0 right-0 h-[45%] z-2 pointer-events-none bg-gradient-to-t from-bg via-bg/92 to-transparent" />

          {/* Brighter background "MANOJ" text */}
          <div
            className="hero-bg-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-transparent whitespace-nowrap pointer-events-none select-none tracking-tight z-1"
            style={{
              fontSize: "clamp(80px, 16vw, 240px)",
              WebkitTextStroke: "1px rgba(232, 230, 224, 0.08)",
              color: "rgba(232, 230, 224, 0.01)",
              textShadow: "0 0 80px rgba(107,143,113,0.08), 0 0 160px rgba(107,143,113,0.03)",
            }}
          >
            MANOJ
          </div>

          {/* Column structure — vertically centred, no manual top offset */}
          <div className="max-w-4xl relative z-10 flex flex-col gap-4 md:gap-5">
            {/* Bold identity name — visual anchor of the hero */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hero-name select-none leading-none tracking-[-0.02em]"
            >
              <span
                style={{
                  fontSize: "clamp(42px, 7.5vw, 105px)",
                  fontWeight: 800,
                  color: "#e8e6e0",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  display: "block",
                }}
              >
                MANOJ
              </span>
              <span
                style={{
                  fontSize: "clamp(42px, 7.5vw, 105px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  display: "block",
                  WebkitTextStroke: "1.5px #6b8f71",
                  color: "transparent",
                }}
              >
                DEVARAJULU
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="hero-eyebrow font-mono text-[11px] text-mono tracking-[0.18em] uppercase flex items-center gap-1.5 flex-wrap"
            >
              <RoleCycler /> <span className="text-text-custom3">— Chennai, India</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="hero-headline text-3xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight text-text-custom2"
            >
              Building
              {" "}<em className="font-serif italic font-normal text-text-custom">intelligent</em>
              {" "}systems.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="hero-sub text-[15px] text-text-custom2 leading-relaxed max-w-[520px]"
            >
              I engineer AI infrastructure, developer tools, and intelligent workflows. Systems-first thinker. Open to Work.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="hero-actions flex gap-6 items-center flex-wrap"
            >
              <a href="#work" className="btn-primary bg-text-custom text-bg px-8 py-3.5 text-[13px] font-medium tracking-wide uppercase transition-all duration-200 hover:opacity-85 hover:-translate-y-[1px]">
                View Work
              </a>
              <a
                href="/Manoj_Resume.docx"
                download="Manoj_Resume.docx"
                className="font-mono text-[12px] text-mono border border-mono/30 px-5 py-3 hover:bg-mono hover:text-bg transition-all duration-300 uppercase tracking-wider flex items-center gap-1.5"
              >
                Resume <span>↓</span>
              </a>
              <a
                href="#contact"
                className="btn-ghost font-mono text-[13px] text-text-custom2 hover:text-text-custom tracking-wide flex items-center gap-2 group/btn transition-colors duration-200"
              >
                Get in touch
                <span className="text-lg transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="hero-avail flex items-center gap-3 select-none pt-2"
            >
              <div className="ticker-dot w-1.5 h-1.5 bg-mono rounded-full animate-ping" />
              <span className="font-mono text-[10px] text-text-custom3 uppercase tracking-wider">
                Open to Work — Available for new projects &amp; roles
              </span>
            </motion.div>
          </div>

          <div className="absolute bottom-16 right-8 md:right-12 z-10 hidden md:flex flex-col items-center gap-3 select-none">
            <div className="scroll-line w-[1px] h-[55px] bg-gradient-to-b from-transparent to-border-custom2 relative overflow-hidden animate-scroll-drop" />
            <span className="font-mono text-[9px] text-text-custom3 uppercase tracking-[0.25em] rotate-90 origin-bottom whitespace-nowrap mt-8">
              Scroll
            </span>
          </div>
        </section>

        {/* ── Marquee band ── */}
        <div className="marquee-band border-t border-b border-border-custom bg-bg2 overflow-hidden py-4 flex select-none">
          <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] gap-10">
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <span
                key={`${item}-${idx}`}
                className="marquee-item font-mono text-[12px] text-text-custom3 tracking-widest uppercase flex items-center gap-10"
              >
                {item}&nbsp;<span aria-hidden="true" className="text-mono text-base font-normal">·</span>
              </span>
            ))}
          </div>
        </div>

        <hr className="border-border-custom m-0" />

        {/* ══════════════════════════════════════════
            ABOUT SECTION
        ══════════════════════════════════════════ */}
        <section id="about" className="px-8 md:px-12 py-24 md:py-32">
          <div className="section-label font-mono text-[11px] text-mono tracking-[0.2em] uppercase mb-16 flex items-center gap-4">
            001 — About <div className="flex-grow h-[1px] bg-border-custom" />
          </div>

          <div className="about-grid grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="flex flex-col gap-6">
              <h2 className="about-headline text-3xl md:text-5xl font-light leading-[1.2] tracking-tight text-text-custom">
                I think in <em className="font-serif italic font-normal text-text-custom2">systems,</em> not features.
              </h2>
              <div className="about-body text-text-custom2 text-[15px] leading-relaxed flex flex-col gap-5">
                <p>
                  Hi, I&apos;m Manoj D — an AI/ML Engineer with 1.5+ years building production AI applications, LLM-powered automation, agentic workflows, and RAG systems. I think in systems rather than isolated features, always focused on reducing complexity and delivering measurable impact.
                </p>
                <p>
                  At Infinite Computer Solutions, I architected Zen AI — a production OCR + LLM platform for healthcare document processing that cut processing time by ~90% and saved ~400 hours/month. I design HIPAA-compliant PHI pipelines, Azure-based cloud architectures, and structured prompt-engineering workflows.
                </p>
                <p>
                  On the side, I&apos;m building GravLens-MMA, an AI pipeline that ranks galaxies for gravitational-wave telescope follow-up — and documenting the process on Medium. I also built Sentinel (RAG + dependency graph developer copilot) and an agentic chess engine with Minimax AI.
                </p>
              </div>
              <div className="stack-row flex flex-wrap gap-2 mt-4">
                {["Python", "FastAPI", "LangGraph", "RAG", "GPT-4o", "Azure", "PostgreSQL", "Astropy"].map((chip) => (
                  <span
                    key={chip}
                    className="stack-chip font-mono text-[10px] text-text-custom3 border border-border-custom px-3 py-1 tracking-wider uppercase hover:text-text-custom2 hover:border-border-custom2 transition-colors duration-300"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-8 w-full lg:max-w-md">
              <div className="philosophy-block bg-bg2 border border-border-custom border-l-2 border-l-mono p-8 rounded-sm">
                <p className="text-[17px] text-accent2 leading-relaxed font-light italic">
                  &ldquo;Technology should reduce complexity, not add to it. Every system I build starts from that premise.&rdquo;
                </p>
                <div className="attr font-mono text-[10px] text-text-custom3 tracking-wider uppercase mt-6">
                  — Engineering philosophy
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 gap-6">
                {[
                  { num: "1.5+", label: "Years in production AI systems" },
                  { num: "~90%", label: "Processing time reduced at Zen AI" },
                  { num: "∞", label: "Systems still left to build" },
                ].map((stat) => (
                  <div key={stat.label} className="about-stat border-t border-border-custom pt-6 flex flex-col gap-1">
                    <div className="stat-number text-4xl md:text-5xl font-light text-text-custom tracking-tight leading-none">
                      {stat.num}
                    </div>
                    <div className="stat-label font-mono text-[10px] text-text-custom2 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="border-border-custom m-0" />

        {/* ══════════════════════════════════════════
            WORK (PROJECTS) SECTION
        ══════════════════════════════════════════ */}
        <section id="work" className="px-8 md:px-12 py-24 md:py-32">
          <div className="section-label font-mono text-[11px] text-mono tracking-[0.2em] uppercase mb-16 flex items-center gap-4">
            002 — Selected Work <div className="flex-grow h-[1px] bg-border-custom" />
          </div>

          <div className="work-intro max-w-2xl mb-16">
            <h2 className="text-4xl md:text-6xl font-light leading-tight tracking-tight mb-4">
              Projects that <em className="font-serif italic font-normal text-text-custom2">matter.</em>
            </h2>
            <p className="text-text-custom2 font-light text-[15px] leading-relaxed">
              Each project started from a real frustration, a genuine problem, or a system I wished existed.
            </p>
          </div>

          {/* Responsive Grid of Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((proj) => (
              <ProjectCard key={proj.num} project={proj} onPreview={triggerPreview} />
            ))}
          </div>
        </section>

        <hr className="border-border-custom m-0" />

        {/* ══════════════════════════════════════════
            EXPERIENCE SECTION
        ══════════════════════════════════════════ */}
        <section id="experience" className="px-8 md:px-12 py-24 md:py-32">
          <div className="section-label font-mono text-[11px] text-mono tracking-[0.2em] uppercase mb-16 flex items-center gap-4">
            003 — Experience <div className="flex-grow h-[1px] bg-border-custom" />
          </div>

          <div className="exp-layout grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="max-w-md">
              <h2 className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-4">
                Where I&apos;ve <em className="font-serif italic font-normal text-text-custom2">worked.</em>
              </h2>
              <p className="text-text-custom2 font-light text-[15px] leading-relaxed">
                Exposure to regulated healthcare environments taught me the importance of reliability, security, and production-grade AI deployment — things you can&apos;t learn from tutorials.
              </p>
            </div>

            <div className="exp-items flex flex-col w-full">
              {[
                {
                  role: "Associate Software Engineer",
                  period: "Oct 2024 — Present",
                  company: "Infinite Computer Solutions",
                  desc: "Enterprise healthcare AI systems — architected Zen AI, a production OCR + LLM platform that automates referral document processing.",
                  stats: [
                    { value: "~90%", label: "Time Saved" },
                    { value: "~400 hrs", label: "Saved / month" }
                  ],
                  bullets: [
                    "Built OCR + LLM pipelines delivering precise, HIPAA-compliant document processing",
                    "Implemented secure PHI classification, ingestion and structured JSON delivery",
                    "Azure Blob Storage, Azure Data Factory migration, and custom Selenium test automation",
                  ],
                },
                {
                  role: "Full-Stack Developer Intern",
                  period: "Jul 2024 — Sep 2024",
                  company: "Inblue Infotech Pvt Ltd",
                  desc: "Built full-stack product features across the React + Node.js stack. Contributed to REST API design, MongoDB schemas, code reviews, and deployment workflows.",
                  bullets: [
                    "Full-stack features with React, Node.js, REST APIs, and MongoDB",
                    "Participated in code reviews and production deployment workflows",
                  ],
                },
              ].map((item) => (
                <div key={item.company} className="exp-item border-t border-border-custom py-8 flex flex-col gap-4">
                  <div className="exp-header flex justify-between items-start flex-wrap gap-2">
                    <h3 className="exp-role text-lg font-normal text-text-custom tracking-tight">
                      {item.role}
                    </h3>
                    <span className="exp-period font-mono text-[10px] text-text-custom3 tracking-wider uppercase">
                      {item.period}
                    </span>
                  </div>
                  <div className="exp-company font-mono text-[12px] text-mono tracking-wider uppercase">
                    {item.company}
                  </div>
                  <p className="exp-desc text-text-custom2 font-light text-[14px] leading-relaxed">
                    {item.desc}
                  </p>
                  
                  {/* Highlighted Stat Cards for metrics scans */}
                  {"stats" in item && item.stats && (
                    <div className="flex gap-4 my-2 flex-wrap">
                      {item.stats.map((st) => (
                        <div key={st.label} className="border border-mono/20 bg-bg2 px-4 py-2 flex flex-col min-w-[125px]">
                          <span className="font-mono text-xl text-mono leading-none font-semibold">{st.value}</span>
                          <span className="font-mono text-[8px] text-text-custom2 uppercase tracking-widest mt-1.5">{st.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <ul className="exp-bullets flex flex-col gap-2 list-none p-0">
                    {item.bullets.map((b, bIdx) => (
                      <li key={`${item.company}-b-${bIdx}`} className="text-text-custom3 font-light text-[13px] leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-border-custom2">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="border-b border-border-custom w-full" />
            </div>
          </div>
        </section>

        <hr className="border-border-custom m-0" />

        {/* ══════════════════════════════════════════
            NOW SECTION
        ══════════════════════════════════════════ */}
        <section id="now" className="px-8 md:px-12 py-24 md:py-32">
          <div className="section-label font-mono text-[11px] text-mono tracking-[0.2em] uppercase mb-16 flex items-center gap-4">
            004 — Now <div className="flex-grow h-[1px] bg-border-custom" />
          </div>

          <div className="now-grid grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">
            <div className="max-w-md">
              <h2 className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-4">
                What I&apos;m <em className="font-serif italic font-normal text-text-custom2">doing</em> right now.
              </h2>
              <p className="text-text-custom2 font-light text-[14px] leading-relaxed">
                A live snapshot. Updated whenever something meaningful shifts.
              </p>
            </div>

            <div className="now-cards grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-border-custom border border-border-custom">
              {[
                { label: "Building", val: "GravLens-MMA", sub: "AI ranking pipeline for gravitational-wave telescope follow-up — deciding where in the sky telescopes should look" },
                { label: "Thinking About", val: "LLM Reliability Patterns", sub: "How multi-agent systems fail in production and what actually makes agentic workflows robust" },
                { label: "Writing On", val: "Medium", sub: "Documenting the build process: AI for astrophysics, developer tools, and systems thinking in public" },
              ].map((card) => (
                <div key={card.label} className="now-card bg-bg p-8 hover:bg-bg2 transition-colors duration-300 flex flex-col gap-4">
                  <span className="now-label font-mono text-[9px] text-mono uppercase tracking-[0.2em]">
                    {card.label}
                  </span>
                  <div>
                    <div className="now-value text-[16px] font-normal text-text-custom mb-1">
                      {card.val}
                    </div>
                    <div className="now-sub text-text-custom2 font-light text-[13px] leading-relaxed">
                      {card.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-border-custom m-0" />

        {/* ══════════════════════════════════════════
            STACK (SKILLS GRID) SECTION
        ══════════════════════════════════════════ */}
        <section id="stack" className="px-8 md:px-12 py-24 md:py-32">
          <div className="section-label font-mono text-[11px] text-mono tracking-[0.2em] uppercase mb-16 flex items-center gap-4">
            005 — Tech Stack <div className="flex-grow h-[1px] bg-border-custom" />
          </div>

          <div className="stack-section-grid grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">
            <div className="max-w-md">
              <h2 className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-4">
                Tools I <em className="font-serif italic font-normal text-text-custom2">actually</em> use.
              </h2>
              <p className="text-text-custom2 font-light text-[15px] leading-relaxed mb-6">
                No buzzword bingo. Only tools I&apos;ve shipped real things with.
              </p>
              <p className="text-text-custom3 font-mono text-[11px] tracking-wide leading-relaxed">
                Core: Python + FastAPI for AI backends. Next.js + React for product layers. LangGraph for agentic workflows. Azure + Docker for cloud infrastructure.
              </p>
            </div>

            {/* Custom SVG grid showing all 22 logos */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 w-full">
              {skillList.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index} />
              ))}
            </div>
          </div>
        </section>

        <hr className="border-border-custom m-0" />

        {/* ══════════════════════════════════════════
            EDUCATION SECTION
        ══════════════════════════════════════════ */}
        <section id="education" className="px-8 md:px-12 py-24 md:py-32">
          <div className="section-label font-mono text-[11px] text-mono tracking-[0.2em] uppercase mb-16 flex items-center gap-4">
            006 — Education <div className="flex-grow h-[1px] bg-border-custom" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="max-w-md">
              <h2 className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-4">
                Where I <em className="font-serif italic font-normal text-text-custom2">learned</em> to build.
              </h2>
              <p className="text-text-custom2 font-light text-[15px] leading-relaxed">
                A background in AI & Data Science gave me the theoretical foundations to build things that actually work in production — not just demo well.
              </p>
            </div>

            <div className="flex flex-col w-full">
              <div className="border-t border-border-custom py-8 flex flex-col gap-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <h3 className="text-lg font-normal text-text-custom tracking-tight">
                    B.Tech — Artificial Intelligence &amp; Data Science
                  </h3>
                  <span className="font-mono text-[10px] text-text-custom3 tracking-wider uppercase">2020 — 2024</span>
                </div>
                <div className="font-mono text-[12px] text-mono tracking-wider uppercase">
                  Velammal Engineering College, Chennai
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-mono text-[11px] text-text-custom2 border border-border-custom px-3 py-1 tracking-wider">
                    CGPA: 8.88 / 10
                  </span>
                  <span className="font-mono text-[11px] text-text-custom3 tracking-wider">
                    Anna University Affiliated
                  </span>
                </div>
                <p className="text-text-custom2 font-light text-[14px] leading-relaxed">
                  Specialized in machine learning, neural networks, NLP, and data engineering. Built the foundation for everything from OCR pipelines to agentic AI systems.
                </p>
              </div>
              <div className="border-b border-border-custom w-full" />
            </div>
          </div>
        </section>

        <hr className="border-border-custom m-0" />

        {/* ══════════════════════════════════════════
            CONTACT SECTION
        ══════════════════════════════════════════ */}
        <section id="contact" className="px-8 md:px-12 py-24 md:py-32">
          <div className="section-label font-mono text-[11px] text-mono tracking-[0.2em] uppercase mb-16 flex items-center gap-4">
            007 — Contact <div className="flex-grow h-[1px] bg-border-custom" />
          </div>

          <div className="contact-inner grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-4xl md:text-6xl font-light leading-tight tracking-tight">
                Let&apos;s <em className="font-serif italic font-normal text-text-custom2">build</em><br />something.
              </h2>
              <p className="text-text-custom2 font-light text-[15px] leading-relaxed mb-6">
                Open to interesting conversations — AI systems, startup ideas, developer tooling, collaborations, or just a good technical discussion.
              </p>

              {/* Verified links from links.txt */}
              <div className="contact-links flex flex-col w-full">
                {[
                  { name: "GitHub", url: "https://github.com/ManojDevarajulu" },
                  { name: "LinkedIn", url: "https://www.linkedin.com/in/manojd7/" },
                  { name: "Medium", url: "https://medium.com/@ManojDevarajulu" },
                  { name: "Twitter / X", url: "https://x.com/ManojDevarajulu" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link border-t border-border-custom py-5 px-1 flex justify-between items-center text-text-custom2 hover:text-text-custom hover:pl-3 font-mono text-[13px] tracking-wide transition-all duration-300 group"
                  >
                    {item.name}
                    <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ))}
                <div className="border-b border-border-custom w-full" />
              </div>
            </div>

            <div className="flex flex-col gap-6 max-w-sm lg:self-start lg:mt-8">
              <a href="mailto:builds@manojdevarajulu.cc" className="big-email text-2xl font-light text-text-custom hover:text-text-custom2 tracking-tight pb-6 border-b border-border-custom transition-colors duration-200">
                builds@manojdevarajulu.cc
              </a>
              <div className="availability flex items-center gap-2 select-none">
                <div className="avail-dot w-2 h-2 bg-mono rounded-full animate-ping" />
                <span className="font-mono text-[10px] text-mono uppercase tracking-wider">
                  Open to Work — Available
                </span>
              </div>
              <p className="contact-note text-text-custom3 font-mono text-[11px] leading-relaxed mt-2 select-none">
                Based in Chennai, India · Usually responds within 24 hours
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="px-8 py-8 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-border-custom bg-bg select-none relative z-10">
        <span className="footer-copy font-mono text-[10px] text-text-custom3 uppercase tracking-wider">
          © 2026 Manoj D
        </span>
        <span className="footer-made font-mono text-[10px] text-text-custom3 uppercase tracking-wider">
          Chennai, India — Built with intention.
        </span>
        <a href="#home" className="footer-back font-mono text-[10px] text-text-custom3 hover:text-text-custom2 uppercase tracking-wider transition-colors duration-200">
          Back to top ↑
        </a>
      </footer>

      {/* ── Website Preview Modal ── */}
      <PreviewModal
        isOpen={previewOpen}
        url={previewUrl}
        title={previewTitle}
        onClose={() => setPreviewOpen(false)}
      />
    </LenisProvider>
  );
}
