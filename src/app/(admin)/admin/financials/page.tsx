export const runtime = "edge";

const kpis = [
  { label: 'Monthly Revenue', value: '$124,530', change: '+12.5%', up: true, icon: '💰' },
  { label: 'Operating Costs', value: '$48,200', change: '+2.1%', up: false, icon: '📤' },
  { label: 'Net Profit', value: '$76,330', change: '+19.3%', up: true, icon: '📈' },
  { label: 'Profit Margin', value: '61.3%', change: '+3.8pp', up: true, icon: '🎯' },
];

const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const revenues = [82000, 91000, 112000, 78000, 95000, 124530];
const maxRev = 130000;

const transactions = [
  { desc: 'Stripe Payout — March W4', type: 'income', amount: '+$31,400', date: 'Mar 24', cat: 'Payments' },
  { desc: 'Staff Payroll — March', type: 'expense', amount: '-$22,800', date: 'Mar 22', cat: 'Payroll' },
  { desc: 'Stripe Payout — March W3', type: 'income', amount: '+$28,900', date: 'Mar 17', cat: 'Payments' },
  { desc: 'Hotel Supplies — Phuket Resort', type: 'expense', amount: '-$4,200', date: 'Mar 15', cat: 'Operations' },
  { desc: 'Franchise Commission — Q1', type: 'expense', amount: '-$6,800', date: 'Mar 10', cat: 'Commission' },
  { desc: 'Stripe Payout — March W2', type: 'income', amount: '+$29,100', date: 'Mar 10', cat: 'Payments' },
  { desc: 'Stripe Payout — March W1', type: 'income', amount: '+$27,200', date: 'Mar 3', cat: 'Payments' },
  { desc: 'Marketing Spend — Social', type: 'expense', amount: '-$3,100', date: 'Mar 1', cat: 'Marketing' },
];

const costBreakdown = [
  { cat: 'Payroll', pct: 47, color: 'bg-violet-500' },
  { cat: 'Operations', pct: 22, color: 'bg-blue-500' },
  { cat: 'Commissions', pct: 14, color: 'bg-amber-500' },
  { cat: 'Marketing', pct: 10, color: 'bg-green-500' },
  { cat: 'Other', pct: 7, color: 'bg-gray-400' },
];

export default function FinancialsPage() {
  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financials</h1>
          <p className="text-gray-500 text-sm mt-1">Revenue, costs, and profit — March 2026</p>
        </div>
        <div className="flex gap-3">
          <a href="/admin/financials/payroll" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            💸 Payroll
          </a>
          <button className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            ⬇️ Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{k.icon}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${k.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {k.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{k.value}</div>
            <div className="text-xs text-gray-400 mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6">Revenue — Last 6 Months</h2>
          <div className="flex items-end gap-3" style={{height: '176px'}}>
            {revenues.map((v, i) => {
              const heightPct = (v / maxRev) * 100;
              const isCurrent = i === revenues.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs text-gray-500 font-medium">${(v/1000).toFixed(0)}k</span>
                  <div className="w-full flex flex-col justify-end" style={{height: '140px'}}>
                    <div className={`w-full rounded-t-md ${isCurrent ? 'bg-indigo-600' : 'bg-indigo-200'}`} style={{height: `${heightPct}%`}} />
                  </div>
                  <span className={`text-xs font-medium ${isCurrent ? 'text-indigo-600' : 'text-gray-400'}`}>{months[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Cost Breakdown</h2>
          <div className="space-y-3">
            {costBreakdown.map(item => (
              <div key={item.cat}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{item.cat}</span>
                  <span className="font-medium text-gray-900">{item.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-2 rounded-full ${item.color}`} style={{width: `${item.pct}%`}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {transactions.map((t, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${t.type === 'income' ? 'bg-green-50' : 'bg-red-50'}`}>
                  {t.type === 'income' ? '↑' : '↓'}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{t.desc}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.cat} · {t.date}</div>
                </div>
              </div>
              <span className={`text-sm font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>{t.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  }
