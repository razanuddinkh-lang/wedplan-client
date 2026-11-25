import { requireRole } from "@/lib/access";
import { VendorServices } from "@/components/vendor-services";
export default async function MyServicesPage(){await requireRole(['vendor']);return <VendorServices/>;}
