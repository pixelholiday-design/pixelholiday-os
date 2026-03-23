"use client";
// src/components/admin/RevenueChart.tsx
// Bar chart of daily/weekly revenue using a pure-CSS approach.
// No recharts dependency required — renders as styled bars.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import { format, subDays, eachDayOfInterval, startOfDay } from "date-fns";

interface Order {
  createdAt:   Date | string;
  totalAmount: number;
}

interface Props {
  orders?: Order[];  // optional — renders empty state if not provided
  days?:   number;   // default 30
}

export function RevenueChart({ orders = [], days = 30 }: Props) {
  const today = startOfDay(new Date());
  const start = subDays(today, days - 1);
  const range = eachDayOfInterval({ start, end: today });

  // Aggregate daily revenue
  const daily = range.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const total  = orders
      .filter((o) => format(new Date(o.createdAt), "yyyy-MM-dd") === dayStr)
      .reduce((s, o) => s + o.totalAmount, 0);
    return { day, label: format(day, "d"), total };
  });

  const max = Math.max(...daily.map((d) => d.total), 1);

  // Weekly grouping for labels
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Revenue — Last {days} Days</CardTitle>
          <span className="text-sm text-muted-foreground">
            Total: {formatCurrency(orders.reduce((s, o) => s + o.totalAmount, 0))}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-0.5 h-32 w-full" aria-label="Daily revenue chart">
          {daily.map(({ day, label, total }, i) => {
            const pct = total === 0 ? 0 : Math.max(4, (total / max) * 100);
            const isToday = format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end group"
              >
                <div
                  className="relative w-full"
                  style={{ height: `${pct}%` }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 border border-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    {format(day, "d MMM")}: {formatCurrency(total)}
                  </div>
                  <div
                    className={`w-full h-full rounded-t-sm ${
                      total === 0
                        ? "bg-gray-800"
                        : isToday
                        ? "bg-amber-400"
                        : "bg-blue-500/60 group-hover:bg-blue-400"
                    } transition-colors`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels — show every 7th */}
        <div className="flex items-center gap-0.5 mt-1">
          {daily.map(({ day, label }, i) => (
            <div key={i} className="flex-1 text-center">
              {i % 7 === 0 && (
                <span className="text-xs text-muted-foreground">{label}</span>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-blue-500/60 rounded-sm" /> Revenue
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-amber-400 rounded-sm" /> Today
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
