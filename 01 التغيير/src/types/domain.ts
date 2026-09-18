export type UserRole =
  | "platform_admin"
  | "station_admin"
  | "station_staff"
  | "driver"
  | "customer";

export type OrderStatus =
  | "new"
  | "accepted"
  | "out_for_delivery"
  | "delivered"
  | "closed"
  | "cancelled";

export type PaymentMethod = "cash" | "cliq" | "coupon";
export type PaymentStatus = "pending" | "paid";

export interface StationSummary {
  id: string;
  name: string;
  logoUrl?: string | null;
}

export interface CustomerContainer {
  id: string;
  label: string;
  quantity: number;
}

export interface OrderSummary {
  id: string;
  customerName: string;
  quantity: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
}
