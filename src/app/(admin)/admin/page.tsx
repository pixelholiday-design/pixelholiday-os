import { Metadata } from 'next';
import { auth } from '@/lib/auth/auth';

export const metadata: Metadata = {
  title: 'Admin Dashboard - PixelHoliday OS',
};

export default async function AdminDashboard() {
  const session = await auth();
  const user = session?.user;

  const stats = [
    { title: 'Total Revenue', value: '$12,543.00', change: '+2.5%' },
    { title: 'Total Orders', value: '2,345', change: '+5.2%' },
    { title: 'Active Users', value: '1,234', change: '+1.1%' },
    { title: 'Conversion Rate', value: '3.24%', change: '+0.3%' },
  ];

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here is your dashboard overview</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-lg border bg-white p-4">
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-green-600">{stat.change} from last month</p>
          </div>
        ))}
      </div>
    </div>
  );
}
