import { type UserRole } from "../stores/authStore";

export interface ApiUser {
  id: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  customerProfile?: CustomerProfile;
  sellerProfile?: SellerProfile;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  phoneNumber?: string | null;
  defaultCity?: string | null;
  defaultState?: string | null;
  defaultZip?: string | null;
}

export interface SellerProfile {
  id: string;
  fullName: string;
  phoneNumber?: string | null;
  businessName?: string | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  shopId: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: string;
  stock: number;
  categoryId: string;
  shopId: string;
  // Aggregated fields (optional, may be null if no feedback)
  averageRating?: number | null;
  feedbackCount?: number;
}

export interface Shop {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  product: Product;
}

export interface Payment {
  id: string;
  method: "CREDIT_CARD" | "DEBIT_CARD" | "COD";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  amount: string;
}

export interface Shipment {
  id: string;
  courier?: string | null;
  trackingNumber?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: "PENDING" | "APPROVED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: string;
  shippingName: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  items: OrderItem[];
  payment?: Payment;
  shipment?: Shipment;
}

export interface AuthResponse {
  user: ApiUser;
  token: string;
}
