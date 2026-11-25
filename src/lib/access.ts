import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { AuthSession } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/sign-in?callbackURL=/dashboard");
  const user = session.user as typeof session.user & { isBlocked?: boolean };
  if (user.isBlocked) redirect("/blocked");
  return session as AuthSession;
}

export async function requireRole(roles: UserRole[]) {
  const session = await requireSession();
  const role = (session.user as typeof session.user & { role?: UserRole }).role;
  if (!role || !roles.includes(role)) redirect("/dashboard");
  return session;
}
