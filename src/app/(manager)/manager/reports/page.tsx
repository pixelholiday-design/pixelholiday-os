// src/app/(manager)/manager/reports/page.tsx
// Manager — financial & performance reports for their territory
import { db } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils/format";
import { format } from "date-fns";

export const runtime = "edge";

export default async function ManagerReportsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["CEO", "MANAGER"].includes(session.user.role as string)) redirect("/login");

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Revenue summary for manager's territory (territory-scoped via hotelId if set)
  const whereClause = session.user.role === "MANAGER" && session.user.hotelId
    ? { gallery: { hotelId: session.user.hotelId } }
    : {};

  const orders = await db.order.findMany({
    where: {
      ...whereClause,
      createdAt: { gte: thirtyDaysAgo },
      status: "COMPLETED",
    },
    include: {
      gallery: { include: { hotel: { select: { id: true, name: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Commission totals
  const commissions = await db.commissionEntry.aggregate({
    where: {
      createdAt: { gte: thirtyDaysAgo },
      ...(session.user.hotelId && {
        order: { gallery: { hotelId: session.user.hotelId } },
      }),
    },
    _sum: { amount: true },
  });

  const commissionTotal = commissions._sum.amount ?? 0;
  const netRevenue = totalRevenue - commissionTotal;

  // Serialise dates so they can be rendered in JSX
  const recentOrders = orders.slice(0, 50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">30-Day Performance Report</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Revenue, commissions, and order metrics</p>
      </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Revenue",    value: `฿${(totalRevenue/1000).toFixed(1)}k`,   color: "text-amber-400" },
              { label: "Orders",           value: orders.length.toString(),                color: "text-white" },
              { label: "Avg Order Value",  value: `฿${avgOrderValue.toFixed(0)}`,          color: "text-white" },
              { label: "Net Revenue",      value: `฿${(netRevenue/1000).toFixed(1)}k`,     color: "text-emerald-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <p className="text-gray-500 text-xs mb-1">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders Table */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800">
              <h3 className="text-sm font-semibold text-white">
                Recent Orders ({recentOrders.length})
              </h3>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm p-4">No orders in the last 30 days.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wide">
                      <th className="text-left px-4 py-2">Date</th>
                      <th className="text-left px-4 py-2">Hotel</th>
                      <th className="text-left px-4 py-2">Guest</th>
                      <th className="text-right px-4 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {recentOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-2.5 text-gray-400 whitespace-nowrap">
                          {format(new Date(o.createdAt), "d MMM yyyy")}
                        </td>
                        <td className="px-4 py-2.5 text-gray-300">
                          {o.gallery?.hotel?.name ?? "—"}
                        </td>
                        <td className="px-4 py-2.5 text-gray-400">
                          {o.guestName ?? "Guest"}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono font-medium text-amber-400">
                          {formatCurrency(o.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-gray-700">
                    <tr>
                      <td colSpan={3} className="px-4 py-2.5 text-gray-400 text-xs">
                        Total (showing {recentOrders.length} of {orders.length})
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-white">
                        {formatCurrency(totalRevenue)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
    </div>
  );
}
