"use client";

import { useEffect, useRef } from "react";
import { buildGlyphSheet, RAMP } from "@/lib/glyphs";

const COLORS = {
  accent: "242,153,74",
  cream: "233,224,200",
  grey: "150,158,165",
  white: "255,255,255",
} as const;
type Tint = keyof typeof COLORS;

/** Cursor pushes characters aside. */
const MOUSE_REPEL = true;
/** Characters drift apart as the hero scrolls away. */
const SCROLL_SCATTER = true;
/** Glyphs crossing the first name line are dimmed so the name stays readable. */
const NAME_DIM = 0.4;

const ALPHA_STEPS = 20;
const PARTICLE_STYLE: Record<"cream" | "white", string[]> = {
  cream: Array.from({ length: ALPHA_STEPS + 1 }, (_, q) => `rgba(${COLORS.cream},${(q / ALPHA_STEPS).toFixed(2)})`),
  white: Array.from({ length: ALPHA_STEPS + 1 }, (_, q) => `rgba(${COLORS.white},${(q / ALPHA_STEPS).toFixed(2)})`),
};

type Cell = {
  x: number;
  y: number;
  b: number; // brightness 0..1
  g: number; // current glyph index
  base: number; // resting glyph index
  tint: Tint;
  ox: number; // animated offset
  oy: number;
  flicker: number;
  delay: number; // intro reveal delay in ms
  ux: number; // unit vector away from the face centre
  uy: number;
  scatter: number;
};

type Particle = { x: number; y: number; vx: number; vy: number; size: number; phase: number; speed: number };

type Props = {
  src: string;
  label: string;
};

/**
 * Renders a portrait as a field of code characters on a canvas.
 * The canvas fills its parent (the hero section); on phones the portrait sits under the copy,
 * so the component also sizes the hero to fit it.
 */
export function GlyphPortrait({ src, label }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !hero || !ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionQuery.matches;

    let cells: Cell[] = [];
    let particles: Particle[] = [];
    let atlas: Partial<Record<Tint, HTMLCanvasElement>> = {};
    let atlasDpr = 1;
    let width = 0;
    let height = 0;
    let cellW = 8;
    let cellH = 11;
    let mobile = false;
    let built = false;
    let running = false;
    let inView = true;
    let rafId = 0;
    let startTime = performance.now();
    let pointerX = -9999;
    let pointerY = -9999;
    let lastWidth = window.innerWidth;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let lastDraw = 0;
    let disposed = false;
    let idleHandle: number | undefined;
    let idleFallback: ReturnType<typeof setTimeout> | undefined;
    // Area of the first name line, where crossing glyphs are dimmed.
    let nameRect = { left: 0, top: 0, right: 0, bottom: 0 };

    const img = new Image();
    img.decoding = "async";

    function buildAtlas(dpr: number) {
      atlasDpr = dpr;
      atlas = {};
      (Object.keys(COLORS) as Tint[]).forEach((tint) => {
        const sheet = buildGlyphSheet(COLORS[tint], cellW, cellH, dpr);
        if (sheet) atlas[tint] = sheet;
      });
    }

    function build() {
      if (!canvas || !hero || !ctx || !img.naturalWidth) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = hero.clientWidth;
      mobile = width <= 760;

      // On phones the portrait sits below the copy, so grow the hero to fit both.
      let mobileTop = 0;
      if (mobile) {
        const copy = hero.querySelector<HTMLElement>(".hero-copy");
        mobileTop = copy ? copy.getBoundingClientRect().bottom - hero.getBoundingClientRect().top + 16 : 0;
        const aspect = img.naturalWidth / img.naturalHeight;
        const portraitH = Math.min((width * 1.05) / aspect, 560);
        hero.style.height = `${Math.round(mobileTop + portraitH)}px`;
      } else {
        hero.style.height = "";
      }
      height = hero.clientHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cellW = mobile ? 5 : 6;
      cellH = mobile ? 7 : 9;
      buildAtlas(dpr);

      const aspect = img.naturalWidth / img.naturalHeight;
      let boxH = mobile ? height - mobileTop : height * 0.95;
      let boxW = boxH * aspect;
      if (!mobile && boxW > width * 0.52) {
        boxW = width * 0.52;
        boxH = boxW / aspect;
      }
      const boxX = mobile ? (width - boxW) / 2 : width * 0.68 - boxW / 2;
      const boxY = height - boxH;
      const centreX = boxX + boxW / 2;
      const centreY = boxY + boxH * 0.35;
      const heroTop = hero.getBoundingClientRect().top;
      const heroLeft = hero.getBoundingClientRect().left;
      const firstLine = hero.querySelector<HTMLElement>(".name-line");
      if (firstLine) {
        const r = firstLine.getBoundingClientRect();
        nameRect = { left: r.left - heroLeft, top: r.top - heroTop, right: r.right - heroLeft, bottom: r.bottom - heroTop };
      }

      const cols = Math.max(1, Math.floor(boxW / cellW));
      const rows = Math.max(1, Math.floor(boxH / cellH));
      const sample = document.createElement("canvas");
      sample.width = cols;
      sample.height = rows;
      const sctx = sample.getContext("2d", { willReadFrequently: true });
      if (!sctx) return;
      sctx.imageSmoothingQuality = "high";
      sctx.drawImage(img, 0, 0, cols, rows);
      const data = sctx.getImageData(0, 0, cols, rows).data;

      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + c) * 4;
          const alpha = data[i + 3] / 255;
          if (alpha < 0.35) continue;
          const luminance = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
          const b = Math.min(1, Math.pow(luminance, 1.6) * alpha);
          if (b < 0.07) continue;
          const g = Math.min(RAMP.length - 1, Math.floor(b * RAMP.length));
          const jitter = b + (Math.random() - 0.5) * 0.14;
          const tint: Tint = jitter > 0.62 ? "accent" : jitter > 0.34 ? "cream" : "grey";
          const x = boxX + c * cellW;
          const y = boxY + r * cellH;
          const dx = x - centreX;
          const dy = y - centreY;
          const dist = Math.hypot(dx, dy) || 1;
          cells.push({
            x,
            y,
            b,
            g,
            base: g,
            tint,
            ox: 0,
            oy: 0,
            flicker: 0,
            delay: Math.random() * 900 + dist * 0.6,
            ux: dx / dist,
            uy: dy / dist,
            scatter: 0.6 + Math.random() * 0.8,
          });
        }
      }

      const count = mobile ? 45 : 90;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(0.05 + Math.random() * 0.18),
        size: Math.random() < 0.06 ? 2.6 : 0.8 + Math.random() * 1.1,
        phase: Math.random() * 6.3,
        speed: 0.0008 + Math.random() * 0.002,
      }));
      built = true;
    }

    function draw(t: number, still: boolean) {
      if (!built || !ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Ambient drifting particles.
      for (const p of particles) {
        if (!still) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -4) {
            p.y = height + 4;
            p.x = Math.random() * width;
          }
          if (p.x < -4) p.x = width + 4;
          if (p.x > width + 4) p.x = -4;
        }
        const a = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(t * p.speed + p.phase));
        ctx.fillStyle = p.size > 2 ? PARTICLE_STYLE.white[Math.round(a * 20)] : PARTICLE_STYLE.cream[Math.round(a * 14)];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2 + 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      const gw = Math.ceil(cellW * atlasDpr);
      const gh = Math.ceil(cellH * atlasDpr);
      const elapsed = t - startTime;
      const scroll = SCROLL_SCATTER ? Math.min(1, Math.max(0, window.scrollY / (height * 0.9))) : 0;
      const scroll2 = scroll * scroll;
      const fade = 1 - scroll * 0.85;
      const radius = mobile ? 70 : 110;
      const radius2 = radius * radius;
      const repel = MOUSE_REPEL && !still;

      for (const c of cells) {
        let g = c.g;
        let tx = 0;
        let ty = 0;
        let boost = 0;

        if (!still) {
          if (Math.random() < 0.01) {
            c.flicker = 1;
            c.g = Math.max(0, Math.min(RAMP.length - 1, c.base + Math.round((Math.random() - 0.5) * 3)));
          }
          c.flicker *= 0.93;
          if (c.flicker < 0.08 && c.g !== c.base && Math.random() < 0.04) c.g = c.base;
          g = c.g;

          // Intro: characters scramble briefly, then settle.
          if (elapsed < c.delay + 500) {
            if (elapsed < c.delay) continue;
            g = Math.floor(Math.random() * RAMP.length);
          }

          if (repel) {
            const dx = c.x - pointerX;
            const dy = c.y - pointerY;
            const d2 = dx * dx + dy * dy;
            if (d2 < radius2) {
              const d = Math.sqrt(d2) || 1;
              const f = 1 - d / radius;
              tx = (dx / d) * f * f * 34;
              ty = (dy / d) * f * f * 34;
              boost = f;
            }
          }
          if (scroll > 0) {
            const k = scroll2 * (220 + 380 * c.scatter);
            tx += c.ux * k;
            ty += c.uy * k - scroll * 60;
          }
          c.ox += (tx - c.ox) * 0.16;
          c.oy += (ty - c.oy) * 0.16;
        }

        const intro = still ? 1 : Math.min(1, (elapsed - c.delay) / 500);
        const x = c.x + c.ox;
        const y = c.y + c.oy;
        const overName = x > nameRect.left && x < nameRect.right && y > nameRect.top && y < nameRect.bottom;
        const a =
          (0.06 + 0.94 * Math.pow(c.b, 0.8)) * (1 + c.flicker * 0.7 + boost * 0.9) * intro * fade * (overName ? NAME_DIM : 1);
        let tint: Tint = c.tint;
        if (c.flicker > 0.85 && c.b > 0.55 && Math.random() < 0.25) {
          tint = "white";
          g = RAMP.length - 1;
        }
        if (boost > 0.35) tint = "accent";
        const sheet = atlas[tint];
        if (!sheet) continue;
        ctx.globalAlpha = Math.min(1, a);
        ctx.drawImage(sheet, g * gw, 0, gw, gh, x, y, gw / atlasDpr, gh / atlasDpr);
      }
      ctx.globalAlpha = 1;
    }

    function loop(t: number) {
      if (!running) return;
      // Phones redraw at ~30fps; the motion reads the same and costs half the main-thread time.
      if (!mobile || t - lastDraw >= 30) {
        lastDraw = t;
        draw(t, false);
      }
      rafId = requestAnimationFrame(loop);
    }
    function start() {
      if (running || reduced || !inView || !built) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }
    function render() {
      if (reduced) draw(performance.now(), true);
      else start();
    }

    const begin = () => {
      if (disposed) return;
      build();
      startTime = performance.now();
      render();
      // The phone layout depends on the copy height, which can shift once web fonts load.
      document.fonts?.ready.then(() => {
        if (!disposed && mobile && built) {
          build();
          if (reduced) draw(performance.now(), true);
        }
      });
    };
    // Build the glyph field only after the page has loaded and the main thread is idle,
    // so the portrait never competes with first paint or hydration.
    const scheduleBegin = () => {
      // Safari has no requestIdleCallback.
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(begin, { timeout: 1500 });
      } else {
        idleFallback = setTimeout(begin, 200);
      }
    };
    const onWindowLoad = () => scheduleBegin();
    img.onload = () => {
      if (document.readyState === "complete") scheduleBegin();
      else window.addEventListener("load", onWindowLoad, { once: true });
    };
    img.src = src;

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    observer.observe(hero);

    const onPointerMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
    };
    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave);

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Mobile browsers fire resize when the address bar shows or hides; ignore height-only changes.
        if (window.innerWidth === lastWidth && mobile) return;
        lastWidth = window.innerWidth;
        if (!img.complete) return;
        build();
        if (reduced) draw(performance.now(), true);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    const onMotionChange = (e: MediaQueryListEvent) => {
      reduced = e.matches;
      if (reduced) {
        stop();
        draw(performance.now(), true);
      } else {
        start();
      }
    };
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      disposed = true;
      stop();
      window.removeEventListener("load", onWindowLoad);
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
      clearTimeout(idleFallback);
      clearTimeout(resizeTimer);
      img.onload = null;
      observer.disconnect();
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      motionQuery.removeEventListener("change", onMotionChange);
      hero.style.height = "";
    };
  }, [src]);

  return <canvas ref={canvasRef} className="hero-canvas" role="img" aria-label={label} />;
}
