"use client";
// src/components/supervisor/HardwareHealthGrid.tsx
// Grid of printer/device status cards with ink levels and online indicator.
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Monitor, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface HardwareDevice {
  id:              string;
  deviceName:      string;
  deviceType:      string;
  localIpAddress:  string | null;
  isOnline:        boolean;
  inkLevelCyan:    number | null;
  inkLevelMagenta: number | null;
  inkLevelYellow:  number | null;
  inkLevelBlack:   number | null;
  paperRemaining:  number | null;
  lastSeenAt:      Date | string;
  firmwareVersion: string | null;
}

function InkBar({ level, color, label }: { level: number | null; color: string; label: string }) {
  if (level === null) return null;
  const pct  = Math.max(0, Math.min(100, level));
  const low  = pct < 20;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-3">{label[0].toUpperCase()}</span>
      <div className="flex-1 bg-gray-800 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all ${low ? "bg-red-500" : color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs tabular-nums w-7 text-right ${low ? "text-red-400 font-semibold" : "text-muted-foreground"}`}>
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

const DEVICE_ICON: Record<string, React.ElementType> = {
  PRINTER: Printer,
  IPAD:    Monitor,
  DEFAULT: Monitor,
};

export function HardwareHealthGrid({ devices }: { devices: HardwareDevice[] }) {
  if (devices.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          No hardware devices registered for this hotel.
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="text-base font-semibold mb-3">Hardware Health ({devices.length} devices)</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((d) => {
          const Icon      = DEVICE_ICON[d.deviceType.toUpperCase()] ?? DEVICE_ICON.DEFAULT;
          const hasLowInk = [d.inkLevelCyan, d.inkLevelMagenta, d.inkLevelYellow, d.inkLevelBlack]
            .some((v) => v !== null && v < 20);
          const lastSeen  = formatDistanceToNow(new Date(d.lastSeenAt), { addSuffix: true });

          return (
            <Card key={d.id} className={`${!d.isOnline ? "border-red-900/50 bg-red-950/10" : hasLowInk ? "border-amber-900/50" : ""}`}>
              <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{d.deviceName}</p>
                      <p className="text-xs text-muted-foreground">{d.deviceType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hasLowInk && d.isOnline && (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                    )}
                    {d.isOnline
                      ? <Wifi className="h-4 w-4 text-green-400" />
                      : <WifiOff className="h-4 w-4 text-red-400" />}
                  </div>
                </div>

                {/* IP + Last seen */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono">{d.localIpAddress ?? "No IP"}</span>
                  <span>seen {lastSeen}</span>
                </div>

                {/* Ink levels */}
                {(d.inkLevelCyan !== null || d.inkLevelBlack !== null) && (
                  <div className="space-y-1.5 pt-1 border-t border-border">
                    <InkBar level={d.inkLevelCyan}    color="bg-cyan-400"   label="Cyan" />
                    <InkBar level={d.inkLevelMagenta} color="bg-pink-400"   label="Magenta" />
                    <InkBar level={d.inkLevelYellow}  color="bg-yellow-400" label="Yellow" />
                    <InkBar level={d.inkLevelBlack}   color="bg-gray-400"   label="Black" />
                  </div>
                )}

                {/* Paper */}
                {d.paperRemaining !== null && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Paper</span>
                    <span className={d.paperRemaining < 50 ? "text-amber-400 font-semibold" : "text-muted-foreground"}>
                      {d.paperRemaining} sheets
                    </span>
                  </div>
                )}

                {/* Firmware */}
                {d.firmwareVersion && (
                  <p className="text-xs text-muted-foreground font-mono">fw {d.firmwareVersion}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
