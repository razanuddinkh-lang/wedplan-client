import Link from "next/link";
import { Heart, Instagram, Facebook, Mail, MapPin } from "lucide-react";
export function SiteFooter() {
  return <footer className="mt-24 bg-[#2d2225] text-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:px-8">
      <div><Link href="/" className="flex items-center gap-2 font-serif text-2xl font-bold"><Heart size={21} fill="currentColor" className="text-rose-300"/>WedPlan</Link><p className="mt-4 max-w-sm text-sm leading-7 text-rose-100/70">A thoughtful way to find the people, places, and details that make your wedding yours.</p><div className="mt-5 flex gap-3"><a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full bg-white/10 p-2.5 hover:bg-white/20"><Instagram size={17}/></a><a aria-label="Facebook" href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded-full bg-white/10 p-2.5 hover:bg-white/20"><Facebook size={17}/></a></div></div>
      <div><h3 className="font-semibold">Explore</h3><div className="mt-4 grid gap-3 text-sm text-rose-100/70"><Link href="/">Home</Link><Link href="/services">Browse services</Link><Link href="/sign-up">Become a vendor</Link><Link href="/sign-in">Sign in</Link></div></div>
      <div><h3 className="font-semibold">For members</h3><div className="mt-4 grid gap-3 text-sm text-rose-100/70"><Link href="/dashboard">Dashboard</Link><Link href="/profile">Profile settings</Link><Link href="/dashboard/bookings">My bookings</Link><Link href="/dashboard/subscription">Vendor plans</Link></div></div>
      <div><h3 className="font-semibold">Get in touch</h3><div className="mt-4 grid gap-4 text-sm text-rose-100/70"><p className="flex items-center gap-2"><Mail size={16}/> hello@wedplan.example</p><p className="flex items-center gap-2"><MapPin size={16}/> Made for celebrations everywhere</p></div></div>
    </div>
    <div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-5 py-5 text-xs text-rose-100/50 sm:flex-row lg:px-8"><span>© {new Date().getFullYear()} WedPlan. All rights reserved.</span><span>Made with care for your forever moment.</span></div></div>
  </footer>;
}
