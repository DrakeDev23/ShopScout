import { apiClient } from "./client";
import type { Product } from "../components/dashboard/types";

export const productsApi = {
  getProducts: (): Promise<Product[]> => {
    return apiClient<Product[]>("/products");
  },
  createProduct: (product: Omit<Product, "id">): Promise<Product> => {
    return apiClient<Product>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  },
  updateProduct: (id: string, product: Partial<Product>): Promise<Product> => {
    return apiClient<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  },
  deleteProduct: (id: string): Promise<{ success: boolean }> => {
    return apiClient<{ success: boolean }>(`/products/${id}`, {
      method: "DELETE",
    });
  },
};
