// New blog post editor
'use client';

import { useState } from 'react';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="max-w-4xl p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <form className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          className="w-full border rounded p-2 text-lg font-semibold"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post Content"
          className="w-full border rounded p-2 h-96"
        />
        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded font-medium">
          Publish
        </button>
      </form>
    </div>
  );
}
