"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StackLayer } from "@/data/skills";
import { traceFinalStep } from "@/data/skills";
import { cn } from "@/lib/utils";
import { RollLabel } from "./RollLabel";

type Props = { layers: StackLayer[]; title: string; intro: string };

const STEP_DELAY_MS = 780;
const REDUCED_STEP_DELAY_MS = 250;
const SETTLE_MS = 1200;

/** Interactive layer diagram plus a step-by-step trace of a payment through every layer. */
export function StackExplorer({ layers, title, intro }: Props) {
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [tracing, setTracing] = useState(false);
  const [tracerY, setTracerY] = useState<number | null>(null);
  const bandRefs = useRef<Array<HTMLDivElement | null>>([]);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const tracerTo = useCallback((index: number) => {
    const band = bandRefs.current[index];
    if (band) setTracerY(band.offsetTop + band.offsetHeight / 2 - 7);
  }, []);

  const toggle = (index: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  const trace = () => {
    if (tracing) return;
    setTracing(true);
    setLog([]);
    tracerTo(0);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? REDUCED_STEP_DELAY_MS : STEP_DELAY_MS;
    const steps = [...layers.map((layer, i) => ({ layer: i, text: layer.step })), traceFinalStep];

    timers.current.forEach(clearTimeout);
    timers.current = steps.map((step, k) =>
      setTimeout(() => {
        setActiveLayer(step.layer);
        tracerTo(step.layer);
        setLog((prev) => [...prev, step.text]);
        if (k === steps.length - 1) {
          timers.current.push(
            setTimeout(() => {
              setActiveLayer(null);
              setTracerY(null);
              setTracing(false);
            }, SETTLE_MS),
          );
        }
      }, k * delay),
    );
  };

  return (
    <div className="grid grid-cols-12 items-start gap-y-7 wide:gap-x-7">
      <div className="col-span-full wide:sticky wide:top-[110px] wide:col-span-4">
        <h2 id="stack-title" className="mb-[26px]">
          {title}
        </h2>
        <p className="mb-[30px] max-w-[36ch] text-on-dark-muted">
          {intro}
        </p>
        <button type="button" className="btn" onClick={trace} aria-disabled={tracing || undefined}>
          <RollLabel label="Trace a payment" bars />
        </button>
        <ol
          className="trace-log mt-7 grid gap-2 text-[15px] text-on-dark-muted wide:min-h-[180px]"
          aria-live="polite"
          aria-label="Payment trace"
        >
          {log.map((text, k) => (
            <li key={`${k}-${text}`}>
              <b className="min-w-[22px] font-semibold text-accent">{k + 1}</b>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="relative col-span-full grid gap-2.5 wide:col-span-7 wide:col-start-6">
        <span
          className="tracer"
          aria-hidden="true"
          style={tracerY === null ? undefined : { opacity: 1, transform: `translateY(${tracerY}px)` }}
        />
        {layers.map((layer, i) => {
          const isOpen = open.has(i);
          const detailId = `layer-detail-${i}`;
          return (
            <div
              key={layer.name}
              ref={(el) => {
                bandRefs.current[i] = el;
              }}
              className={cn("band", isOpen && "is-open", activeLayer === i && "is-active")}
            >
              <button
                type="button"
                className="band-btn"
                aria-expanded={isOpen}
                aria-controls={detailId}
                onClick={() => toggle(i)}
              >
                <span className="flex flex-wrap items-baseline justify-between gap-5">
                  <span className="band-name">{layer.name}</span>
                  <span className="band-tools text-[15px] text-on-dark-muted">
                    {layer.tools.map((tool, t) => (
                      <span key={tool}>
                        <em>{tool}</em>
                        {t < layer.tools.length - 1 ? ", " : null}
                      </span>
                    ))}
                  </span>
                </span>
              </button>
              <div id={detailId} className={cn("disclosure", isOpen && "is-open")} inert={!isOpen}>
                <div>
                  <p className="max-w-[56ch] px-[26px] pb-[22px] text-base text-on-dark-muted">{layer.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
