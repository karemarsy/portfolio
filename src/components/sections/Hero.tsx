import type { CSSProperties } from "react";
import { GlyphPortrait } from "@/components/animations/GlyphPortrait";
import { RollLabel } from "@/components/ui/RollLabel";
import { site } from "@/data/site";

const nameLines = ["Arsene", "Karema"];

export function Hero() {
  return (
    <section className="hero" id="top" aria-label="Introduction">
      <GlyphPortrait src="/images/arsene-portrait.webp" label={`Portrait of ${site.name} drawn in code characters`} />
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-intro">
            <span className="hero-dot" aria-hidden="true" />
            Senior Full Stack Engineer in Kigali, open to remote
          </p>
          <h1 className="hero-name" aria-label={site.name}>
            {nameLines.map((word, wi) => (
              <span className="name-line" aria-hidden="true" key={word}>
                {[...word].map((char, ci) => (
                  <span className="ch" key={ci} style={{ "--d": wi * 4 + ci } as CSSProperties}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="hero-lede">
            I build <strong>software people trust with their money</strong>, from the interfaces they use to the systems
            powering them. Nine years in, based in Kigali.
          </p>
          <div className="hero-actions">
            <a className="btn" href="#contact">
              <RollLabel label="Start a conversation" bars />
            </a>
            <a className="btn btn-ghost" href="#work">
              <RollLabel label="See selected work" />
            </a>
          </div>
        </div>
      </div>
      <p className="hero-hint" aria-hidden="true">
        Move your cursor through the portrait
      </p>
    </section>
  );
}
