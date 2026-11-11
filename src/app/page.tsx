import { MotionEffects } from "@/components/effects/MotionEffects";
import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { TechStack } from "@/components/sections/TechStack";
import { site } from "@/data/site";
import { siteUrl } from "@/lib/site-url";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: siteUrl.toString(),
  address: { "@type": "PostalAddress", addressLocality: "Kigali", addressCountry: "RW" },
  sameAs: [site.links.linkedin.href, site.links.github.href],
  knowsLanguage: ["English", "French", "Kinyarwanda", "Swahili"],
};

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#work">
        Skip to selected work
      </a>
      <Navbar />
      <MotionEffects />
      <main>
        <Hero />
        <SelectedWork />
        <Experience />
        <About />
        <TechStack />
        <Contact />
      </main>
      <script
        type="application/ld+json"
        // Static, trusted data defined in this repository.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
