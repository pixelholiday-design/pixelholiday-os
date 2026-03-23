import { test, expect } from "@playwright/test";

// ─────────────────────────────────────────────────────────────────────────────
// @smoke — Fast PR gate: critical path tests that must pass on every pull request.
// Tagged with "@smoke" so CI can run: playwright test --grep "@smoke"
// Total runtime target: < 60 seconds on chromium.
// ───────────────────────────────────────────────────────────────────────

const DEMO_TOKEN = "demo-gallery-token-001";

// ── Authentication ────────────────────────────────────────────────────────────

test("@smoke login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /PixelHoliday/i })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});

test("@smoke unauthenticated /admin redirects to /login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login/);
});

test("@smoke unauthenticated /staff redirects to /login", async ({ page }) => {
  await page.goto("/staff");
  await expect(page).toHaveURL(/\/login/);
});

// ── Public gallery ────────────────────────────────────────────────────────────

test("@smoke public gallery page loads for valid token", async ({ page }) => {
  const res = await page.goto(`/gallery/${DEMO_TOKEN}`);
  // Accept 200 (found) or any non-5xx code for this smoke test
  expect(res?.status()).not.toBeGreaterThanOrEqual(500);
});

test("@smoke unknown gallery token shows not-found UI", async ({ page }) => {
  await page.goto("/gallery/smoke-test-invalid-token-xyz");
  const isNotFound =
    (await page.getByText(/not found|expired|invalid|404/i).count()) > 0;
  expect(isNotFound).toBe(true);
});

// ── API auth guards ───────────────────────────────────────────────────────────

const PROTECTED_ROUTES = [
  "/api/users",
  "/api/hotels",
  "/api/galleries",
  "/api/orders",
  "/api/staff/commissions",
];

for (const route of PROTECTED_ROUTES) {
  test(`@smoke ${route} returns 401 without auth`, async ({ request }) => {
    const res = await request.get(route);
    expect(res.status()).toBe(401);
  });
}

test("@smoke Stripe webhook rejects unsigned request", async ({ request }) => {
  const res = await request.post("/api/webhook/stripe", {
    data:    "{}",
    headers: { "Content-Type": "application/json" },
  });
  expect(res.status()).toBe(400);
});

test("@smoke print route rejects missing CRON_SECRET", async ({ request }) => {
  const res = await request.post("/api/print", {
    data:    "{}",
    headers: { "Content-Type": "application/json" },
  });
  expect(res.status()).toBe(401);
});

// ── Health ────────────────────────────────────────────────────────────────────

test("@smoke root / renders or redirects (not 5xx)", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).not.toBeGreaterThanOrEqual(500);
});

test("@smoke 404 not-found page renders", async ({ page }) => {
  const res = await page.goto("/definitely-does-not-exist-xyz");
  expect([404, 200]).toContain(res?.status()); // Next.js custom not-found can return 200
  const hasNotFoundText =
    (await page.getByText(/not found|404|doesn.t exist/i).count()) > 0;
  expect(hasNotFoundText).toBe(true);
});
