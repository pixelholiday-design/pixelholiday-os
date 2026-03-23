"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils/format";
import { Target } from "lucide-react";

interface TargetProgressBarProps {
  current:    number;
  target:     number;
  percentage: number;
}

export function TargetProgressBar({ current, target, percentage }: TargetProgressBarProps) {
  const label =
    percentage >= 100 ? "🎉 TARGET SMASHED!" :
    percentage >= 75  ? "💪 Almost there!"   :
    percentage >= 50  ? "🔥 Halfway!"        :
                        "⚡ Keep pushing!";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Target className="h-5 w-5 text-brand-500" />
        <CardTitle>Monthly Target Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-brand-600">{label}</span>
          <span className="text-muted-foreground">
            {formatCurrency(current)} / {formatCurrency(target)}
          </span>
        </div>
        <Progress value={percentage} className="h-4" />
        <p className="text-sm text-muted-foreground">
          {percentage < 100
            ? `${formatCurrency(target - current)} remaining to hit target`
            : `You beat target by ${formatCurrency(current - target)}`}
        </p>
      </CardContent>
    </Card>
  );
}
