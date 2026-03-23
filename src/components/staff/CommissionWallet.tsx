"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import { Wallet } from "lucide-react";

interface CommissionWalletProps {
  mtdEarned: number;
  mtdSales:  number;
  rate:      number;
}

export function CommissionWallet({ mtdEarned, mtdSales, rate }: CommissionWalletProps) {
  return (
    <Card className="border-brand-200 bg-gradient-to-br from-brand-50 to-amber-50 overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="p-2 bg-brand-500 rounded-lg">
          <Wallet className="h-5 w-5 text-white" />
        </div>
        <CardTitle className="text-brand-800">Commission Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-brand-600 mt-1">{formatCurrency(mtdEarned)}</p>
        <p className="text-sm text-brand-700/70 mt-1">earned this month</p>
        <div className="mt-4 pt-4 border-t border-brand-200 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">MTD Sales</p>
            <p className="font-semibold text-brand-700">{formatCurrency(mtdSales)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Commission Rate</p>
            <p className="font-semibold text-brand-700">{(rate * 100).toFixed(0)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
