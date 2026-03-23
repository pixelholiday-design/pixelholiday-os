"use client";
// src/components/booking/BookingKanban.tsx
// Kanban board for the booking pipeline.
// Cards link to detail page; + button opens new-lead modal.
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge }          from "@/components/ui/badge";
import { Button }         from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/format";
import { Plus, Phone, Loader2, X, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Lead {
  id:            string;
  customerName:  string;
  contactNumber: string | null;
  email:         string | null;
  source:        string;
  depositAmount: number | null;
  shootDate:     Date | null;
  createdAt:     Date;
}

interface Column {
  status: string;
  label:  string;
  color:  string;
  leads:  Lead[];
}

// ─── New-lead modal ───────────────────────────────────────────────────────────
function NewLeadModal({
  hotelId,
  onClose,
  onCreated,
}: {
  hotelId:   string;
  onClose:   () => void;
  onCreated: (lead: Lead) => void;
}) {
  const [customerName,  setCustomerName]  = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email,         setEmail]         = useState("");
  const [source,        setSource]        = useState("WALK_IN");
  const [notes,         setNotes]         = useState("");
  const [loading,       setLoading]       = useState(false);
  const [err,           setErr]           = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName.trim()) { setErr("Name is required"); return; }
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/booking/leads", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName:  customerName.trim(),
          contactNumber: contactNumber.trim() || null,
          email:         email.trim()         || null,
          source,
          notes:         notes.trim()         || null,
          hotelId,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to create lead");
      }
      const { data } = await res.json();
      onCreated(data);
      onClose();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="font-semibold text-white">New Lead</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Customer Name *</label>
            <input
              type="text"
              autoFocus
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. John Smith"
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder-gray-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Phone</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+66 8x xxx xxxx"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@email.com"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="WALK_IN">Walk-in</option>
              <option value="HOTEL_REFERRAL">Hotel Referral</option>
              <option value="WEBSITE">Website</option>
              <option value="SOCIAL_MEDIA">Social Media</option>
              <option value="MANUAL">Manual Entry</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Initial notes…"
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder-gray-600"
            />
          </div>

          {err && (
            <p className="text-sm text-red-400 flex items-center gap-1.5">
              <span>⚠</span> {err}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-sm rounded-lg transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {loading ? "Creating…" : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Kanban ──────────────────────────────────────────────────────────────
export function BookingKanban({
  columns,
  hotelId,
}: {
  columns: Column[];
  hotelId: string | null;
}) {
  const router = useRouter();
  const [cols,        setCols]        = useState(columns);
  const [showNewLead, setShowNewLead] = useState(false);

  async function moveCard(leadId: string, newStatus: string) {
    await fetch(`/api/booking/leads/${leadId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status: newStatus }),
    });

    setCols((prev) =>
      prev.map((col) => {
        if (col.leads.some((l) => l.id === leadId)) {
          return { ...col, leads: col.leads.filter((l) => l.id !== leadId) };
        }
        if (col.status === newStatus) {
          const lead = columns.flatMap((c) => c.leads).find((l) => l.id === leadId);
          return lead ? { ...col, leads: [...col.leads, lead] } : col;
        }
        return col;
      })
    );
  }

  function handleLeadCreated(lead: Lead) {
    setCols((prev) =>
      prev.map((col) =>
        col.status === "NEW_LEAD"
          ? { ...col, leads: [lead, ...col.leads] }
          : col
      )
    );
  }

  return (
    <>
      {showNewLead && hotelId && (
        <NewLeadModal
          hotelId={hotelId}
          onClose={() => setShowNewLead(false)}
          onCreated={handleLeadCreated}
        />
      )}

      <div className="flex-1 overflow-x-auto p-6">
        {/* New lead button */}
        <div className="mb-4">
          <Button
            onClick={() => setShowNewLead(true)}
            size="sm"
            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Lead
          </Button>
        </div>

        <div className="flex gap-4 h-full min-w-max pb-4">
          {cols.map((col) => (
            <div key={col.status} className="w-72 flex flex-col">
              <div className={`rounded-t-xl border-2 px-4 py-3 ${col.color}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{col.label}</span>
                  <Badge variant="secondary">{col.leads.length}</Badge>
                </div>
              </div>

              <div className="flex-1 bg-muted/30 border-x-2 border-b-2 border-border rounded-b-xl p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-360px)]">
                {col.leads.map((lead) => (
                  <div key={lead.id} className="group relative">
                    <Link href={`/booking/leads/${lead.id}`}>
                      <div className="bg-card border border-border shadow-sm hover:shadow-md hover:border-amber-500/50 transition-all rounded-lg p-3 space-y-2 cursor-pointer">
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-sm">{lead.customerName}</p>
                          <Badge variant="outline" className="text-xs shrink-0">{lead.source}</Badge>
                        </div>

                        {lead.contactNumber && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {lead.contactNumber}
                          </div>
                        )}

                        {lead.shootDate && (
                          <p className="text-xs text-muted-foreground">
                            📅 {format(new Date(lead.shootDate), "dd MMM yyyy")}
                          </p>
                        )}

                        {lead.depositAmount && (
                          <p className="text-xs font-medium text-green-600">
                            💳 Deposit: {formatCurrency(lead.depositAmount)}
                          </p>
                        )}
                      </div>
                    </Link>

                    {/* Status movers — shown below card */}
                    <div className="flex gap-1 flex-wrap mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {cols
                        .filter((c) => c.status !== col.status)
                        .slice(0, 2)
                        .map((target) => (
                          <Button
                            key={target.status}
                            variant="ghost"
                            size="sm"
                            className="text-xs h-6 px-2"
                            onClick={() => moveCard(lead.id, target.status)}
                          >
                            → {target.label.split(" ").slice(1).join(" ")}
                          </Button>
                        ))}
                    </div>
                  </div>
                ))}

                {col.leads.length === 0 && (
                  <p className="text-center text-muted-foreground text-xs py-8">
                    No leads here
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
