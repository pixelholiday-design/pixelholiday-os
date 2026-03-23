// src/app/(admin)/admin/territories/page.tsx
// CEO-only: list territories and create new ones
import { db } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Globe, Hotel, Users, Plus, ChevronRight } from "lucide-react";
import NewTerritoryForm from "./NewTerritoryForm";

export const runtime = "edge";

export default async function TerritoriesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "CEO") redirect("/admin");

  const territories = await db.territory.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { hotels: true, users: true } },
    },
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5 text-amber-400" />
            Territory Network
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {territories.length} territories in the PixelHoliday network
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Territory list */}
        <div className="lg:col-span-2 space-y-3">
          {territories.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500">
              No territories yet. Create your first territory →
            </div>
          ) : (
            territories.map((t) => (
              <div
                key={t.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between hover:border-amber-500/30 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-amber-500/10 rounded-lg shrink-0">
                    <Globe className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {t.country}{t.region ? ` · ${t.region}` : ""}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Hotel className="h-3.5 w-3.5" />
                        {t._count.hotels} hotel{t._count.hotels !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Users className="h-3.5 w-3.5" />
                        {t._count.users} user{t._count.users !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-mono text-gray-600 select-all">{t.id}</p>
                    <p className="text-xs text-gray-600 mt-0.5">territory ID</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-700 group-hover:text-amber-400 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create new territory */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">New Territory</h3>
            </div>
            <NewTerritoryForm />
          </div>

          {/* ID helper */}
          <div className="mt-4 bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-xs text-gray-500">
            <p className="font-medium text-gray-400 mb-1">💡 Creating a Hotel?</p>
            <p>
              Copy the Territory ID from the list and paste it into the
              Territory ID field on the{" "}
              <Link href="/admin/hotels/new" className="text-amber-400 hover:underline">
                New Hotel
              </Link>{" "}
              form.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
