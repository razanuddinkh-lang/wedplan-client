import type { Metadata } from "next";
import { ServiceBrowser } from "@/components/service-browser";
export const metadata: Metadata = { title: "Browse wedding services" };
export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  return <section className="mx-auto min-h-[60vh] max-w-7xl px-5 py-16 lg:px-8"><p className="section-kicker">Find the people behind your day</p><h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">Browse wedding services</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-stone-500">Search by service name, category, or location. Compare options and discover your next favourite wedding professional.</p><div className="mt-10"><ServiceBrowser initialCategory={params.category || ""}/></div></section>;
}
