import { apiClient } from "../../services/apiClient";

// SELLER APIs

export interface Shop {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface SellerProduct {
  id: string;
  name: string;
  description?: string;
  price: string;
  stock: number;
  categoryId: string;
}

// Get seller shop (returns first shop or null if none exists)
export const fetchSellerShop = async (): Promise<Shop | null> => {
  try {
    const { data } = await apiClient.get("/seller/shops");
    // Return first shop if exists, otherwise null
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    // If no shop exists, return null instead of throwing error
    return null;
  }
};

// Create shop
export const createShop = async (name: string, description?: string): Promise<Shop> => {
  const { data } = await apiClient.post("/seller/shop-requests", {
    businessName: name,
    description,
  });
  return data;
};

// Update shop
export const updateShop = async (name: string, description?: string): Promise<Shop> => {
  const { data } = await apiClient.put("/seller/shops", { name, description });
  return data;
};

// Get seller products
export const fetchSellerProducts = async (): Promise<SellerProduct[]> => {
  const { data } = await apiClient.get("/seller/products");
  return data;
};

// Create product
export const createProduct = async (product: {
  name: string;
  description?: string;
  price: string;
  stock: number;
  categoryId: string;
}): Promise<SellerProduct> => {
  const { data } = await apiClient.post("/seller/products", product);
  return data;
};

// Update product
export const updateProduct = async (
  productId: string,
  product: {
    name?: string;
    description?: string;
    price?: string;
    stock?: number;
    categoryId?: string;
  },
): Promise<SellerProduct> => {
  const { data } = await apiClient.put(`/seller/products/${productId}`, product);
  return data;
};

// Delete product
export const deleteProduct = async (productId: string): Promise<void> => {
  await apiClient.delete(`/seller/products/${productId}`);
};

// Get seller orders
export const fetchSellerOrders = async () => {
  const { data } = await apiClient.get("/seller/orders");
  return data;
};
