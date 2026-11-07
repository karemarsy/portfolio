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
  await expect.poll(() => page.locator("#stack").evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBeLessThan(5);
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
