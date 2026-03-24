// Edge-runtime stub: next-auth v5 uses jose which requires DecompressionStream (Node.js-only).
// Cloudflare Workers edge runtime does not provide DecompressionStream, so we export no-op stubs
// that preserve the module interface without importing next-auth at build/runtime.
//
// PREVIEW MODE: injects a mock CEO session so the middleware allows access to all portals.
// Replace with real NextAuth config when authentication is wired up.

const MOCK_SESSION = {
  user: {
    id: "preview-user",
    role: "CEO",
    hotelId: "",
    territoryId: "",
    name: "Preview User",
    email: "preview@pixelholiday.com",
  },
};

export const auth: any = (reqOrHandler?: any) => {
    if (typeof reqOrHandler === "function") {
        return async (req: any, ctx?: any) => {
            req.auth = MOCK_SESSION;
            return reqOrHandler(req, ctx);
        };
    }
    return MOCK_SESSION;
};

export const handlers = {
    GET: async (_req: Request) =>
        new Response(JSON.stringify({ error: "auth not configured" }), {
            status: 200,
            headers: { "content-type": "application/json" },
        }),
    POST: async (_req: Request) =>
        new Response(JSON.stringify({ error: "auth not configured" }), {
            status: 200,
            headers: { "content-type": "application/json" },
        }),
};

export const signIn = async (..._args: any[]) => {};
export const signOut = async (..._args: any[]) => {};
