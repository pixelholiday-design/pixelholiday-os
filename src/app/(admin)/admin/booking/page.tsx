export const runtime = "edge";
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const ADMIN_ROLES = ['admin', 'CEO', 'MANAGER'];

const mockBookings = [
  { id: 'BK-001', guest: 'James Wilson', hotel: 'Grand Riviera Resort', room: 'Suite 401', checkIn: '2026-03-25', checkOut: '2026-03-29', nights: 4, status: 'Confirmed', total: '$1,240' },
  { id: 'BK-002', guest: 'Sofia Martinez', hotel: 'Azure Beach Club', room: 'Deluxe 205', checkIn: '2026-03-26', checkOut: '2026-03-28', nights: 2, status: 'Pending', total: '$480' },
  { id: 'BK-003', guest: 'Chen Wei', hotel: 'Mountain Zen Lodge', room: 'Standard 112', checkIn: '2026-03-28', checkOut: '2026-04-02', nights: 5, status: 'Confirmed', total: '$950' },
  { id: 'BK-004', guest: 'Amara Okafor', hotel: 'Grand Riviera Resort', room: 'Ocean View 310', checkIn: '2026-03-30', checkOut: '2026-04-01', nights: 2, status: 'Cancelled', total: '$680' },
  { id: 'BK-005', guest: 'Luca Ferrari', hotel: 'Azure Beach Club', room: 'Suite 501', checkIn: '2026-04-01', checkOut: '2026-04-05', nights: 4, status: 'Confirmed', total: '$1,600' },
  { id: 'BK-006', guest: 'Emma Thompson', hotel: 'Mountain Zen Lodge', room: 'Deluxe 220', checkIn: '2026-04-03', checkOut: '2026-04-06', nights: 3, status: 'Pending', total: '$570' },
  ];

const statusColors: Record<string, string> = {
    Confirmed: 'bg-green-500/20 text-green-400 border border-green-500/30',
    Pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    Cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
};

export default async function BookingPage() {
    const session = await auth();
    if (!session?.user) redirect('/login');
    const userRole = (session.user as any)?.role;
    if (!ADMIN_ROLES.includes(userRole)) redirect('/dashboard');
    return (
          <div className="p-8">
                <div className="mb-8 flex items-center justify-between">
                        <div>
                                  <h1 className="text-2xl font-bold text-white">Booking Management</h1>h1>
                                  <p className="text-gray-400 mt-1">Manage all hotel reservations</p>p>
                        </div>div>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ New Booking</button>button>
                </div>div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {[{label:'Total Bookings',value:'1,284',sub:'+12% this month'},{label:'Active Stays',value:'89',sub:'guests checked in'},{label:'Pending Approval',value:'23',sub:'awaiting confirmation'},{label:'Revenue (Month)',value:'$84,290',sub:'+18% vs last month'}].map((kpi) => (
                      <div key={kpi.label} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                  <p className="text-gray-400 text-sm">{kpi.label}</p>p>
                                  <p className="text-3xl font-bold text-white mt-2">{kpi.value}</p>p>
                                  <p className="text-gray-500 text-xs mt-1">{kpi.sub}</p>p>
                      </div>div>
                    ))}
                </div>div>
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-700">
                                  <h2 className="text-white font-semibold">Recent Bookings</h2>h2>
                        </div>div>
                        <div className="overflow-x-auto">
                                  <table className="w-full">
                                              <thead><tr className="border-b border-gray-700">
                                                {['Booking ID','Guest','Hotel','Room','Check-in','Check-out','Nights','Total','Status',''].map(h => (
                            <th key={h} className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">{h}</th>th>
                          ))}
                                              </tr>tr></thead>thead>
                                              <tbody className="divide-y divide-gray-700">
                                                {mockBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-gray-700/50">
                                              <td className="px-6 py-4 text-indigo-400 text-sm font-mono">{b.id}</td>td>
                                              <td className="px-6 py-4 text-white text-sm">{b.guest}</td>td>
                                              <td className="px-6 py-4 text-gray-300 text-sm">{b.hotel}</td>td>
                                              <td className="px-6 py-4 text-gray-300 text-sm">{b.room}</td>td>
                                              <td className="px-6 py-4 text-gray-400 text-sm">{b.checkIn}</td>td>
                                              <td className="px-6 py-4 text-gray-400 text-sm">{b.checkOut}</td>td>
                                              <td className="px-6 py-4 text-gray-400 text-sm">{b.nights}</td>td>
                                              <td className="px-6 py-4 text-green-400 text-sm">{b.total}</td>td>
                                              <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${statusColors[b.status]}`}>{b.status}</span>span></td>td>
                                              <td className="px-6 py-4"><button className="text-indigo-400 text-sm">View</button>button></td>td>
                            </tr>tr>
                          ))}
                                              </tbody>tbody>
                                  </table>table>
                        </div>div>
                </div>div>
          </div>div>
        );
}</div>
