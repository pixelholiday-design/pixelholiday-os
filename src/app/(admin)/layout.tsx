import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    redirect('/auth/login');
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white">
        <nav className="space-y-2 p-4">
          <a href="/admin" className="block px-4 py-2 hover:bg-gray-800">Dashboard</a>
          <a href="/admin/cms" className="block px-4 py-2 hover:bg-gray-800">CMS</a>
          <a href="/admin/ats" className="block px-4 py-2 hover:bg-gray-800">ATS</a>
          <a href="/admin/financials" className="block px-4 py-2 hover:bg-gray-800">Financials</a>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
