"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_LABEL = "Copy email";

export function CopyEmailButton({ email }: { email: string }) {
  const [label, setLabel] = useState(DEFAULT_LABEL);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setLabel("Copied");
    } catch {
      setLabel("Select and copy above");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLabel(DEFAULT_LABEL), 2200);
  };

  return (
    <>
      <button type="button" className="btn btn-dark" onClick={copy}>
        <span className="roll">
          <span>{label}</span>
          <span aria-hidden="true">{DEFAULT_LABEL}</span>
        </span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {label === DEFAULT_LABEL ? "" : label}
      </span>
    </>
  );
}
