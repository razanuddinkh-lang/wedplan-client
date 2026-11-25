import { requireRole } from "@/lib/access";
import { ServiceForm } from "@/components/service-form";
export default async function AddServicePage(){await requireRole(['vendor']);return <ServiceForm/>;}
