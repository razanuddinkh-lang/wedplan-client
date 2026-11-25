"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, ChevronDown, LayoutDashboard, LogOut, UserRound, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { data: session, isPending } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const user = session?.user as ({ name: string; email: string; image?: string | null; role?: string } | undefined);
  const nav = [{ href: "/", label: "Home" }, { href: "/services", label: "Explore services" }];
  async function logout() {
    await authClient.signOut();
    setProfileOpen(false);
    router.push("/");
    router.refresh();
  }
  return <header className="sticky top-0 z-50 border-b border-rose-100/80 bg-white/90 backdrop-blur-xl">
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
      <Link href="/" className="flex items-center gap-2.5" aria-label="WedPlan home">
        <span className="grid size-10 place-items-center rounded-2xl bg-rose-700 text-white"><Heart size={20} fill="currentColor" /></span>
        <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">Wed<span className="text-rose-700">Plan</span></span>
      </Link>
      <nav className="hidden items-center gap-8 md:flex">
        {nav.map((item) => <Link key={item.href} href={item.href} className={`text-sm font-medium transition hover:text-rose-700 ${pathname === item.href ? "text-rose-700" : "text-stone-600"}`}>{item.label}</Link>)}
      </nav>
      <div className="hidden items-center gap-3 md:flex">
        {isPending ? <span className="h-10 w-28 animate-pulse rounded-full bg-stone-100" /> : user ? <div className="relative">
          <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-full border border-stone-200 p-1.5 pr-3 hover:border-rose-200">
            {user.image ? <img src={user.image} alt="" className="size-8 rounded-full object-cover" /> : <span className="grid size-8 place-items-center rounded-full bg-rose-100 text-rose-800"><UserRound size={16}/></span>}
            <span className="max-w-28 truncate text-sm font-semibold text-stone-700">{user.name}</span><ChevronDown size={15}/>
          </button>
          {profileOpen && <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-stone-100 bg-white p-2 shadow-xl">
            <div className="border-b border-stone-100 px-3 py-2"><p className="font-semibold text-stone-900">{user.name}</p><p className="truncate text-xs text-stone-500">{user.email}</p></div>
            <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-rose-50"><LayoutDashboard size={16}/> Dashboard</Link>
            <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-rose-50"><UserRound size={16}/> Profile settings</Link>
            <button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"><LogOut size={16}/> Log out</button>
          </div>}
        </div> : <><Link href="/sign-in" className="px-3 py-2 text-sm font-semibold text-stone-700 hover:text-rose-700">Sign in</Link><Button onClick={() => router.push("/sign-up")}>Join WedPlan</Button></>}
      </div>
      <button className="rounded-xl p-2 text-stone-700 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button>
    </div>
    {menuOpen && <div className="border-t border-rose-100 bg-white px-5 py-4 md:hidden"><nav className="grid gap-3">{nav.map((item) => <Link key={item.href} onClick={() => setMenuOpen(false)} href={item.href} className="py-2 text-sm font-semibold">{item.label}</Link>)}{user ? <><div className="flex items-center gap-3 rounded-2xl bg-rose-50 p-3"><span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-rose-100 text-rose-800">{user.image ? <img src={user.image} alt="" className="h-full w-full object-cover"/> : <UserRound size={18}/>}</span><span className="min-w-0"><span className="block truncate text-sm font-bold text-stone-800">{user.name}</span><span className="block truncate text-xs text-stone-500">{user.email}</span></span></div><Link href="/dashboard" onClick={() => setMenuOpen(false)} className="py-2 text-sm font-semibold">Dashboard</Link><Link href="/profile" onClick={() => setMenuOpen(false)} className="py-2 text-sm font-semibold">Profile settings</Link><button onClick={logout} className="py-2 text-left text-sm font-semibold text-red-600">Log out</button></> : <div className="flex gap-2"><Link href="/sign-in" className="flex-1 rounded-full border p-3 text-center text-sm">Sign in</Link><Link href="/sign-up" className="flex-1 rounded-full bg-rose-700 p-3 text-center text-sm text-white">Join WedPlan</Link></div>}</nav></div>}
  </header>;
}
