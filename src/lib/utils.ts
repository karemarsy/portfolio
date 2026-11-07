/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));

/** True when the user has asked the OS to reduce motion. Safe to call only in the browser. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
