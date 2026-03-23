import { test, expect } from "@playwright/test";

/**
 * Public guest gallery tests — no auth required.
 * Uses the demo token seeded by prisma/seed.ts
 */
const DEMO_TOKEN = "demo-gallery-token-001";

test.describe("Guest Gallery", () => {
  test("gallery loads with demo token", async ({ page }) => {
    await page.goto(`/gallery/${DEMO_TOKEN}`);
    await expect(page.getByText(/Smith Family/i)).toBeVisible({ timeout: 10_000 });
  });

  test("shows GDPR consent notice", async ({ page }) => {
    await page.goto(`/gallery/${DEMO_TOKEN}`);
    await expect(page.getByText(/GDPR|privacy|consent/i)).toBeVisible({ timeout: 10_000 });
  });

  test("returns 404 for unknown token", async ({ page }) => {
    const res = await page.goto("/gallery/nonexistent-token-xyz");
    // Either 404 status or displays not-found UI
    const isNotFound =
      res?.status() === 404 ||
      (await page.getByText(/not found|expired|invalid/i).count()) > 0;
    expect(isNotFound).toBe(true);
  });

  test("photo grid renders after consent", async ({ page }) => {
    await page.goto(`/gallery/${DEMO_TOKEN}`);
    // Accept GDPR consent if checkbox is present
    const consentBox = page.getByRole("checkbox").first();
    if (await consentBox.isVisible()) {
      await consentBox.check();
    }
    // At least one photo card should be visible
    await expect(page.locator("[data-photo-id], img[alt]").first()).toBeVisible({ timeout: 15_000 });
  });
});
