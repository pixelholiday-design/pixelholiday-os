export const runtime = "edge";

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tight mb-4">Book Your Stay</h1>
          <p className="text-gray-400 text-lg">Find and reserve your perfect PixelHoliday experience.</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Destination</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500">
                <option value="">All destinations</option>
                <option>Grand Riviera Resort, Mexico</option>
                <option>Azure Beach Club, Maldives</option>
                <option>Mountain Zen Lodge, Switzerland</option>
                <option>Savanna Safari Camp, Kenya</option>
                <option>Bali Hideaway, Indonesia</option>
                <option>Patagonia Lodge, Argentina</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Guests</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500">
                <option>1 guest</option>
                <option>2 guests</option>
                <option>3 guests</option>
                <option>4+ guests</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Check-in</label>
              <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Check-out</label>
              <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors">
            Search Availability
          </button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Properties', value: '6' },
            { label: 'Countries', value: '6' },
            { label: 'Happy Guests', value: '2,400+' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
