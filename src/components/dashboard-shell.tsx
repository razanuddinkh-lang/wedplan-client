"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Store, PlusCircle, CalendarDays, CreditCard, Users, ClipboardList, UserRound, Menu, X, Heart } from "lucide-react";
import type { UserRole } from "@/lib/types";
const links: Record<UserRole, { label: string; href: string; icon: React.ReactNode }[]> = {
  vendor: [
    { label: "Overview", href: "/dashboard", icon: <LayoutDashboard size={17}/> },
    { label: "My services", href: "/dashboard/services", icon: <Store size={17}/> },
    { label: "Add service", href: "/dashboard/services/new", icon: <PlusCircle size={17}/> },
    { label: "Booking requests", href: "/dashboard/bookings", icon: <CalendarDays size={17}/> },
    { label: "Subscription", href: "/dashboard/subscription", icon: <CreditCard size={17}/> },
    { label: "Profile settings", href: "/profile", icon: <UserRound size={17}/> },
  ],
  customer: [
    { label: "Overview", href: "/dashboard", icon: <LayoutDashboard size={17}/> },
    { label: "My bookings", href: "/dashboard/bookings", icon: <CalendarDays size={17}/> },
    { label: "Profile settings", href: "/profile", icon: <UserRound size={17}/> },
  ],
  admin: [
    { label: "Overview", href: "/dashboard", icon: <LayoutDashboard size={17}/> },
    { label: "Manage users", href: "/dashboard/users", icon: <Users size={17}/> },
    { label: "Manage services", href: "/dashboard/admin/services", icon: <Store size={17}/> },
    { label: "Transactions", href: "/dashboard/transactions", icon: <ClipboardList size={17}/> },
  ],
};
export function DashboardShell({ role, name, children }: { role: UserRole; name: string; children: React.ReactNode }) {
  const pathname = usePathname(); const [open, setOpen] = useState(false);
  return <div className="mx-auto flex max-w-[1600px] gap-0 px-3 py-6 sm:px-5 lg:gap-7 lg:px-8"><aside className={`fixed inset-y-0 left-0 z-[60] w-72 bg-white p-5 shadow-2xl transition-transform lg:sticky lg:top-24 lg:z-0 lg:h-[calc(100vh-7rem)] lg:translate-x-0 lg:rounded-3xl lg:border lg:border-stone-100 lg:shadow-sm ${open ? "translate-x-0" : "-translate-x-full"}`}><div className="flex items-center justify-between border-b border-stone-100 pb-5"><div><p className="font-serif text-xl font-bold">Workspace</p><p className="mt-1 text-xs capitalize text-stone-500">{role} account</p></div><button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close dashboard menu"><X/></button></div><div className="mt-6 flex items-center gap-3 rounded-2xl bg-rose-50 p-3"><div className="grid size-10 place-items-center rounded-full bg-rose-700 text-white"><Heart size={17}/></div><div className="min-w-0"><p className="truncate text-sm font-bold">{name}</p><p className="text-[11px] capitalize text-rose-800">{role} dashboard</p></div></div><nav className="mt-6 grid gap-1">{links[role].map((item) => { const active = pathname === item.href; return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-rose-700 text-white shadow-sm" : "text-stone-600 hover:bg-rose-50 hover:text-rose-800"}`}>{item.icon}{item.label}</Link>; })}</nav><div className="absolute bottom-5 left-5 right-5 hidden rounded-2xl bg-[#38272b] p-4 text-white lg:block"><p className="font-serif text-lg font-bold">Plan with heart.</p><p className="mt-1 text-xs leading-5 text-white/65">Your WedPlan workspace keeps the important details close.</p></div></aside>{open && <button aria-label="Close menu overlay" onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-black/30 lg:hidden"/>}<div className="min-w-0 flex-1"><div className="mb-4 flex items-center gap-3 lg:hidden"><button onClick={() => setOpen(true)} className="rounded-xl border border-stone-200 bg-white p-3"><Menu size={19}/></button><span className="text-sm font-bold">Dashboard menu</span></div>{children}</div></div>;
}
