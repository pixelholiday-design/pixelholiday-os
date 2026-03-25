export const runtime = "edge";
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const ADMIN_ROLES = ['admin', 'CEO', 'MANAGER'];

const mockRankings = [
  { rank: 1, guest: 'Luca Ferrari', email: 'luca.ferrari@email.it', level: 'Legendary Explorer', xp: 48200, badges: 24, stays: 12, countries: 6, streak: 8 },
  { rank: 2, guest: 'Chen Wei', email: 'c.wei@email.com', level: 'Master Voyager', xp: 34600, badges: 18, stays: 8, countries: 4, streak: 5 },
  { rank: 3, guest: 'James Wilson', email: 'james.wilson@gmail.com', level: 'Elite Wanderer', xp: 22100, badges: 13, stays: 5, countries: 3, streak: 3 },
  { rank: 4, guest: 'Sofia Martinez', email: 'sofia.m@outlook.com', level: 'Seasoned Traveler', xp: 14800, badges: 9, stays: 3, countries: 2, streak: 2 },
  { rank: 5, guest: 'Emma Thompson', email: 'emma.t@icloud.com', level: 'Adventurer', xp: 4200, badges: 4, stays: 1, countries: 1, streak: 1 },
  { rank: 6, guest: 'Amara Okafor', email: 'amara.o@gmail.com', level: 'Explorer', xp: 2800, badges: 3, stays: 2, countries: 1, streak: 0 },
];

const levelColors: Record<string, string> = {
  'Legendary Explorer': 'text-yellow-300',
  'Master Voyager': 'text-purple-400',
  'Elite Wanderer': 'text-blue-400',
  'Seasoned Traveler': 'text-green-400',
  'Adventurer': 'text-cyan-400',
  'Explorer': 'text-gray-400',
};

const xpToNextLevel: Record<string, number> = {
  'Legendary Explorer': 100000,
  'Master Voyager': 50000,
  'Elite Wanderer': 35000,
  'Seasoned Traveler': 23000,
  'Adventurer': 15000,
  'Explorer': 5000,
};

export default async function RPGRankingPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const userRole = (session.user as any)?.role;
  if (!ADMIN_ROLES.includes(userRole)) redirect('/dashboard');

  const totalXP = mockRankings.reduce((s, r) => s + r.xp, 0);
  const totalBadges = mockRankings.reduce((s, r) => s + r.badges, 0);
  const avgStreak = (mockRankings.reduce((s, r) => s + r.streak, 0) / mockRankings.length).toFixed(1);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">RPG Ranking</h1>
          <p className="text-gray-400 mt-1">Guest loyalty gamification leaderboard</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Configure XP Rules
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Players', value: mockRankings.length, sub: 'enrolled guests' },
          { label: 'Total XP Earned', value: totalXP.toLocaleString(), sub: 'across all players' },
          { label: 'Badges Awarded', value: totalBadges, sub: 'total achievements' },
          { label: 'Avg Streak', value: avgStreak + ' days', sub: 'booking streak' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">{kpi.label}</p>
            <p className="text-3xl font-bold text-white mt-2">{kpi.value}</p>
            <p className="text-gray-500 text-xs mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {mockRankings.slice(0, 3).map((r) => (
          <div key={r.rank} className={`bg-gray-800 rounded-xl border p-6 ${r.rank === 1 ? 'border-yellow-500/50' : r.rank === 2 ? 'border-gray-400/50' : 'border-orange-700/50'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-2xl font-black ${r.rank === 1 ? 'text-yellow-300' : r.rank === 2 ? 'text-gray-300' : 'text-orange-400'}`}>
                {r.rank === 1 ? '1st' : r.rank === 2 ? '2nd' : '3rd'}
              </span>
              <span className="text-gray-500 text-sm">{r.xp.toLocaleString()} XP</span>
            </div>
            <p className="text-white font-semibold">{r.guest}</p>
            <p className={`text-sm font-medium mt-1 ${levelColors[r.level]}`}>{r.level}</p>
            <div className="mt-3 flex gap-4 text-xs text-gray-400">
              <span>{r.badges} badges</span>
              <span>{r.stays} stays</span>
              <span>{r.countries} countries</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>XP Progress</span>
                <span>{Math.round((r.xp / xpToNextLevel[r.level]) * 100)}%</span>
              </div>
              <div className="bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((r.xp / xpToNextLevel[r.level]) * 100))}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-white font-semibold">Full Leaderboard</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                {['Rank', 'Guest', 'Level', 'XP', 'Progress', 'Badges', 'Stays', 'Countries', 'Streak'].map(h => (
                  <th key={h} className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {mockRankings.map((r) => {
                const progress = Math.min(100, Math.round((r.xp / xpToNextLevel[r.level]) * 100));
                return (
                  <tr key={r.rank} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-white font-bold text-sm">#{r.rank}</td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm font-medium">{r.guest}</p>
                      <p className="text-gray-500 text-xs">{r.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${levelColors[r.level]}`}>{r.level}</span>
                    </td>
                    <td className="px-6 py-4 text-white text-sm font-mono">{r.xp.toLocaleString()}</td>
                    <td className="px-6 py-4 w-32">
                      <div className="bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-gray-500 text-xs mt-1">{progress}%</span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{r.badges}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{r.stays}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{r.countries}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{r.streak} days</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
