export const runtime = "edge";
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const ADMIN_ROLES = ['admin', 'CEO', 'MANAGER'];

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/hotels', label: 'Hotels', icon: '🏨' },
  { href: '/admin/booking', label: 'Booking', icon: '📅' },
  { href: '/admin/cms', label: 'CMS', icon: '📝' },
  { href: '/admin/ats', label: 'Recruitment', icon: '👥' },
  { href: '/admin/financials', label: 'Financials', icon: '💰' },
  { href: '/admin/inventory', label: 'Inventory', icon: '📦' },
  { href: '/admin/users', label: 'Users', icon: '🔑' },
  { href: '/admin/territories', label: 'Territories', icon: '🗺️' },
  { href: '/admin/support', label: 'Support', icon: '🎧' },
  { href: '/admin/rpg-ranking', label: 'RPG Ranking', icon: '🏆' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || !ADMIN_ROLES.includes(session.user?.role)) {
    redirect('/login');
  }
  const user = session.user;
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-gray-700/60">
          <div className="text-lg font-bold text-white tracking-tight">🏨 PixelHoliday OS</div>
          <div className="text-xs text-gray-400 mt-0.5">Operations Portal</div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5">
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-gray-700/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {(user?.name ?? 'U')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.name ?? 'User'}</div>
              <div className="text-xs text-gray-400 capitalize">{user?.role ?? 'admin'}</div>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
