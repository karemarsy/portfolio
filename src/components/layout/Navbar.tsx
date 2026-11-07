"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { navItems, site, trackedSections } from "@/data/site";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [onAccent, setOnAccent] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Hide while scrolling down past the hero; switch to dark text over the orange contact section.
  useEffect(() => {
    const contact = document.getElementById("contact");
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setOnAccent(contact ? contact.getBoundingClientRect().top < 70 : false);
      setHidden(y > lastY && y > window.innerHeight * 0.6);
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Mark the link for the section in the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    trackedSections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setMenuOpen(false);
    if (restoreFocus) menuButtonRef.current?.focus();
  }, []);

  return (
    <>
      <header className={cn("nav", hidden && !menuOpen && "is-hidden", onAccent && "on-accent")}>
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-[var(--gutter)] py-[22px]">
          <a className="brand" href="#top" aria-label={`${site.shortName}, back to top`}>
            {site.shortName}
          </a>
          <nav aria-label="Main" className="hidden wide:block">
            <ul className="flex items-center gap-[30px]">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    className="nav-link"
                    href={`#${item.id}`}
                    aria-current={active === item.id ? "true" : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  className="nav-link nav-cta"
                  href="#contact"
                  aria-current={active === "contact" ? "true" : undefined}
                >
                  Get in touch
                </a>
              </li>
            </ul>
          </nav>
          <button
            ref={menuButtonRef}
            type="button"
            className="min-h-11 cursor-pointer px-1 text-[15px] font-semibold wide:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
