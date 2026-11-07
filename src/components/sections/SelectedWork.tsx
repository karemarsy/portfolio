import { ProjectCard, ProjectMeta, ProjectVisual } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/data/projects";
import { workGroups, workIntro } from "@/data/projects";

function FeaturedProject({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className="case col-span-full grid grid-cols-1 items-end gap-x-[clamp(20px,2.4vw,36px)] wide:grid-cols-12"
      aria-labelledby={`${project.slug}-title`}
    >
      <ProjectVisual project={project} className="col-span-full wide:col-span-8" />
      <div className="col-span-full self-end wide:col-span-4 wide:col-start-9">
        <ProjectMeta project={project} index={index} featured />
      </div>
    </article>
  );
}

/** Running number across all groups, starting at 1. */
const indexOf = new Map(workGroups.flatMap((g) => g.projects).map((p, i) => [p.slug, i + 1]));

export function SelectedWork() {
  return (
    <section className="section bg-paper text-ink" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHeading id="work-title" title="Selected work" intro={workIntro} />
        {workGroups.map((group) => (
          <div key={group.title} className="[&+&]:mt-[clamp(80px,9vw,140px)]">
            <h3 className="mb-8 flex items-baseline gap-4 border-b border-line pb-3.5 font-body text-[17px] leading-[1.3] font-semibold tracking-normal">
              {group.title} <span className="font-normal text-ink-muted">{group.period}</span>
            </h3>
            <div className="grid grid-cols-12 gap-x-[clamp(20px,2.4vw,36px)] gap-y-[clamp(28px,3vw,44px)]">
              {group.projects.map((project) =>
                project.layout === "feature" ? (
                  <FeaturedProject key={project.slug} project={project} index={indexOf.get(project.slug) ?? 0} />
                ) : (
                  <ProjectCard key={project.slug} project={project} index={indexOf.get(project.slug) ?? 0} />
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
