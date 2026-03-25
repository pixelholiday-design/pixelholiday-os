export const runtime = "edge";
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const ADMIN_ROLES = ['admin', 'CEO', 'MANAGER'];

const mockUsers = [
  { id: 'USR-001', name: 'Luca Ferrari', email: 'luca.ferrari@pixelholiday.com', role: 'admin', status: 'Active', joined: '2024-01-15', lastLogin: '2 hours ago', avatar: 'LF' },
  { id: 'USR-002', name: 'Sofia Marchetti', email: 'sofia.marchetti@pixelholiday.com', role: 'CEO', status: 'Active', joined: '2023-11-02', lastLogin: '1 day ago', avatar: 'SM' },
  { id: 'USR-003', name: 'Marco Ricci', email: 'marco.ricci@pixelholiday.com', role: 'MANAGER', status: 'Active', joined: '2024-03-10', lastLogin: '3 hours ago', avatar: 'MR' },
  { id: 'USR-004', name: 'Elena Conti', email: 'elena.conti@pixelholiday.com', role: 'staff', status: 'Active', joined: '2024-06-20', lastLogin: '5 hours ago', avatar: 'EC' },
  { id: 'USR-005', name: 'Giuseppe Bianchi', email: 'giuseppe.bianchi@pixelholiday.com', role: 'staff', status: 'Inactive', joined: '2024-02-28', lastLogin: '14 days ago', avatar: 'GB' },
  { id: 'USR-006', name: 'Valentina Esposito', email: 'valentina.esposito@pixelholiday.com', role: 'MANAGER', status: 'Active', joined: '2024-04-05', lastLogin: '1 hour ago', avatar: 'VE' },
  { id: 'USR-007', name: 'Roberto Russo', email: 'roberto.russo@pixelholiday.com', role: 'staff', status: 'Pending', joined: '2024-12-01', lastLogin: 'Never', avatar: 'RR' },
  { id: 'USR-008', name: 'Chiara Romano', email: 'chiara.romano@pixelholiday.com', role: 'staff', status: 'Active', joined: '2024-07-14', lastLogin: '2 days ago', avatar: 'CR' },
];

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-800',
  CEO: 'bg-purple-100 text-purple-800',
  MANAGER: 'bg-blue-100 text-blue-800',
  staff: 'bg-gray-100 text-gray-700',
};

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-500',
  Pending: 'bg-yellow-100 text-yellow-700',
};

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const userRole = (session.user as { role?: string }).role ?? '';
  if (!ADMIN_ROLES.includes(userRole)) redirect('/admin');

  const activeCount = mockUsers.filter(u => u.status === 'Active').length;
  const adminCount = mockUsers.filter(u => ADMIN_ROLES.includes(u.role)).length;
  const pendingCount = mockUsers.filter(u => u.status === 'Pending').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage staff accounts and permissions</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          + Invite User
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: mockUsers.length, color: 'text-blue-600' },
          { label: 'Active', value: activeCount, color: 'text-green-600' },
          { label: 'Admins & Managers', value: adminCount, color: 'text-purple-600' },
          { label: 'Pending Invite', value: pendingCount, color: 'text-yellow-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{card.label}</p>
            <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">All Users</h2>
          <input
            type="text"
            placeholder="Search users..."
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Joined</th>
                <th className="px-6 py-3 text-left">Last Login</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role] ?? 'bg-gray-100 text-gray-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[user.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : user.status === 'Pending' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                      <button className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-500">
          Showing {mockUsers.length} of {mockUsers.length} users
        </div>
      </div>
    </div>
  );
}
