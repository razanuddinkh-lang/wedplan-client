import { authClient } from "@/lib/auth-client";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiOptions = RequestInit & { authenticated?: boolean };

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { authenticated = true, ...requestOptions } = options;
  const headers = new Headers(requestOptions.headers);
  if (authenticated) {
    const tokenResponse = await authClient.token();
    const token = tokenResponse.data?.token;
    if (!token) throw new ApiError("Your session has expired. Please sign in again.", 401);
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (requestOptions.body && !(requestOptions.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers,
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as { message?: string } & T;
  if (!response.ok) throw new ApiError(payload.message || "The request could not be completed.", response.status);
  return payload;
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const result = await apiFetch<{ url: string }>("/uploads/image", { method: "POST", body: form });
  return result.url;
}
