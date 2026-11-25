import { requireRole } from "@/lib/access";
import { AdminTransactions } from "@/components/admin-transactions";
export default async function TransactionsPage(){await requireRole(['admin']);return <AdminTransactions/>;}
