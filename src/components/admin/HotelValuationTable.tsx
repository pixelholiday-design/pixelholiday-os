// src/components/admin/HotelValuationTable.tsx
// Hotel RPG (Revenue Per Guest) ranking table.
//
// Usage A — self-fetching widget (admin dashboard):
//   <HotelValuationTable />
//
// Usage B — pre-fetched data (rpg-ranking page for richer display):
//   <HotelValuationTable rankings={rankings} networkAvgRpg={avgRpg} showFull />
import { getHotelRpgRanking } from "@/lib/ai/staff-valuation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import { subDays } from "date-fns";
import { MapPin, TrendingUp, TrendingDown } from "lucide-react";

type RankingRow = {
  hotelId:      string;
  hotelName:    string;
  city:         string;
  totalRevenue: number;
  guestCount:   number;
  rpg:          number;
  monthlyRent:  number;
  roiRatio:     number;
};

interface Props {
  /** Pre-fetched rankings. If omitted the component self-fetches (last 30 days). */
  rankings?:      RankingRow[];
  /** Network average RPG for comparison indicators. */
  networkAvgRpg?: number;
  /** Show full table with extra columns (revenue, ROI). Defaults to compact widget. */
  showFull?:      boolean;
  /** Max rows to render. Default 8 for compact, all for showFull. */
  maxRows?:       number;
}

export async function HotelValuationTable({
  rankings:      externalRankings,
  networkAvgRpg = 0,
  showFull      = false,
  maxRows,
}: Props = {}) {
  // Self-fetch only when no external data was provided
  const ranking = externalRankings
    ?? await getHotelRpgRanking(subDays(new Date(), 30), new Date());

  const limit = maxRows ?? (showFull ? ranking.length : 8);
  const rows  = ranking.slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Hotel Valuation (Revenue per Guest)
          {networkAvgRpg > 0 && (
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              Network avg: {formatCurrency(networkAvgRpg)}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">No hotel data yet</p>
        ) : showFull ? (
          /* ── Full table for RPG-ranking page ─────────────────────────── */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="text-left py-2 pr-3 font-medium">#</th>
                  <th className="text-left py-2 pr-3 font-medium">Hotel</th>
                  <th className="text-right py-2 pr-3 font-medium">Guests</th>
                  <th className="text-right py-2 pr-3 font-medium">Revenue</th>
                  <th className="text-right py-2 pr-3 font-medium">RPG</th>
                  <th className="text-right py-2 font-medium">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((hotel, i) => {
                  const aboveAvg = networkAvgRpg > 0 && hotel.rpg > networkAvgRpg;
                  const belowAvg = networkAvgRpg > 0 && hotel.rpg < networkAvgRpg * 0.7;
                  return (
                    <tr key={hotel.hotelId} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 pr-3 font-mono text-muted-foreground">
                        {i + 1}
                      </td>
                      <td className="py-2.5 pr-3">
                        <p className="font-medium">{hotel.hotelName}</p>
                        <p className="text-xs text-muted-foreground">{hotel.city}</p>
                      </td>
                      <td className="py-2.5 pr-3 text-right tabular-nums">
                        {hotel.guestCount.toLocaleString()}
                      </td>
                      <td className="py-2.5 pr-3 text-right tabular-nums font-medium">
                        {formatCurrency(hotel.totalRevenue)}
                      </td>
                      <td className="py-2.5 pr-3 text-right tabular-nums">
                        <span className={`inline-flex items-center gap-0.5 font-bold ${
                          aboveAvg ? "text-emerald-600" : belowAvg ? "text-red-500" : ""
                        }`}>
                          {aboveAvg && <TrendingUp className="h-3 w-3" />}
                          {belowAvg && <TrendingDown className="h-3 w-3" />}
                          {formatCurrency(hotel.rpg)}
                        </span>
                      </td>
                      <td className="py-2.5 text-right tabular-nums text-muted-foreground">
                        {hotel.roiRatio.toFixed(1)}×
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* ── Compact widget for dashboard ────────────────────────────── */
          <div className="space-y-2">
            {rows.map((hotel, i) => (
              <div
                key={hotel.hotelId}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-mono text-sm w-5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{hotel.hotelName}</p>
                    <p className="text-xs text-muted-foreground">
                      {hotel.city} · {hotel.guestCount} guests
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{formatCurrency(hotel.rpg)} RPG
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ROI: {hotel.roiRatio.toFixed(1)}×
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default HotelValuationTable;
