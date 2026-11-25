import { requireRole } from "@/lib/access";
import { BookingsView } from "@/components/bookings-view";
import type { UserRole } from "@/lib/types";
export default async function BookingsPage(){const session=await requireRole(['customer','vendor']);const role=(session.user as typeof session.user&{role:UserRole}).role as 'customer'|'vendor';return <BookingsView role={role}/>;}
