"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
export function BookingForm({ serviceId }: { serviceId: string }) {
  const router = useRouter(); const [eventDate, setEventDate] = useState(""); const [eventLocation, setEventLocation] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) { e.preventDefault(); setBusy(true); try { await apiFetch("/bookings", { method: "POST", body: JSON.stringify({ serviceId, eventDate, eventLocation, message }) }); toast.success("Your booking request has been sent."); router.push("/dashboard/bookings"); } catch (err) { toast.error(err instanceof Error ? err.message : "Could not send request."); } finally { setBusy(false); } }
  const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  return <form onSubmit={submit} className="grid gap-4"><Field label="Event date"><Input type="date" min={minDate} required value={eventDate} onChange={(e) => setEventDate(e.target.value)}/></Field><Field label="Event location"><Input required minLength={2} value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Venue, town, or city"/></Field><Field label="Additional message"><Textarea maxLength={1500} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Share a few details about your celebration..."/></Field><Button type="submit" disabled={busy}>{busy ? "Sending request..." : "Send booking request"}</Button></form>;
}
