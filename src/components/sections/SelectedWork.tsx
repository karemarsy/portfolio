import { DeckMotion } from "@/components/effects/DeckMotion";
import { ProjectDeckCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { workGroups, workIntro } from "@/data/projects";

const entries = workGroups.flatMap((group) => group.projects.map((project) => ({ group, project })));

export function SelectedWork() {
  return (
    <section className="section sheet bg-paper text-ink" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHeading id="work-title" title="Selected work" intro={workIntro} />
        <DeckMotion>
          {entries.map(({ group, project }, i) => (
            <ProjectDeckCard key={project.slug} project={project} group={group} index={i + 1} total={entries.length} />
          ))}
        </DeckMotion>
      </div>
    </section>
  );
}
