"use client";
// src/components/supervisor/StaffDispatchBoard.tsx
// Shows active staff on-duty with camera assignment status.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Camera } from "lucide-react";

interface Asset {
  id:   string;
  name: string;
  type: string;
}

interface StaffMember {
  id:             string;
  name:           string | null;
  email:          string;
  assignedAssets: Asset[];
}

export function StaffDispatchBoard({ staff }: { staff: StaffMember[] }) {
  const withCamera    = staff.filter((s) => s.assignedAssets.length > 0);
  const withoutCamera = staff.filter((s) => s.assignedAssets.length === 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Staff on Duty ({staff.length})
          </CardTitle>
          <div className="flex gap-2 text-xs">
            <span className="text-green-400">{withCamera.length} equipped</span>
            {withoutCamera.length > 0 && (
              <span className="text-amber-400">{withoutCamera.length} no camera</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {staff.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">
            No active staff on duty.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {staff.map((s) => {
              const cameras = s.assignedAssets.filter((a) => a.type === "CAMERA");
              const hasCamera = cameras.length > 0;
              return (
                <div key={s.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      hasCamera ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                    }`}>
                      <User className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{s.name ?? s.email}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    {hasCamera ? (
                      <div className="flex items-center gap-1.5">
                        <Camera className="h-3.5 w-3.5 text-green-400" />
                        <span className="text-xs text-green-400">
                          {cameras.map((c) => c.name).join(", ")}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Camera className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-xs text-amber-400">No camera</span>
                      </div>
                    )}
                    <Badge
                      variant="outline"
                      className={hasCamera
                        ? "border-green-500/30 text-green-400 text-xs"
                        : "border-amber-500/30 text-amber-400 text-xs"}
                    >
                      {hasCamera ? "Ready" : "Unequipped"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
