"use client";
import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, MapPin, ArrowDownUp } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import type { Service } from "@/lib/types";
import { ServiceCard } from "@/components/service-card";
import { Input } from "@/components/ui/input";

export function ServiceBrowser({ featured = false, initialCategory = "" }: { featured?: boolean; initialCategory?: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    if (location.trim()) params.set("location", location.trim());
    if (sort !== "newest") params.set("sort", sort);
    if (featured) params.set("limit", "6");
    setLoading(true); setError("");
    const timer = setTimeout(() => {
      apiFetch<{ services: Service[] }>(`/services?${params.toString()}`, { authenticated: false })
        .then((data) => { if (active) setServices(data.services); })
        .catch((err: Error) => { if (active) setError(err.message); })
        .finally(() => { if (active) setLoading(false); });
    }, 180);
    return () => { active = false; clearTimeout(timer); };
  }, [search, category, location, sort, featured]);
  return <div>
    {!featured && <div className="mb-9 rounded-3xl border border-rose-100 bg-white p-4 shadow-sm md:p-5"><div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={17}/><Input aria-label="Search services" placeholder="Search wedding services..." className="pl-11" value={search} onChange={(e) => setSearch(e.target.value)}/></div>
      <div className="relative"><SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16}/><select aria-label="Filter by category" className="w-full appearance-none rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-3 text-sm text-stone-700 outline-none focus:border-rose-400" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{SERVICE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="relative"><MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16}/><Input aria-label="Filter by location" placeholder="Location" className="pl-10" value={location} onChange={(e) => setLocation(e.target.value)}/></div>
      <div className="relative"><ArrowDownUp className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16}/><select aria-label="Sort by price" className="w-full appearance-none rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-3 text-sm text-stone-700 outline-none focus:border-rose-400" value={sort} onChange={(e) => setSort(e.target.value)}><option value="newest">Newest first</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></div>
    </div></div>}
    {loading ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: featured ? 3 : 6 }).map((_, i) => <div key={i} className="h-80 animate-pulse rounded-3xl bg-rose-50"/>)}</div> : error ? <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">{error}</div> : services.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{services.map((service) => <ServiceCard key={service.id} service={service}/>)}</div> : <div className="rounded-3xl border border-dashed border-rose-200 bg-white py-16 text-center"><div className="mx-auto grid size-14 place-items-center rounded-full bg-rose-50 text-rose-700"><Search/></div><h3 className="mt-4 font-serif text-xl font-bold">No services found</h3><p className="mt-2 text-sm text-stone-500">Try adjusting your search or filters.</p></div>}
  </div>;
}
