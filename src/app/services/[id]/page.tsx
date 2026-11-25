import { requireSession } from "@/lib/access";
import { ServiceDetails } from "@/components/service-details";
export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSession();
  const { id } = await params;
  return <ServiceDetails id={id}/>;
}
