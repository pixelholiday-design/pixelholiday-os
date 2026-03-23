"use client";
// src/app/(booking)/booking/leads/[id]/LeadDetailClient.tsx
// Editable lead detail form: status, notes, shoot date, deposit
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Phone, Mail, Calendar, DollarSign,
  CheckCircle2, Loader2, AlertTriangle, Pencil, Trash2,
} from "lucide-react";

interface LeadData {
  id:            string;
  customerName:  string;
  contactNumber: string | null;
  email:         string | null;
  source:        string;
  status:        string;
  shootDate:     string | null;
  depositAmount: number | null;
  depositPaidAt: string | null;
  notes:         string | null;
  updatedAt:     string;
}

const STATUS_OPTIONS = [
  { value: "NEW_LEAD",           label: "🆕 New Lead" },
  { value: "CONTACTED",          label: "📞 Contacted" },
  { value: "DEPOSIT_PAID",       label: "💳 Deposit Paid" },
  { value: "SHOOTING_SCHEDULED", label: "📅 Shoot Scheduled" },
  { value: "COMPLETED",          label: "✅ Completed" },
  { value: "CANCELLED",          label: "❌ Cancelled" },
];

export default function LeadDetailClient({
  lead,
  canEdit,
  canDelete,
  hotelName,
}: {
  lead:      LeadData;
  canEdit:   boolean;
  canDelete: boolean;
  hotelName: string;
}) {
  const router = useRouter();

  // Form state
  const [status,        setStatus]        = useState(lead.status);
  const [notes,         setNotes]         = useState(lead.notes ?? "");
  const [shootDate,     setShootDate]     = useState(lead.shootDate ? lead.shootDate.slice(0, 10) : "");
  const [depositAmount, setDepositAmount] = useState(lead.depositAmount?.toString() ?? "");
  const [saving,        setSaving]        = useState(false);
  const [saveMsg,       setSaveMsg]       = useState("");
  const [saveErr,       setSaveErr]       = useState("");

  // Delete confirm
  const [deleteStep,    setDeleteStep]    = useState<"idle" | "confirm" | "deleting">("idle");

  async function handleSave() {
    setSaving(true);
    setSaveMsg("");
    setSaveErr("");
    try {
      const res = await fetch(`/api/booking/leads/${lead.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          notes:         notes         || null,
          shootDate:     shootDate     ? new Date(shootDate).toISOString()   : null,
          depositAmount: depositAmount ? parseFloat(depositAmount)           : null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Save failed");
      }
      setSaveMsg("Saved!");
      router.refresh();
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (e: any) {
      setSaveErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleteStep("deleting");
    try {
      const res = await fetch(`/api/booking/leads/${lead.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/booking");
    } catch {
      setDeleteStep("idle");
    }
  }

  return (
    <div className="space-y-6">
      {/* Contact info — read-only */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Contact</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {lead.contactNumber && (
            <div className="flex items-center gap-2 text-gray-300">
              <Phone className="h-4 w-4 text-gray-500 shrink-0" />
              <a href={`tel:${lead.contactNumber}`} className="hover:text-white transition-colors">
                {lead.contactNumber}
              </a>
            </div>
          )}
          {lead.email && (
            <div className="flex items-center gap-2 text-gray-300">
              <Mail className="h-4 w-4 text-gray-500 shrink-0" />
              <a href={`mailto:${lead.email}`} className="hover:text-white transition-colors">
                {lead.email}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-xs bg-gray-800 px-2 py-1 rounded font-mono">{lead.source}</span>
            <span className="text-xs text-gray-600">source</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            Last updated {format(new Date(lead.updatedAt), "d MMM yyyy, HH:mm")}
          </div>
        </div>
      </div>

      {/* Editable fields */}
      {canEdit ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Details</h2>

          {/* Status */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Shoot date */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              <Calendar className="inline h-3.5 w-3.5 mr-1" />
              Shoot Date
            </label>
            <input
              type="date"
              value={shootDate}
              onChange={(e) => setShootDate(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Deposit */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              <DollarSign className="inline h-3.5 w-3.5 mr-1" />
              Deposit Amount (฿)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              <Pencil className="inline h-3.5 w-3.5 mr-1" />
              Notes
            </label>
            <textarea
              rows={5}
              placeholder="Add notes about this lead…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder-gray-600"
            />
          </div>

          {/* Save row */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-sm">
              {saveMsg && (
                <span className="flex items-center gap-1.5 text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  {saveMsg}
                </span>
              )}
              {saveErr && (
                <span className="flex items-center gap-1.5 text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                  {saveErr}
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-sm rounded-xl transition-colors"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      ) : (
        /* Read-only view for STAFF */
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Details</h2>
          {lead.shootDate && (
            <p className="text-sm text-gray-300">
              <Calendar className="inline h-4 w-4 text-gray-500 mr-2" />
              Shoot on {format(new Date(lead.shootDate), "d MMMM yyyy")}
            </p>
          )}
          {lead.depositAmount && (
            <p className="text-sm text-gray-300">
              <DollarSign className="inline h-4 w-4 text-gray-500 mr-2" />
              Deposit ฿{lead.depositAmount.toLocaleString()}
            </p>
          )}
          {lead.notes && (
            <p className="text-sm text-gray-400 whitespace-pre-wrap border-l-2 border-gray-700 pl-3">
              {lead.notes}
            </p>
          )}
          {!lead.shootDate && !lead.depositAmount && !lead.notes && (
            <p className="text-sm text-gray-600">No additional details.</p>
          )}
        </div>
      )}

      {/* Danger Zone */}
      {canDelete && (
        <div className="bg-gray-900 border border-red-900/40 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-3">Danger Zone</h2>
          {deleteStep === "idle" && (
            <button
              onClick={() => setDeleteStep("confirm")}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/40 text-sm font-medium rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Lead
            </button>
          )}
          {deleteStep === "confirm" && (
            <div className="space-y-3">
              <p className="text-sm text-red-300">
                Permanently delete this lead for <strong>{lead.customerName}</strong>? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteStep("idle")}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          )}
          {deleteStep === "deleting" && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Deleting…
            </div>
          )}
        </div>
      )}
    </div>
  );
}
