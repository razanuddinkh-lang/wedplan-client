import { requireRole } from "@/lib/access";
import { AdminServices } from "@/components/admin-services";
export default async function AdminServicesPage(){await requireRole(['admin']);return <AdminServices/>;}
