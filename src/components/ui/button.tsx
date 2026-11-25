import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  const styles = {
    primary: "bg-rose-700 text-white hover:bg-rose-800 shadow-sm",
    secondary: "bg-rose-50 text-rose-800 hover:bg-rose-100",
    outline: "border border-stone-300 bg-white text-stone-800 hover:border-rose-300 hover:text-rose-800",
    ghost: "text-stone-700 hover:bg-rose-50 hover:text-rose-800",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes = { sm: "px-3 py-2 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-sm" };
  return <button className={cn("inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-50", styles[variant], sizes[size], className)} {...props} />;
}
