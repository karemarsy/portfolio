import { StatementReveal } from "@/components/ui/StatementReveal";
import { aboutHighlights, aboutNotes, aboutStatement } from "@/data/about";

export function About() {
  return (
    <section className="section bg-basalt text-on-dark" id="about" aria-labelledby="about-title">
      <div className="wrap grid grid-cols-12 gap-y-7 wide:gap-x-7">
        <h2 id="about-title" className="col-span-full text-[clamp(40px,4vw,56px)] text-on-dark-muted wide:col-span-3">
          About
        </h2>
        <StatementReveal
          text={aboutStatement}
          highlights={aboutHighlights}
          className="statement col-span-full font-display text-[clamp(34px,4.3vw,66px)] leading-[1.04] font-semibold tracking-[0.005em] wide:col-span-9 wide:col-start-4"
        />
        <div className="col-span-full mt-[clamp(56px,7vw,100px)] grid grid-cols-1 gap-7 border-t border-line-dark pt-8 wide:col-span-9 wide:col-start-4 wide:grid-cols-3 wide:gap-9">
          {aboutNotes.map((note) => (
            <div key={note.title} className="about-note">
              <h3 className="mb-2.5 font-body text-base leading-[1.3] font-semibold tracking-normal text-accent">
                {note.title}
              </h3>
              <p className="text-base text-on-dark-muted">{note.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
