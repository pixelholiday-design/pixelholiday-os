// src/app/(franchise)/franchise/commissions/page.tsx
// Franchise owner — their commission wallet, history, and payout status
import { db } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function FranchiseCommissionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "FRANCHISE") redirect("/login");

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [commission, recentEntries] = await Promise.all([
    // Get franchise commission record
    db.commission.findFirst({
      where: { userId: session.user.id },
    }),
    // Recent commission entries
    db.commissionEntry.findMany({
      where: {
        userId:    session.user.id,
        createdAt: { gte: thirtyDaysAgo },
      },
      include: {
        order: {
          include: {
            gallery: {
              include: { hotel: { select: { name: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const totalEarned  = recentEntries.reduce((s, e) => s + e.amount, 0);
  const totalPaid    = recentEntries.filter((e) => e.isPaid).reduce((s, e) => s + e.amount, 0);
  const pendingPayout = totalEarned - totalPaid;

  return (
    <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Commission Wallet</h2>
            <p className="text-gray-400 text-sm mt-0.5">30-day earnings summary and payout history</p>
          </div>

          {/* Wallet cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 border border-amber-700/40 rounded-xl p-5">
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">Pending Payout</p>
              <p className="text-3xl font-bold text-amber-300">฿{pendingPayout.toFixed(2)}</p>
              <p className="text-amber-500/70 text-xs mt-1">Awaiting transfer</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Earned (30d)</p>
              <p className="text-3xl font-bold text-white">฿{totalEarned.toFixed(2)}</p>
              <p className="text-gray-500 text-xs mt-1">{recentEntries.length} orders</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Paid Out (30d)</p>
              <p className="text-3xl font-bold text-emerald-400">฿{totalPaid.toFixed(2)}</p>
              <p className="text-gray-500 text-xs mt-1">
                Rate: {commission?.rate != null ? `${(commission.rate * 100).toFixed(0)}%` : "—"}
              </p>
            </div>
          </div>

          {/* Commission history table */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800">
              <h3 className="text-sm font-semibold">Commission History</h3>
            </div>
            {recentEntries.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No commissions in the last 30 days</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b border-gray-800">
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Hotel</th>
                    <th className="text-left p-3">Order Total</th>
                    <th className="text-left p-3">Commission</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEntries.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="p-3 text-gray-400 text-xs">
                        {entry.createdAt.toLocaleDateString()}
                      </td>
                      <td className="p-3 text-gray-300">
                        {entry.order?.gallery?.hotel?.name ?? "—"}
                      </td>
                      <td className="p-3 text-white">
                        ฿{entry.order?.totalAmount.toFixed(2) ?? "—"}
                      </td>
                      <td className="p-3 text-amber-400 font-semibold">
                        ฿{entry.amount.toFixed(2)}
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          entry.isPaid
                            ? "bg-emerald-900/40 text-emerald-400"
                            : "bg-amber-900/40 text-amber-400"
                        }`}>
                          {entry.isPaid ? "Paid" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
    </div>
  );
}
