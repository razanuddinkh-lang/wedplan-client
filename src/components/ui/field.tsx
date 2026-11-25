import * as React from "react";
export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <label className="grid gap-2 text-sm font-semibold text-stone-700"><span>{label}</span>{children}{hint ? <span className="text-xs font-normal text-stone-500">{hint}</span> : null}</label>;
}
