"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink } from "lucide-react";

interface Alert {
  id:              string;
  message:         string;
  trainingVideoUrl: string | null;
}

export function AovAlerts({ alerts }: { alerts: Alert[] }) {
  async function markRead(id: string) {
    await fetch(`/api/staff/alerts/${id}/read`, { method: "PATCH" });
  }

  return (
    <Card className="border-yellow-300 bg-yellow-50">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <AlertTriangle className="h-5 w-5 text-yellow-600" />
        <CardTitle className="text-yellow-800">Performance Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
       {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start justify-between gap-3">
            <p className="text-sm text-yellow-900 flex-1">{alert.message}</p>
            <div className="flex gap-2 flex-shrink-0">
              {alert.trainingVideoUrl && (
                <Button size="sm" variant="outline" asChild className="border-yellow-400 text-yellow-800">
                  <a href={alert.trainingVideoUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Watch
                  </a>
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="text-yellow-700"
                onClick={() => markRead(alert.id)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
