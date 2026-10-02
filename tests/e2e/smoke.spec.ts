import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { locales } from "../../src/i18n/config";

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

async function expectNoSeriousA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`)).toEqual([]);
}

test.describe("locale routing", () => {
  test("redirects / using Accept-Language", async ({ browser }) => {
    const context = await browser.newContext({ locale: "de-DE", extraHTTPHeaders: { "Accept-Language": "de-DE,de;q=0.9" } });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/de$/);
    await context.close();
  });

  test("redirects legacy routes to docs", async ({ page }) => {
    await page.goto("/packages");
    await expect(page).toHaveURL(/\/en\/docs\/packages$/);
  });

  test("unknown pages return a localized 404", async ({ page }) => {
    const response = await page.goto("/fr/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

for (const locale of locales) {
  test(`home renders in ${locale} without overflow at 375px`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    const response = await page.goto(`/${locale}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
    await expectNoHorizontalOverflow(page);
  });

  test(`docs page renders in ${locale} without overflow at 375px`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(`/${locale}/docs/packages/after_enterprise`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("after_enterprise");
    const codeDirection = await page.locator(".code-frame").first().evaluate((el) => getComputedStyle(el).direction);
    expect(codeDirection).toBe("ltr");
    await expectNoHorizontalOverflow(page);
  });
}

test.describe("interactions", () => {
  test("theme choice persists across reloads", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/en");
    const group = page.getByRole("group", { name: "Theme" }).first();
    await group.getByRole("button", { name: "Light" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(group.getByRole("button", { name: "Light" })).toHaveAttribute("aria-pressed", "true");
  });

  test("respects the system color scheme on first visit", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await context.close();
  });

  test("language selector switches locale and keeps the page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/en/docs/tooling");
    await page.getByRole("combobox", { name: "Language" }).first().selectOption("ja");
    await expect(page).toHaveURL(/\/ja\/docs\/tooling$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  });

  test("search opens with / and finds an API", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/en/docs");
    await page.locator("body").press("/");
    const input = page.getByRole("combobox", { name: "Search docs" });
    await expect(input).toBeFocused();
    await input.fill("EnterpriseScope");
    const option = page.getByRole("option").first();
    await expect(option).toContainText("EnterpriseScope");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/en\/docs\/packages\/after_enterprise#apis$/);
  });

  test("search shows an empty state", async ({ page }) => {
    await page.goto("/en/docs");
    await page.locator("body").press("/");
    await page.getByRole("combobox", { name: "Search docs" }).fill("zzqqxx");
    await expect(page.getByText("No results for “zzqqxx”.")).toBeVisible();
  });

  test("package explorer switches packages with the keyboard", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/en#packages");
    const tab = page.getByRole("tab", { name: /after_core/ });
    await tab.focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("tab", { name: /after_ecosystem/ })).toHaveAttribute("aria-selected", "true");
  });

  test("copy button copies code", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "clipboard permissions are chromium-only");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/en/docs/tooling");
    await page.getByRole("button", { name: "Copy code" }).first().click();
    await expect(page.getByRole("button", { name: "Copied" }).first()).toBeVisible();
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text.length).toBeGreaterThan(10);
  });

  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto("/en");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("reduced motion disables graph animation", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/en");
    const animation = await page.locator(".graph-animate .graph-edge").first().evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toBe("none");
    await context.close();
  });
});

test.describe("accessibility", () => {
  for (const [path, theme] of [
    ["/en", "dark"],
    ["/en", "light"],
    ["/ar", "dark"],
    ["/en/docs/architecture", "light"],
    ["/ja/docs/packages/after_core", "dark"],
  ] as const) {
    test(`${path} (${theme}) has no serious axe violations`, async ({ browser }) => {
      const context = await browser.newContext({ colorScheme: theme, reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expectNoSeriousA11yViolations(page);
      await context.close();
    });
  }
});
