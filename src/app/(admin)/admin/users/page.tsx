export const runtime = "edge";
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const ADMIN_ROLES = ['admin', 'CEO', 'MANAGER'];

const mockUsers = [
  { id: 'USR-001', name: 'Alexandra Chen', email: 'a.chen@pixelholiday.com', role: 'CEO', status: 'Active', joined: '2023-01-15', lastLogin: '2026-03-24', bookings: 0 },
  { id: 'USR-002', name: 'Marcus Williams', email: 'm.williams@pixelholiday.com', role: 'MANAGER', status: 'Active', joined: '2023-03-08', lastLogin: '2026-03-24', bookings: 0 },
  { id: 'USR-003', name: 'James Wilson', email: 'james.wilson@gmail.com', role: 'GUEST', status: 'Active', joined: '2025-06-12', lastLogin: '2026-03-22', bookings: 5 },
  { id: 'USR-004', name: 'Sofia Martinez', email: 'sofia.m@outlook.com', role: 'GUEST', status: 'Active', joined: '2025-09-03', lastLogin: '2026-03-21', bookings: 3 },
  { id: 'USR-005', name: 'Chen Wei', email: 'c.wei@email.com', role: 'GUEST', status: 'Active', joined: '2024-11-20', lastLogin: '2026-03-20', bookings: 8 },
  { id: 'USR-006', name: 'Amara Okafor', email: 'amara.o@gmail.com', role: 'GUEST', status: 'Suspended', joined: '2025-01-14', lastLogin: '2026-02-15', bookings: 2 },
  { id: 'USR-007', name: 'Luca Ferrari', email: 'luca.ferrari@email.it', role: 'GUEST', status: 'Active', joined: '2024-07-30', lastLogin: '2026-03-19', bookings: 12 },
  { id: 'USR-008', name: 'Emma Thompson', email: 'emma.t@icloud.com', role: 'GUEST', status: 'Active', joined: '2025-12-01', lastLogin: '2026-03-18', bookings: 1 },
  ];

const roleColors: Record<string, string> = {
    CEO: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    MANAGER: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    admin: 'bg-red-500/20 text-red-400 border border-red-500/30',
    GUEST: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

const statusColors: Record<string, string> = {
    Active: 'bg-green-500/20 text-green-400 border border-green-500/30',
    Suspended: 'bg-red-500/20 text-red-400 border border-red-500/30',
    Pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
};

export default async function UsersPage() {
    const session = await auth();
    if (!session?.user) redirect('/login');
    const userRole = (session.user as any)?.role;
    if (!ADMIN_ROLES.includes(userRole)) redirect('/dashboard');

  const totalUsers = mockUsers.length;
    const activeUsers = mockUsers.filter(u => u.status === 'Active').length;
    const guestUsers = mockUsers.filter(u => u.role === 'GUEST').length;
    const staffUsers = mockUsers.filter(u => u.role !== 'GUEST').length;

  return (
        <div className="p-8">
              <div className="mb-8 flex items-center justify-between">
                      <div>
                                <h1 className="text-2xl font-bold text-white">Users</h1>h1>
                                <p className="text-gray-400 mt-1">Manage guests and staff accounts</p>p>
                      </div>div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                + Invite User
                      </button>button>
              </div>div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
          { label: 'Total Users', value: totalUsers, sub: 'registered accounts' },
          { label: 'Active', value: activeUsers, sub: 'currently active' },
          { label: 'Guests', value: guestUsers, sub: 'traveler accounts' },
          { label: 'Staff', value: staffUsers, sub: 'admin and managers' },
                  ].map((kpi) => (
                              <div key={kpi.label} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                          <p className="text-gray-400 text-sm">{kpi.label}</p>p>
                                          <p className="text-3xl font-bold text-white mt-2">{kpi.value}</p>p>
                                          <p className="text-gray-500 text-xs mt-1">{kpi.sub}</p>p>
                              </div>div>
                            ))}
              </div>div>
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                      <div className="p-6 border-b border-gray-700">
                                <h2 className="text-white font-semibold">All Users</h2>h2>
                      </div>div>
                      <div className="overflow-x-auto">
                                <table className="w-full">
                                            <thead>
                                                          <tr className="border-b border-gray-700">
                                                            {['ID', 'Name', 'Email</div>
