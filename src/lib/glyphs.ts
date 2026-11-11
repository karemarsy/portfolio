/** Character ramp from darkest to brightest, shared by every glyph canvas on the page. */
export const RAMP = [".", ":", "-", "=", "+", "<", ">", "/", "{", "}", "0", "1", "#", "@"] as const;

const GLYPH_FONT = 'ui-monospace, "SF Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace';

/**
 * Pre-renders every ramp glyph in one colour onto a sprite sheet, one cell per glyph,
 * so the animation loop can blit with drawImage instead of calling fillText per frame.
 */
export function buildGlyphSheet(rgb: string, cellW: number, cellH: number, dpr: number): HTMLCanvasElement | null {
  const gw = Math.ceil(cellW * dpr);
  const gh = Math.ceil(cellH * dpr);
  const sheet = document.createElement("canvas");
  sheet.width = gw * RAMP.length;
  sheet.height = gh;
  const ctx = sheet.getContext("2d");
  if (!ctx) return null;
  ctx.scale(dpr, dpr);
  ctx.font = `600 ${cellH}px ${GLYPH_FONT}`;
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  ctx.fillStyle = `rgb(${rgb})`;
  RAMP.forEach((glyph, i) => ctx.fillText(glyph, (i * gw) / dpr + cellW / 2, 0));
  return sheet;
}
