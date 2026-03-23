import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

test.describe("Authentication", () => {
  test("login page renders", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /PixelHoliday/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("CEO can log in and reach admin dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("ceo@pixelholiday.com");
    await page.getByLabel(/password/i).fill("PixelH0liday!");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByText(/Command Centre/i)).toBeVisible();
  });

  test("STAFF can log in and reach staff dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("staff1@pixelholiday.com");
    await page.getByLabel(/password/i).fill("PixelH0liday!");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/staff/);
  });

  test("invalid credentials show error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("nobody@example.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid/i)).toBeVisible();
  });

  test("STAFF cannot access /admin", async ({ page }) => {
    // Log in as staff
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("staff1@pixelholiday.com");
    await page.getByLabel(/password/i).fill("PixelH0liday!");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/staff/);
    // Attempt to navigate to admin
    await page.goto("/admin");
    await expect(page).not.toHaveURL(/\/admin\/page/);
    // Should be redirected
    await expect(page).toHaveURL(/\/(login|staff)/);
  });
});
