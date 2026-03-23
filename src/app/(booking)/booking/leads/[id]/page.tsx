// src/app/(booking)/booking/leads/[id]/page.tsx
// Lead detail page — status timeline, editable fields, notes
import { db } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import LeadDetailClient from "./LeadDetailClient";

export const runtime = "edge";

const STATUS_ORDER = [
  "NEW_LEAD",
  "CONTACTED",
  "DEPOSIT_PAID",
  "SHOOTING_SCHEDULED",
  "COMPLETED",
  "CANCELLED",
] as const;

const STATUS_META: Record<string, { label: string; color: string; emoji: string }> = {
  NEW_LEAD:            { label: "New Lead",         color: "bg-blue-500/20 text-blue-300 border-blue-500/40",     emoji: "🆕" },
  CONTACTED:           { label: "Contacted",         color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40", emoji: "📞" },
  DEPOSIT_PAID:        { label: "Deposit Paid",      color: "bg-orange-500/20 text-orange-300 border-orange-500/40", emoji: "💳" },
  SHOOTING_SCHEDULED:  { label: "Shoot Scheduled",   color: "bg-purple-500/20 text-purple-300 border-purple-500/40", emoji: "📅" },
  COMPLETED:           { label: "Completed",         color: "bg-green-500/20 text-green-300 border-green-500/40",   emoji: "✅" },
  CANCELLED:           { label: "Cancelled",         color: "bg-red-500/20 text-red-300 border-red-500/40",         emoji: "❌" },
};

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const lead = await db.bookingLead.findUnique({
    where: { id: params.id },
    include: {
      hotel: { select: { id: true, name: true } },
    },
  });

  if (!lead) notFound();

  // Scope-check
  if (
    ["FRANCHISE", "SUPERVISOR", "STAFF"].includes(session.user.role as string) &&
    session.user.hotelId &&
    lead.hotelId !== session.user.hotelId
  ) {
    redirect("/booking");
  }

  const canEdit   = ["CEO", "MANAGER", "FRANCHISE", "SUPERVISOR"].includes(session.user.role as string);
  const canDelete = ["CEO", "MANAGER"].includes(session.user.role as string);

  const currentStatusIdx = STATUS_ORDER.indexOf(lead.status as any);

  return (
    <div className="text-white">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/booking" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Pipeline
          </Link>
          <span className="text-xs text-gray-600">{lead.hotel.name}</span>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">{lead.customerName}</h1>
            <p className="text-gray-400 mt-1 text-sm">Created {format(new Date(lead.createdAt), "d MMMM yyyy 'at' HH:mm")}</p>
          </div>
          {(() => { const m = STATUS_META[lead.status]; return (<span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${m.color}`}>{m.emoji} {m.label}</span>); })()}
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-5">Progress</h2>
          <div className="flex items-center gap-0">
            {STATUS_ORDER.filter((s) => s !== "CANCELLED").map((s, i, arr) => {
              const m = STATUS_META[s];
              const reached = STATUS_ORDER.indexOf(s) <= currentStatusIdx && lead.status !== "CANCELLED";
              const isActive = s === lead.status && lead.status !== "CANCELLED";
              return (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${isActive ? "border-amber-400 bg-amber-400/20 text-amber-300" : reached ? "border-green-500 bg-green-500/20 text-green-400" : "border-gray-700 bg-gray-800 text-gray-600"}`}>
                      {reached && !isActive ? "✓" : m.emoji}
                    </div>
                    <span className={`text-xs text-center leading-tight max-w-[60px] ${isActive ? "text-amber-300 font-medium" : reached ? "text-gray-300" : "text-gray-600"}`}>{m.label.split(" ").join("\n")}</span>
                  </div>
                  {i < arr.length - 1 && (<div className={`flex-1 h-0.5 mx-1 mb-5 ${reached && STATUS_ORDER.indexOf(arr[i + 1]) <= currentStatusIdx ? "bg-green-500/50" : "bg-gray-800"}`} />)}
                </div>
              );
            })}
          </div>
          {lead.status === "CANCELLED" && (<p className="text-center text-red-400 text-sm mt-4 font-medium">❌ This lead was cancelled</p>)}
        </div>
        <LeadDetailClient lead={{id: lead.id, customerName: lead.customerName, contactNumber: lead.contactNumber, email: lead.email, source: lead.source, status: lead.status, shootDate: lead.shootDate?.toISOString() ?? null, depositAmount: lead.depositAmount, depositPaidAt: lead.depositPaidAt?.toISOString() ?? null, notes: lead.notes, updatedAt: lead.updatedAt.toISOString()}} canEdit={canEdit} canDelete={canDelete} hotelName={lead.hotel.name} />
      </main>
    </div>
  );
}
