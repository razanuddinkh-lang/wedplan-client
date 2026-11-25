import { requireRole } from "@/lib/access";
import { SubscriptionView } from "@/components/subscription-view";
export default async function SubscriptionPage(){await requireRole(['vendor']);return <SubscriptionView/>;}
