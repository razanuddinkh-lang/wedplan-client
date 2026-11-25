"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { uploadImage, apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const query = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "vendor">("customer");
  const [businessName, setBusinessName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const isSignup = mode === "sign-up";
  const requestedCallback = query.get("callbackURL");
  const safeCallbackURL = requestedCallback && requestedCallback.startsWith("/") && !requestedCallback.startsWith("//") ? requestedCallback : "/dashboard";
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true);
    try {
      if (isSignup) {
        if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) throw new Error("Use at least 6 characters, including one uppercase and one lowercase letter.");
        const result = await authClient.signUp.email({ name, email, password, role, businessName: role === "vendor" ? businessName : undefined });
        if (result.error) throw new Error(result.error.message || "Registration failed.");
        if (imageFile) {
          const image = await uploadImage(imageFile);
          await apiFetch("/users/me", { method: "PATCH", body: JSON.stringify({ image }) });
        }
        toast.success("Your WedPlan account is ready.");
      } else {
        const result = await authClient.signIn.email({ email, password });
        if (result.error) throw new Error(result.error.message || "Unable to sign in.");
        toast.success("Welcome back to WedPlan.");
      }
      router.replace(safeCallbackURL);
      router.refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Something went wrong."); }
    finally { setBusy(false); }
  }
  async function google() {
    setBusy(true);
    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL: safeCallbackURL });
      if (result.error) throw new Error(result.error.message || "Google sign in failed.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Google sign in failed."); setBusy(false); }
  }
  return <form onSubmit={submit} className="grid gap-5">
    {isSignup && <Field label="Full name"><Input autoComplete="name" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name"/></Field>}
    <Field label="Email address"><Input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"/></Field>
    <Field label="Password" hint={isSignup ? "At least 6 characters, one uppercase and one lowercase letter." : undefined}><Input type="password" autoComplete={isSignup ? "new-password" : "current-password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"/></Field>
    {isSignup && <>
      <Field label="I want to join as"><select className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-400" value={role} onChange={(e) => setRole(e.target.value as "customer" | "vendor")}><option value="customer">Customer — plan my wedding</option><option value="vendor">Vendor — offer wedding services</option></select></Field>
      {role === "vendor" && <Field label="Business name"><Input required value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your wedding business"/></Field>}
      <Field label="Profile photo (optional)"><Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="file:mr-3 file:rounded-full file:border-0 file:bg-rose-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-rose-800"/></Field>
    </>}
    <Button type="submit" disabled={busy} size="lg" className="w-full">{busy ? "Please wait..." : isSignup ? "Create my account" : "Sign in to WedPlan"}</Button>
    <div className="relative py-1 text-center text-xs text-stone-400"><span className="bg-white px-3">OR CONTINUE WITH</span><span className="absolute left-0 right-0 top-1/2 -z-10 border-t border-stone-100"/></div>
    <Button type="button" variant="outline" disabled={busy} onClick={google} className="w-full"><span className="font-bold">G</span> Continue with Google</Button>
    <p className="text-center text-sm text-stone-500">{isSignup ? "Already have an account?" : "New to WedPlan?"} <Link className="font-bold text-rose-800 hover:underline" href={isSignup ? "/sign-in" : "/sign-up"}>{isSignup ? "Sign in" : "Create an account"}</Link></p>
  </form>;
}
