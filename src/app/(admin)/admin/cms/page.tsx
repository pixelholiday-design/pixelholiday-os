// CMS Dashboard
import Link from 'next/link';

export default function CMSPage() {
  const posts = [
    { id: 1, title: 'Welcome to PixelHoliday', date: '2024-03-20' },
    { id: 2, title: 'Feature Announcement', date: '2024-03-19' },
  ];

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <Link href="/admin/cms/posts/new" className="px-4 py-2 bg-blue-600 text-white rounded">New Post</Link>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="rounded-lg border bg-white p-4">
            <h3 className="font-bold">{post.title}</h3>
            <p className="text-sm text-gray-600">{post.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
