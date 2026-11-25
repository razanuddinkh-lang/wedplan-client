"use client";
import { Card } from "@/components/ui/card";
export function DataTable({ headers, rows, empty = "Nothing to show yet." }: { headers: string[]; rows: React.ReactNode[][]; empty?: string }) {
  return <Card className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500"><tr>{headers.map((header) => <th key={header} className="px-5 py-4 font-semibold">{header}</th>)}</tr></thead><tbody className="divide-y divide-stone-100">{rows.length ? rows.map((row, i) => <tr key={i} className="hover:bg-rose-50/30">{row.map((cell, j) => <td key={j} className="px-5 py-4 align-middle">{cell}</td>)}</tr>) : <tr><td colSpan={headers.length} className="px-5 py-12 text-center text-stone-500">{empty}</td></tr>}</tbody></table></div></Card>;
}
