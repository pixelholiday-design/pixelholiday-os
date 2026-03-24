export const runtime = "edge";

const hotels = [
  { id: 1, name: 'PixelHoliday Bangkok Central', location: 'Bangkok, Thailand', rooms: 120, occupied: 98, status: 'active', stars: 4, revenue: '$42,100', manager: 'Somchai P.' },
  { id: 2, name: 'PixelHoliday Phuket Resort', location: 'Phuket, Thailand', rooms: 85, occupied: 77, status: 'active', stars: 5, revenue: '$68,450', manager: 'Nattaporn K.' },
  { id: 3, name: 'PixelHoliday Chiang Mai Hills', location: 'Chiang Mai, Thailand', rooms: 60, occupied: 44, status: 'active', stars: 4, revenue: '$28,300', manager: 'Apisit W.' },
  { id: 4, name: 'PixelHoliday Koh Samui Bay', location: 'Koh Samui, Thailand', rooms: 95, occupied: 84, status: 'active', stars: 5, revenue: '$55,780', manager: 'Chanisa R.' },
  { id: 5, name: 'PixelHoliday Pattaya Beach', location: 'Pattaya, Thailand', rooms: 70, occupied: 45, status: 'maintenance', stars: 3, revenue: '$18,200', manager: 'Teerawat S.' },
  { id: 6, name: 'PixelHoliday Hua Hin Garden', location: 'Hua Hin, Thailand', rooms: 50, occupied: 38, status: 'active', stars: 4, revenue: '$21,900', manager: 'Pranom L.' },
];

const statusStyle: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  maintenance: 'bg-amber-100 text-amber-700',
  closed: 'bg-red-100 text-red-500',
};

export default function HotelsPage() {
  const totalRooms = hotels.reduce((a, h) => a + h.rooms, 0);
  const totalOccupied = hotels.reduce((a, h) => a + h.occupied, 0);
  const avgOccupancy = Math.round((totalOccupied / totalRooms) * 100);

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hotels</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your property portfolio across Thailand</p>
        </div>
        <a href="/admin/hotels/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          + Add Property
        </a>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Properties', value: String(hotels.length), icon: '🏨' },
          { label: 'Total Rooms', value: String(totalRooms), icon: '🛏️' },
          { label: 'Avg Occupancy', value: `${avgOccupancy}%`, icon: '📈' },
          { label: 'Total Revenue', value: '$234,730', icon: '💰' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <span className="text-3xl">{c.icon}</span>
            <div>
              <div className="text-2xl font-bold text-gray-900">{c.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Hotel', 'Location', 'Rooms', 'Occupancy', 'Revenue (MTD)', 'Manager', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {hotels.map(hotel => {
              const occ = Math.round((hotel.occupied / hotel.rooms) * 100);
              return (
                <tr key={hotel.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{hotel.name}</div>
                    <div className="text-yellow-400 text-xs mt-0.5">{'★'.repeat(hotel.stars)}{'☆'.repeat(5 - hotel.stars)}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{hotel.location}</td>
                  <td className="px-5 py-4 text-gray-700 font-medium">{hotel.rooms}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${occ >= 80 ? 'bg-green-500' : occ >= 60 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${occ}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{occ}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900">{hotel.revenue}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{hotel.manager}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle[hotel.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {hotel.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <a href={`/admin/hotels/${hotel.id}`} className="text-indigo-600 text-xs font-medium hover:underline mr-3">View</a>
                    <a href={`/admin/hotels/${hotel.id}/edit`} className="text-gray-400 text-xs font-medium hover:text-gray-600 hover:underline">Edit</a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
      }
