import { Footer } from "@/components/layout/Footer";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { LocalTime } from "@/components/ui/LocalTime";
import { site } from "@/data/site";

const metaLabel = "mb-1.5 font-body text-sm leading-[1.3] font-semibold tracking-normal opacity-85";
const metaValue = "inline-flex min-h-11 items-center text-xl font-medium no-underline hover:underline hover:underline-offset-4";

export function Contact() {
  return (
    <section
      className="sheet bg-accent pt-[clamp(100px,13vw,190px)] pb-10 text-basalt"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="wrap">
        <h2 id="contact-title" className="max-w-[11ch] text-[clamp(64px,11vw,190px)] leading-[0.86] font-extrabold">
          Let’s build the whole thing.
        </h2>
        <p className="mt-[34px] mb-12 max-w-[42ch] text-[clamp(18px,1.6vw,22px)]">
          I’m open to senior full stack roles, remote or in Kigali, and to software projects with teams who care about
          the details. Email is the quickest way to reach me.
        </p>
        <div className="flex flex-wrap items-center gap-x-[26px] gap-y-[18px] border-y-[1.5px] border-basalt py-[30px]">
          <a className="email-link" href={`mailto:${site.email}`} data-magnetic>
            {site.email}
          </a>
          <CopyEmailButton email={site.email} />
        </div>
        <div className="mt-11 grid grid-cols-1 gap-7 mid:grid-cols-3">
          <div>
            <h3 className={metaLabel}>LinkedIn</h3>
            <a className={metaValue} href={site.links.linkedin.href} target="_blank" rel="noopener noreferrer">
              {site.links.linkedin.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <div>
            <h3 className={metaLabel}>GitHub</h3>
            <a className={metaValue} href={site.links.github.href} target="_blank" rel="noopener noreferrer">
              {site.links.github.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <div>
            <h3 className={metaLabel}>{site.location}</h3>
            <p className="text-xl font-medium">
              <LocalTime timeZone={site.timeZone} /> local time
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </section>
  );
}
