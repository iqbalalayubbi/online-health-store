import { apiClient } from "../../services/apiClient";

// ADMIN APIs

export interface Customer {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface ShopRequest {
  id: string;
  sellerEmail: string;
  businessName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

// Get all customers
export const fetchCustomers = async (): Promise<Customer[]> => {
  const { data } = await apiClient.get("/admin/customers");
  return data;
};

// Delete customer
export const deleteCustomer = async (customerId: string): Promise<void> => {
  await apiClient.delete(`/admin/customers/${customerId}`);
};

// Get all guestbook entries
export const fetchGuestbookEntries = async (): Promise<GuestbookEntry[]> => {
  const { data } = await apiClient.get("/admin/guestbook");
  return data;
};

// Delete guestbook entry
export const deleteGuestbookEntry = async (entryId: string): Promise<void> => {
  await apiClient.delete(`/admin/guestbook/${entryId}`);
};

// Get all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get("/admin/categories");
  return data;
};

// Create category
export const createCategory = async (name: string, description?: string): Promise<Category> => {
  const { data } = await apiClient.post("/admin/categories", { name, description });
  return data;
};

// Update category
export const updateCategory = async (
  categoryId: string,
  name: string,
  description?: string,
): Promise<Category> => {
  const { data } = await apiClient.put(`/admin/categories/${categoryId}`, {
    name,
    description,
  });
  return data;
};

// Delete category
export const deleteCategory = async (categoryId: string): Promise<void> => {
  await apiClient.delete(`/admin/categories/${categoryId}`);
};

// Get shop creation requests
export const fetchShopRequests = async (): Promise<ShopRequest[]> => {
  const { data } = await apiClient.get("/admin/shop-requests");
  return data;
};

// Approve shop request
export const approveShopRequest = async (requestId: string): Promise<ShopRequest> => {
  const { data } = await apiClient.post(`/admin/shop-requests/${requestId}/approve`);
  return data;
};

// Reject shop request
export const rejectShopRequest = async (requestId: string): Promise<ShopRequest> => {
  const { data } = await apiClient.post(`/admin/shop-requests/${requestId}/reject`);
  return data;
};

// Get orders for shipping management
export const fetchOrdersForShipping = async () => {
  const { data } = await apiClient.get("/admin/orders/shipping");
  return data;
};

// Mark order as shipped
export const markOrderAsShipped = async (
  orderId: string,
  courier: string,
  trackingNumber: string,
) => {
  const { data } = await apiClient.post(`/admin/orders/${orderId}/ship`, {
    courier,
    trackingNumber,
  });
  return data;
};
