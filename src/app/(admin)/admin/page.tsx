export const runtime = "edge";
import { auth } from '@/lib/auth/auth';

const stats = [
  { label: 'Monthly Revenue', value: '$124,530', change: '+12.5%', up: true, icon: '💰', sub: 'vs last month' },
  { label: 'Total Bookings', value: '2,345', change: '+5.2%', up: true, icon: '📅', sub: 'vs last month' },
  { label: 'Avg Occupancy', value: '78.3%', change: '+3.1pp', up: true, icon: '🏨', sub: 'across all hotels' },
  { label: 'Avg Order Value', value: '$423', change: '-1.2%', up: false, icon: '🛒', sub: 'vs last month' },
];

const recentOrders = [
  { id: '#ORD-2341', guest: 'Sarah Mitchell', hotel: 'Bangkok Central', room: 'Deluxe King', amount: '$840', status: 'confirmed', date: 'Mar 24' },
  { id: '#ORD-2340', guest: 'James Chen', hotel: 'Phuket Resort', room: 'Sea View Suite', amount: '$1,200', status: 'pending', date: 'Mar 24' },
  { id: '#ORD-2339', guest: 'Emma Wilson', hotel: 'Chiang Mai Hills', room: 'Superior Twin', amount: '$560', status: 'confirmed', date: 'Mar 23' },
  { id: '#ORD-2338', guest: 'Luca Ferrari', hotel: 'Bangkok Central', room: 'Standard Room', amount: '$980', status: 'processing', date: 'Mar 23' },
  { id: '#ORD-2337', guest: 'Ana Souza', hotel: 'Koh Samui Bay', room: 'Pool Villa', amount: '$2,100', status: 'confirmed', date: 'Mar 22' },
  { id: '#ORD-2336', guest: 'Kenji Tanaka', hotel: 'Pattaya Beach', room: 'Ocean View', amount: '$720', status: 'cancelled', date: 'Mar 22' },
];

const statusStyle: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-500',
};

const quickLinks = [
  { label: 'Add Hotel', href: '/admin/hotels/new', icon: '🏨' },
  { label: 'New Posting', href: '/admin/ats/new-posting', icon: '📋' },
  { label: 'New CMS Post', href: '/admin/cms/posts/new', icon: '✍️' },
  { label: 'Payroll', href: '/admin/financials/payroll', icon: '💸' },
];

export default async function AdminDashboard() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name ?? 'Admin'}! 👋</h1>
          <p className="text-gray-500 mt-1 text-sm">Here&apos;s what&apos;s happening across your portfolio today.</p>
        </div>
        <div className="flex gap-2">
          {quickLinks.map(l => (
            <a key={l.href} href={l.href} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
              <span>{l.icon}</span>{l.label}
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            <div className="text-xs text-gray-300 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Recent Bookings</h2>
          <a href="/admin/booking" className="text-xs text-indigo-600 hover:underline font-medium">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Guest', 'Hotel', 'Room', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-xs font-medium text-indigo-600">{o.id}</td>
                  <td className="px-6 py-3.5 font-medium text-gray-900">{o.guest}</td>
                  <td className="px-6 py-3.5 text-gray-500">{o.hotel}</td>
                  <td className="px-6 py-3.5 text-gray-400 text-xs">{o.room}</td>
                  <td className="px-6 py-3.5 font-semibold text-gray-900">{o.amount}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-400 text-xs">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
                  }
