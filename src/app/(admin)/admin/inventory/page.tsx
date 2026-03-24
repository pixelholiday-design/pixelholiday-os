export const runtime = "edge";
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const ADMIN_ROLES = ['admin', 'CEO', 'MANAGER'];

const mockInventory = [
  { id: 'INV-001', property: 'Grand Riviera Resort', room: 'Suite 401', type: 'Suite', status: 'Available', floor: 4, capacity: 4, nightly: '$310', lastCleaned: '2026-03-24' },
  { id: 'INV-002', property: 'Grand Riviera Resort', room: 'Ocean View 310', type: 'Deluxe', status: 'Occupied', floor: 3, capacity: 2, nightly: '$240', lastCleaned: '2026-03-22' },
  { id: 'INV-003', property: 'Azure Beach Club', room: 'Deluxe 205', type: 'Deluxe', status: 'Maintenance', floor: 2, capacity: 2, nightly: '$190', lastCleaned: '2026-03-20' },
  { id: 'INV-004', property: 'Azure Beach Club', room: 'Suite 501', type: 'Suite', status: 'Available', floor: 5, capacity: 6, nightly: '$420', lastCleaned: '2026-03-24' },
  { id: 'INV-005', property: 'Mountain Zen Lodge', room: 'Standard 112', type: 'Standard', status: 'Occupied', floor: 1, capacity: 2, nightly: '$140', lastCleaned: '2026-03-23' },
  { id: 'INV-006', property: 'Mountain Zen Lodge', room: 'Deluxe 220', type: 'Deluxe', status: 'Available', floor: 2, capacity: 3, nightly: '$185', lastCleaned: '2026-03-24' },
  { id: 'INV-007', property: 'Grand Riviera Resort', room: 'Standard 101', type: 'Standard', status: 'Available', floor: 1, capacity: 2, nightly: '$160', lastCleaned: '2026-03-24' },
  { id: 'INV-008', property: 'Azure Beach Club', room: 'Penthouse 601', type: 'Penthouse', status: 'Reserved', floor: 6, capacity: 8, nightly: '$750', lastCleaned: '2026-03-23' },
  ];

const statusColors: Record<string, string> = {
    Available: 'bg-green-500/20 text-green-400 border border-green-500/30',
    Occupied: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    Maintenance: 'bg-red-500/20 text-red-400 border border-red-500/30',
    Reserved: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
};

export default async function InventoryPage() {
    const session = await auth();
    if (!session?.user) redirect('/login');
    const userRole = (session.user as any)?.role;
    if (!ADMIN_ROLES.includes(userRole)) redirect('/dashboard');

  const available = mockInventory.filter(r => r.status === 'Available').length;
    const occupied = mockInventory.filter(r => r.status === 'Occupied').length;
    const maintenance = mockInventory.filter(r => r.status === 'Maintenance').length;
    const reserved = mockInventory.filter(r => r.status === 'Reserved').length;

  return (
        <div className="p-8">
              <div className="mb-8 flex items-center justify-between">
                      <div>
                                <h1 className="text-2xl font-bold text-white">Inventory</h1>h1>
                                <p className="text-gray-400 mt-1">Room &amp; property inventory management</p>p>
                      </div>div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                + Add Room
                      </button>button>
              </div>div>
        
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
          { label: 'Available', value: available, color: 'text-green-400' },
          { label: 'Occupied', value: occupied, color: 'text-blue-400' },
          { label: 'Reserved', value: reserved, color: 'text-yellow-400' },
          { label: 'Maintenance', value: maintenance, color: 'text-red-400' },
                  ].map((kpi) => (
                              <div key={kpi.label} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                          <p className="text-gray-400 text-sm">{kpi.label}</p>p>
                                          <p className={`text-3xl font-bold mt-2 ${kpi.color}`}>{kpi.value}</p>p>
                                          <p className="text-gray-500 text-xs mt-1">of {mockInventory.length} total rooms</p>p>
                              </div>div>
                            ))}
              </div>div>
        
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                      <div className="p-6 border-b border-gray-700">
                                <h2 className="text-white font-semibold">Room Inventory</h2>h2>
                      </div>div>
                      <div className="overflow-x-auto">
                                <table className="w-full">
                                            <thead>
                                                          <tr className="border-b border-gray-700">
                                                            {['ID', 'Property', 'Room', 'Type', 'Floor', 'Capacity', 'Nightly Rate', 'Last Cleaned', 'Status', 'Actions'].map(h => (
                            <th key={h} className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-3">{h}</th>th>
                          ))}
                                                          </tr>tr>
                                            </thead>thead>
                                            <tbody className="divide-y divide-gray-700">
                                              {mockInventory.map((room) => (
                          <tr key={room.id} className="hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 text-gray-400 text-sm font-mono">{room.id}</td>td>
                                            <td className="px-6 py-4 text-white text-sm">{room.property}</td>td>
                                            <td className="px-6 py-4 text-white text-sm font-medium">{room.room}</td>td>
                                            <td className="px-6 py-4 text-gray-300 text-sm">{room.type}</td>td>
                                            <td className="px-6 py-4 text-gray-300 text-sm">{room.floor}</td>td>
                                            <td className="px-6 py-4 text-gray-300 text-sm">{room.capacity} guests</td>td>
                                            <td className="px-6 py-4 text-green-400 text-sm font-medium">{room.nightly}</td>td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">{room.lastCleaned}</td>td>
                                            <td className="px-6 py-4">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[room.status]}`}>
                                                                  {room.status}
                                                                </span>span>
                                            </td>td>
                                            <td className="px-6 py-4">
                                                                <button className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">Edit</button>button>
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
