// src/app/(franchise)/franchise/territory/page.tsx
// Franchise owner — territory overview: all hotels, gallery pipeline, total RPG
import { db } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function FranchiseTerritoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "FRANCHISE") redirect("/login");

  // Get all hotels in franchise's territory
  const territory = await db.territory.findFirst({
    where: {
      users: {
        some: { id: session.user.id },
      },
    },
    include: {
      hotels: {
        where: { isActive: true },
        include: {
          _count: {
            select: {
              galleries: {
                where: {
                  status: "ACTIVE",
                  expiresAt: { gte: new Date() },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!territory) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        No territory assigned. Contact your manager.
      </div>
    );
  }

  // Revenue metrics per hotel (last 30d)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const hotelIds = territory.hotels.map((h) => h.id);

  const metrics = await db.order.groupBy({
    by:     ["galleryId"],
    where: {
      gallery:   { hotelId: { in: hotelIds } },
      createdAt: { gte: thirtyDaysAgo },
      status:    "COMPLETED",
    },
    _sum:   { totalAmount: true },
    _count: { id: true },
  });

  // Build hotel → revenue map by joining through galleries
  const galleries = await db.gallery.findMany({
    where: { id: { in: metrics.map((m) => m.galleryId) } },
    select: { id: true, hotelId: true },
  });
  const galleryHotelMap = new Map(galleries.map((g) => [g.id, g.hotelId]));

  const hotelRevMap = new Map<string, number>();
  for (const m of metrics) {
    const hId = galleryHotelMap.get(m.galleryId);
    if (hId) hotelRevMap.set(hId, (hotelRevMap.get(hId) ?? 0) + (m._sum.totalAmount ?? 0));
  }

  const totalRevenue = [...hotelRevMap.values()].reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">{territory.name}</h2>
              <p className="text-gray-400 text-sm mt-0.5">
                {territory.hotels.length} active hotel{territory.hotels.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-400">฿{(totalRevenue / 1000).toFixed(1)}k</p>
              <p className="text-xs text-gray-500">Revenue (30d)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {territory.hotels.map((hotel) => {
              const rev = hotelRevMap.get(hotel.id) ?? 0;
              const activeGalleries = hotel._count.galleries;
              return (
                <div key={hotel.id}
                     className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-amber-500/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{hotel.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{activeGalleries} active galleries</p>
                    </div>
                    <span className="text-xs bg-emerald-900/40 text-emerald-400 px-2 py-1 rounded-full">Active</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-lg font-bold text-amber-400">฿{rev.toFixed(0)}</p>
                      <p className="text-xs text-gray-500">Revenue (30d)</p>
                    </div>
                    <div className="h-8 w-px bg-gray-800" />
                    <div>
                      <p className="text-lg font-bold text-white">{activeGalleries}</p>
                      <p className="text-xs text-gray-500">Open galleries</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
    </div>
  );
}
