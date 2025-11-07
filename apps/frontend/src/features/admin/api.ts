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
  shop?: { id: string; name: string };
}

export interface AdminShopSummary {
  id: string;
  name: string;
  isActive: boolean;
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

export const fetchAdminShops = async (): Promise<AdminShopSummary[]> => {
  const { data } = await apiClient.get("/admin/shops");
  return data;
};

// Create category
export const createCategory = async (
  name: string,
  shopId: string,
  description?: string,
): Promise<Category> => {
  const { data } = await apiClient.post("/admin/categories", { name, description, shopId });
  return data;
};

// Update category
export const updateCategory = async (
  categoryId: string,
  name: string,
  description?: string,
  shopId?: string,
): Promise<Category> => {
  const { data } = await apiClient.put(`/admin/categories/${categoryId}`, {
    name,
    description,
    shopId,
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
  // Map backend shape (ShopCreationRequest with nested seller.user) to UI-friendly interface
  return (Array.isArray(data) ? data : []).map((r: any) => ({
    id: r.id,
    businessName: r.proposedName ?? r.businessName ?? "",
    sellerEmail: r?.seller?.user?.email ?? r?.sellerEmail ?? "",
    status: r.status,
    createdAt: r.createdAt,
  })) as ShopRequest[];
};

// Approve shop request
export const approveShopRequest = async (requestId: string): Promise<ShopRequest> => {
  // Backend expects a single /review endpoint with decision in body
  const { data } = await apiClient.post(`/admin/shop-requests/${requestId}/review`, {
    decision: "APPROVED",
  });
  return {
    id: data.id,
    businessName: data.proposedName ?? data.businessName ?? "",
    sellerEmail: data?.seller?.user?.email ?? "",
    status: data.status,
    createdAt: data.createdAt,
  } as ShopRequest;
};

// Reject shop request
export const rejectShopRequest = async (requestId: string): Promise<ShopRequest> => {
  const { data } = await apiClient.post(`/admin/shop-requests/${requestId}/review`, {
    decision: "REJECTED",
  });
  return {
    id: data.id,
    businessName: data.proposedName ?? data.businessName ?? "",
    sellerEmail: data?.seller?.user?.email ?? "",
    status: data.status,
    createdAt: data.createdAt,
  } as ShopRequest;
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
