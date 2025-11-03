import { apiClient } from "../../services/apiClient";
import { type Order, type Product, type Shop } from "../../types/api";

interface ShopRequestPayload {
  proposedName: string;
  proposedDescription?: string;
  details?: string;
}

interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  shopId: string;
  isActive?: boolean;
}

interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  shopId?: string;
  isActive?: boolean;
}

export const submitShopRequest = async (payload: ShopRequestPayload) => {
  const { data } = await apiClient.post("/seller/shop-requests", payload);
  return data;
};

export const fetchShops = async () => {
  const { data } = await apiClient.get<Shop[]>("/seller/shops");
  return data;
};

export const fetchSellerProducts = async () => {
  const { data } = await apiClient.get<Product[]>("/seller/products");
  return data;
};

export const createProduct = async (payload: CreateProductPayload) => {
  const { data } = await apiClient.post<Product>("/seller/products", payload);
  return data;
};

export const updateProduct = async (productId: string, payload: UpdateProductPayload) => {
  const { data } = await apiClient.put<Product>(`/seller/products/${productId}`, payload);
  return data;
};

export const deleteProduct = async (productId: string) => {
  await apiClient.delete(`/seller/products/${productId}`);
};

export const fetchSellerOrders = async () => {
  const { data } = await apiClient.get<Order[]>("/seller/orders");
  return data;
};
