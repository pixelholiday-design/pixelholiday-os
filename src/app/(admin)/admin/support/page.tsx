export const runtime = "edge";
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const ADMIN_ROLES = ['admin', 'CEO', 'MANAGER'];

const mockTickets = [
  { id: 'TKT-001', subject: 'Room service delay at Grand Riviera', guest: 'James Wilson', hotel: 'Grand Riviera Resort', priority: 'High', status: 'Open', category: 'Service', created: '2026-03-24 09:15', assignee: 'Carlos M.' },
  { id: 'TKT-002', subject: 'AC not working in Suite 401', guest: 'Luca Ferrari', hotel: 'Azure Beach Club', priority: 'Urgent', status: 'In Progress', category: 'Maintenance', created: '2026-03-24 08:42', assignee: 'Hans M.' },
  { id: 'TKT-003', subject: 'Billing discrepancy on invoice #4821', guest: 'Sofia Martinez', hotel: 'Mountain Zen Lodge', priority: 'Medium', status: 'Open', category: 'Billing', created: '2026-03-23 16:30', assignee: 'Unassigned' },
  { id: 'TKT-004', subject: 'Refund request for cancelled booking BK-004', guest: 'Amara Okafor', hotel: 'Grand Riviera Resort', priority: 'Medium', status: 'Resolved', category: 'Billing', created: '2026-03-23 11:00', assignee: 'Isabella R.' },
  { id: 'TKT-005', subject: 'Wi-Fi connectivity issues in room 220', guest: 'Chen Wei', hotel: 'Mountain Zen Lodge', priority: 'Low', status: 'Resolved', category: 'Technical', created: '2026-03-22 14:20', assignee: 'Wayan S.' },
  { id: 'TKT-006', subject: 'Late checkout request for April 6', guest: 'Emma Thompson', hotel: 'Mountain Zen Lodge', priority: 'Low', status: 'Open', category: 'Request', created: '2026-03-22 10:05', assignee: 'Unassigned' },
];

const priorityColors: Record<string, string> = {
  Urgent: 'bg-red-500/30 text-red-300 border border-red-500/40',
  High: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Low: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

const statusColors: Record<string, string> = {
  Open: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'In Progress': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Resolved: 'bg-green-500/20 text-green-400 border border-green-500/30',
  Closed: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

export default async function SupportPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const userRole = (session.user as any)?.role;
  if (!ADMIN_ROLES.includes(userRole)) redirect('/dashboard');

  const openTickets = mockTickets.filter(t => t.status === 'Open').length;
  const inProgress = mockTickets.filter(t => t.status === 'In Progress').length;
  const resolved = mockTickets.filter(t => t.status === 'Resolved').length;
  const urgent = mockTickets.filter(t => t.priority === 'Urgent').length;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Support</h1>
          <p className="text-gray-400 mt-1">Guest support tickets and requests</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Open Tickets', value: openTickets, color: 'text-blue-400', sub: 'awaiting response' },
          { label: 'In Progress', value: inProgress, color: 'text-yellow-400', sub: 'being handled' },
          { label: 'Resolved', value: resolved, color: 'text-green-400', sub: 'this week' },
          { label: 'Urgent', value: urgent, color: 'text-red-400', sub: 'need immediate action' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">{kpi.label}</p>
            <p className={`text-3xl font-bold mt-2 ${kpi.color}`}>{kpi.value}</p>
            <p className="text-gray-500 text-xs mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-white font-semibold">Recent Tickets</h2>
          <div className="flex gap-2">
            {['All', 'Open', 'In Progress', 'Resolved'].map(f => (
              <button key={f} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${f === 'All' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                {['Ticket ID', 'Subject', 'Guest', 'Hotel', 'Category', 'Priority', 'Status', 'Assignee', 'Created'].map(h => (
                  <th key={h} className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {mockTickets.map((t) => (
                <tr key={t.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 text-sm font-mono">{t.id}</td>
                  <td className="px-6 py-4 text-white text-sm max-w-xs truncate">{t.subject}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{t.guest}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{t.hotel}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{t.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[t.priority]}`}>{t.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[t.status]}`}>{t.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{t.assignee}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{t.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
