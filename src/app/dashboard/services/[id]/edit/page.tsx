import { requireRole } from "@/lib/access";
import { EditServiceForm } from "@/components/edit-service-form";
export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) { await requireRole(["vendor"]); const { id } = await params; return <EditServiceForm id={id} />; }
