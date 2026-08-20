import { apiClient } from "./client";
import type { Product } from "../components/dashboard/types";

export const productsApi = {
  getProducts: (token: string | null): Promise<Product[]> => {
    return apiClient<Product[]>("/products", {}, token);
  },
  createProduct: (product: Omit<Product, "id">, token: string | null): Promise<Product> => {
    return apiClient<Product>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }, token);
  },
  updateProduct: (id: string, product: Partial<Product>, token: string | null): Promise<Product> => {
    return apiClient<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }, token);
  },
  deleteProduct: (id: string, token: string | null): Promise<{ success: boolean }> => {
    return apiClient<{ success: boolean }>(`/products/${id}`, {
      method: "DELETE",
    }, token);
  },
};