"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { clamp } from "@/lib/utils";

type Props = {
  text: string;
  highlights: string[];
  className?: string;
};

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
export function StatementReveal({ text, highlights, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = useMemo(() => {
    const marked = new Set(highlights);
    return text.split(" ").map((word) => ({
      word,
      highlight: marked.has(word.replace(/[^a-z]/gi, "").toLowerCase()),
    }));
  }, [text, highlights]);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (motionQuery.matches) {
        setLit(words.length);
        return;
      }
      const rect = el.getBoundingClientRect();
      const progress = clamp((window.innerHeight * 0.82 - rect.top) / (rect.height + window.innerHeight * 0.3));
      setLit(Math.round(progress * words.length));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    motionQuery.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motionQuery.removeEventListener("change", update);
      cancelAnimationFrame(frame);
    };
  }, [words.length]);

  return (
    <p ref={ref} className={className}>
      {words.map(({ word, highlight }, i) => (
        <span key={i}>
          <span className={`w${highlight ? " hl" : ""}${i < lit ? " on" : ""}`}>{word}</span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </p>
  );
}
