"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, ChevronDown, ChevronUp, MapPin, MessageSquareText, UserRound } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Booking } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { formatDate, formatMoney } from "@/lib/utils";

export function BookingsView({ role }: { role: "customer" | "vendor" }) {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  async function load() {
    try {
      const data = await apiFetch<{ bookings: Booking[] }>("/bookings/mine");
      setItems(data.bookings);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function update(id: string, action: "respond" | "cancel", status?: "accepted" | "rejected") {
    try {
      await apiFetch(`/bookings/${id}/${action}`, {
        method: "PATCH",
        body: JSON.stringify(status ? { status } : {}),
      });
      toast.success(action === "cancel" ? "Booking request cancelled." : `Request ${status}.`);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update request.");
    }
  }

  const heading = role === "vendor" ? "Booking requests" : "My bookings";
  const description = role === "vendor"
    ? "Review customer enquiries and respond to pending requests."
    : "Track your wedding service requests and see the latest updates.";

  return (
    <section>
      <div className="mb-7">
        <p className="section-kicker">{role === "vendor" ? "Vendor workspace" : "Your wedding plans"}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold">{heading}</h1>
        <p className="mt-2 text-sm text-stone-500">{description}</p>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-44 animate-pulse rounded-3xl bg-rose-50" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-rose-200 bg-white py-16 text-center">
          <CalendarDays className="mx-auto text-rose-700" size={30} />
          <h2 className="mt-4 font-serif text-xl font-bold">No booking requests yet</h2>
          <p className="mt-2 text-sm text-stone-500">New requests will appear here when they are submitted.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {items.map((booking) => {
            const isOpen = Boolean(expanded[booking.id]);
            const contactName = role === "vendor"
              ? booking.customer?.name || booking.customer?.email || "Customer"
              : booking.vendor?.businessName || booking.vendor?.name || "Wedding vendor";
            const contactEmail = role === "vendor" ? booking.customer?.email : booking.vendor?.email;
            const contactImage = role === "vendor" ? booking.customer?.image : booking.vendor?.image;
            const statusClass = booking.status === "accepted"
              ? "bg-green-50 text-green-700"
              : booking.status === "rejected" || booking.status === "cancelled"
                ? "bg-red-50 text-red-700"
                : "bg-amber-50 text-amber-800";

            return (
              <article key={booking.id} className="overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
                  {booking.service?.images?.[0] ? (
                    <img src={booking.service.images[0]} alt={booking.service.serviceName} className="h-24 w-full rounded-2xl object-cover sm:w-32" />
                  ) : (
                    <div className="grid h-24 w-full place-items-center rounded-2xl bg-rose-50 text-rose-700 sm:w-32"><CalendarDays size={25}/></div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold capitalize ${statusClass}`}>{booking.status}</span>
                      <span className="text-xs text-stone-400">Request sent {formatDate(booking.createdAt)}</span>
                    </div>
                    <h2 className="mt-2 truncate font-serif text-xl font-bold text-stone-900">{booking.service?.serviceName || "Wedding service"}</h2>
                    <p className="mt-1 text-sm text-stone-500">{role === "vendor" ? "Customer" : "Vendor"}: <span className="font-semibold text-stone-700">{contactName}</span></p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone-500">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays size={14}/>{formatDate(booking.eventDate)}</span>
                      <span className="inline-flex items-center gap-1.5"><MapPin size={14}/>{booking.eventLocation}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <Button type="button" size="sm" variant="outline" onClick={() => setExpanded((current) => ({ ...current, [booking.id]: !current[booking.id] }))} aria-expanded={isOpen}>
                      {isOpen ? "Hide details" : "View details"}{isOpen ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
                    </Button>
                    {role === "vendor" && booking.status === "pending" && <>
                      <Button type="button" size="sm" onClick={() => void update(booking.id, "respond", "accepted")}>Accept</Button>
                      <Button type="button" size="sm" variant="danger" onClick={() => void update(booking.id, "respond", "rejected")}>Reject</Button>
                    </>}
                    {role === "customer" && booking.status === "pending" && <Button type="button" size="sm" variant="danger" onClick={() => void update(booking.id, "cancel")}>Cancel request</Button>}
                  </div>
                </div>
                {isOpen && (
                  <div className="grid gap-5 border-t border-stone-100 bg-[#fffdfb] p-5 sm:grid-cols-2 sm:p-6">
                    <div className="space-y-3 text-sm">
                      <h3 className="font-semibold text-stone-900">{role === "vendor" ? "Customer information" : "Vendor information"}</h3>
                      <div className="flex items-center gap-3">
                        {contactImage ? <img src={contactImage} alt="" className="size-11 rounded-full object-cover"/> : <span className="grid size-11 place-items-center rounded-full bg-rose-100 text-rose-800"><UserRound size={18}/></span>}
                        <div className="min-w-0"><p className="font-semibold">{contactName}</p>{contactEmail && <p className="truncate text-xs text-stone-500">{contactEmail}</p>}</div>
                      </div>
                      <p className="text-stone-500">Category: <span className="font-medium text-stone-700">{booking.service?.category || "—"}</span></p>
                      {booking.service?.price !== undefined && <p className="text-stone-500">Listed price: <span className="font-medium text-stone-700">{formatMoney(booking.service.price)}</span></p>}
                      <p className="text-stone-500">Service location: <span className="font-medium text-stone-700">{booking.service?.location || "—"}</span></p>
                    </div>
                    <div className="space-y-3 text-sm">
                      <h3 className="font-semibold text-stone-900">Event details</h3>
                      <p className="text-stone-500">Event date: <span className="font-medium text-stone-700">{formatDate(booking.eventDate)}</span></p>
                      <p className="text-stone-500">Event location: <span className="font-medium text-stone-700">{booking.eventLocation}</span></p>
                      <p className="flex items-center gap-2 font-medium text-stone-700"><MessageSquareText size={15}/> Customer message</p>
                      <p className="rounded-2xl bg-white p-4 leading-6 text-stone-600">{booking.message?.trim() || "No additional message was added."}</p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
