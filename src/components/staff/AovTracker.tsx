"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import { TrendingUp } from "lucide-react";

export function AovTracker({ aov7d, orderCount }: { aov7d: number; orderCount: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <TrendingUp className="h-5 w-5 text-green-500" />
        <CardTitle>7-Day AOV</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-green-600">{formatCurrency(aov7d)}</p>
        <p className="text-sm text-muted-foreground mt-1">
          average order value across {orderCount} order{orderCount !== 1 ? "s" : ""}
        </p>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Target AOV</span>
            <span className="font-medium">฿1,500</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-muted-foreground">vs Target</span>
            <span className={aov7d >= 1500 ? "font-medium text-green-600" : "font-medium text-red-600"}>
              {aov7d >= 1500 ? "+" : ""}{formatCurrency(aov7d - 1500)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
