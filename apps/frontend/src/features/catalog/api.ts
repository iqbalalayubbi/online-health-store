import { apiClient } from "../../services/apiClient";
import { type Category, type Product } from "../../types/api";

export const fetchCategories = async () => {
  const { data } = await apiClient.get<Category[]>("/catalog/categories");
  return data;
};

export const fetchProducts = async (params?: { categoryId?: string }) => {
  const { data } = await apiClient.get<Product[]>("/catalog/products", {
    params,
  });
  return data;
};
