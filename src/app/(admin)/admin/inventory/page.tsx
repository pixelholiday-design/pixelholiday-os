export const runtime = "edge";
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const ADMIN_ROLES = ['admin', 'CEO', 'MANAGER'];

const mockItems = [
  { id: 'INV-001', name: 'Canon EOS R5', category: 'Camera', sku: 'CAM-R5-001', qty: 4, available: 3, condition: 'Excellent', location: 'Studio A', value: 3899 },
  { id: 'INV-002', name: 'Sony A7 IV', category: 'Camera', sku: 'CAM-A7-002', qty: 6, available: 5, condition: 'Good', location: 'Studio B', value: 2498 },
  { id: 'INV-003', name: 'Godox SL-200W', category: 'Lighting', sku: 'LGT-GDX-003', qty: 10, available: 8, condition: 'Good', location: 'Lighting Room', value: 299 },
  { id: 'INV-004', name: 'Profoto B10 Plus', category: 'Lighting', sku: 'LGT-PRF-004', qty: 6, available: 4, condition: 'Excellent', location: 'Studio A', value: 1995 },
  { id: 'INV-005', name: 'DJI Ronin 4D', category: 'Gimbal', sku: 'GIM-DJI-005', qty: 2, available: 1, condition: 'Excellent', location: 'Cage', value: 7399 },
  { id: 'INV-006', name: 'Canon 24-70mm f/2.8', category: 'Lens', sku: 'LNS-CAN-006', qty: 3, available: 3, condition: 'Good', location: 'Lens Cabinet', value: 2099 },
  { id: 'INV-007', name: 'Sony 85mm f/1.4 GM', category: 'Lens', sku: 'LNS-SNY-007', qty: 2, available: 2, condition: 'Excellent', location: 'Lens Cabinet', value: 1798 },
  { id: 'INV-008', name: 'Manfrotto 055 Tripod', category: 'Support', sku: 'SUP-MAN-008', qty: 8, available: 6, condition: 'Good', location: 'Equipment Room', value: 349 },
  { id: 'INV-009', name: 'SanDisk 256GB CFexpress', category: 'Media', sku: 'MED-SDK-009', qty: 20, available: 15, condition: 'Good', location: 'Media Cabinet', value: 189 },
  { id: 'INV-010', name: 'Westcott 7ft Umbrella', category: 'Lighting', sku: 'LGT-WST-010', qty: 12, available: 10, condition: 'Fair', location: 'Lighting Room', value: 79 },
];

const conditionColor: Record<string, string> = {
  Excellent: 'bg-green-100 text-green-800',
  Good: 'bg-blue-100 text-blue-800',
  Fair: 'bg-yellow-100 text-yellow-800',
  Poor: 'bg-red-100 text-red-800',
};

const categories = Array.from(new Set(mockItems.map(i => i.category)));
const totalValue = mockItems.reduce((sum, i) => sum + i.value * i.qty, 0);
const totalItems = mockItems.reduce((sum, i) => sum + i.qty, 0);
const availableItems = mockItems.reduce((sum, i) => sum + i.available, 0);

export default async function InventoryPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!ADMIN_ROLES.includes((session.user as { role?: string }).role ?? '')) {
    redirect('/admin');
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Track equipment, gear, and consumables</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          + Add Item
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Total SKUs</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{mockItems.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Total Units</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalItems}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Available</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{availableItems}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${totalValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['All', ...categories].map(cat => (
          <span key={cat} className="px-3 py-1 rounded-full text-sm border bg-white text-gray-700 cursor-pointer hover:bg-gray-50">
            {cat}
          </span>
        ))}
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left font-medium text-gray-600">Item</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">SKU</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Qty</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Available</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Condition</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Unit Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.id}</div>
                </td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{item.sku}</td>
                <td className="px-4 py-3 text-gray-600">{item.category}</td>
                <td className="px-4 py-3 text-gray-900 font-medium">{item.qty}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.available === 0 ? 'bg-red-100 text-red-700' :
                    item.available < item.qty ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.available}/{item.qty}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${conditionColor[item.condition] ?? 'bg-gray-100 text-gray-700'}`}>
                    {item.condition}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{item.location}</td>
                <td className="px-4 py-3 text-gray-900">${item.value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
