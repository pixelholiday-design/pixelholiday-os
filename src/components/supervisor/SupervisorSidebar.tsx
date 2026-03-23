"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, Package2, Calendar, Camera, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/supervisor",              label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/supervisor/dispatch",     label: "Daily Dispatch", icon: Calendar },
  { href: "/supervisor/z-report",     label: "Z-Report",     icon: FileText },
  { href: "/supervisor/gear-locker",  label: "Gear Locker",  icon: Package2 },
  { href: "/booking",                 label: "Bookings",     icon: Camera },
];

export function SupervisorSidebar() {
  const pathname = usePathname();

  function isActive(item: typeof NAV_ITEMS[0]) {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  }

  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 text-white flex flex-col flex-shrink-0 h-screen sticky top-0">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-amber-400" />
          <div>
            <p className="font-bold text-sm text-white">PixelHoliday</p>
            <p className="text-xs text-gray-500">Supervisor HQ</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-amber-400" : "")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-800">
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Link>
      </div>
    </aside>
  );
}
