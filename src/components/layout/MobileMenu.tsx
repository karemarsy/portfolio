"use client";

import { useEffect, useRef } from "react";
import { navItems, site } from "@/data/site";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  /** `restoreFocus` is false when a link was chosen, so focus can follow the page jump. */
  onClose: (restoreFocus: boolean) => void;
};

export function MobileMenu({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose(true);
        return;
      }
      // Keep keyboard focus inside the open dialog.
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  // Close if the viewport grows past the breakpoint where the menu exists.
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia("(min-width: 861px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && onClose(false);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      className={cn("overlay", open && "is-open")}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
    >
      <div className="flex items-center justify-between">
        <span className="brand">{site.shortName}</span>
        <button
          ref={closeRef}
          type="button"
          className="min-h-11 cursor-pointer text-[15px] font-semibold"
          onClick={() => onClose(true)}
        >
          Close
        </button>
      </div>
      <nav aria-label="Mobile" className="my-auto">
        <ul>
          {[...navItems, { id: "contact", label: "Contact" }].map((item) => (
            <li key={item.id}>
              <a className="overlay-link" href={`#${item.id}`} onClick={() => onClose(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p className="text-on-dark-muted">{site.location}</p>
    </div>
  );
}
