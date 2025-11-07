import { apiClient } from "../../services/apiClient";
import { type Cart, type Order } from "../../types/api";

interface UpdateProfilePayload {
  fullName?: string;
  phoneNumber?: string;
  defaultCity?: string;
  defaultState?: string;
  defaultZip?: string;
}

interface CartPayload {
  productId: string;
  quantity: number;
}

interface CheckoutPayload {
  paymentMethod: "CREDIT_CARD" | "DEBIT_CARD" | "COD";
  shippingName: string;
  shippingPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
}

export const fetchProfile = async () => {
  const { data } = await apiClient.get("/customer/profile");
  return data;
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const { data } = await apiClient.put("/customer/profile", payload);
  return data;
};

export const fetchCart = async () => {
  const { data } = await apiClient.get<Cart>("/customer/cart");
  return data;
};

export const addToCart = async (payload: CartPayload) => {
  const { data } = await apiClient.post("/customer/cart", payload);
  return data;
};

export const removeFromCart = async (cartItemId: string) => {
  await apiClient.delete(`/customer/cart/${cartItemId}`);
};

export const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
  const { data } = await apiClient.patch(`/customer/cart/${cartItemId}`, { quantity });
  return data;
};

export const checkout = async (payload: CheckoutPayload) => {
  const { data } = await apiClient.post<Order>("/customer/orders", payload);
  return data;
};

export const cancelOrder = async (orderId: string) => {
  const { data } = await apiClient.delete<Order>(`/customer/orders/${orderId}`);
  return data;
};

export const fetchOrders = async () => {
  const { data } = await apiClient.get<Order[]>("/customer/orders");
  return data;
};

export interface CreateFeedbackPayload {
  productId: string;
  orderId: string; // new: identify the order for per-order review
  rating: number; // 1..5
  comment?: string;
}

export const createFeedback = async (payload: CreateFeedbackPayload) => {
  const { data } = await apiClient.post("/feedback", payload);
  return data;
};

// Fetch reviewed product IDs grouped by orderId
export const fetchMyReviewedProductIdsByOrder = async (orderIds: string[]) => {
  if (orderIds.length === 0) return { reviewedByOrder: {} as Record<string, string[]> };
  const params = new URLSearchParams({ orderIds: orderIds.join(",") });
  const { data } = await apiClient.get<{ reviewedByOrder: Record<string, string[]> }>(
    `/feedback/mine?${params.toString()}`,
  );
  return data;
};
