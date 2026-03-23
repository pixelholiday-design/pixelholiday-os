"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { AssetStatus, AssetType } from "@prisma/client";

interface Asset {
  id:           string;
  name:         string;
  type:         AssetType;
  serialNumber: string;
  status:       AssetStatus;
  assignedUser: { id: string; name: string | null } | null;
}

interface StaffMember {
  id:   string;
  name: string | null;
}

interface AssetLog {
  id:         string;
  action:     string;
  note:       string | null;
  timestamp:  Date;
  asset:      { name: string; type: string; serialNumber: string };
  loggedBy:   { name: string | null };
  assignedTo: { name: string | null } | null;
}

const STATUS_COLORS: Record<AssetStatus, string> = {
  AVAILABLE: "bg-green-100 text-green-800 border-green-300",
  ASSIGNED:  "bg-blue-100 text-blue-800 border-blue-300",
  IN_REPAIR: "bg-yellow-100 text-yellow-800 border-yellow-300",
  LOST:      "bg-red-100 text-red-800 border-red-300",
  RETIRED:   "bg-gray-100 text-gray-800 border-gray-300",
};

const TYPE_EMOJIS: Record<AssetType, string> = {
  CAMERA:   "📷",
  LENS:     "🔭",
  IPAD:     "📱",
  TERMINAL: "💳",
  PRINTER:  "🖨️",
  LAPTOP:   "💻",
  TRIPOD:   "📐",
  FLASH:    "⚡",
  OTHER:    "📦",
};

export function GearLockerClient({
  assets,
  staff,
  recentLogs,
}: {
  assets:     Asset[];
  staff:      StaffMember[];
  recentLogs: AssetLog[];
}) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [loading,     setLoading]     = useState<Record<string, boolean>>({});

  async function checkOut(asset: Asset) {
    const assignToId = assignments[asset.id];
    if (!assignToId) {
      toast({ title: "Select a staff member first", variant: "destructive" });
      return;
    }

    setLoading((p) => ({ ...p, [asset.id]: true }));
    try {
      const res = await fetch("/api/inventory/gear-locker?action=checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ assetId: asset.id, assignToId }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast({ title: `${asset.name} checked out ✅` });
      window.location.reload();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading((p) => ({ ...p, [asset.id]: false }));
    }
  }

  async function checkIn(asset: Asset) {
    setLoading((p) => ({ ...p, [asset.id]: true }));
    try {
      const res = await fetch("/api/inventory/gear-locker?action=checkin", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ assetId: asset.id }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast({ title: `${asset.name} checked in ✅` });
      window.location.reload();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading((p) => ({ ...p, [asset.id]: false }));
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Asset Grid */}
      <div className="lg:col-span-2 space-y-3">
        {assets.map((asset) => (
          <Card
            key={asset.id}
            className={cn(
              "border-l-4",
              asset.status === "AVAILABLE" ? "border-l-green-400" :
              asset.status === "ASSIGNED"  ? "border-l-blue-400"  :
              "border-l-yellow-400"
            )}
          >
            <CardContent className="py-3 flex items-center gap-4">
              <span className="text-2xl">{TYPE_EMOJIS[asset.type]}</span>
              <div className="flex-1">
                <p className="font-medium">{asset.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{asset.serialNumber}</p>
                {asset.assignedUser && (
                  <p className="text-xs text-blue-600 mt-0.5">
                    → {asset.assignedUser.name}
                  </p>
                )}
              </div>
              <Badge className={cn("text-xs border", STATUS_COLORS[asset.status])}>
                {asset.status}
              </Badge>

              {/* Actions */}
              {asset.status === "AVAILABLE" ? (
                <div className="flex items-center gap-2">
                  <Select
                    value={assignments[asset.id] ?? ""}
                    onValueChange={(v) => setAssignments((p) => ({ ...p, [asset.id]: v }))}
                  >
                    <SelectTrigger className="w-40 h-8 text-xs">
                      <SelectValue placeholder="Assign to..." />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name ?? "Unknown"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={() => checkOut(asset)}
                    disabled={loading[asset.id] || !assignments[asset.id]}
                  >
                    Check Out
                  </Button>
                </div>
              ) : asset.status === "ASSIGNED" ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => checkIn(asset)}
                  disabled={loading[asset.id]}
                >
                  Check In
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Log */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentLogs.map((log) => (
            <div key={log.id} className="text-xs space-y-0.5 border-b pb-2 last:border-0">
              <p className="font-medium">
                {TYPE_EMOJIS[log.asset.type as AssetType] ?? "📦"} {log.asset.name}
              </p>
              <p className="text-muted-foreground">
                <span className={cn(
                  "font-medium",
                  log.action === "CHECK_OUT" ? "text-blue-600" : "text-green-600"
                )}>
                  {log.action.replace("_", " ")}
                </span>
                {log.assignedTo && ` → ${log.assignedTo.name}`}
              </p>
              <p className="text-muted-foreground/70">
                {format(new Date(log.timestamp), "HH:mm, dd MMM")}
                {" by "}{log.loggedBy.name}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
