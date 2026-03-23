// src/app/(admin)/admin/ats/applications/page.tsx
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function ATSApplicationsPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const applications = [
    { id: 1, name: 'John Doe', position: 'Senior Frontend Engineer', status: 'new', applied: '2024-03-20' },
    { id: 2, name: 'Jane Smith', position: 'Senior Frontend Engineer', status: 'reviewing', applied: '2024-03-19' },
  ];

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-gray-600">Review and manage job applications</p>
      </div>
      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="rounded-lg border bg-white p-4">
            <h3 className="font-bold">{app.name}</h3>
            <p className="text-sm text-gray-600">{app.position}</p>
            <p className="text-xs text-gray-500">Applied: {app.applied}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
