export const runtime = "edge";

const posts = [
  { id: '1', title: 'Spring Season Promotions — 30% Off Beachfront Villas', status: 'published', category: 'Promotions', author: 'Admin', views: 1243, date: 'Mar 20, 2026' },
  { id: '2', title: 'New Spa Menu Launches at Phuket Resort', status: 'published', category: 'News', author: 'Nattaporn K.', views: 876, date: 'Mar 18, 2026' },
  { id: '3', title: 'Staff Recognition — March 2026 Top Performers', status: 'draft', category: 'Internal', author: 'Admin', views: 0, date: 'Mar 17, 2026' },
  { id: '4', title: 'Koh Samui Bay Pool Villas — Updated Gallery', status: 'published', category: 'Updates', author: 'Chanisa R.', views: 2104, date: 'Mar 15, 2026' },
  { id: '5', title: 'Chiang Mai Hills — Eco Trekking Packages 2026', status: 'draft', category: 'Promotions', author: 'Apisit W.', views: 0, date: 'Mar 12, 2026' },
  { id: '6', title: 'PixelHoliday Celebrates 5 Years of Operations', status: 'published', category: 'News', author: 'Admin', views: 3891, date: 'Mar 8, 2026' },
  { id: '7', title: 'Q1 Revenue Report — Summary for Partners', status: 'archived', category: 'Internal', author: 'Admin', views: 412, date: 'Mar 1, 2026' },
];

const statusStyle: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-amber-100 text-amber-700',
  archived: 'bg-gray-100 text-gray-500',
};

const catStyle: Record<string, string> = {
  Promotions: 'bg-indigo-50 text-indigo-600',
  News: 'bg-blue-50 text-blue-600',
  Internal: 'bg-gray-50 text-gray-500',
  Updates: 'bg-teal-50 text-teal-600',
};

export default function CMSPage() {
  const published = posts.filter(p => p.status === 'published').length;
  const drafts = posts.filter(p => p.status === 'draft').length;
  const totalViews = posts.reduce((a, p) => a + p.views, 0);

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage blog posts, promotions, and announcements</p>
        </div>
        <a href="/admin/cms/posts/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          ✍️ New Post
        </a>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Published', value: String(published), icon: '✅', color: 'text-green-600' },
          { label: 'Drafts', value: String(drafts), icon: '📝', color: 'text-amber-600' },
          { label: 'Total Views', value: totalViews.toLocaleString(), icon: '👁️', color: 'text-indigo-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <span className="text-2xl">{c.icon}</span>
            <div>
              <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">All Posts</h2>
          <span className="text-xs text-gray-400">{posts.length} total</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Title', 'Category', 'Author', 'Status', 'Views', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-5 py-3.5 max-w-xs">
                  <div className="font-medium text-gray-900 truncate">{post.title}</div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${catStyle[post.category] ?? 'bg-gray-50 text-gray-500'}`}>
                    {post.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-500 text-xs">{post.author}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle[post.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-500 text-xs">{post.views > 0 ? post.views.toLocaleString() : '—'}</td>
                <td className="px-5 py-3.5 text-gray-400 text-xs">{post.date}</td>
                <td className="px-5 py-3.5">
                  <a href={`/admin/cms/posts/${post.id}`} className="text-indigo-600 text-xs font-medium hover:underline mr-2">Edit</a>
                  <a href={`/admin/cms/posts/${post.id}`} className="text-gray-400 text-xs font-medium hover:text-gray-600 hover:underline">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
            }
