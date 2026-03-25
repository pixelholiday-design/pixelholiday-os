export const runtime = "edge";
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const ADMIN_ROLES = ['admin', 'CEO', 'MANAGER'];

const mockBooking = {
  id: 'BK-2401', guest: 'Luca Ferrari', email: 'luca@email.it',
  hotel: 'Villa Serena', room: 'Suite 201',
  checkIn: '2025-04-01', checkOut: '2025-04-07', nights: 6,
  status: 'Confirmed', total: '€2,400', source: 'Direct',
  notes: 'VIP guest — early check-in requested.',
  adults: 2, children: 0, specialRequests: 'Sea view room preferred'
};

export default async function BookingPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const userRole = (session.user as { role?: string }).role ?? '';
  if (!ADMIN_ROLES.includes(userRole)) redirect('/admin');
  const b = mockBooking;
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/admin/bookings" className="text-sm text-blue-600 hover:underline">
            Back to Bookings
          </a>
          <h1 className="text-xl font-bold text-gray-900">Booking {b.id}</h1>
        </div>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          {b.status}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 border-b pb-2 mb-4">Guest</h2>
          <dl className="space-y-2">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-gray-900">{b.guest}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-900">{b.email}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Adults</dt>
              <dd className="font-medium text-gray-900">{b.adults}</dd>
            </div>
          </dl>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 border-b pb-2 mb-4">Stay</h2>
          <dl className="space-y-2">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Hotel</dt>
              <dd className="font-medium text-gray-900">{b.hotel}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Room</dt>
              <dd className="font-medium text-gray-900">{b.room}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Check In</dt>
              <dd className="font-medium text-gray-900">{b.checkIn}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Check Out</dt>
              <dd className="font-medium text-gray-900">{b.checkOut}</dd>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <dt className="font-medium text-gray-700">Total</dt>
              <dd className="font-bold text-gray-900">{b.total}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-2">Special Requests</h2>
        <p className="text-sm text-gray-600">{b.specialRequests}</p>
      </div>
      <div className="flex gap-3">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          Edit Booking
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
          Check In
        </button>
        <button className="border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50">
          Cancel
        </button>
      </div>
    </div>
  );
}
