import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project, WorkGroup } from "@/data/projects";
import { cn } from "@/lib/utils";
import { Tags } from "./Tags";

const SIZES = "(max-width: 860px) 100vw, 56vw";
const pad = (n: number) => String(n).padStart(2, "0");

function ArrowUpRight() {
  return (
    <svg className="case-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 10.5 10.5 3.5M5 3.5h5.5V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Screenshot inset like a window; falls back to a typographic wordmark without an image. */
function ProjectVisual({ project }: { project: Project }) {
  if (!project.image) {
    return (
      <div className="case-visual aspect-[16/10]">
        <span className="badge">{project.badge}</span>
        <span className="wordmark" aria-hidden="true">
          {project.title}
        </span>
      </div>
    );
  }
  return (
    <div className="case-frame aspect-[16/10]">
      <span className="badge">{project.badge}</span>
      <div className={cn("case-shot", project.hoverImage && "shot-center")}>
        <Image src={project.image.src} alt={project.image.alt} fill sizes={SIZES} />
        {project.hoverImage && (
          <Image className="alt" src={project.hoverImage.src} alt="" aria-hidden="true" fill sizes={SIZES} />
        )}
      </div>
    </div>
  );
}

type Props = { project: Project; group: WorkGroup; index: number; total: number };

/**
 * One card in the project deck: a slab in the project's colour with the screenshot and its story.
 * On wide screens the cards pin one after another and stack (see `.deck` and DeckMotion).
 */
export function ProjectDeckCard({ project, group, index, total }: Props) {
  return (
    <li className="deck-item" style={{ "--i": index - 1 } as CSSProperties}>
      <article className={cn("deck-card case", `slab-${project.tone}`)} aria-labelledby={`${project.slug}-title`}>
        <ProjectVisual project={project} />
        <div className="deck-meta">
          <div className="flex items-start justify-between gap-6">
            <p className="deck-group">
              {group.title}
              <span> · {group.period}</span>
            </p>
            <p className="deck-count" aria-label={`Project ${index} of ${total}`}>
              {pad(index)}
              <span aria-hidden="true">/{pad(total)}</span>
            </p>
          </div>
          <p className="deck-kind">{project.kind}</p>
          <h3 id={`${project.slug}-title`} className="deck-title">
            {project.title}
          </h3>
          <p className="deck-desc">{project.description}</p>
          <Tags items={project.tags} />
          {project.link && (
            <a
              className="case-link relative mt-6 inline-flex items-center gap-2 border-b-[1.5px] border-current pb-0.5 text-[15px] font-semibold no-underline after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-['']"
              href={project.link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.link.label}
              <ArrowUpRight />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </article>
    </li>
  );
}
