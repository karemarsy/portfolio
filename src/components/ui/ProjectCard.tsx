import Image from "next/image";
import type { Project, ProjectLayout } from "@/data/projects";
import { cn } from "@/lib/utils";
import { Tags } from "./Tags";

/** Staggered grid placement on wide screens; everything stacks full width below 861px. */
const placement: Record<ProjectLayout, { card: string; visual: string; sizes: string }> = {
  feature: { card: "", visual: "aspect-[16/10]", sizes: "(max-width: 860px) 100vw, 66vw" },
  i1: { card: "wide:col-span-7 wide:col-start-1", visual: "aspect-[4/3]", sizes: "(max-width: 860px) 100vw, 58vw" },
  i2: {
    card: "wide:col-span-5 wide:col-start-8 wide:mt-[clamp(40px,9vw,140px)]",
    visual: "aspect-[4/3]",
    sizes: "(max-width: 860px) 100vw, 42vw",
  },
  i3: { card: "wide:col-span-6 wide:col-start-3", visual: "aspect-[16/10]", sizes: "(max-width: 860px) 100vw, 50vw" },
  o1: { card: "wide:col-span-7 wide:col-start-1", visual: "aspect-[16/10]", sizes: "(max-width: 860px) 100vw, 58vw" },
  o2: {
    card: "wide:col-span-5 wide:col-start-8 wide:mt-[clamp(40px,8vw,120px)]",
    visual: "aspect-[16/10] wide:aspect-[4/3]",
    sizes: "(max-width: 860px) 100vw, 42vw",
  },
  o3: { card: "wide:col-span-6 wide:col-start-4", visual: "aspect-[16/10]", sizes: "(max-width: 860px) 100vw, 50vw" },
};

function ArrowUpRight() {
  return (
    <svg className="case-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 10.5 10.5 3.5M5 3.5h5.5V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Screenshot set inside a tinted frame; falls back to a typographic wordmark without an image. */
export function ProjectVisual({ project, className }: { project: Project; className?: string }) {
  const { visual, sizes } = placement[project.layout];
  if (!project.image) {
    return (
      <div className={cn("case-visual bg-basalt text-accent", visual, className)}>
        <span className="badge">{project.badge}</span>
        <span className="wordmark" aria-hidden="true">
          {project.title}
        </span>
      </div>
    );
  }
  return (
    <div className={cn("case-frame", `tone-${project.tone}`, visual, className)}>
      <span className="badge">{project.badge}</span>
      <div className={cn("case-shot", project.hoverImage && "shot-center")}>
        <Image src={project.image.src} alt={project.image.alt} fill sizes={sizes} />
        {project.hoverImage && (
          <Image className="alt" src={project.hoverImage.src} alt="" aria-hidden="true" fill sizes={sizes} />
        )}
      </div>
    </div>
  );
}

export function ProjectMeta({ project, index, featured = false }: { project: Project; index: number; featured?: boolean }) {
  return (
    <div className="pt-6">
      <p className="mb-2 flex items-center gap-3 text-sm text-ink-muted">
        <span className="font-display text-base font-bold tracking-[0.04em] text-ink">
          {String(index).padStart(2, "0")}
        </span>
        <span aria-hidden="true" className="h-px w-6 bg-line" />
        {project.kind}
      </p>
      <h3
        id={`${project.slug}-title`}
        className={featured ? "text-[clamp(40px,4vw,64px)]" : "text-[clamp(32px,3vw,46px)]"}
      >
        {project.title}
      </h3>
      <p className="mt-3 max-w-[52ch] text-ink-muted">{project.description}</p>
      <Tags items={project.tags} />
      {project.link && (
        <a
          className="case-link relative mt-5 inline-flex items-center gap-2 border-b-[1.5px] border-current pb-0.5 after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-[''] text-[15px] font-semibold text-ink no-underline"
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
  );
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className={cn("case col-span-full", placement[project.layout].card)} aria-labelledby={`${project.slug}-title`}>
      <ProjectVisual project={project} />
      <ProjectMeta project={project} index={index} />
    </article>
  );
}
