import { test, expect, Page } from "@playwright/test";

async function loginAsStaff(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill("staff1@pixelholiday.com");
  await page.getByLabel(/password/i).fill("PixelH0liday!");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/staff/);
}

test.describe("Staff Portal", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStaff(page);
  });

  test("staff dashboard shows leaderboard", async ({ page }) => {
    await expect(page.getByText(/leaderboard|dashboard/i)).toBeVisible();
  });

  test("commissions page shows MTD earnings", async ({ page }) => {
    await page.goto("/staff/commissions");
    await expect(page.getByText(/MTD Earned/i)).toBeVisible();
  });

  test("schedule page shows weekly grid", async ({ page }) => {
    await page.goto("/staff/schedule");
    await expect(page.getByText(/My Schedule/i)).toBeVisible();
    // 7 day columns visible
    await expect(page.getByText(/Mon|Tue|Wed|Thu|Fri/i).first()).toBeVisible();
  });

  test("upload page renders dropzone", async ({ page }) => {
    await page.goto("/staff/upload");
    await expect(page.getByText(/upload|drop/i)).toBeVisible();
  });

  test("staff cannot access admin portal", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).not.toHaveURL(/\/admin$/);
  });
});
