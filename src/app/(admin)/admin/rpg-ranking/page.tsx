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

  return (
        <div className="p-8">
              <div className="mb-8 flex items-center justify-between">
                      <div>
                                <h1 className="text-2xl font-bold text-white">RPG Ranking</h1>h1>
                                <p className="text-gray-400 mt-1">Guest loyalty gamification leaderboard</p>p>
                      </div>div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                Configure XP Rules
                      </button>button>
              </div>div>
        
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
          { label: 'Total Players', value: mockRankings.length, sub: 'enrolled guests' },
          { label: 'Total XP Earned', value: totalXP.toLocaleString(), sub: 'across all players' },
          { label: 'Badges Awarded', value: totalBadges, sub: 'total achiev</div>
