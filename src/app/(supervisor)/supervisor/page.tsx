import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardwareHealthGrid } from "@/components/supervisor/HardwareHealthGrid";
import { StaffDispatchBoard } from "@/components/supervisor/StaffDispatchBoard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const runtime = "edge";
export const metadata = { title: "Supervisor HQ" };

export default async function SupervisorDashboardPage() {
  const session = await auth();
  const hotelId = session!.user.hotelId!;

  const [hardware, activeStaff, todayOrders, openTickets] = await Promise.all([
    db.hardwareStatus.findMany({ where: { hotelId } }),
    db.user.findMany({
      where: { hotelId, role: "STAFF", isActive: true },
      include: { assignedAssets: { where: { type: "CAMERA" } } },
    }),
    db.order.count({
      where: { status: "COMPLETED", createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) }, gallery: { hotelId } },
    }),
    db.supportTicket.count({ where: { hotelId, status: { in: ["OPEN", "IN_PROGRESS"] } } }),
  ]);

  const offlineDevices = hardware.filter((h) => !h.isOnline).length;
  const lowInk = hardware.filter((h) => (h.inkLevelCyan != null && h.inkLevelCyan < 20) || (h.inkLevelMagenta != null && h.inkLevelMagenta < 20)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Supervisor HQ</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link href="/supervisor/z-report">📊 Submit Z-Report</Link></Button>
          <Button asChild><Link href="/supervisor/gear-locker">🎒 Gear Locker</Link></Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Today's Orders</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{todayOrders}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Staff on Duty</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{activeStaff.length}</p></CardContent></Card>
        <Card className={offlineDevices > 0 ? "border-red-300" : ""}><CardHeader className="pb-2"><CardTitle className="text-sm">Devices Offline</CardTitle></CardHeader><CardContent><p className={`text-2xl font-bold ${offlineDevices > 0 ? "text-red-600" : "text-green-600"}`}>{offlineDevices}</p></CardContent></Card>
        <Card className={openTickets > 0 ? "border-yellow-300" : ""}><CardHeader className="pb-2"><CardTitle className="text-sm">Open Tickets</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-yellow-600">{openTickets}</p></CardContent></Card>
      </div>
      <HardwareHealthGrid devices={hardware} />
      <StaffDispatchBoard staff={activeStaff} />
    </div>
  );
}
