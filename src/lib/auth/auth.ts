// Edge-runtime stub: next-auth v5 uses jose which requires DecompressionStream (Node.js-only).
// Cloudflare Workers edge runtime does not provide DecompressionStream, so we export no-op stubs
// that preserve the module interface without importing next-auth at build/runtime.

export const auth: any = async (reqOrHandler?: any) => {
    if (typeof reqOrHandler === "function") {
          return async (req: Request, ctx?: any) => reqOrHandler(req, ctx);
    }
    return null;
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
