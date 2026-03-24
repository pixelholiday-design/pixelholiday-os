export const runtime = "edge";
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const ADMIN_ROLES = ['admin', 'CEO', 'MANAGER'];

const mockTerritories = [
  { id: 'TER-001', name: 'Caribbean Coast', region: 'Americas', country: 'Mexico', hotels: 3, activeBookings: 42, revenue: '$124,500', manager: 'Carlos Mendez', status: 'Active' },
  { id: 'TER-002', name: 'Mediterranean Riviera', region: 'Europe', country: 'Italy', hotels: 5, activeBookings: 78, revenue: '$287,000', manager: 'Isabella Rossi', status: 'Active' },
  { id: 'TER-003', name: 'Bali & Lombok', region: 'Asia Pacific', country: 'Indonesia', hotels: 4, activeBookings: 55, revenue: '$198,400', manager: 'Wayan Suarta', status: 'Active' },
  { id: 'TER-004', name: 'Maldives Atolls', region: 'Asia Pacific', country: 'Maldives', hotels: 2, activeBookings: 18, revenue: '$210,600', manager: 'Aisha Rasheed', status: 'Active' },
  { id: 'TER-005', name: 'Swiss Alps', region: 'Europe', country: 'Switzerland', hotels: 3, activeBookings: 31, revenue: '$156,750', manager: 'Hans Mueller', status: 'Active' },
  { id: 'TER-006', name: 'East African Savanna', region: 'Africa', country: 'Kenya', hotels: 2, activeBookings: 14, revenue: '$89,200', manager: 'Amara Njoroge', status: 'Expanding' },
  { id: 'TER-007', name: 'Patagonia Highlands', region: 'Americas', country: 'Argentina', hotels: 1, activeBookings: 8, revenue: '$42,300', manager: 'Diego Vargas', status: 'Expanding' },
  ];

const statusColors: Record<string, string> = {
    Active: 'bg-green-500/20 text-green-400 border border-green-500/30',
    Expanding: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    Paused: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
};

const regionColors: Record<string, string> = {
    'Americas': 'bg-orange-500/20 text-orange-400',
    'Europe': 'bg-indigo-500/20 text-indigo-400',
    'Asia Pacific': 'bg-cyan-500/20 text-cyan-400',
    'Africa': 'bg-yellow-500/20 text-yellow-400',
};

export default async function TerritoriesPage() {
    const session = await auth();
    if (!session?.user) redirect('/login');
    const userRole = (session.user as any)?.role;
    if (!ADMIN_ROLES.includes(userRole)) redirect('/dashboard');

  const totalHotels = mockTerritories.reduce((s, t) => s + t.hotels, 0);
    const totalBookings = mockTerritories.reduce((s, t) => s + t.activeBookings, 0);
    const totalRevenue = '$1,108,750';

  return (
        <div className="p-8">
              <div className="mb-8 flex items-center justify-between">
                      <div>
                                <h1 className="text-2xl font-bold text-white">Territories</h1>h1>
                                <p className="text-gray-400 mt-1">Geographic regions and property zones</p>p>
                      </div>div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                + Add Territory
                      </button>button>
              </div>div>
        
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
          { label: 'Territories', value: mockTerritories.length, sub: 'active zones' },
          { label: 'Total Hotels', value: totalHotels, sub: 'across all zones' },
          { label: 'Active Bookings', value: totalBookings, sub: 'right now' },
          { label: 'Total Revenue', value: totalRevenue, sub: 'this quarter' },
                  ].map((kpi) => (
                              <div key={kpi.label} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                          <p className="text-gray-400 text-sm">{kpi.label}</p>p>
                                          <p className="text-3xl font-bold text-white mt-2">{kpi.value}</p>p>
                                          <p className="text-gray-500 text-xs mt-1">{kpi.sub}</p>p>
                              </div>div>
                            ))}
              </div>div>
        
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {['Americas', 'Europe', 'Asia Pacific', 'Africa'].map(region => {
                    const territories = mockTerritories.filter(t => t.region === region);
                    if (territories.length === 0) return null;
                    return (
                                  <div key={region} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                                                <div className="flex items-center gap-2 mb-4">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${regionColors[region]}`}>{region}</span>span>
                                                                <span className="text-gray-400 text-sm">{territories.length} territories</span>span>
                                                </div>div>
                                                <div className="space-y-3">
                                                  {territories.map(t => (
                                                      <div key={t.id} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                                                                          <div>
                                                                                                <p className="text-white text-sm font-medium">{t.name}</p>p>
                                                                                                <p className="text-gray-400 text-xs">{t.country} · {t.hotels} hotels · {t.manager}</p>p>
                                                                          </div>div>
                                                                          <div className="text-right">
                                                                                                <p className="text-green-400 text-sm font-medium">{t.revenue}</p>p>
                                                                                                <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[t.status]}`}>{t.status}</span>span>
                                                                          </div>div>
                                                      </div>div>
                                                    ))}
                                                </div>div>
                                  </div>div>
                                );
        })}
              </div>div>
        
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                      <div className="p-6 border-b border-gray-700">
                                <h2 className="text-white font-semibold">All Territories</h2>h2>
                      </div>div>
                      <div className="overflow-x-auto">
                                <table className="w-full">
                                            <thead>
                                                          <tr className="border-b border-gray-700">
                                                            {['ID', 'Territory', 'Region', 'Country', 'Hotels', 'Active Bookings', 'Revenue', 'Manager', 'Status'].map(h => (
                            <th key={h} className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-3">{h}</th>th>
                          ))}
                                                          </tr>tr>
                                            </thead>thead>
                                            <tbody className="divide-y divide-gray-700">
                                              {mockTerritories.map((t) => (
                          <tr key={t.id} className="hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 text-gray-400 text-sm font-mono">{t.id}</td>td>
                                            <td className="px-6 py-4 text-white text-sm font-medium">{t.name}</td>td>
                                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs ${regionColors[t.region]}`}>{t.region}</span>span></td>td>
                                            <td className="px-6 py-4 text-gray-300 text-sm">{t.country}</td>td>
                                            <td className="px-6 py-4 text-gray-300 text-sm">{t.hotels}</td>td>
                                            <td className="px-6 py-4 text-gray-300 text-sm">{t.activeBookings}</td>td>
                                            <td className="px-6 py-4 text-green-400 text-sm font-medium">{t.revenue}</td>td>
                                            <td className="px-6 py-4 text-gray-300 text-sm">{t.manager}</td>td>
                                            <td className="px-6 py-4">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[t.status]}`}>{t.status}</span>span>
                                            </td>td>
                          </tr>tr>
                        ))}
                                            </tbody>tbody>
                                </table>table>
                      </div>div>
              </div>div>
        </div>div>
      );
}</div>
