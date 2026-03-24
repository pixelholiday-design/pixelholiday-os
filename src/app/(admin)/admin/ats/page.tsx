export const runtime = "edge";

const pipeline = [
  { stage: 'Applied', count: 28, color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
  { stage: 'Screening', count: 14, color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  { stage: 'Interview', count: 7, color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
  { stage: 'Offer', count: 3, color: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  { stage: 'Hired', count: 2, color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
];

const applications = [
  { id: 'APP-001', name: 'Nattapon Saelim', role: 'Front Desk Manager', hotel: 'Bangkok Central', stage: 'Interview', date: 'Mar 22', score: 87 },
  { id: 'APP-002', name: 'Siriporn Thongchai', role: 'Executive Chef', hotel: 'Phuket Resort', stage: 'Offer', date: 'Mar 21', score: 92 },
  { id: 'APP-003', name: 'Warongrat Suwan', role: 'Housekeeping Supervisor', hotel: 'Chiang Mai Hills', stage: 'Screening', date: 'Mar 20', score: 74 },
  { id: 'APP-004', name: 'Monthira Phakdee', role: 'Guest Relations Officer', hotel: 'Koh Samui Bay', stage: 'Applied', date: 'Mar 20', score: 68 },
  { id: 'APP-005', name: 'Kritsada Wongwian', role: 'Revenue Manager', hotel: 'Bangkok Central', stage: 'Hired', date: 'Mar 18', score: 95 },
  { id: 'APP-006', name: 'Pimchanok Rattana', role: 'Spa Therapist', hotel: 'Phuket Resort', stage: 'Interview', date: 'Mar 17', score: 81 },
  { id: 'APP-007', name: 'Theerawat Kongcharoen', role: 'Night Auditor', hotel: 'Pattaya Beach', stage: 'Screening', date: 'Mar 16', score: 71 },
];

const stageStyle: Record<string, string> = {
  Applied: 'bg-gray-100 text-gray-600',
  Screening: 'bg-blue-100 text-blue-700',
  Interview: 'bg-indigo-100 text-indigo-700',
  Offer: 'bg-violet-100 text-violet-700',
  Hired: 'bg-green-100 text-green-700',
};

const scoreColor = (s: number) => s >= 90 ? 'text-green-600' : s >= 75 ? 'text-amber-600' : 'text-gray-500';

export default function ATSPage() {
  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment (ATS)</h1>
          <p className="text-gray-500 text-sm mt-1">Track applicants across all hotel properties</p>
        </div>
        <a href="/admin/ats/new-posting" className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          + New Job Posting
        </a>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-8">
        {pipeline.map(p => (
          <div key={p.stage} className={`rounded-xl border border-gray-100 shadow-sm p-4 ${p.color}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${p.dot}`} />
              <span className="text-sm font-medium">{p.stage}</span>
            </div>
            <div className="text-3xl font-bold">{p.count}</div>
            <div className="text-xs opacity-70 mt-0.5">applicants</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">All Applications</h2>
          <a href="/admin/ats/applications" className="text-xs text-indigo-600 font-medium hover:underline">View all →</a>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Applicant', 'Role', 'Property', 'Stage', 'Score', 'Applied', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {applications.map(a => (
              <tr key={a.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{a.id}</td>
                <td className="px-5 py-3.5 font-medium text-gray-900">{a.name}</td>
                <td className="px-5 py-3.5 text-gray-500 text-xs">{a.role}</td>
                <td className="px-5 py-3.5 text-gray-400 text-xs">{a.hotel}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${stageStyle[a.stage] ?? 'bg-gray-100 text-gray-600'}`}>
                    {a.stage}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-sm font-bold ${scoreColor(a.score)}`}>{a.score}</span>
                  <span className="text-gray-300 text-xs">/100</span>
                </td>
                <td className="px-5 py-3.5 text-gray-400 text-xs">{a.date}</td>
                <td className="px-5 py-3.5">
                  <a href={`/admin/ats/applications/${a.id}`} className="text-indigo-600 text-xs font-medium hover:underline">Review</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
          }
