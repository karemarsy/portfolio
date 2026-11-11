"use client";

import { useEffect } from "react";
import { clamp } from "@/lib/utils";

/** Largest card tilt, in degrees. */
const TILT = 4;
/** How far outside a magnetic element the pull starts, in px. */
const MAGNET_REACH = 40;
const MAGNET_MAX_X = 8;
const MAGNET_MAX_Y = 6;

/**
 * Page-wide pointer effects, attached once with a single listener:
 * project frames tilt toward the pointer with a moving highlight, and
 * elements marked `data-magnetic` lean toward a nearby pointer.
 * Only runs with a mouse or trackpad and when motion is allowed.
 */
export function MotionEffects() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last: PointerEvent | null = null;
    let tilted: HTMLElement | null = null;
    let magnets: HTMLElement[] = [];

    const enabled = () => fine.matches && !reduce.matches;
    const collectMagnets = () => {
      magnets = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    };

    const resetTilt = (el: HTMLElement) => {
      el.classList.remove("is-tilting");
      el.style.removeProperty("--tilt-x");
      el.style.removeProperty("--tilt-y");
    };
    const resetMagnets = () => magnets.forEach((el) => (el.style.translate = ""));

    const update = () => {
      frame = 0;
      const e = last;
      if (!e) return;

      const target = e.target instanceof Element ? e.target.closest<HTMLElement>(".case-frame") : null;
      if (tilted && tilted !== target) resetTilt(tilted);
      tilted = target;
      if (target) {
        const r = target.getBoundingClientRect();
        const px = clamp((e.clientX - r.left) / r.width);
        const py = clamp((e.clientY - r.top) / r.height);
        target.classList.add("is-tilting");
        target.style.setProperty("--tilt-x", `${((0.5 - py) * 2 * TILT).toFixed(2)}deg`);
        target.style.setProperty("--tilt-y", `${((px - 0.5) * 2 * TILT).toFixed(2)}deg`);
        target.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
        target.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
      }

      for (const el of magnets) {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const near = Math.abs(dx) < r.width / 2 + MAGNET_REACH && Math.abs(dy) < r.height / 2 + MAGNET_REACH;
        el.style.translate = near
          ? `${clamp(dx * 0.16, -MAGNET_MAX_X, MAGNET_MAX_X).toFixed(1)}px ${clamp(dy * 0.22, -MAGNET_MAX_Y, MAGNET_MAX_Y).toFixed(1)}px`
          : "";
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !enabled()) return;
      last = e;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => {
      if (tilted) resetTilt(tilted);
      tilted = null;
      resetMagnets();
    };
    const onPreferenceChange = () => {
      if (!enabled()) onLeave();
    };

    collectMagnets();
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onLeave, { passive: true });
    fine.addEventListener("change", onPreferenceChange);
    reduce.addEventListener("change", onPreferenceChange);
    return () => {
      cancelAnimationFrame(frame);
      onLeave();
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onLeave);
      fine.removeEventListener("change", onPreferenceChange);
      reduce.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return null;
}
