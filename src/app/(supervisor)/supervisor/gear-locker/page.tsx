import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/prisma";
import { GearLockerClient } from "@/components/supervisor/GearLockerClient";

export const runtime = "edge";
export const metadata = { title: "Gear Locker" };

export default async function GearLockerPage() {
  const session = await auth();
  const hotelId = session!.user.hotelId!;
  const [assets, staff, recentLogs] = await Promise.all([
    db.asset.findMany({ where: { hotelId }, include: { assignedUser: { select: { id: true, name: true } }, logs: { orderBy: { timestamp: "desc" }, take: 1 } }, orderBy: [{ type: "asc" }, { status: "asc" }] }),
    db.user.findMany({ where: { hotelId, isActive: true, role: "STAFF" }, select: { id: true, name: true } }),
    db.assetLog.findMany({ where: { asset: { hotelId } }, include: { asset: { select: { name: true, type: true, serialNumber: true } }, loggedBy: { select: { name: true } }, assignedTo: { select: { name: true } } }, orderBy: { timestamp: "desc" }, take: 20 }),
  ]);
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">🎒 Gear Locker</h1><p className="text-muted-foreground">Daily camera and equipment check-in / check-out</p></div>
      <GearLockerClient assets={assets} staff={staff} recentLogs={recentLogs} />
    </div>
  );
}
