import type { Role } from "@prisma/client";
import type { DefaultSession, DefaultJWT } from "next-auth";
declare module "next-auth" {
  interface Session { user: DefaultSession["user"] & { id: string; role: Role; hotelId: string | null; territoryId: string | null; isActive: boolean; }; }
  interface User { role: Role; hotelId: string | null; territoryId: string | null; isActive: boolean; }
}
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT { id: string; role: Role; hotelId: string | null; territoryId: string | null; isActive: boolean; }
}
