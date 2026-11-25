import { requireSession } from "@/lib/access";
import { DashboardShell } from "@/components/dashboard-shell";
import type { UserRole } from "@/lib/types";
export default async function DashboardLayout({children}:{children:React.ReactNode}){const session=await requireSession();const user=session.user as typeof session.user&{role?:UserRole};const role=user.role;if(!role)throw new Error('Your account role is not configured.');return <DashboardShell role={role} name={session.user.name}>{children}</DashboardShell>;}
