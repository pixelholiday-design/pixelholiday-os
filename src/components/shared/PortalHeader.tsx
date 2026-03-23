"use client";

import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Bell } from "lucide-react";
import type { Role } from "@prisma/client";

const ROLE_COLORS: Record<Role, string> = {
  CEO:        "bg-purple-100 text-purple-800",
  MANAGER:    "bg-blue-100 text-blue-800",
  FRANCHISE:  "bg-green-100 text-green-800",
  SUPERVISOR: "bg-orange-100 text-orange-800",
  STAFF:      "bg-gray-100 text-gray-800",
};

interface User {
  id:          string;
  name?:       string | null;
  email?:      string | null;
  image?:      string | null;
  role:        Role;
  hotelId?:    string | null;
}

// Accept `title` as an alias for `portalName` so pages can use either prop
export function PortalHeader({
  user,
  portalName,
  title,
}: {
  user:        User;
  portalName?: string;
  title?:      string;
}) {
  const heading = title ?? portalName ?? "Portal";
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 flex-shrink-0">
      <h2 className="font-semibold text-muted-foreground">{heading}</h2>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>

        <Badge variant="secondary" className={ROLE_COLORS[user.role]}>
          {user.role}
        </Badge>

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback>{user.name?.charAt(0) ?? "U"}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden md:block">{user.name}</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

export default PortalHeader;
