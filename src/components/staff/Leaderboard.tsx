"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface LeaderboardEntry {
  id:    string;
  name:  string;
  image: string | null;
  total: number;
}

const RANK_STYLES = [
  "bg-yellow-100 border-yellow-400 text-yellow-800", // 🥇
  "bg-slate-100 border-slate-400 text-slate-700",    // 🥈
  "bg-amber-100 border-amber-500 text-amber-800",    // 🥉
];

const RANK_EMOJIS = ["🥇", "🥈", "🥉"];

export function Leaderboard({
  entries,
  currentUserId,
}: {
  entries:        LeaderboardEntry[];
  currentUserId:  string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <CardTitle>Team Leaderboard — This Month</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                entry.id === currentUserId
                  ? "border-brand-400 bg-brand-50 shadow-md shadow-brand-100"
                  : RANK_STYLES[i] ?? "border-border bg-card",
                i === 0 && "animate-pulse-glow"
              )}
            >
              <span className="text-xl font-bold w-8 text-center">
                {RANK_EMOJIS[i] ?? `#${i + 1}`}
              </span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={entry.image ?? undefined} />
                <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {entry.name}
                  {entry.id === currentUserId && (
                    <span className="ml-2 text-xs text-brand-600 font-bold">YOU</span>
                  )}
                </p>
              </div>
              <p className="font-bold">{formatCurrency(entry.total)}</p>
            </div>
          ))}

          {entries.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No sales yet this month — be the first! 🚀
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
