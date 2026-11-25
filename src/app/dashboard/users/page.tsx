import { requireRole } from "@/lib/access";
import { AdminUsers } from "@/components/admin-users";
export default async function UsersPage(){await requireRole(['admin']);return <AdminUsers/>;}
