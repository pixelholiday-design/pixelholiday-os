import { db } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
export const runtime = "edge";
const ROLE_COLORS: Record<string,string> = { CEO:"bg-purple-900/40 text-purple-300 border-purple-700", MANAGER:"bg-blue-900/40 text-blue-300 border-blue-700", FRANCHISE:"bg-amber-900/40 text-amber-300 border-amber-700", SUPERVISOR:"bg-teal-900/40 text-teal-300 border-teal-700", STAFF:"bg-gray-800 text-gray-300 border-gray-700" };
export default async function UsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["CEO","MANAGER"].includes(session.user.role as string)) redirect("/admin");
  const where = session.user.role==="MANAGER"&&session.user.hotelId ? {hotelId:session.user.hotelId} : {};
  const users = await db.user.findMany({where,select:{id:true,name:true,email:true,role:true,isActive:true,createdAt:true,hotel:{select:{name:true}}},orderBy:[{role:"asc"},{name:"asc"}]});
  const activeCount=users.filter(u=>u.isActive).length;
  return (<div className="space-y-6"><div className="flex items-center justify-between mb-6"><div><h2 className="text-xl font-semibold">All Users</h2><p className="text-gray-400 text-sm mt-0.5">{users.length} total · {activeCount} active</p></div>{session.user.role==="CEO"&&<a href="/admin/users/new" className="px-4 py-2 rounded-lg bg-amber-500 text-gray-950 font-semibold text-sm">+ Add User</a>}</div><div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"><table className="w-full text-sm"><thead><tr className="text-gray-500 text-xs border-b border-gray-800"><th className="text-left p-3 pl-4">Name</th><th className="text-left p-3">Email</th><th className="text-left p-3">Role</th><th className="text-left p-3">Hotel</th><th className="text-left p-3">Status</th></tr></thead><tbody>{users.map(user=>(<tr key={user.id} className="border-b border-gray-800/50"><td className="p-3 pl-4"><span className="font-medium text-white">{user.name??"—"}</span></td><td className="p-3 text-gray-400">{user.email}</td><td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ROLE_COLORS[user.role]??"bg-gray-800 text-gray-300"}`}>{user.role}</span></td><td className="p-3 text-gray-400">{user.hotel?.name??"—"}</td><td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${user.isActive?"bg-emerald-900/40 text-emerald-400":"bg-gray-800 text-gray-500"}`}>{user.isActive?"Active":"Inactive"}</span></td></tr>))}</tbody></table></div></div>);
}
