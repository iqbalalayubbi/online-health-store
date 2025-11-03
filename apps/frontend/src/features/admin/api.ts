import { apiClient } from "../../services/apiClient";
import { type Category, type Order } from "../../types/api";

export interface AdminCustomer {
  id: string;
  email: string;
  isActive: boolean;
  customerProfile?: {
    fullName: string;
    phoneNumber?: string | null;
  } | null;
}

export interface GuestBookEntry {
  id: string;
  name: string;
  email?: string | null;
  message: string;
  createdAt: string;
}

export interface ShopRequest {
  id: string;
  status: string;
  proposedName: string;
  proposedDescription?: string | null;
  details?: string | null;
}

export const fetchCustomers = async () => {
  const { data } = await apiClient.get<AdminCustomer[]>("/admin/customers");
  return data;
};

export const setCustomerStatus = async (customerId: string, isActive: boolean) => {
  const { data } = await apiClient.patch(`/admin/customers/${customerId}/status`, { isActive });
  return data;
};

export const fetchGuestbook = async () => {
  const { data } = await apiClient.get<GuestBookEntry[]>("/admin/guestbook");
  return data;
};

export const deleteGuestBookEntry = async (entryId: string) => {
  await apiClient.delete(`/admin/guestbook/${entryId}`);
};

export const createCategory = async (payload: Partial<Category> & { shopId: string }) => {
  const { data } = await apiClient.post<Category>("/admin/categories", payload);
  return data;
};

export const updateCategory = async (
  categoryId: string,
  payload: Partial<Category> & { shopId?: string },
) => {
  const { data } = await apiClient.put<Category>(`/admin/categories/${categoryId}`, payload);
  return data;
};

export const deleteCategory = async (categoryId: string) => {
  await apiClient.delete(`/admin/categories/${categoryId}`);
};

export const fetchShopRequests = async () => {
  const { data } = await apiClient.get<ShopRequest[]>("/admin/shop-requests");
  return data;
};

export const reviewShopRequest = async (requestId: string, decision: "APPROVED" | "REJECTED") => {
  const { data } = await apiClient.post(`/admin/shop-requests/${requestId}/review`, { decision });
  return data;
};

export const fetchOrders = async () => {
  const { data } = await apiClient.get<Order[]>("/admin/orders");
  return data;
};

export const markOrderShipped = async (
  orderId: string,
  payload: { courier?: string; trackingNumber?: string },
) => {
  const { data } = await apiClient.patch(`/admin/orders/${orderId}/ship`, payload);
  return data;
};
