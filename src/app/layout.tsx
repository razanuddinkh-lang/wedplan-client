import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: { default: "WedPlan — Find your wedding team", template: "%s | WedPlan" },
  description: "Discover trusted wedding venues, photographers, florists, caterers, and more with WedPlan.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="min-h-screen antialiased"><SiteHeader/><main>{children}</main><SiteFooter/><Toaster position="top-right" richColors closeButton/></body></html>;
}
