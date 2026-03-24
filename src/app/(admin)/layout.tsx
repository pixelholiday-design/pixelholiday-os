import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

// Admin-level roles: 'admin' for future real auth, 'CEO'/'MANAGER' from current RBAC stub
const ADMIN_ROLES = ['admin', 'CEO', 'MANAGER'];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || !ADMIN_ROLES.includes(session.user?.role)) {
    redirect('/login');
  }
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white">
        <nav className="space-y-2 p-4">
          <a href="/admin" className="block px-4 py-2 hover:bg-gray-800">Dashboard</a>
          <a href="/admin/cms" className="block px-4 py-2 hover:bg-gray-800">CMS</a>
          <a href="/admin/ats" className="block px-4 py-2 hover:bg-gray-800">ATS</a>
          <a href="/admin/financials" className="block px-4 py-2 hover:bg-gray-800">Financials</a>
          <a href="/admin/hotels" className="block px-4 py-2 hover:bg-gray-800">Hotels</a>
          <a href="/admin/booking" className="block px-4 py-2 hover:bg-gray-800">Booking</a>
          <a href="/admin/users" className="block px-4 py-2 hover:bg-gray-800">Users</a>
          <a href="/admin/inventory" className="block px-4 py-2 hover:bg-gray-800">Inventory</a>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
