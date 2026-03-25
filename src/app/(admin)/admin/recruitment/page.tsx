export const runtime = "edge";
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const ADMIN_ROLES = ['admin', 'CEO', 'MANAGER'];

const mockCandidates = [
  { id: 'REC-001', name: 'Alessandro Greco', role: 'Front Desk Manager', hotel: 'Villa Serena', stage: 'Interview', applied: '2025-03-10', experience: '5 years', status: 'Active' },
  { id: 'REC-002', name: 'Isabella Moretti', role: 'Head Chef', hotel: 'Palazzo Mare', stage: 'Offer', applied: '2025-03-05', experience: '8 years', status: 'Active' },
  { id: 'REC-003', name: 'David Chen', role: 'Marketing Coordinator', hotel: 'HQ', stage: 'Screening', applied: '2025-03-18', experience: '3 years', status: 'Active' },
  { id: 'REC-004', name: 'Fatima Al-Hassan', role: 'Spa Therapist', hotel: 'Coral Bay Resort', stage: 'Hired', applied: '2025-02-28', experience: '6 years', status: 'Hired' },
  { id: 'REC-005', name: 'Pierre Lambert', role: 'Revenue Manager', hotel: 'HQ', stage: 'Interview', applied: '2025-03-12', experience: '7 years', status: 'Active' },
  { id: 'REC-006', name: 'Amelia Thompson', role: 'Housekeeping Supervisor', hotel: 'Villa Serena', stage: 'Rejected', applied: '2025-03-01', experience: '4 years', status: 'Closed' },
  { id: 'REC-007', name: 'Kwame Asante', role: 'F&B Director', hotel: 'Palazzo Mare', stage: 'Screening', applied: '2025-03-20', experience: '10 years', status: 'Active' },
];

const openRoles = [
  { title: 'Front Desk Manager', hotel: 'Villa Serena', type: 'Full-time', posted: '2025-03-01', applicants: 12 },
  { title: 'Head Chef', hotel: 'Palazzo Mare', type: 'Full-time', posted: '2025-02-20', applicants: 8 },
  { title: 'Marketing Coordinator', hotel: 'HQ', type: 'Full-time', posted: '2025-03-15', applicants: 24 },
  { title: 'Spa Therapist', hotel: 'Coral Bay Resort', type: 'Part-time', posted: '2025-03-08', applicants: 6 },
  { title: 'Revenue Manager', hotel: 'HQ', type: 'Full-time', posted: '2025-03-10', applicants: 15 },
];

const stageColors: Record<string, string> = {
  Screening: 'bg-blue-100 text-blue-700',
  Interview: 'bg-purple-100 text-purple-700',
  Offer: 'bg-yellow-100 text-yellow-700',
  Hired: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-600',
};

export default async function RecruitmentPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const userRole = (session.user as { role?: string }).role ?? '';
  if (!ADMIN_ROLES.includes(userRole)) redirect('/admin');

  const active = mockCandidates.filter(c => c.status === 'Active').length;
  const hired = mockCandidates.filter(c => c.stage === 'Hired').length;
  const inInterview = mockCandidates.filter(c => c.stage === 'Interview').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment</h1>
          <p className="text-sm text-gray-500 mt-1">Track candidates and open positions</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          + Post Role
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Open Positions', value: openRoles.length, color: 'text-blue-600' },
          { label: 'Active Candidates', value: active, color: 'text-purple-600' },
          { label: 'In Interview', value: inInterview, color: 'text-yellow-600' },
          { label: 'Hired This Month', value: hired, color: 'text-green-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{c.label}</p>
            <p className={`text-3xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidates Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Candidates Pipeline</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Candidate</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Stage</th>
                  <th className="px-4 py-3 text-left">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockCandidates.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.experience} exp.</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700">{c.role}</p>
                      <p className="text-xs text-gray-400">{c.hotel}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${stageColors[c.stage] ?? 'bg-gray-100 text-gray-600'}`}>
                        {c.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{c.applied}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Open Roles */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Open Positions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {openRoles.map(r => (
              <div key={r.title} className="px-4 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.hotel} · {r.type}</p>
                  </div>
                  <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {r.applicants} apps
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Posted {r.posted}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
