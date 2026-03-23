// New job posting form
'use client';

export default function NewPostingPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Job Posting</h1>
      <form className="max-w-2xl space-y-4">
        <input type="text" placeholder="Job Title" className="w-full border rounded p-2" />
        <textarea placeholder="Description" className="w-full border rounded p-2" />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Post Job</button>
      </form>
    </div>
  );
}
