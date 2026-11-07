import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="mt-[clamp(80px,10vw,140px)] flex flex-wrap justify-between gap-5 text-sm">
      <span>© 2026 {site.name}</span>
      <a className="font-semibold no-underline" href="#top">
        Back to top
      </a>
    </footer>
  );
}
