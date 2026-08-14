"use client";

import { useState } from "react";
import { ExternalLink, ChevronLeft, ChevronRight, Sparkles, ShieldCheck } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export interface ProjectShowcaseProps {
  title: string;
  badge?: string;
  tagline: string;
  description: string;
  metrics?: string;
  role?: string;
  slides: {
    title: string;
    description: string;
    type?: "gradient" | "code" | "diagram" | "metrics";
    accentColor?: string;
    details?: { label: string; value: string }[];
  }[];
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  articleUrl?: string;
}

export default function ProjectShowcaseCard({
  title,
  badge,
  tagline,
  description,
  metrics,
  role,
  slides,
  tags,
  liveUrl,
  githubUrl,
  articleUrl,
}: ProjectShowcaseProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const activeSlide = slides[currentSlide] || slides[0];

  return (
    <div className="project-showcase-card block bg-[var(--bg-secondary)] rounded-3xl p-2 sm:p-2.5 transition-all duration-300 border border-[var(--border-subtle)] hover:border-[var(--border-primary)] shadow-lg hover:shadow-2xl">
      {/* ── Slide Visual Container ── */}
      <div className="carousel-image-area relative w-full bg-[var(--bg-card)] rounded-[20px] overflow-hidden aspect-video flex flex-col justify-between p-5 sm:p-7 select-none border border-[var(--border-subtle)]">
        {/* Background dynamic glow / atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-30"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${
              activeSlide.accentColor || "rgba(100, 140, 255, 0.2)"
            } 0%, transparent 75%)`,
          }}
        />

        {/* Top bar inside preview */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[var(--text-secondary)] text-[11px] font-medium border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {activeSlide.title}
            </span>
          </div>

          {badge && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white/90 text-[11px] font-medium border border-white/10">
              <Sparkles className="w-3 h-3 text-amber-300" />
              {badge}
            </span>
          )}
        </div>

        {/* Middle Slide Content Area */}
        <div className="relative z-10 my-auto flex flex-col justify-center items-center text-center px-4 py-2">
          <p className="text-base sm:text-lg md:text-xl font-semibold text-[var(--text-primary)] tracking-tight max-w-[500px]">
            {activeSlide.description}
          </p>

          {activeSlide.details && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {activeSlide.details.map((d, i) => (
                <div
                  key={i}
                  className="px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/5 text-left"
                >
                  <span className="text-[10px] text-[var(--text-dimmed)] block font-mono uppercase tracking-wider">
                    {d.label}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)] font-mono">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Carousel Controls */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="text-[11px] font-mono text-[var(--text-dimmed)]">
            Slide {currentSlide + 1} / {slides.length}
          </div>

          {/* Nav pill */}
          <div className="carousel-nav flex items-center gap-1.5 rounded-full p-1 bg-black/40 backdrop-blur-md border border-white/10">
            <button
              onClick={prevSlide}
              className="carousel-prev-btn flex items-center justify-center rounded-full w-6 h-6 bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous slide"
              type="button"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 px-1">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  className="carousel-dot rounded-full transition-all duration-300 h-1.5"
                  style={{
                    width: idx === currentSlide ? "16px" : "6px",
                    backgroundColor: idx === currentSlide ? "#ffffff" : "rgba(255, 255, 255, 0.35)",
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  type="button"
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="carousel-next-btn flex items-center justify-center rounded-full w-6 h-6 bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next slide"
              type="button"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Card Meta Info ── */}
      <div className="p-3 sm:p-4 pt-3.5 space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
                {title}
              </h3>
              {role && (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  {role}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-dimmed)] font-mono">{tagline}</p>
          </div>

          {/* Arrow button */}
          {(liveUrl || githubUrl || articleUrl) && (
            <a
              href={liveUrl || githubUrl || articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="arrow-circle-btn flex-shrink-0 relative flex items-center justify-center w-8 h-8 rounded-full border border-[var(--border-primary)] mt-0.5 overflow-hidden group"
              aria-label={`Open ${title}`}
            >
              <span className="arrow-fill absolute inset-0 rounded-full" />
              <ExternalLink className="arrow-icon w-3.5 h-3.5 relative z-10 text-[var(--text-muted)] group-hover:text-[var(--bg-primary)] transition-colors" />
            </a>
          )}
        </div>

        <p className="text-sm text-[var(--text-muted)] leading-relaxed">{description}</p>

        {metrics && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{metrics}</span>
          </div>
        )}

        {/* Tags & Action Links */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[var(--bg-card)] text-[var(--text-dimmed)] border border-[var(--border-subtle)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-medium">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Code</span>
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Demo</span>
              </a>
            )}
            {articleUrl && (
              <a
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <span>Read Story</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
