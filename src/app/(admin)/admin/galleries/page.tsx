export const runtime = "edge";
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const ADMIN_ROLES = ['admin', 'CEO', 'MANAGER'];

const mockGalleries = [
  { id: 'GAL-001', hotel: 'Grand Riviera Resort', location: 'Mexico', images: 24, published: 18, drafts: 6, views: 8420, lastUpdated: '2026-03-22', status: 'Published' },
  { id: 'GAL-002', hotel: 'Azure Beach Club', location: 'Maldives', images: 18, published: 18, drafts: 0, views: 12300, lastUpdated: '2026-03-20', status: 'Published' },
  { id: 'GAL-003', hotel: 'Mountain Zen Lodge', location: 'Switzerland', images: 31, published: 25, drafts: 6, views: 5600, lastUpdated: '2026-03-18', status: 'Published' },
  { id: 'GAL-004', hotel: 'Savanna Safari Camp', location: 'Kenya', images: 15, published: 0, drafts: 15, views: 0, lastUpdated: '2026-03-24', status: 'Draft' },
  { id: 'GAL-005', hotel: 'Bali Hideaway', location: 'Indonesia', images: 27, published: 27, drafts: 0, views: 9870, lastUpdated: '2026-03-15', status: 'Published' },
  { id: 'GAL-006', hotel: 'Patagonia Lodge', location: 'Argentina', images: 12, published: 8, drafts: 4, views: 2100, lastUpdated: '2026-03-10', status: 'Published' },
];

const statusColors: Record<string, string> = {
  Published: 'bg-green-500/20 text-green-400 border border-green-500/30',
  Draft: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Archived: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

export default async function GalleriesAdminPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const userRole = (session.user as any)?.role;
  if (!ADMIN_ROLES.includes(userRole)) redirect('/dashboard');

  const totalImages = mockGalleries.reduce((s, g) => s + g.images, 0);
  const totalViews = mockGalleries.reduce((s, g) => s + g.views, 0);
  const totalPublished = mockGalleries.filter(g => g.status === 'Published').length;
  const totalDrafts = mockGalleries.reduce((s, g) => s + g.drafts, 0);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Galleries</h1>
          <p className="text-gray-400 mt-1">Property photo galleries and media management</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Upload Photos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Photos', value: totalImages, sub: 'across all properties' },
          { label: 'Published Galleries', value: totalPublished, sub: 'live on site' },
          { label: 'Draft Photos', value: totalDrafts, sub: 'pending review' },
          { label: 'Total Views', value: totalViews.toLocaleString(), sub: 'gallery page visits' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">{kpi.label}</p>
            <p className="text-3xl font-bold text-white mt-2">{kpi.value}</p>
            <p className="text-gray-500 text-xs mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mockGalleries.map((g) => (
          <div key={g.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 h-36 flex items-center justify-center">
              <span className="text-gray-500 text-sm">{g.images} photos</span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-white font-semibold text-sm">{g.hotel}</h3>
                  <p className="text-gray-400 text-xs mt-0.5">{g.location}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[g.status]}`}>{g.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div>
                  <p className="text-white font-semibold text-sm">{g.published}</p>
                  <p className="text-gray-500 text-xs">Published</p>
                </div>
                <div>
                  <p className="text-yellow-400 font-semibold text-sm">{g.drafts}</p>
                  <p className="text-gray-500 text-xs">Drafts</p>
                </div>
                <div>
                  <p className="text-indigo-400 font-semibold text-sm">{g.views.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs">Views</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-gray-500 text-xs">Updated {g.lastUpdated}</span>
                <div className="flex gap-2">
                  <button className="text-indigo-400 hover:text-indigo-300 text-xs transition-colors">Edit</button>
                  <button className="text-gray-500 hover:text-gray-300 text-xs transition-colors">View</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-white font-semibold">Gallery Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                {['ID', 'Hotel', 'Location', 'Total Photos', 'Published', 'Drafts', 'Views', 'Last Updated', 'Status'].map(h => (
                  <th key={h} className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {mockGalleries.map((g) => (
                <tr key={g.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 text-sm font-mono">{g.id}</td>
                  <td className="px-6 py-4 text-white text-sm font-medium">{g.hotel}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{g.location}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{g.images}</td>
                  <td className="px-6 py-4 text-green-400 text-sm">{g.published}</td>
                  <td className="px-6 py-4 text-yellow-400 text-sm">{g.drafts}</td>
                  <td className="px-6 py-4 text-indigo-400 text-sm">{g.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{g.lastUpdated}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[g.status]}`}>{g.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
