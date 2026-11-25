import { requireSession } from "@/lib/access";
import { DashboardOverview } from "@/components/dashboard-overview";
import type { UserRole } from "@/lib/types";
export default async function DashboardPage(){const session=await requireSession();const role=(session.user as typeof session.user&{role:UserRole}).role;return <DashboardOverview role={role}/>;}
