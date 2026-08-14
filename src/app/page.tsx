"use client";

import { useState, useEffect } from "react";
import ReactGA from "react-ga4";

// Initialize GA4 with Measurement ID
if (typeof window !== "undefined") {
  ReactGA.initialize("G-H8RF0XHJZV");
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
}

import dynamic from "next/dynamic";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X, Download } from "lucide-react";
import LenisProvider from "@/components/LenisProvider";
import HeroCanvas from "@/components/HeroCanvas";
import { skillList } from "@/components/SkillIcons";
import SkillCard from "@/components/SkillCard";
import ProjectCard, { ProjectData } from "@/components/ProjectCard";
import PreviewModal from "@/components/PreviewModal";

// Dynamic import of RoleCycler with ssr: false
const RoleCycler = dynamic(() => import("@/components/RoleCycler"), { ssr: false });

const projects: ProjectData[] = [
  {
    num: "01",
    title: "Cura — AI Healthcare SaaS Platform",
    desc: "Architecting and building the core web platform for an AI healthcare SaaS startup serving patients and doctors across European countries, holding complete technical ownership across frontend, backend, and AI system architecture. Building RAG-based AI features and LLM workflows using pgvector for vector search.",
    tags: ["Next.js", "FastAPI", "pgvector", "PostgreSQL", "LangChain", "Docker"],
    outcome: "Sole Technical Lead · Serving EU clinicians & patients · Contextual clinical RAG",
    link: "",
    type: "Healthcare AI SaaS",
    isFeatured: true,
    canvasId: "pc1",
  },
  {
    num: "02",
    title: "Zen AI — Healthcare Document Processing Platform",
    desc: "A production OCR + LLM platform that automates healthcare document processing workflows for operations teams, reducing processing time by ~90% and saving an estimated 400 hours/month. Built structured prompt-engineering and validation workflows to improve extraction accuracy across daily batches.",
    tags: ["Python", "FastAPI", "GPT-4o", "OCR", "Azure Blob", "Pydantic"],
    outcome: "~90% reduction in processing time · ~400 hrs/month saved",
    link: "https://zenai-fax-referral-extractor.onrender.com/",
    githubLink: "https://github.com/ManojDevarajulu/ZEN-AI-Referral-Fax-Extractor",
    type: "Enterprise AI",
    canvasId: "pc2",
  },
  {
    num: "03",
    title: "Multi-Agent Research Orchestrator",
    desc: "Designed and deployed a multi-agent orchestration framework for automated deep research, dynamic task planning, and report generation using LangChain & LangGraph with specialized roles (Researcher, Critic, Synthesizer), dynamic tool calling, state persistence, and Pydantic hallucination mitigation schemas.",
    tags: ["LangGraph", "LangChain", "Python", "GPT-4o", "Multi-Agent", "Pydantic"],
    outcome: "Autonomous multi-agent coordination · Dynamic tool calling · Fallback validation",
    link: "https://github.com/ManojDevarajulu",
    githubLink: "https://github.com/ManojDevarajulu",
    type: "Agentic AI Framework",
    canvasId: "pc3",
  },
  {
    num: "04",
    title: "Sentinel — Developer Intelligence Copilot",
    desc: "A developer copilot for multi-file repositories that maps architectural dependency graphs and computes blast-radius impact for code changes, featuring an interactive dashboard and GitHub PR workflow with natural-language RAG code search on the roadmap.",
    tags: ["Next.js", "TypeScript", "FastAPI", "Python", "Celery", "Supabase", "Redis", "Docker"],
    outcome: "Maps multi-file repo dependencies · PR blast-radius impact analysis",
    link: "https://sentinel-teal-two.vercel.app/",
    githubLink: "https://github.com/ManojDevarajulu",
    type: "Dev Infrastructure",
    canvasId: "pc4",
  },
  {
    num: "05",
    title: "Medical Referral Extractor — Vision R&D",
    desc: "A personal R&D system extracting structured medical referral data from PDFs, faxes, and scanned images using Azure OpenAI GPT-4o Vision for OCR-free multimodal document analysis and structured clinical JSON delivery.",
    tags: ["React", "FastAPI", "Azure OpenAI", "GPT-4o Vision", "Docker"],
    outcome: "OCR-free direct vision parsing of unstructured faxes & patient referrals",
    link: "https://github.com/ManojDevarajulu/ZEN-AI-Referral-Fax-Extractor",
    githubLink: "https://github.com/ManojDevarajulu/ZEN-AI-Referral-Fax-Extractor",
    type: "Multimodal Vision AI",
    canvasId: "pc5",
  },
  {
    num: "06",
    title: "GravLens-MMA — AI Gravitational-Wave Follow-up Pipeline",
    desc: "Building an AI-powered ranking pipeline for gravitational-wave telescope follow-up. Ingested the GLADE+ catalog (23M+ records) and curated an 11M-record dataset for feature engineering and graph-based ML ranking evaluated via Hit Rate@K and MRR.",
    tags: ["Python", "PostgreSQL", "Astropy", "HEALPix", "Graph ML", "Pandas"],
    outcome: "Helps telescopes decide where to look — ranking top galaxy candidates",
    link: "",
    type: "Astro AI Research",
    inProgress: true,
    mediumLink: "https://medium.com/@ManojDevarajulu/why-im-building-an-ai-to-decide-where-telescopes-should-look-2521890ee7fc",
    canvasId: "pc6",
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
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 md:py-6 flex justify-between items-center border-b transition-all duration-500 ${
          scrolled
            ? "border-border-custom bg-bg/85 backdrop-blur-xl shadow-lg"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="flex items-center gap-3">
          <a
            href="#home"
            className="nav-logo font-mono text-[13px] text-text-custom2 hover:text-text-custom tracking-wider font-light transition-colors duration-200"
          >
            MD_
          </a>
          <div className="flex items-center gap-2 border border-mono/20 px-2.5 py-0.5 rounded-full bg-mono/5 select-none">
            <div className="ticker-dot w-1.5 h-1.5 bg-mono rounded-full animate-ping" />
            <span className="font-mono text-[8px] text-mono uppercase tracking-widest font-normal">
              Open to Work
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-10 list-none items-center">
          {(["work", "about", "experience", "now", "stack", "education", "contact"] as const).map((section) => (
            <li key={section}>
              <a
                href={`#${section}`}
                className="font-mono text-[12px] text-text-custom2 hover:text-text-custom capitalize tracking-wide font-light transition-colors duration-200"
              >
                {section}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/Manoj_D_resume.docx"
              download="Manoj_D_resume.docx"
              className="font-mono text-[11px] text-mono border border-mono/30 px-3 py-1.5 hover:bg-mono hover:text-bg transition-all duration-300 uppercase tracking-wider flex items-center gap-1"
            >
              <Download size={12} />
              <span>Resume</span>
            </a>
          </li>
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-text-custom2 hover:text-text-custom transition-colors duration-200 z-50 cursor-pointer"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 bg-bg/97 backdrop-blur-2xl z-40 flex flex-col justify-center items-center gap-7 transition-all duration-500 ease-in-out md:hidden ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {["work", "about", "experience", "now", "stack", "education", "contact"].map((section) => (
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
          href="/Manoj_D_resume.docx"
          download="Manoj_D_resume.docx"
          onClick={() => setMenuOpen(false)}
          className="text-lg font-mono text-mono border border-mono/30 px-6 py-2.5 hover:bg-mono hover:text-bg transition-all duration-300 uppercase tracking-wider mt-2 flex items-center gap-2"
        >
          <Download size={16} />
          <span>Resume</span>
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
          <div className="hero-gradient absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_88%_4%,rgba(52,52,52,0.4)_0%,transparent_60%),radial-gradient(ellipse_55%_50%_at_4%_96%,rgba(16,185,129,0.08)_0%,transparent_55%),radial-gradient(ellipse_40%_40%_at_50%_50%,rgba(10,10,10,0.55)_0%,transparent_100%)]" />
          <div className="hero-vignette absolute inset-0 z-2 pointer-events-none bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_35%,rgba(10,10,10,0.75)_100%)]" />
          <div className="hero-bottom-fade absolute bottom-0 left-0 right-0 h-[45%] z-2 pointer-events-none bg-gradient-to-t from-bg via-bg/92 to-transparent" />

          {/* Background Watermark Text */}
          <div
            className="hero-bg-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-transparent whitespace-nowrap pointer-events-none select-none tracking-tight z-1"
            style={{
              fontSize: "clamp(80px, 16vw, 240px)",
              WebkitTextStroke: "1px rgba(232, 230, 224, 0.08)",
              color: "rgba(232, 230, 224, 0.01)",
              textShadow: "0 0 80px rgba(16,185,129,0.08), 0 0 160px rgba(16,185,129,0.03)",
            }}
          >
            MANOJ
          </div>

          {/* Hero Content Block */}
          <div className="max-w-4xl relative z-10 flex flex-col gap-4 md:gap-5">
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
                  WebkitTextStroke: "1.5px #10b981",
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
              Building{" "}
              <em className="font-serif italic font-normal text-text-custom">intelligent</em> systems.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="hero-sub text-[15px] text-text-custom2 leading-relaxed max-w-[560px]"
            >
              AI Developer &amp; Full-Stack Engineer with 2 years of experience building production AI
              applications for healthcare SaaS platforms — agentic systems, RAG pipelines, and LLM
              automation. Systems-first thinker. Open to Work.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="hero-actions flex gap-4 sm:gap-6 items-center flex-wrap"
            >
              <a
                href="#work"
                className="btn-primary bg-text-custom text-bg px-8 py-3.5 text-[13px] font-medium tracking-wide uppercase transition-all duration-200 hover:opacity-85 hover:-translate-y-[1px]"
              >
                View Work
              </a>
              <a
                href="/Manoj_D_resume.docx"
                download="Manoj_D_resume.docx"
                className="font-mono text-[12px] text-mono border border-mono/30 px-5 py-3 hover:bg-mono hover:text-bg transition-all duration-300 uppercase tracking-wider flex items-center gap-1.5"
              >
                Resume <Download size={13} />
              </a>
              <a
                href="#contact"
                className="btn-ghost font-mono text-[13px] text-text-custom2 hover:text-text-custom tracking-wide flex items-center gap-2 group/btn transition-colors duration-200"
              >
                Get in touch
                <span className="text-lg transition-transform duration-200 group-hover/btn:translate-x-1">
                  →
                </span>
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
                Open to Work — Available for full-time roles &amp; projects
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
                {item}&nbsp;
                <span aria-hidden="true" className="text-mono text-base font-normal">
                  ·
                </span>
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
                I think in <em className="font-serif italic font-normal text-text-custom2">systems,</em> not
                features.
              </h2>
              <div className="about-body text-text-custom2 text-[15px] leading-relaxed flex flex-col gap-5">
                <p>
                  Hi, I&apos;m Manoj D — an AI Developer &amp; Full-Stack Engineer with 2 years of
                  experience building production AI applications for healthcare SaaS platforms — including
                  agentic and multi-agent systems, LLM/NLP-powered automation, and Retrieval-Augmented
                  Generation (RAG) pipelines.
                </p>
                <p>
                  At <span className="text-text-custom font-normal">Cura</span> (Healthcare SaaS Startup), I
                  architect and build the core web platform serving patients and doctors across European
                  countries as sole technical lead, building RAG workflows and pgvector vector search. At{" "}
                  <span className="text-text-custom font-normal">Infinite Computer Solutions</span>, I
                  architected <span className="text-mono font-mono">Zen AI</span> — a production OCR + LLM
                  platform reducing healthcare document processing time by ~90% and saving ~400 hours/month.
                </p>
                <p>
                  I also engineer autonomous multi-agent research frameworks (LangChain / LangGraph),
                  developer copilots like Sentinel (dependency mapping &amp; blast-radius PR analysis), and
                  GravLens-MMA (AI galaxy ranking for gravitational-wave follow-up across 11M+ astronomical
                  records).
                </p>
              </div>
              <div className="stack-row flex flex-wrap gap-2 mt-4">
                {[
                  "Python",
                  "FastAPI",
                  "pgvector",
                  "LangGraph",
                  "LangChain",
                  "GPT-4o",
                  "Next.js",
                  "React",
                  "Docker",
                  "Azure",
                ].map((chip) => (
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
              <div className="border border-border-custom bg-bg2 p-8 flex flex-col gap-4">
                <span className="font-mono text-[10px] text-mono uppercase tracking-widest">
                  Quick Summary
                </span>
                <p className="text-text-custom2 font-light text-[14px] leading-relaxed">
                  Specializing in healthcare SaaS, agentic LLM workflows, and production RAG pipelines with
                  measurable operational savings and zero hallucinations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-border-custom bg-bg2 p-6 flex flex-col gap-1">
                  <span className="font-mono text-3xl font-light text-text-custom">2</span>
                  <span className="font-mono text-[9px] text-text-custom3 uppercase tracking-wider">
                    Years Production AI
                  </span>
                </div>
                <div className="border border-border-custom bg-bg2 p-6 flex flex-col gap-1">
                  <span className="font-mono text-3xl font-light text-mono">~400</span>
                  <span className="font-mono text-[9px] text-text-custom3 uppercase tracking-wider">
                    Hrs/Month Saved (Zen AI)
                  </span>
                </div>
                <div className="border border-border-custom bg-bg2 p-6 flex flex-col gap-1">
                  <span className="font-mono text-3xl font-light text-text-custom">8.88</span>
                  <span className="font-mono text-[9px] text-text-custom3 uppercase tracking-wider">
                    B.Tech CGPA (AI &amp; DS)
                  </span>
                </div>
                <div className="border border-border-custom bg-bg2 p-6 flex flex-col gap-1">
                  <span className="font-mono text-3xl font-light text-mono">11M+</span>
                  <span className="font-mono text-[9px] text-text-custom3 uppercase tracking-wider">
                    Records ML Dataset
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-border-custom m-0" />

        {/* ══════════════════════════════════════════
            FEATURED WORK SECTION
        ══════════════════════════════════════════ */}
        <section id="work" className="px-8 md:px-12 py-24 md:py-32">
          <div className="section-label font-mono text-[11px] text-mono tracking-[0.2em] uppercase mb-16 flex items-center gap-4">
            002 — Featured Work <div className="flex-grow h-[1px] bg-border-custom" />
          </div>

          <div className="projects-list flex flex-col gap-12">
            {projects.map((project) => (
              <ProjectCard key={project.num} project={project} onPreview={triggerPreview} />
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

          <div className="exp-grid grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">
            <div className="max-w-md">
              <h2 className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-4">
                Where I&apos;ve <em className="font-serif italic font-normal text-text-custom2">built</em>{" "}
                things.
              </h2>
              <p className="text-text-custom2 font-light text-[15px] leading-relaxed">
                From startup technical leadership to enterprise healthcare automation and full-stack
                development.
              </p>
            </div>

            <div className="exp-timeline flex flex-col w-full">
              {[
                {
                  role: "Full-Stack AI Engineer",
                  company: "Cura (Healthcare Startup) — Remote",
                  period: "Jul 2026 — Present (Part-Time, Equity-Based)",
                  desc: "Sole technical lead architecting the core web platform and clinical AI workflows.",
                  stats: [
                    { value: "Lead", label: "Architecture Owner" },
                    { value: "EU", label: "Clinician & Patient SaaS" },
                    { value: "pgvector", label: "Vector Search RAG" },
                  ],
                  bullets: [
                    "Architecting and building the core web platform for an AI healthcare SaaS startup serving patients and doctors across European countries, holding complete technical ownership of the domain.",
                    "Building RAG-based AI features and LLM-powered workflows using pgvector for vector search, integrated across the full stack to support clinical and patient-facing use cases.",
                    "Owning end-to-end technical decisions across frontend, backend, and AI system architecture as the sole technical lead.",
                  ],
                },
                {
                  role: "Software Engineer",
                  company: "Infinite Computer Solutions — Chennai, India",
                  period: "Oct 2024 — Present",
                  desc: "Enterprise AI & cloud engineering for healthcare document processing and data automation.",
                  stats: [
                    { value: "~90%", label: "Time Reduction" },
                    { value: "~400 hrs", label: "Saved / Month" },
                    { value: "10+", label: "ADF Pipelines" },
                  ],
                  bullets: [
                    "Architected Zen AI, a production OCR + LLM platform used to automate healthcare document processing workflows for operations teams, reducing processing time by ~90% and saving an estimated 400 hours/month.",
                    "Designed AI-powered workflow automation to handle daily document batches across secure ingestion, extraction, validation, and structured JSON data delivery.",
                    "Built structured prompt-engineering and validation workflows, debugging backend processing issues to improve extraction accuracy and significantly reduce parsing errors across diverse healthcare documents.",
                    "Led SSIS to Azure Data Factory migration testing across 10+ pipelines; automated claims testing using Selenium.",
                  ],
                },
                {
                  role: "Full-Stack Developer Intern",
                  company: "Inblue Infotech Pvt Ltd — Chennai, India",
                  period: "Jul 2024 — Sep 2024",
                  desc: "Full-stack web development and REST API integration.",
                  stats: [
                    { value: "Full-Stack", label: "React + Node.js" },
                    { value: "MongoDB", label: "Data Layer" },
                  ],
                  bullets: [
                    "Built full-stack features using React, Node.js, REST APIs, and MongoDB while collaborating closely with a team of 3 other interns.",
                    "Participated in code reviews, feature testing, and deployment workflows.",
                  ],
                },
              ].map((item, idx) => (
                <div
                  key={`${item.company}-${idx}`}
                  className="exp-item border-t border-border-custom py-10 flex flex-col gap-4 group hover:pl-2 transition-all duration-300"
                >
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <h3 className="exp-role text-xl font-normal text-text-custom tracking-tight">
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

                  {/* Stat Cards */}
                  {item.stats && (
                    <div className="flex gap-4 my-2 flex-wrap">
                      {item.stats.map((st) => (
                        <div
                          key={st.label}
                          className="border border-mono/20 bg-bg2 px-4 py-2 flex flex-col min-w-[125px]"
                        >
                          <span className="font-mono text-xl text-mono leading-none font-semibold">
                            {st.value}
                          </span>
                          <span className="font-mono text-[8px] text-text-custom2 uppercase tracking-widest mt-1.5">
                            {st.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <ul className="exp-bullets flex flex-col gap-2 list-none p-0">
                    {item.bullets.map((b, bIdx) => (
                      <li
                        key={`${item.company}-b-${bIdx}`}
                        className="text-text-custom3 font-light text-[13px] leading-relaxed pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-border-custom2"
                      >
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
                What I&apos;m <em className="font-serif italic font-normal text-text-custom2">doing</em>{" "}
                right now.
              </h2>
              <p className="text-text-custom2 font-light text-[14px] leading-relaxed">
                A live snapshot. Updated whenever something meaningful shifts.
              </p>
            </div>

            <div className="now-cards grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-border-custom border border-border-custom">
              {[
                {
                  label: "Building",
                  val: "Cura & Multi-Agent AI",
                  sub: "European healthcare SaaS platform with pgvector RAG & autonomous multi-agent deep research frameworks",
                },
                {
                  label: "Thinking About",
                  val: "LLM Reliability Patterns",
                  sub: "How multi-agent systems coordinate in production and eliminating hallucinations with deterministic schemas",
                },
                {
                  label: "Writing On",
                  val: "Medium",
                  sub: "Documenting the build process: AI for astrophysics, developer copilots, and systems thinking in public",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="now-card bg-bg p-8 hover:bg-bg2 transition-colors duration-300 flex flex-col gap-4"
                >
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
                No buzzword bingo. Only tools I&apos;ve shipped real production software with.
              </p>
              <p className="text-text-custom3 font-mono text-[11px] tracking-wide leading-relaxed">
                Core: Python + FastAPI for AI backends. Next.js + React for product layers. LangGraph &amp;
                LangChain for agentic workflows. Azure + Docker for cloud infrastructure. pgvector + PostgreSQL
                for vector search.
              </p>
            </div>

            {/* Custom SVG grid showing skill logos */}
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
                A background in AI &amp; Data Science gave me the theoretical foundations to build things that
                actually work in production — not just demo well.
              </p>
            </div>

            <div className="flex flex-col w-full">
              <div className="border-t border-border-custom py-8 flex flex-col gap-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <h3 className="text-lg font-normal text-text-custom tracking-tight">
                    B.Tech — Artificial Intelligence &amp; Data Science
                  </h3>
                  <span className="font-mono text-[10px] text-text-custom3 tracking-wider uppercase">
                    2020 — 2024
                  </span>
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
                  Specialized in machine learning, neural networks, NLP, and data engineering. Built the
                  foundation for everything from OCR pipelines to agentic AI systems.
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
                Let&apos;s <em className="font-serif italic font-normal text-text-custom2">build</em>
                <br />
                something.
              </h2>
              <p className="text-text-custom2 font-light text-[15px] leading-relaxed mb-6">
                Open to interesting conversations — AI systems, healthcare SaaS, developer tooling, startup
                collaborations, or full-time opportunities.
              </p>

              {/* Verified Links */}
              <div className="contact-links flex flex-col w-full">
                {[
                  { name: "GitHub", url: "https://github.com/ManojDevarajulu" },
                  { name: "LinkedIn", url: "https://www.linkedin.com/in/manoj-d-91b35b227/" },
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
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ))}
                <div className="border-b border-border-custom w-full" />
              </div>
            </div>

            <div className="flex flex-col gap-6 max-w-sm lg:self-start lg:mt-8">
              <a
                href="mailto:manojdevarajuluad2020@gmail.com"
                className="big-email text-2xl font-light text-text-custom hover:text-text-custom2 tracking-tight pb-6 border-b border-border-custom transition-colors duration-200"
              >
                manojdevarajuluad2020@gmail.com
              </a>
              <div className="availability flex items-center gap-2 select-none">
                <div className="avail-dot w-2 h-2 bg-mono rounded-full animate-ping" />
                <span className="font-mono text-[10px] text-mono uppercase tracking-wider">
                  Open to Work — Available for Full-Time Roles
                </span>
              </div>
              <p className="contact-note text-text-custom3 font-mono text-[11px] leading-relaxed mt-2 select-none">
                Phone: +91 6382455809 · Chennai, India · Responds within 24 hours
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
        <a
          href="#home"
          className="footer-back font-mono text-[10px] text-text-custom3 hover:text-text-custom2 uppercase tracking-wider transition-colors duration-200"
        >
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
