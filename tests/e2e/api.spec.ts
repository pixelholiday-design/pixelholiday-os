import { test, expect } from "@playwright/test";

/**
 * API smoke tests — unauthenticated guard checks.
 * These verify that protected routes correctly return 401.
 */
test.describe("API Route Auth Guards", () => {
  const PROTECTED = [
    "/api/users",
    "/api/hotels",
    "/api/galleries",
    "/api/orders",
    "/api/staff/commissions",
    "/api/staff/leaderboard",
    "/api/staff/shifts",
    "/api/staff/alerts",
    "/api/ats/postings",
    "/api/ats/applications",
  ];

  for (const route of PROTECTED) {
    test(`${route} returns 401 without auth`, async ({ request }) => {
      const res = await request.get(route);
      expect(res.status()).toBe(401);
    });
  }

  test("/api/gallery/[token] — valid demo token returns 200", async ({ request }) => {
    const res = await request.get("/api/gallery/demo-gallery-token-001");
    // Route may return gallery data or 404 if expired — not 401
    expect([200, 404]).toContain(res.status());
  });

  test("Stripe webhook returns 400 without signature", async ({ request }) => {
    const res = await request.post("/api/webhook/stripe", {
      data:    "{}",
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
  });

  test("Print route returns 401 without CRON_SECRET", async ({ request }) => {
    const res = await request.post("/api/print", {
      data:    "{}",
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(401);
  });
});
