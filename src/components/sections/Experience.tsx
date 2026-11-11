import { ExperienceTimeline } from "@/components/effects/ExperienceTimeline";
import { ExperienceItem } from "@/components/ui/ExperienceItem";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experienceIntro, roles } from "@/data/experience";

export function Experience() {
  return (
    <section className="section bg-paper text-ink" id="experience" aria-labelledby="experience-title">
      <div className="wrap">
        <SectionHeading id="experience-title" title="Experience" intro={experienceIntro} />
        <ExperienceTimeline>
          {roles.map((role) => (
            <ExperienceItem key={role.id} role={role} />
          ))}
        </ExperienceTimeline>
      </div>
    </section>
  );
}
