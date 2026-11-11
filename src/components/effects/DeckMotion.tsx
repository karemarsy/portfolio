"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clamp } from "@/lib/utils";

/** Must match the media query that makes `.deck-item` sticky in globals.css. */
const STACKING = "(min-width: 861px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

/**
 * The project deck. While a card is pinned and the next one slides over it, the pinned card
 * sinks back (`--recede` 0..1 drives its scale, tilt and shade in CSS).
 */
export function DeckMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const query = window.matchMedia(STACKING);
    const items = Array.from(list.querySelectorAll<HTMLElement>(":scope > .deck-item"));
    const cards = items.map((item) => item.querySelector<HTMLElement>(".deck-card"));
    let frame = 0;

    const reset = () => cards.forEach((card) => card?.style.removeProperty("--recede"));
    const update = () => {
      frame = 0;
      if (!query.matches) return reset();
      for (let i = 0; i < items.length - 1; i++) {
        const card = cards[i];
        if (!card) continue;
        const pinnedTop = parseFloat(getComputedStyle(items[i]).top) || 0;
        const height = card.offsetHeight || 1;
        const nextTop = items[i + 1].getBoundingClientRect().top;
        // 0 while the next card is still below this one; 1 once it has slid all the way over.
        card.style.setProperty("--recede", clamp((pinnedTop + height - nextTop) / height).toFixed(3));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    query.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      query.removeEventListener("change", schedule);
      reset();
    };
  }, []);

  return (
    <ol ref={ref} className="deck" aria-label="Projects">
      {children}
    </ol>
  );
}
