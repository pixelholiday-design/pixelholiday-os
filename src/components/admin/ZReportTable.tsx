"use client";
// src/components/admin/ZReportTable.tsx
// Z-Report cash reconciliation table — highlights discrepancies.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils/format";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface ZReport {
  id:                 string;
  reportDate:         Date | string;
  declaredCash:       number;
  systemExpectedCash: number;
  discrepancy:        number;
  notes: string | null;
  signedOffAt:        Date | string | null;
  supervisor:         { name: string | null } | null;
  hotel:              { name: string } | null;
}

function DiscrepancyBadge({ value }: { value: number }) {
  const abs = Math.abs(value);
  if (abs < 1)    return <span className="text-xs text-green-400">✓ Balanced</span>;
  if (abs < 100)  return <span className="text-xs text-amber-400">⚠ {formatCurrency(abs)} {value < 0 ? "under" : "over"}</span>;
  return <span className="text-xs text-red-400 font-semibold">⛔ {formatCurrency(abs)} {value < 0 ? "under" : "over"}</span>;
}

export function ZReportTable({ reports }: { reports: ZReport[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Z-Reports / Cash Reconciliation ({reports.length})</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {reports.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">No Z-Reports in this period.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Hotel</th>
                  <th className="text-left px-4 py-2">Supervisor</th>
                  <th className="text-right px-4 py-2">System Expected</th>
                  <th className="text-right px-4 py-2">Declared Cash</th>
                  <th className="text-right px-4 py-2">Discrepancy</th>
                  <th className="text-center px-4 py-2">Signed Off</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => {
                  const hasBigDisc = Math.abs(r.discrepancy) >= 100;
                  return (
                    <tr key={r.id} className={`border-b border-border transition-colors hover:bg-muted/30 ${hasBigDisc ? "bg-red-950/20" : ""}`}>
                      <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground">
                        {format(new Date(r.reportDate), "d MMM yyyy")}
                      </td>
                      <td className="px-4 py-2.5">{r.hotel?.name ?? "—"}</td>
                      <td className="px-4 py-2.5">{r.supervisor?.name ?? "—"}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{formatCurrency(r.systemExpectedCash)}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{formatCurrency(r.declaredCash)}</td>
                      <td className="px-4 py-2.5 text-right">
                        <DiscrepancyBadge value={r.discrepancy} />
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {r.signedOffAt
                          ? <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                          : <AlertTriangle className="h-4 w-4 text-amber-500 mx-auto" />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
