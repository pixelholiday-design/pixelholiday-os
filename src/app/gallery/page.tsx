export const runtime = "edge";

const mockGalleries = [
  { id: 1, hotel: 'Grand Riviera Resort', location: 'Mexico', images: 24, cover: 'Pool & Terrace', featured: true },
  { id: 2, hotel: 'Azure Beach Club', location: 'Maldives', images: 18, cover: 'Overwater Bungalows', featured: true },
  { id: 3, hotel: 'Mountain Zen Lodge', location: 'Switzerland', images: 31, cover: 'Alpine Views', featured: false },
  { id: 4, hotel: 'Savanna Safari Camp', location: 'Kenya', images: 15, cover: 'Wildlife & Sunsets', featured: true },
  { id: 5, hotel: 'Bali Hideaway', location: 'Indonesia', images: 27, cover: 'Infinity Pool', featured: false },
  { id: 6, hotel: 'Patagonia Lodge', location: 'Argentina', images: 12, cover: 'Mountain Peaks', featured: false },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tight mb-4">Our Properties</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Explore stunning photography from our collection of handpicked luxury hotels and resorts worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockGalleries.map((g) => (
            <div key={g.id} className="group bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-52 flex items-center justify-center relative">
                <span className="text-gray-600 text-sm">{g.cover}</span>
                {g.featured && (
                  <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-medium">Featured</span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-white font-semibold text-lg group-hover:text-indigo-400 transition-colors">{g.hotel}</h3>
                <p className="text-gray-400 text-sm mt-1">{g.location}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-500 text-xs">{g.images} photos</span>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">View Gallery</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">All photographs taken on-property by our media team.</p>
          <a href="/book" className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-colors">
            Book a Stay
          </a>
        </div>
      </div>
    </div>
  );
}
