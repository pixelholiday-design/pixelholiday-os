export const runtime = "edge";
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const ADMIN_ROLES = ['admin', 'CEO', 'MANAGER'];

const mockBookings = [
  { id: 'BK-2401', guest: 'Luca Ferrari', email: 'luca@email.it', hotel: 'Villa Serena', room: 'Suite 201', checkIn: '2025-04-01', checkOut: '2025-04-07', nights: 6, status: 'Confirmed', total: '€2,400', source: 'Direct' },
  { id: 'BK-2402', guest: 'Emma Johnson', email: 'emma.j@email.com', hotel: 'Palazzo Mare', room: 'Deluxe 105', checkIn: '2025-04-03', checkOut: '2025-04-08', nights: 5, status: 'Confirmed', total: '€1,750', source: 'Booking.com' },
  { id: 'BK-2403', guest: 'Carlos García', email: 'carlos.g@email.es', hotel: 'Villa Serena', room: 'Standard 302', checkIn: '2025-04-05', checkOut: '2025-04-10', nights: 5, status: 'Pending', total: '€1,200', source: 'Expedia' },
  { id: 'BK-2404', guest: 'Yuki Tanaka', email: 'yuki.t@email.jp', hotel: 'Coral Bay Resort', room: 'Ocean Suite', checkIn: '2025-04-08', checkOut: '2025-04-15', nights: 7, status: 'Confirmed', total: '€3,850', source: 'Direct' },
  { id: 'BK-2405', guest: 'Marie Dupont', email: 'marie.d@email.fr', hotel: 'Palazzo Mare', room: 'Junior Suite 210', checkIn: '2025-04-10', checkOut: '2025-04-13', nights: 3, status: 'Checked In', total: '€1,080', source: 'Airbnb' },
  { id: 'BK-2406', guest: 'James Wilson', email: 'j.wilson@email.uk', hotel: 'Villa Serena', room: 'Deluxe 118', checkIn: '2025-04-12', checkOut: '2025-04-19', nights: 7, status: 'Confirmed', total: '€2,100', source: 'Direct' },
  { id: 'BK-2407', guest: 'Ana Silva', email: 'ana.s@email.br', hotel: 'Coral Bay Resort', room: 'Standard 401', checkIn: '2025-04-14', checkOut: '2025-04-17', nights: 3, status: 'Cancelled', total: '€780', source: 'Booking.com' },
  { id: 'BK-2408', guest: 'Mohammed Al-Rashid', email: 'm.alrashid@email.ae', hotel: 'Palazzo Mare', room: 'Presidential Suite', checkIn: '2025-04-20', checkOut: '2025-04-28', nights: 8, status: 'Confirmed', total: '€8,400', source: 'Direct' },
];

const statusColors: Record<string, string> = {
  Confirmed: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  'Checked In': 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-red-100 text-red-600',
  'Checked Out': 'bg-gray-100 text-gray-500',
};

export default async function BookingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const userRole = (session.user as { role?: string }).role ?? '';
  if (!ADMIN_ROLES.includes(userRole)) redirect('/admin');

  const confirmed = mockBookings.filter(b => b.status === 'Confirmed').length;
  const checkedIn = mockBookings.filter(b => b.status === 'Checked In').length;
  const pending = mockBookings.filter(b => b.status === 'Pending').length;
  const totalRevenue = '€21,560';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all hotel reservations</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          + New Booking
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: totalRevenue, color: 'text-green-600' },
          { label: 'Confirmed', value: confirmed, color: 'text-blue-600' },
          { label: 'Checked In', value: checkedIn, color: 'text-purple-600' },
          { label: 'Pending Review', value: pending, color: 'text-yellow-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{c.label}</p>
            <p className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">All Bookings</h2>
          <div className="flex gap-2">
            <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Checked In</option>
            </select>
            <input type="text" placeholder="Search..." className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Booking ID</th>
                <th className="px-6 py-3 text-left">Guest</th>
                <th className="px-6 py-3 text-left">Hotel</th>
                <th className="px-6 py-3 text-left">Check In</th>
                <th className="px-6 py-3 text-left">Check Out</th>
                <th className="px-6 py-3 text-left">Nights</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockBookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{b.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{b.guest}</p>
                    <p className="text-xs text-gray-500">{b.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{b.hotel}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.checkIn}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.checkOut}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">{b.nights}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{b.total}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">{b.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-500">
          Showing {mockBookings.length} bookings
        </div>
      </div>
    </div>
  );
}
