"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Camera, CheckCircle2, Clock3, Crown, Store, Users, Wallet } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/lib/types";

type Stats = Record<string, number | string>;
const iconMap: Record<string, React.ReactNode> = { services: <Store/>, activeServices: <Camera/>, pendingBookings: <Clock3/>, acceptedBookings: <CheckCircle2/>, bookings: <CalendarDays/>, pending: <Clock3/>, accepted: <CheckCircle2/>, rejected: <Clock3/>, users: <Users/>, vendors: <Store/>, customers: <Users/>, totalServices: <Camera/>, pendingServices: <Clock3/>, transactions: <Wallet/>, subscriptionPlan: <Crown/> };
const titles: Record<string,string> = { services:"Total services", activeServices:"Active services", pendingBookings:"Pending requests", acceptedBookings:"Accepted bookings", bookings:"Total requests", pending:"Pending bookings", accepted:"Accepted bookings", rejected:"Rejected bookings", users:"Registered users", vendors:"Vendors", customers:"Customers", totalServices:"Total services", pendingServices:"Pending review", transactions:"Transactions", subscriptionPlan:"Subscription plan" };
export function DashboardOverview({ role }: { role: UserRole }) {
  const [stats, setStats] = useState<Stats | null>(null); const [error, setError] = useState("");
  useEffect(() => { apiFetch<{ stats: Stats }>("/dashboard/stats").then((data) => setStats(data.stats)).catch((err: Error) => setError(err.message)); }, []);
  const keys = role === "vendor" ? ["services","activeServices","pendingBookings","acceptedBookings","subscriptionPlan"] : role === "customer" ? ["bookings","pending","accepted","rejected"] : ["users","vendors","customers","totalServices","pendingServices","transactions"];
  return <div><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="section-kicker">Your WedPlan workspace</p><h1 className="mt-2 font-serif text-3xl font-bold">Dashboard overview</h1><p className="mt-2 text-sm text-stone-500">A quick look at what is happening with your wedding plans.</p></div>{role === "vendor" && <Link href="/dashboard/services/new"><Button>+ Add a service</Button></Link>}{role === "customer" && <Link href="/services"><Button>Explore services</Button></Link>}</div>{error && <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{keys.map((key) => <Card key={key}><CardContent className="flex items-center justify-between gap-3"><div><p className="text-sm text-stone-500">{titles[key]}</p><p className="mt-2 text-3xl font-bold capitalize text-stone-900">{stats ? stats[key] ?? 0 : <span className="inline-block h-8 w-16 animate-pulse rounded bg-rose-50"/>}</p></div><div className="grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-800">{iconMap[key]}</div></CardContent></Card>)}</div><div className="mt-8 rounded-3xl bg-[#38272b] p-7 text-white"><p className="text-xs font-semibold uppercase tracking-widest text-rose-200">A little reminder</p><h2 className="mt-3 font-serif text-2xl font-bold">Every lovely celebration starts with a plan.</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">Keep your service information current and respond to booking requests promptly. Clear details help everyone plan with confidence.</p></div></div>;
}
