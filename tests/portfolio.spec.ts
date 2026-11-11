import { expect, test, type Page } from "@playwright/test";

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) <= 860;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("renders every section with no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
  page.on("pageerror", (err) => errors.push(err.message));
  await page.reload();
  for (const id of ["top", "work", "experience", "about", "stack", "contact"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await expect(page.getByRole("heading", { level: 1, name: "Arsene Karema" })).toBeVisible();
  await page.waitForTimeout(1500);
  expect(errors).toEqual([]);
});

test("glyph portrait draws onto the canvas", async ({ page }) => {
  const canvas = page.getByRole("img", { name: /Portrait of Arsene Karema/ });
  await expect(canvas).toBeVisible();
  // The portrait is built after the load event, once the main thread is idle.
  await page.waitForLoadState("load");
  await expect
    .poll(
      () =>
        canvas.evaluate((el) => {
          const c = el as HTMLCanvasElement;
          const d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
          let painted = 0;
          for (let i = 3; i < d.length; i += 400) if (d[i] > 0) painted++;
          return painted;
        }),
      { timeout: 15_000 },
    )
    .toBeGreaterThan(100);
});

test("no horizontal overflow", async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 800 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(0);
  }
});

test("navigation links scroll to their sections", async ({ page }) => {
  test.skip(isMobile(page), "desktop navigation only");
  const nav = page.getByRole("navigation", { name: "Main" });
  await nav.getByRole("link", { name: "Experience" }).click();
  await expect.poll(() => page.locator("#experience").evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBeLessThan(5);
  await expect(nav.getByRole("link", { name: "Experience" })).toHaveAttribute("aria-current", "true");
});

test("mobile menu opens, traps focus, closes with Escape and on link choice", async ({ page }) => {
  test.skip(!isMobile(page), "mobile menu only");
  const menu = page.getByRole("button", { name: "Menu" });
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();

  await menu.click();
  await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "Stack" }).click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  // Smooth scrolling covers most of the page; allow for slow, busy machines.
  await expect
    .poll(() => page.locator("#stack").evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 10_000 })
    .toBeLessThan(5);
});

test("experience entries expand and collapse", async ({ page }) => {
  const adfinance = page.getByRole("button", { name: /ADFinance Rwanda/ });
  const octan = page.getByRole("button", { name: /Octan Group/ });
  await expect(adfinance).toHaveAttribute("aria-expanded", "true");
  await expect(octan).toHaveAttribute("aria-expanded", "false");
  await octan.click();
  await expect(octan).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Managed and mentored the frontend team, ran code reviews")).toBeVisible();
  await octan.click();
  await expect(octan).toHaveAttribute("aria-expanded", "false");
});

test("stack layers open and the payment trace runs every step", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); // shorter step delay
  const identity = page.getByRole("button", { name: /^Identity/ });
  await identity.click();
  await expect(identity).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Authentication and role-based access control with Keycloak")).toBeVisible();

  await page.getByRole("button", { name: "Trace a payment" }).click();
  const log = page.getByRole("list", { name: "Payment trace" }).getByRole("listitem");
  await expect(log).toHaveCount(8, { timeout: 6000 });
  await expect(log.last()).toContainText("The confirmation appears on screen");
});

test("contact: mailto link, copy email and Kigali time", async ({ page, context, browserName }) => {
  await expect(page.locator("a.email-link")).toHaveAttribute("href", "mailto:karemarsy@gmail.com");
  await expect(page.locator("#contact time")).toHaveText(/^\d{2}:\d{2}$/);
  if (browserName === "chromium") {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: /Copy email/ }).click();
    await expect(page.getByRole("status")).toHaveText("Copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("karemarsy@gmail.com");
  }
});

test("reduced motion shows the About statement fully", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  const words = page.locator("#about .statement .w");
  await expect(page.locator("#about .statement .w.on")).toHaveCount(await words.count());
});

test("stack plates light up in trace order", async ({ page }) => {
  // Normal step speed (780ms): with the reduced-motion speed, a busy machine can merge steps into one render.
  await expect(page.locator(".plate")).toHaveCount(7);
  // Record which plate is lit each time the classes change, then run the trace.
  await page.evaluate(() => {
    const plates = Array.from(document.querySelectorAll(".plate"));
    const seen: number[] = [];
    (window as unknown as { __lit: number[] }).__lit = seen;
    new MutationObserver(() => {
      const lit = plates.findIndex((p) => p.classList.contains("is-active"));
      if (lit !== -1 && seen[seen.length - 1] !== lit) seen.push(lit);
    }).observe(document.querySelector(".plates-stack")!, { subtree: true, attributes: true, attributeFilter: ["class"] });
  });
  await page.getByRole("button", { name: "Trace a payment" }).click();
  const lit = () => page.evaluate(() => (window as unknown as { __lit: number[] }).__lit);
  await expect.poll(lit, { timeout: 12_000 }).toEqual(expect.arrayContaining([6]));
  await expect.poll(async () => (await lit()).at(-1), { timeout: 3000 }).toBe(0);
  // Down the stack from Interfaces to Delivery, then back to the interface.
  const order = (await lit()).slice(0, -1);
  expect(order[0]).toBe(0);
  expect(order.every((v, i) => i === 0 || v > order[i - 1])).toBe(true);
});

test("experience rail fills as the list scrolls into view", async ({ page, isMobile }) => {
  test.skip(isMobile, "The rail is shown on wide screens only");
  const list = page.locator("ol.timeline");
  await list.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 400);
  await expect
    .poll(async () => Number(await list.evaluate((el) => getComputedStyle(el).getPropertyValue("--progress"))))
    .toBeGreaterThan(0);
  await expect(list.locator("> li[data-reached]").first()).toBeAttached();
});

test("decorative layers stay out of the accessibility tree and still under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator(".plates")).toHaveAttribute("aria-hidden", "true");
  const frame = page.locator("#work .case-frame").first();
  await expect(frame).toHaveCSS("opacity", "1");
  await expect(frame).toHaveCSS("rotate", "none");
});

test("project deck lists every project with its number", async ({ page }) => {
  const deck = page.getByRole("list", { name: "Projects" });
  const cards = deck.getByRole("article");
  await expect(cards).toHaveCount(7);
  await expect(cards.first().getByRole("heading", { level: 3 })).toHaveText("ADFinance");
  await expect(cards.last().getByLabel("Project 7 of 7")).toBeVisible();
});

test("pinned deck cards recede as the next card covers them", async ({ page, isMobile }) => {
  test.skip(isMobile, "Cards pin on wide screens only");
  const deck = page.getByRole("list", { name: "Projects" });
  await deck.scrollIntoViewIfNeeded();
  const second = page.locator(".deck-item").nth(1);
  await second.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 92));
  await expect
    .poll(() => page.locator(".deck-card").first().evaluate((el) => Number(el.style.getPropertyValue("--recede") || 0)))
    .toBeGreaterThan(0.8);
});
