export type UserRole = "customer" | "vendor" | "admin";
export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type ServiceStatus = "pending" | "approved" | "rejected";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  isBlocked?: boolean;
  businessName?: string;
  subscriptionPlan?: "free" | "premium";
  subscriptionExpiresAt?: string | null;
}

export interface VendorInfo {
  id?: string;
  name: string;
  image?: string | null;
  businessName?: string;
  email?: string;
  subscriptionPlan?: "free" | "premium";
}

export interface Service {
  id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ServiceStatus;
  isActive: boolean;
  vendorId: string;
  vendor?: VendorInfo;
  createdAt: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: BookingStatus;
  createdAt: string;
  service?: Service;
  vendor?: VendorInfo;
  customer?: { id: string; name: string; email: string; image?: string };
}
