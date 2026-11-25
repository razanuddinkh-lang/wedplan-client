"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { Service } from "@/lib/types";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
export function VendorServices() {
 const [items,setItems]=useState<Service[]>([]); const [loading,setLoading]=useState(true);
 async function load(){try{const d=await apiFetch<{services:Service[]}>('/services/mine');setItems(d.services);}catch(e){toast.error(e instanceof Error?e.message:'Could not load services.');}finally{setLoading(false);}}
 useEffect(()=>{void load();},[]);
 async function remove(id:string){if(!window.confirm('Delete this service? This cannot be undone.'))return;try{await apiFetch(`/services/${id}`,{method:'DELETE'});toast.success('Service deleted.');await load();}catch(e){toast.error(e instanceof Error?e.message:'Delete failed.');}}
 async function toggle(s:Service){try{await apiFetch(`/services/${s.id}`,{method:'PATCH',body:JSON.stringify({isActive:!s.isActive})});toast.success(s.isActive?'Service paused.':'Service activated.');await load();}catch(e){toast.error(e instanceof Error?e.message:'Could not change availability.');}}
 const rows=items.map(s=>[<span className="font-semibold">{s.serviceName}</span>,s.category,`$${s.price}`,<span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.status==='approved'?'bg-green-50 text-green-700':s.status==='rejected'?'bg-red-50 text-red-700':'bg-amber-50 text-amber-700'}`}>{s.status}</span>,<span className={`rounded-full px-3 py-1 text-xs ${s.isActive?'bg-green-50 text-green-700':'bg-stone-100 text-stone-600'}`}>{s.isActive?'Available':'Paused'}</span>,<span className="flex gap-2"><Link href={`/dashboard/services/${s.id}/edit`}><Button size="sm" variant="outline">Edit</Button></Link><Button size="sm" variant="secondary" onClick={()=>toggle(s)}>{s.isActive?'Pause':'Activate'}</Button><Button size="sm" variant="danger" onClick={()=>remove(s.id)}>Delete</Button></span>]);
 return <div><div className="mb-7 flex items-end justify-between gap-3"><div><p className="section-kicker">Vendor workspace</p><h1 className="mt-2 font-serif text-3xl font-bold">My services</h1><p className="mt-2 text-sm text-stone-500">Manage your submitted wedding services and their review status.</p></div><Link href="/dashboard/services/new"><Button>+ Add service</Button></Link></div>{loading?<div className="h-56 animate-pulse rounded-2xl bg-rose-50"/>:<DataTable headers={['Service','Category','Price','Approval','Availability','Actions']} rows={rows} empty="You have not added any services yet."/>}</div>;
}
