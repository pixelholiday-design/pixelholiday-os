import { test, expect, Page } from "@playwright/test";

async function loginAsCeo(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill("ceo@pixelholiday.com");
  await page.getByLabel(/password/i).fill("PixelH0liday!");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/admin/);
}

test.describe("Admin Portal", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCeo(page);
  });

  test("command centre shows KPI strip", async ({ page }) => {
    await expect(page.getByText(/revenue/i)).toBeVisible();
  });

  test("hotels list renders", async ({ page }) => {
    await page.goto("/admin/hotels");
    await expect(page.getByRole("heading", { name: /hotels/i })).toBeVisible();
    await expect(page.getByText(/Patong Beach Resort/i)).toBeVisible();
  });

  test("hotel detail page loads", async ({ page }) => {
    await page.goto("/admin/hotels");
    await page.getByText(/Patong Beach Resort/i).click();
    await expect(page).toHaveURL(/\/admin\/hotels\/.+/);
    await expect(page.getByText(/Active Staff/i)).toBeVisible();
  });

  test("gallery pipeline renders with demo gallery", async ({ page }) => {
    await page.goto("/admin/galleries");
    await expect(page.getByText(/Smith Family/i)).toBeVisible();
  });

  test("users page shows staff roster", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.getByText(/Tom Photographer|staff1/i)).toBeVisible();
  });

  test("new user form validates required fields", async ({ page }) => {
    await page.goto("/admin/users/new");
    await page.getByRole("button", { name: /create user/i }).click();
    await expect(page.getByText(/required|missing/i)).toBeVisible();
  });

  test("ATS postings list renders", async ({ page }) => {
    await page.goto("/admin/ats");
    await expect(page.getByText(/Resort Photographer/i)).toBeVisible();
  });

  test("ATS applications pipeline renders", async ({ page }) => {
    await page.goto("/admin/ats/applications");
    await expect(page.getByRole("heading", { name: /applications/i })).toBeVisible();
  });

  test("CMS page lists blog posts", async ({ page }) => {
    await page.goto("/admin/cms");
    await expect(page.getByText(/Welcome to PixelHoliday/i)).toBeVisible();
  });

  test("system health page renders", async ({ page }) => {
    await page.goto("/admin/support");
    await expect(page.getByText(/System Health/i)).toBeVisible();
  });

  test("RPG ranking page loads (CEO only)", async ({ page }) => {
    await page.goto("/admin/rpg-ranking");
    await expect(page.getByText(/RPG Ranking/i)).toBeVisible();
  });
});
