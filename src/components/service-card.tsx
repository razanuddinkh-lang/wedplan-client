import Link from "next/link";
import { MapPin, ArrowUpRight, Camera, Crown } from "lucide-react";
import type { Service } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
export function ServiceCard({ service }: { service: Service }) {
  const image = service.images?.[0];
  return <article className="group overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-[0_8px_28px_rgba(60,35,35,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
    <Link href={`/services/${service.id}`} className="block">
      <div className="relative h-56 overflow-hidden bg-rose-50">{image ? <img src={image} alt={service.serviceName} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/> : <div className="grid h-full place-items-center text-rose-300"><Camera size={42}/></div>}<div className="absolute left-4 top-4"><Badge>{service.category}</Badge></div></div>
      <div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-rose-800">{service.serviceName}</h3><span className="shrink-0 text-sm font-bold text-rose-800">{formatMoney(service.price)}</span></div><p className="mt-3 flex items-center gap-1.5 text-sm text-stone-500"><MapPin size={15}/>{service.location}</p><div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4"><div className="flex items-center gap-2">{service.vendor?.image ? <img src={service.vendor.image} alt="" className="size-8 rounded-full object-cover"/> : <span className="grid size-8 place-items-center rounded-full bg-rose-100 text-xs font-bold text-rose-800">{service.vendor?.name?.slice(0,1) || "W"}</span>}<div><p className="text-xs font-semibold text-stone-800">{service.vendor?.businessName || service.vendor?.name || "Wedding professional"}</p><p className="flex items-center gap-1 text-[11px] text-stone-500">{service.vendor?.subscriptionPlan === "premium" ? <><Crown size={11} className="text-amber-600"/> Premium vendor</> : "Wedding vendor"}</p></div></div><span className="grid size-9 place-items-center rounded-full bg-stone-50 transition group-hover:bg-rose-700 group-hover:text-white"><ArrowUpRight size={17}/></span></div></div>
    </Link>
  </article>;
}
