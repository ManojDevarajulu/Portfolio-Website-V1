"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Briefcase,
  Layers,
  Sparkles,
  Mail,
  Moon,
  Sun,
  Laptop,
  Check,
  Star,
  Settings as SettingsIcon,
} from "lucide-react";

interface FloatingDockProps {
  onCopyEmail?: () => void;
}

export default function FloatingDock({ onCopyEmail }: FloatingDockProps) {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Track scroll position and active section
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? Math.min(1, Math.max(0, currentScroll / totalScroll)) : 0;
      setScrollProgress(progress);

      const sections = ["home", "work", "experience", "skills", "education"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 0) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme switcher handler
  const handleThemeChange = (newTheme: "dark" | "light" | "system") => {
    setTheme(newTheme);
    const root = document.documentElement;
    if (newTheme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else if (newTheme === "dark") {
      root.classList.remove("light");
      root.classList.add("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
      root.classList.toggle("light", !prefersDark);
    }
  };

  const copyEmail = () => {
    const email = "manojdevarajuluad2020@gmail.com";
    navigator.clipboard.writeText(email);
    setToastMessage("Email copied to clipboard!");
    if (onCopyEmail) onCopyEmail();
    setTimeout(() => setToastMessage(null), 2500);
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "#home" },
    { id: "work", label: "Work", icon: Briefcase, href: "#work" },
    { id: "experience", label: "Journey", icon: Layers, href: "#experience" },
    { id: "skills", label: "Skills", icon: Sparkles, href: "#skills" },
    { id: "contact", label: "Contact", icon: Mail, href: "mailto:manojdevarajuluad2020@gmail.com" },
  ];

  const circumference = 2 * Math.PI * 11; // r=11
  const strokeDashoffset = circumference - scrollProgress * circumference;
  const isComplete = scrollProgress >= 0.96;

  return (
    <>
      {/* Toast Notification */}
      <div
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--dock-bg)] border border-[var(--border-primary)] shadow-2xl backdrop-blur-xl transition-all duration-300 pointer-events-none ${
          toastMessage
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-3 scale-95 pointer-events-none"
        }`}
      >
        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="text-xs font-medium text-[var(--text-primary)] font-sans whitespace-nowrap">
          {toastMessage}
        </span>
      </div>

      {/* Floating Bottom Dock */}
      <nav
        aria-label="Floating Navigation Dock"
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300"
      >
        <div className="dock-container bg-[var(--dock-bg)] border border-[var(--border-primary)] rounded-[24px] shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col">
          {/* Expandable Settings Drawer */}
          {settingsOpen && (
            <div className="p-3.5 border-b border-[var(--border-subtle)] space-y-3 transition-all duration-300 bg-[var(--bg-secondary)]/50">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] font-mono text-[var(--text-dimmed)] uppercase tracking-wider">
                  Appearance
                </span>
                <div className="flex items-center gap-1 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-subtle)]">
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                      theme === "dark"
                        ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] font-semibold shadow-sm"
                        : "text-[var(--text-dimmed)] hover:text-[var(--text-secondary)]"
                    }`}
                    type="button"
                    title="Dark Mode"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                      theme === "light"
                        ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] font-semibold shadow-sm"
                        : "text-[var(--text-dimmed)] hover:text-[var(--text-secondary)]"
                    }`}
                    type="button"
                    title="Light Mode"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleThemeChange("system")}
                    className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                      theme === "system"
                        ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] font-semibold shadow-sm"
                        : "text-[var(--text-dimmed)] hover:text-[var(--text-secondary)]"
                    }`}
                    type="button"
                    title="System Default"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-[var(--text-dimmed)] uppercase tracking-wider">
                  Quick Action
                </span>
                <button
                  onClick={copyEmail}
                  className="px-2.5 py-1 text-xs rounded-lg bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors flex items-center gap-1.5"
                  type="button"
                >
                  <Mail className="w-3 h-3" />
                  <span>Copy Email</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Navigation Bar */}
          <div className="flex items-center gap-1 p-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const isExternal = item.href.startsWith("mailto:");

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`dock-item ${isActive && !isExternal ? "is-active" : ""}`}
                >
                  <span className="dock-icon">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="dock-label">{item.label}</span>
                </a>
              );
            })}

            {/* Separator */}
            <div className="w-[1px] h-5 bg-[var(--border-subtle)] mx-1 shrink-0" />

            {/* Scroll Progress Ring */}
            <div
              className="relative w-8 h-8 flex items-center justify-center shrink-0 select-none cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              title={`Page read: ${Math.round(scrollProgress * 100)}% (Click to scroll top)`}
            >
              {isComplete ? (
                <Star className="w-4 h-4 text-amber-300 animate-pulse fill-amber-300" />
              ) : (
                <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
                  <circle
                    cx="14"
                    cy="14"
                    r="11"
                    className="stroke-[var(--progress-ring-bg)] fill-none"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="14"
                    cy="14"
                    r="11"
                    className="stroke-[var(--progress-ring-fill)] fill-none transition-all duration-150"
                    strokeWidth="2.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>

            {/* Settings Toggle */}
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`p-2 rounded-xl text-[var(--text-dimmed)] hover:text-[var(--text-primary)] hover:bg-[var(--dock-item-hover)] transition-all ${
                settingsOpen ? "text-[var(--text-primary)] bg-[var(--dock-item-hover)] rotate-45" : ""
              }`}
              aria-label="Toggle Preferences"
              type="button"
            >
              <SettingsIcon className="w-4 h-4 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
