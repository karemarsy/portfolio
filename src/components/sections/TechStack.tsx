import { StackExplorer } from "@/components/ui/StackExplorer";
import { stackIntro, stackLayers } from "@/data/skills";

export function TechStack() {
  return (
    <section className="section bg-basalt text-on-dark" id="stack" aria-labelledby="stack-title">
      <div className="wrap">
        <StackExplorer layers={stackLayers} title="The whole stack" intro={stackIntro} />
      </div>
    </section>
  );
}
