export const runtime = "edge";
import { redirect } from 'next/navigation';

const mockGalleries = [
  { id: 'GAL-001', title: 'Smith Wedding', client: 'Emma & James Smith', date: '2026-03-15', photos: 142, cover: '/placeholder.jpg', status: 'delivered', slug: 'smith-wedding-2026' },
  { id: 'GAL-002', title: 'Ferrari Family Portraits', client: 'Ferrari Family', date: '2026-03-10', photos: 87, cover: '/placeholder.jpg', status: 'delivered', slug: 'ferrari-portraits-2026' },
  { id: 'GAL-003', title: 'Costa Corporate Event', client: 'Costa Corp', date: '2026-02-28', photos: 215, cover: '/placeholder.jpg', status: 'review', slug: 'costa-event-2026' },
  { id: 'GAL-004', title: 'Rossi Engagement', client: 'Sofia & Marco Rossi', date: '2026-02-14', photos: 63, cover: '/placeholder.jpg', status: 'delivered', slug: 'rossi-engagement-2026' },
  { id: 'GAL-005', title: 'Bianchi Anniversary', client: 'Bianchi Family', date: '2026-01-20', photos: 98, cover: '/placeholder.jpg', status: 'delivered', slug: 'bianchi-anniversary-2026' },
  { id: 'GAL-006', title: 'Luxury Brand Campaign', client: 'Ricci Brands', date: '2026-01-08', photos: 320, cover: '/placeholder.jpg', status: 'archived', slug: 'ricci-campaign-2026' },
];

const statusColor: Record<string, string> = {
  delivered: 'bg-green-100 text-green-800',
  review: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-gray-100 text-gray-600',
};

export default async function GalleryPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">PixelHoliday Galleries</h1>
          <p className="text-gray-500 mt-2 text-lg">Browse and download your photo collection</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockGalleries.map(gallery => (
            <div key={gallery.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-5xl">📷</span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="font-semibold text-gray-900 text-lg leading-tight">{gallery.title}</h2>
                  <span className={`ml-2 flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[gallery.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {gallery.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{gallery.client}</p>
                <p className="text-xs text-gray-400 mb-4">{gallery.date} · {gallery.photos} photos</p>
                <a
                  href={`/gallery/${gallery.slug}`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Gallery
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
