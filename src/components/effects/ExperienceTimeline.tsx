"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clamp } from "@/lib/utils";

/** Reading line, as a fraction of the viewport height, that fills the rail. */
const READING_LINE = 0.55;

/**
 * Ordered list with a rail that fills as the reader moves through it.
 * Each role's marker lights once the reading line passes it.
 */
export function ExperienceTimeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * READING_LINE;
      const rect = list.getBoundingClientRect();
      list.style.setProperty("--progress", clamp((line - rect.top) / rect.height).toFixed(4));
      for (const item of Array.from(list.children)) {
        item.toggleAttribute("data-reached", item.getBoundingClientRect().top + 60 < line);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Opening or closing a role changes the list height.
    const resize = new ResizeObserver(schedule);
    resize.observe(list);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
    };
  }, []);

  return (
    <ol ref={ref} className="timeline border-t border-line">
      {children}
    </ol>
  );
}
