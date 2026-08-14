"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ExternalLink, FileText } from "lucide-react";

export interface ProjectData {
  num: string;
  title: string;
  desc: string;
  tags: string[];
  outcome: string;
  link: string;
  type: string;
  isFeatured?: boolean;
  inProgress?: boolean;
  mediumLink?: string;
  githubLink?: string;
  canvasId: string;
}

interface ProjectCardProps {
  project: ProjectData;
  onPreview: (url: string, title: string) => void;
}

export function ProjectCanvas({ canvasId }: { canvasId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const c = el.getContext("2d");
    if (!c) return;

    let w = 0,
      h = 0,
      frame = 0;
    let animationId: number;

    function resize() {
      if (!el || !el.parentElement) return;
      w = el.width = el.parentElement.offsetWidth;
      h = el.height = el.parentElement.offsetHeight;
    }

    const observer = new ResizeObserver(resize);
    if (el.parentElement) {
      observer.observe(el.parentElement);
    }
    resize();

    // Cura Canvas: Healthcare AI Graph + Vector Search Pulse
    const drawP1 = (c: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      if (w <= 0 || h <= 0) return;
      c.clearRect(0, 0, w, h);
      c.fillStyle = "#0a0f0d";
      c.fillRect(0, 0, w, h);
      const cols = 8,
        rows = 4,
        nodes: { x: number; y: number; a: number }[] = [];
      const gx = w / cols,
        gy = h / rows;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          nodes.push({
            x: (i + 0.5) * gx + Math.sin(f * 0.008 + i * 1.3 + j) * 4,
            y: (j + 0.5) * gy + Math.cos(f * 0.006 + j * 1.7 + i) * 3,
            a: 0.08 + 0.04 * Math.sin(f * 0.02 + i + j * 2),
          });
        }
      }
      c.strokeStyle = "rgba(16,185,129,0.08)";
      c.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x,
            dy = nodes[i].y - nodes[j].y,
            d = Math.sqrt(dx * dx + dy * dy);
          if (d < gx * 1.6) {
            c.globalAlpha = 0.06 * (1 - d / (gx * 1.6));
            c.beginPath();
            c.moveTo(nodes[i].x, nodes[i].y);
            c.lineTo(nodes[j].x, nodes[j].y);
            c.stroke();
          }
        }
      }
      const cx = w * 0.55,
        cy = h * 0.45,
        r = 30 + 5 * Math.sin(f * 0.03);
      const gr = c.createRadialGradient(cx, cy, 0, cx, cy, r * 3);
      gr.addColorStop(0, "rgba(16,185,129,0.14)");
      gr.addColorStop(1, "transparent");
      c.globalAlpha = 1;
      c.fillStyle = gr;
      c.beginPath();
      c.arc(cx, cy, r * 3, 0, Math.PI * 2);
      c.fill();
      nodes.forEach((n, i) => {
        const highlighted = Math.sqrt((n.x - cx) ** 2 + (n.y - cy) ** 2) < 80;
        c.globalAlpha = highlighted ? 0.55 + 0.25 * Math.sin(f * 0.05 + i) : 0.1 + n.a;
        c.fillStyle = highlighted ? "#10b981" : "#c8c4b8";
        c.beginPath();
        c.arc(n.x, n.y, highlighted ? 2.5 : 1.2, 0, Math.PI * 2);
        c.fill();
      });
      c.globalAlpha = 1;
    };

    // Zen AI Canvas: Document Processing & OCR Scanning Beam
    const drawP2 = (c: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      if (w <= 0 || h <= 0) return;
      c.clearRect(0, 0, w, h);
      c.fillStyle = "#0e100e";
      c.fillRect(0, 0, w, h);
      const lineCount = 14;
      const lineH = h / (lineCount + 2);
      for (let i = 0; i < lineCount; i++) {
        const y = (i + 1.5) * lineH;
        const progress = (f * 0.6 + i * 18) % w;
        const lineW = 60 + 40 * Math.sin(i * 0.7);
        const alpha = 0.06 + 0.03 * Math.sin(f * 0.015 + i * 0.4);
        c.fillStyle = `rgba(200,196,184,${alpha})`;
        c.fillRect(40, y - 1, lineW + Math.sin(f * 0.01 + i) * 20, 1.5);
        c.fillRect(40 + lineW + 30, y - 1, lineW * 0.6, 1.5);
        const beam = ((f * 1.2 + i * 5) % (w + 60)) - 30;
        const beamAlpha = Math.max(0, 0.6 - Math.abs(beam - progress) / 60) * 0.35;
        c.fillStyle = `rgba(16,185,129,${beamAlpha})`;
        c.fillRect(beam, y - 6, 3, 12);
      }
      const scanY = (f * 0.8) % h;
      const sGrad = c.createLinearGradient(0, scanY - 4, 0, scanY + 4);
      sGrad.addColorStop(0, "transparent");
      sGrad.addColorStop(0.5, "rgba(16,185,129,0.2)");
      sGrad.addColorStop(1, "transparent");
      c.fillStyle = sGrad;
      c.fillRect(0, scanY - 4, w, 8);
      const labels = ["PHI", "DOC", "REF", "OCR"];
      labels.forEach((l, i) => {
        const lx = w - 80,
          ly = 30 + i * 40;
        const pulse = 0.3 + 0.2 * Math.sin(f * 0.04 + i * 1.1);
        c.globalAlpha = pulse;
        c.strokeStyle = "#10b981";
        c.lineWidth = 0.8;
        c.strokeRect(lx, ly, 56, 18);
        c.fillStyle = "rgba(16,185,129,0.08)";
        c.fillRect(lx, ly, 56, 18);
        c.fillStyle = "#10b981";
        c.font = "9px DM Mono,monospace";
        c.textAlign = "center";
        c.fillText(l, lx + 28, ly + 12);
      });
      c.globalAlpha = 1;
    };

    // Multi-Agent Research Orchestrator Canvas: Dynamic Autonomous Nodes
    const drawP3 = (c: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      if (w <= 0 || h <= 0) return;
      c.clearRect(0, 0, w, h);
      c.fillStyle = "#0c0e12";
      c.fillRect(0, 0, w, h);
      const cx = w / 2,
        cy = h / 2;
      const roles = [
        { label: "Researcher", angle: 0 + f * 0.005, color: "#3b82f6" },
        { label: "Critic", angle: (2 * Math.PI) / 3 + f * 0.005, color: "#f59e0b" },
        { label: "Synthesizer", angle: (4 * Math.PI) / 3 + f * 0.005, color: "#10b981" },
      ];
      const rad = Math.min(w, h) * 0.32;

      // Central Hub
      c.strokeStyle = "rgba(16,185,129,0.2)";
      c.lineWidth = 1;
      c.beginPath();
      c.arc(cx, cy, 14 + Math.sin(f * 0.04) * 2, 0, Math.PI * 2);
      c.stroke();
      c.fillStyle = "rgba(16,185,129,0.15)";
      c.fill();
      c.fillStyle = "#10b981";
      c.font = "9px DM Mono,monospace";
      c.textAlign = "center";
      c.fillText("ORCH", cx, cy + 3);

      roles.forEach((r) => {
        const nx = cx + rad * Math.cos(r.angle);
        const ny = cy + rad * Math.sin(r.angle);

        // Connector line with pulse packet
        c.strokeStyle = "rgba(200,196,184,0.15)";
        c.beginPath();
        c.moveTo(cx, cy);
        c.lineTo(nx, ny);
        c.stroke();

        const packetT = (f * 0.02) % 1;
        const px = cx + (nx - cx) * packetT;
        const py = cy + (ny - cy) * packetT;
        c.fillStyle = r.color;
        c.beginPath();
        c.arc(px, py, 2, 0, Math.PI * 2);
        c.fill();

        // Node Circle
        c.fillStyle = "rgba(15,23,42,0.9)";
        c.strokeStyle = r.color;
        c.lineWidth = 1.2;
        c.beginPath();
        c.arc(nx, ny, 16, 0, Math.PI * 2);
        c.fill();
        c.stroke();

        c.fillStyle = r.color;
        c.font = "8px DM Mono,monospace";
        c.fillText(r.label.substring(0, 4).toUpperCase(), nx, ny + 3);
      });
    };

    // Sentinel Canvas: Blast-Radius & Dependency AST
    const drawP4 = (c: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      if (w <= 0 || h <= 0) return;
      c.clearRect(0, 0, w, h);
      c.fillStyle = "#0e0e10";
      c.fillRect(0, 0, w, h);
      const cx = w / 2,
        cy = h / 2;
      const numCit = 12;
      const radius = Math.min(w, h) * 0.34;
      for (let r = 0; r < 3; r++) {
        const pr = radius * 0.3 + radius * 0.7 * ((f * 0.012 + r * 0.33) % 1);
        const pa = 0.15 * (1 - pr / radius);
        c.globalAlpha = Math.max(0, pa);
        c.strokeStyle = "rgba(16,185,129,0.4)";
        c.lineWidth = 0.6;
        c.beginPath();
        c.arc(cx, cy, pr, 0, Math.PI * 2);
        c.stroke();
      }
      for (let i = 0; i < numCit; i++) {
        const angle = i * ((Math.PI * 2) / numCit) + f * 0.003;
        const nx = cx + radius * Math.cos(angle),
          ny = cy + radius * Math.sin(angle);
        const lineProgress = (f * 0.02 + i * 0.7) % 1;
        c.globalAlpha = 0.07;
        c.strokeStyle = "#c8c4b8";
        c.lineWidth = 0.5;
        c.beginPath();
        c.moveTo(cx, cy);
        c.lineTo(nx, ny);
        c.stroke();
        const px = cx + (nx - cx) * lineProgress,
          py = cy + (ny - cy) * lineProgress;
        c.globalAlpha = 0.5 * (1 - Math.abs(lineProgress - 0.5) * 2);
        c.fillStyle = "#10b981";
        c.beginPath();
        c.arc(px, py, 1.5, 0, Math.PI * 2);
        c.fill();
        c.globalAlpha = 0.2 + 0.08 * Math.sin(f * 0.04 + i);
        c.fillStyle = "#c8c4b8";
        c.beginPath();
        c.arc(nx, ny, 2, 0, Math.PI * 2);
        c.fill();
      }
      const ar = 8 + 2 * Math.sin(f * 0.05);
      const ag = c.createRadialGradient(cx, cy, 0, cx, cy, ar * 2);
      ag.addColorStop(0, "rgba(16,185,129,0.5)");
      ag.addColorStop(1, "transparent");
      c.globalAlpha = 1;
      c.fillStyle = ag;
      c.beginPath();
      c.arc(cx, cy, ar * 2, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "rgba(16,185,129,0.8)";
      c.beginPath();
      c.arc(cx, cy, ar * 0.6, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;
    };

    // Medical Referral Extractor Canvas: Multimodal Vision Scanner
    const drawP5 = (c: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      if (w <= 0 || h <= 0) return;
      c.clearRect(0, 0, w, h);
      c.fillStyle = "#0c100e";
      c.fillRect(0, 0, w, h);

      // Draw bounding boxes of medical extracted fields
      const boxes = [
        { x: 30, y: 30, bw: 120, bh: 35, label: "PATIENT_NAME" },
        { x: 170, y: 30, bw: 100, bh: 35, label: "DOB_SEX" },
        { x: 30, y: 80, bw: 180, bh: 45, label: "CLINICAL_ICD10" },
        { x: 230, y: 80, bw: 90, bh: 45, label: "NPI_REF" },
      ];

      boxes.forEach((b, i) => {
        const pulse = 0.3 + 0.2 * Math.sin(f * 0.03 + i);
        c.strokeStyle = `rgba(16,185,129,${pulse})`;
        c.lineWidth = 1;
        c.strokeRect(b.x, b.y, b.bw, b.bh);
        c.fillStyle = "rgba(16,185,129,0.05)";
        c.fillRect(b.x, b.y, b.bw, b.bh);
        c.fillStyle = "#10b981";
        c.font = "8px DM Mono,monospace";
        c.fillText(b.label, b.x + 6, b.y + 12);
      });

      // Vision AI Reticle in corner
      const rx = w - 60,
        ry = h - 50;
      c.strokeStyle = "rgba(245,158,11,0.6)";
      c.beginPath();
      c.arc(rx, ry, 20 + Math.sin(f * 0.05) * 3, 0, Math.PI * 2);
      c.stroke();
      c.fillStyle = "#f59e0b";
      c.font = "8px DM Mono,monospace";
      c.fillText("GPT-4o", rx - 14, ry + 3);
    };

    // GravLens-MMA Canvas: Celestial Galaxy Coordinate Map
    const drawP6 = (c: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      if (w <= 0 || h <= 0) return;
      c.clearRect(0, 0, w, h);
      c.fillStyle = "#080b10";
      c.fillRect(0, 0, w, h);

      // Celestial grid
      c.strokeStyle = "rgba(200,196,184,0.06)";
      c.lineWidth = 0.5;
      for (let x = 0; x < w; x += 40) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, h);
        c.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(w, y);
        c.stroke();
      }

      // Gravitational Wave localized ellipse error region
      const ex = w * 0.5,
        ey = h * 0.5;
      c.strokeStyle = "rgba(139,92,246,0.6)";
      c.lineWidth = 1.2;
      c.beginPath();
      c.ellipse(ex, ey, 70, 35, (f * 0.002) % (Math.PI * 2), 0, Math.PI * 2);
      c.stroke();

      // Top Ranked Galaxies
      const galaxies = [
        { ra: ex - 20, dec: ey - 10, rank: "1", score: "0.94" },
        { ra: ex + 25, dec: ey + 8, rank: "2", score: "0.89" },
        { ra: ex + 5, dec: ey - 18, rank: "3", score: "0.78" },
      ];

      galaxies.forEach((g) => {
        c.fillStyle = "#a78bfa";
        c.beginPath();
        c.arc(g.ra, g.dec, 3, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "#10b981";
        c.font = "8px DM Mono,monospace";
        c.fillText(`#${g.rank} (${g.score})`, g.ra + 6, g.dec + 2);
      });
    };

    function loop() {
      frame++;
      if (canvasId === "pc1") drawP1(c!, w, h, frame);
      else if (canvasId === "pc2") drawP2(c!, w, h, frame);
      else if (canvasId === "pc3") drawP3(c!, w, h, frame);
      else if (canvasId === "pc4") drawP4(c!, w, h, frame);
      else if (canvasId === "pc5") drawP5(c!, w, h, frame);
      else if (canvasId === "pc6") drawP6(c!, w, h, frame);
      animationId = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [canvasId]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

export default function ProjectCard({ project, onPreview }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="project-card border border-border-custom bg-bg hover:border-border-custom2 transition-all duration-300 group overflow-hidden select-none flex flex-col rounded-none"
    >
      {/* Visual Header Canvas */}
      <div className="proj-hero w-full h-[190px] sm:h-[210px] relative overflow-hidden flex items-end justify-between p-6">
        <ProjectCanvas canvasId={project.canvasId} />
        <div className="proj-hero-overlay absolute inset-0 bg-gradient-to-tr from-bg/95 via-bg/40 to-transparent z-1" />
        <div className="proj-hero-bottom absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-t from-bg to-transparent z-1" />

        {project.isFeatured && (
          <span className="proj-hero-badge absolute top-5 left-6 sm:left-8 z-2 font-mono text-[9px] text-mono tracking-[0.18em] uppercase border border-mono/30 bg-bg/85 px-3 py-1">
            Featured
          </span>
        )}
        {project.inProgress && (
          <span className="absolute top-5 left-6 sm:left-8 z-2 font-mono text-[9px] tracking-[0.18em] uppercase border border-amber-500/40 bg-amber-500/10 text-amber-400 px-3 py-1">
            In Progress
          </span>
        )}

        <span
          className="proj-hero-num font-mono text-7xl md:text-8xl font-light text-transparent select-none relative z-2 tracking-tighter"
          style={{ WebkitTextStroke: "1px rgba(232, 230, 224, 0.12)", lineHeight: 1 }}
        >
          {project.num}
        </span>
        <span className="proj-hero-type font-mono text-[10px] text-mono tracking-[0.18em] uppercase relative z-2 mb-2">
          {project.type}
        </span>
      </div>

      {/* Card Info and triggers */}
      <div className="proj-body p-6 sm:p-8 md:p-10 pt-4 flex-grow grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start relative z-10">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h3 className="proj-title font-sans text-xl md:text-2xl font-light tracking-tight text-text-custom mb-3">
              {project.title}
            </h3>
            <p className="proj-desc text-text-custom2 font-light text-[14px] leading-relaxed max-w-[550px] mb-5">
              {project.desc}
            </p>
            <div className="proj-tags flex flex-wrap gap-2 mb-4">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="tag font-mono text-[10px] font-light text-text-custom3 border border-border-custom px-3 py-1 uppercase tracking-wider group-hover:text-text-custom2 group-hover:border-border-custom2 transition-all duration-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Outcome */}
          <div className="proj-outcome font-mono text-[10px] text-mono tracking-wider pt-4 border-t border-border-custom flex items-center gap-2 transition-all duration-500">
            <span className="text-mono">→</span> {project.outcome}
          </div>
        </div>

        {/* Actions block */}
        <div className="flex flex-col gap-2.5 self-end md:self-start md:mt-2 text-right">
          {project.mediumLink && (
            <a
              href={project.mediumLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-mono hover:text-text-custom border-b border-mono hover:border-text-custom transition-all duration-200 pb-0.5 inline-flex items-center gap-1 self-end"
            >
              [ Read on Medium ↗ ]
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-text-custom2 hover:text-text-custom border-b border-border-custom hover:border-text-custom transition-all duration-200 pb-0.5 inline-flex items-center gap-1 self-end"
            >
              [ View GitHub ↗ ]
            </a>
          )}
          {project.link && project.link !== "#" && (
            <>
              <button
                onClick={() => onPreview(project.link, project.title)}
                className="font-mono text-[11px] text-mono hover:text-text-custom border-b border-mono hover:border-text-custom transition-all duration-200 cursor-pointer pb-0.5 inline-flex items-center gap-1 self-end"
              >
                [ Interactive Preview ↗ ]
              </button>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-text-custom2 hover:text-text-custom border-b border-border-custom hover:border-text-custom transition-all duration-200 pb-0.5 inline-flex items-center gap-1 self-end"
              >
                [ Open Direct Link ↗ ]
              </a>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
