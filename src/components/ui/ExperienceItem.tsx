"use client";

import { useState } from "react";
import type { Role } from "@/data/experience";
import { cn } from "@/lib/utils";

export function ExperienceItem({ role }: { role: Role }) {
  const [open, setOpen] = useState(Boolean(role.defaultOpen));
  const panelId = `role-${role.id}`;
  const buttonId = `${panelId}-button`;

  return (
    <li className="border-b border-line">
      <h3 className="font-body tracking-normal [font-size:inherit] [line-height:inherit]">
        <button
          id={buttonId}
          type="button"
          className="role-btn"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="role-years text-[15px] font-medium text-ink-muted">{role.years}</span>
          <span>
            <span className="role-co">{role.company}</span>
            <span className="mt-2.5 block text-[17px] font-medium leading-[1.3] text-ink-muted">{role.title}</span>
          </span>
          <span className="role-toggle" aria-hidden="true" />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn("disclosure", open && "is-open")}
        inert={!open}
      >
        <div>
          <div className="role-body">
            <p className="col-start-2 max-w-[48ch] text-ink-muted">{role.summary}</p>
            <ul className="col-start-3 grid gap-2.5">
              {role.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}
