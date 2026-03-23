import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ATS - Applicant Tracking System',
};

export default function ATSPage() {
  const jobs = [
    { id: 1, title: 'Senior Frontend Engineer', applications: 12, status: 'Open' },
    { id: 2, title: 'Product Designer', applications: 8, status: 'Open' },
    { id: 3, title: 'Backend Engineer', applications: 15, status: 'Closed' },
  ];

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Applicant Tracking</h1>
          <p className="text-gray-600">Manage job postings and applications</p>
        </div>
        <Link href="/admin/ats/new-posting" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          New Job Posting
        </Link>
      </div>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-lg border bg-white p-4">
            <h3 className="font-bold">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.applications} applications</p>
            <Link href={`/admin/ats/applications?job=${job.id}`} className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              View Applications
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
