"use client";
import { useEffect } from "react";
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <div className="grid min-h-[60vh] place-items-center px-5 text-center"><div><h2 className="font-serif text-3xl font-bold">Something went wrong</h2><p className="mt-3 text-sm text-stone-500">Please try again. Your account and saved bookings have not been intentionally changed.</p><button onClick={() => reset()} className="mt-6 rounded-full bg-rose-700 px-6 py-3 text-sm font-semibold text-white">Try again</button></div></div>;
}
