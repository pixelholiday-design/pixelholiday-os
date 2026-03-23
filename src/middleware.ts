import { auth } from "@/lib/auth/auth";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ──────────────────────────────────────────────────────────────────────────────
// PIXELHOLIDAY MASTER OS — Middleware
// Handles:
//   1. next-intl locale detection + rewriting for guest gallery
//   2. NextAuth session check for all protected portals
//   3. RBAC — role-to-portal enforcement
//   4. QStash cron signature verification
// ──────────────────────────────────────────────────────────────────────────────

// ── Supported locales ──────────────────────────────────────────────────────────
const LOCALES = ["en", "de", "fr", "th", "ru", "zh"] as const;
type SupportedLocale = (typeof LOCALES)[number];

// next-intl middleware (only for guest-facing routes)
const intlMiddleware = createIntlMiddleware({
  locales: LOCALES,
  defaultLocale: "en",
  localePrefix: "as-needed", // only adds prefix if not the default locale
});

// ── Role → allowed path prefixes ────────────────────────────────────────────────
const ROLE_ALLOWED_PATHS: Record<string, string[]> = {
  CEO:        ["/admin"],
  MANAGER:    ["/admin", "/manager"],
  FRANCHISE:  ["/franchise"],
  SUPERVISOR: ["/supervisor", "/booking"],
  STAFF:      ["/staff"],
};

// ── Public routes (no auth required) ────────────────────────────────────────────
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/gallery",        // magic-link guest gallery
  "/api/webhook",    // Stripe webhooks
  "/api/cron",       // QStash cron (verified by signature)
  "/api/print",      // printer webhook from local network
  "/api/auth",       // NextAuth endpoints
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function getPortalFromPath(pathname: string): string | null {
  const portals = ["/admin", "/manager", "/franchise", "/supervisor", "/staff", "/booking", "/kiosk"];
  return portals.find((p) => pathname.startsWith(p)) ?? null;
}

// ── Cron HMAC verification ──────────────────────────────────────────────────────
async function isValidQStashRequest(req: NextRequest): Promise<boolean> {
  const signature = req.headers.get("upstash-signature");
  const internalSecret = req.headers.get("x-cron-secret");

  // Internal server-to-server cron calls use a shared secret
  if (internalSecret && internalSecret === process.env.CRON_SECRET) return true;

  // QStash signed requests — delegate full verification to API route handler
  // (verifySignature from @upstash/qstash is run inside the route)
  if (signature) return true;

  return false;
}

export default auth(async function middleware(req) {
  const { pathname } = req.nextUrl;
  const session = req.auth; // NextAuth v5 augmented request

  // ── 1. QStash / Cron auth guard ────────────────────────────────────────────────
  if (pathname.startsWith("/api/cron")) {
    const valid = await isValidQStashRequest(req);
    if (!valid) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    return NextResponse.next();
  }

  // ── 2. Guest gallery — run i18n middleware ────────────────────────────────────
  if (pathname.startsWith("/gallery")) {
    return intlMiddleware(req as unknown as Parameters<typeof intlMiddleware>[0]);
  }

  // ── 3. Public paths — allow through ────────────────────────────────────────────
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // ── 4. All portal routes require an authenticated session ─────────────────────
  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = session.user.role as string;
  const portal   = getPortalFromPath(pathname);

  if (!portal) {
    // Not a portal path and not public → 404-style redirect
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ── 5. RBAC enforcement ────────────────────────────────────────────────────────
  const allowedPaths = ROLE_ALLOWED_PATHS[userRole] ?? [];
  const hasAccess    = allowedPaths.some((p) => pathname.startsWith(p));

  if (!hasAccess) {
    // Redirect to the user's default portal
    const defaultPortal = allowedPaths[0] ?? "/";
    return NextResponse.redirect(new URL(defaultPortal, req.url));
  }

  // ── 6. Franchise scope guard (can only see their own territory) ────────────────
  if (userRole === "FRANCHISE" && pathname.startsWith("/franchise")) {
    // Territory is embedded in session; individual pages validate hotelId/territoryId
    // Middleware just ensures they can reach the route group
  }

  // ── 7. Staff / kiosk mode ─────────────────────────────────────────────────────
  if (pathname.startsWith("/kiosk")) {
    // Kiosk mode requires SUPERVISOR or STAFF and a special env flag or query param
    const kioskMode = req.nextUrl.searchParams.get("kiosk") === "true" ||
                      process.env.NEXT_PUBLIC_KIOSK_MODE === "true";
    if (!kioskMode && !["SUPERVISOR", "CEO", "MANAGER"].includes(userRole)) {
      return NextResponse.redirect(new URL("/staff", req.url));
    }
  }

  // ── 8. Inject user context headers for Server Components ──────────────────────
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id",       session.user.id ?? "");
  requestHeaders.set("x-user-role",     userRole);
  requestHeaders.set("x-user-hotel-id", session.user.hotelId ?? "");
  requestHeaders.set("x-territory-id",  session.user.territoryId ?? "");

  return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|css|js)$).*)",
  ],
};
