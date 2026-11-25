"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch, uploadImage } from "@/lib/api";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";

export function EditServiceForm({ id }: { id: string }) {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [name, setName] = useState(""); const [category, setCategory] = useState<string>(SERVICE_CATEGORIES[0]);
  const [description, setDescription] = useState(""); const [price, setPrice] = useState(""); const [location, setLocation] = useState("");
  const [files, setFiles] = useState<File[]>([]); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false);
  useEffect(() => { apiFetch<{ services: Service[] }>("/services/mine").then((d) => { const found = d.services.find((x) => x.id === id); if (!found) throw new Error("Service not found or you do not own it."); setService(found); setName(found.serviceName); setCategory(found.category); setDescription(found.description); setPrice(String(found.price)); setLocation(found.location); }).catch((e: Error) => toast.error(e.message)).finally(() => setLoading(false)); }, [id]);
  async function submit(e: React.FormEvent) { e.preventDefault(); setBusy(true); try { let images = service?.images || []; if (files.length) { if (files.length > 5) throw new Error("Upload a maximum of five images."); images = []; for (const file of files) images.push(await uploadImage(file)); } await apiFetch(`/services/${id}`, { method: "PATCH", body: JSON.stringify({ serviceName: name, category, description, price: Number(price), location, images }) }); toast.success("Service updated and sent for admin review."); router.push("/dashboard/services"); } catch (e) { toast.error(e instanceof Error ? e.message : "Could not update service."); } finally { setBusy(false); } }
  if (loading) return <div className="h-72 animate-pulse rounded-3xl bg-rose-50"/>;
  if (!service) return <p className="rounded-xl bg-red-50 p-5 text-sm text-red-700">This service could not be loaded.</p>;
  return <div className="max-w-3xl"><div className="mb-7"><p className="section-kicker">Vendor workspace</p><h1 className="mt-2 font-serif text-3xl font-bold">Edit service</h1><p className="mt-2 text-sm text-stone-500">Content updates will return the listing to pending review.</p></div><form onSubmit={submit} className="grid gap-5 rounded-3xl border border-stone-100 bg-white p-6 shadow-sm sm:p-8"><Field label="Service name"><Input required minLength={3} maxLength={90} value={name} onChange={e=>setName(e.target.value)}/></Field><Field label="Category"><select className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm" value={category} onChange={e=>setCategory(e.target.value)}>{SERVICE_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></Field><Field label="Description"><Textarea required minLength={20} maxLength={3000} value={description} onChange={e=>setDescription(e.target.value)}/></Field><div className="grid gap-5 sm:grid-cols-2"><Field label="Starting price (USD)"><Input required type="number" min="1" value={price} onChange={e=>setPrice(e.target.value)}/></Field><Field label="Location"><Input required value={location} onChange={e=>setLocation(e.target.value)}/></Field></div><Field label="Replace service images (optional)" hint="Choose up to five new images. Leave empty to keep the current images."><Input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={e=>setFiles(Array.from(e.target.files||[]))}/></Field><Button type="submit" disabled={busy}>{busy?"Saving changes...":"Save changes"}</Button></form></div>;
}
