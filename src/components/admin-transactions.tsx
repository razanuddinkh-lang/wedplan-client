"use client";
import { useEffect,useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { DataTable } from "@/components/data-table";
import { formatDate } from "@/lib/utils";
type Tx={id:string;vendorId:string;vendorName?:string;plan:string;amount:number;currency:string;status:string;createdAt:string;stripeSessionId:string};
export function AdminTransactions(){const [items,setItems]=useState<Tx[]>([]);const [loading,setLoading]=useState(true);useEffect(()=>{apiFetch<{transactions:Tx[]}>('/admin/transactions').then(d=>setItems(d.transactions)).catch(e=>toast.error(e instanceof Error?e.message:'Unable to load transactions.')).finally(()=>setLoading(false));},[]);const rows=items.map(t=>[t.vendorName||t.vendorId,t.plan,`${t.currency.toUpperCase()} ${Number(t.amount).toFixed(2)}`,<span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">{t.status}</span>,formatDate(t.createdAt),<span className="max-w-36 truncate font-mono text-xs text-stone-500">{t.stripeSessionId}</span>]);return <div><div className="mb-7"><p className="section-kicker">Platform administration</p><h1 className="mt-2 font-serif text-3xl font-bold">Transactions</h1><p className="mt-2 text-sm text-stone-500">Read-only records created from verified Stripe events.</p></div>{loading?<div className="h-52 animate-pulse rounded-2xl bg-rose-50"/>:<DataTable headers={['Vendor','Plan','Amount','Status','Date','Stripe session']} rows={rows} empty="No successful transactions yet."/>}</div>}
