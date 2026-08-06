import { apiClient } from "./client";
import type { Shop } from "../components/types";

export const storesApi = {
  getStores: (query?: string): Promise<Shop[]> => {
    const searchParam = query ? `?q=${encodeURIComponent(query)}` : "";
    return apiClient<Shop[]>(`/stores${searchParam}`);
  },
  getStoreById: (id: number): Promise<Shop> => {
    return apiClient<Shop>(`/stores/${id}`);
  },
};
