// src/app/api/cms/posts/[id]/route.ts
export const runtime = "edge";
export { GET, PATCH, DELETE } from "./handlers";
