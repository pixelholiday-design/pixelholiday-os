import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { SupervisorSidebar } from "@/components/supervisor/SupervisorSidebar";
import { PortalHeader } from "@/components/shared/PortalHeader";

export default async function SupervisorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || !["SUPERVISOR", "CEO", "MANAGER"].includes(session.user.role)) {
    redirect("/login");
  }
  return (
    <div className="flex h-screen overflow-hidden">
      <SupervisorSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <PortalHeader user={session.user} portalName="Supervisor HQ" />
        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">{children}</main>
      </div>
    </div>
  );
}
