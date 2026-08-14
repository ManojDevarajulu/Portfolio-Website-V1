"use client";

import { useEffect, useRef } from "react";

export default function HeroStarfield() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    container.innerHTML = "";
    container.appendChild(canvas);

    const GAP = 12;
    const BASE_R = 1.0;
    const PADDING = 8;
    const INFLUENCE = 100;
    const PUSH = 14;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let count = 0;

    let baseX: Float32Array;
    let baseY: Float32Array;
    let posX: Float32Array;
    let posY: Float32Array;
    let dotRadius: Float32Array;
    let dotBaseAlpha: Float32Array;
    let dotType: Uint8Array; // 0=grid, 1=small star, 2=medium, 3=bright 4-pointed star
    let twinklePhase: Float32Array;
    let twinkleSpeed: Float32Array;
    let starRotation: Float32Array;

    let mouseX = -9999;
    let mouseY = -9999;
    let smoothX = -9999;
    let smoothY = -9999;
    let mouseInside = false;
    let animId = 0;

    interface ShootingStar {
      x: number;
      y: number;
      len: number;
      speed: number;
      size: number;
      angle: number;
      alpha: number;
      maxAlpha: number;
    }

    const shootingStars: ShootingStar[] = [];
    let nextShoot = 2.0;

    function drawStar4(
      cx: number,
      cy: number,
      outerR: number,
      innerR: number,
      alpha: number,
      rgb: string,
      rotation: number
    ) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.beginPath();
      for (let j = 0; j < 8; j++) {
        const r = j % 2 === 0 ? outerR : innerR;
        const angle = (j * Math.PI) / 4;
        if (j === 0) ctx.moveTo(r, 0);
        else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
      ctx.fill();
      ctx.restore();
    }

    function breatheAlpha(x: number, y: number, t: number) {
      const wave1 = Math.sin(x * 0.012 + y * 0.008 + t * 0.6) * 0.5 + 0.5;
      const wave2 = Math.sin(x * 0.007 - y * 0.011 + t * 0.4) * 0.5 + 0.5;
      return wave1 * 0.3 + wave2 * 0.2;
    }

    function buildGrid() {
      if (!container || !ctx) return;
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      if (W === 0 || H === 0) return;

      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);

      cols = Math.floor((W - PADDING * 2) / GAP) + 1;
      rows = Math.floor((H - PADDING * 2) / GAP) + 1;
      count = cols * rows;

      const offsetX = (W - (cols - 1) * GAP) / 2;
      const offsetY = (H - (rows - 1) * GAP) / 2;

      baseX = new Float32Array(count);
      baseY = new Float32Array(count);
      posX = new Float32Array(count);
      posY = new Float32Array(count);
      dotRadius = new Float32Array(count);
      dotBaseAlpha = new Float32Array(count);
      dotType = new Uint8Array(count);
      twinklePhase = new Float32Array(count);
      twinkleSpeed = new Float32Array(count);
      starRotation = new Float32Array(count);

      const brightThresh = 0.982;
      const medThresh = 0.945;
      const smallThresh = 0.88;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const x = offsetX + c * GAP;
          const y = offsetY + r * GAP;
          baseX[idx] = x;
          baseY[idx] = y;
          posX[idx] = x;
          posY[idx] = y;

          const roll = Math.random();
          if (roll > brightThresh) {
            dotType[idx] = 3;
            dotRadius[idx] = 2.8 + Math.random() * 1.4;
            dotBaseAlpha[idx] = 0.75 + Math.random() * 0.25;
            twinkleSpeed[idx] = 0.5 + Math.random() * 1.2;
          } else if (roll > medThresh) {
            dotType[idx] = 2;
            dotRadius[idx] = 1.8 + Math.random() * 0.8;
            dotBaseAlpha[idx] = 0.45 + Math.random() * 0.25;
            twinkleSpeed[idx] = 0.6 + Math.random() * 1.8;
          } else if (roll > smallThresh) {
            dotType[idx] = 1;
            dotRadius[idx] = 1.3 + Math.random() * 0.4;
            dotBaseAlpha[idx] = 0.24 + Math.random() * 0.16;
            twinkleSpeed[idx] = 0.8 + Math.random() * 2.2;
          } else {
            dotType[idx] = 0;
            dotRadius[idx] = BASE_R;
            dotBaseAlpha[idx] = 0.15 + Math.random() * 0.08;
            twinkleSpeed[idx] = 0;
          }

          if (dotType[idx] > 0) {
            baseX[idx] += (Math.random() - 0.5) * GAP * 0.8;
            baseY[idx] += (Math.random() - 0.5) * GAP * 0.8;
            posX[idx] = baseX[idx];
            posY[idx] = baseY[idx];
          }

          twinklePhase[idx] = Math.random() * Math.PI * 2;
          starRotation[idx] = Math.random() * Math.PI * 0.5;
        }
      }
    }

    buildGrid();

    function spawnShootingStar() {
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.2;
      shootingStars.push({
        x: Math.random() * W * 0.9,
        y: Math.random() * H * 0.4,
        len: 40 + Math.random() * 70,
        speed: 8 + Math.random() * 7,
        size: 1.2 + Math.random() * 1.0,
        angle,
        alpha: 0,
        maxAlpha: 0.7 + Math.random() * 0.3,
      });
    }

    function animate() {
      animId = requestAnimationFrame(animate);
      if (!ctx || W === 0 || H === 0) return;

      const t = performance.now() * 0.001;
      const isLight = document.documentElement.classList.contains("light");
      const rgb = isLight ? "24, 24, 27" : "255, 255, 255";

      if (mouseInside) {
        smoothX += (mouseX - smoothX) * 0.12;
        smoothY += (mouseY - smoothY) * 0.12;
      } else {
        smoothX += (-9999 - smoothX) * 0.05;
        smoothY += (-9999 - smoothY) * 0.05;
      }

      ctx.clearRect(0, 0, W, H);

      // Draw Starfield Grid
      for (let i = 0; i < count; i++) {
        const bx = baseX[i];
        const by = baseY[i];

        // Mouse push interaction
        const dx = bx - smoothX;
        const dy = by - smoothY;
        const distSq = dx * dx + dy * dy;
        let px = bx;
        let py = by;
        let mouseBoost = 0;

        if (distSq < INFLUENCE * INFLUENCE && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / INFLUENCE) * PUSH;
          px += (dx / dist) * force;
          py += (dy / dist) * force;
          mouseBoost = (1 - dist / INFLUENCE) * 0.5;
        }

        posX[i] = px;
        posY[i] = py;

        const type = dotType[i];
        const r = dotRadius[i];
        const baseA = dotBaseAlpha[i];
        const wave = breatheAlpha(bx, by, t);

        let alpha = Math.min(1, baseA + wave + mouseBoost);

        if (type === 3) {
          // Bright 4-point star
          const tw = Math.sin(t * twinkleSpeed[i] + twinklePhase[i]) * 0.35 + 0.65;
          const starAlpha = Math.min(1, alpha * tw * 1.3);
          drawStar4(px, py, r * 2.2, r * 0.45, starAlpha, rgb, starRotation[i] + t * 0.04);
        } else if (type === 2) {
          // Medium star with slight pulse
          const tw = Math.sin(t * twinkleSpeed[i] + twinklePhase[i]) * 0.3 + 0.7;
          ctx.beginPath();
          ctx.arc(px, py, r * tw, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, ${Math.min(1, alpha * tw)})`;
          ctx.fill();
        } else {
          // Regular dot or small star
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
          ctx.fill();
        }
      }

      // Shooting stars logic
      nextShoot -= 0.016;
      if (nextShoot <= 0) {
        spawnShootingStar();
        nextShoot = 3 + Math.random() * 5;
      }

      for (let s = shootingStars.length - 1; s >= 0; s--) {
        const star = shootingStars[s];
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.alpha = Math.min(star.maxAlpha, star.alpha + 0.06);

        const tailX = star.x - Math.cos(star.angle) * star.len;
        const tailY = star.y - Math.sin(star.angle) * star.len;

        const grad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
        grad.addColorStop(0, `rgba(${rgb}, 0)`);
        grad.addColorStop(1, `rgba(${rgb}, ${star.alpha})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = star.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.stroke();

        if (star.x > W + 100 || star.y > H + 100) {
          shootingStars.splice(s, 1);
        }
      }
    }

    animId = requestAnimationFrame(animate);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseInside = true;
    };

    const onMouseLeave = () => {
      mouseInside = false;
    };

    const onResize = () => {
      buildGrid();
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="hero-starfield"
      className="w-full h-full relative overflow-hidden"
      style={{ background: "var(--canvas-bg)" }}
    />
  );
}
