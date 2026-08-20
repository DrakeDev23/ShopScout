import { apiClient } from "./client";
import type { Shop } from "../components/types";

export const storesApi = {
  getStores: (query?: string, token?: string | null): Promise<Shop[]> => {
    const searchParam = query ? `?q=${encodeURIComponent(query)}` : "";
    return apiClient<Shop[]>(`/stores${searchParam}`, {}, token);
  },
  getStoreById: (id: number, token?: string | null): Promise<Shop> => {
    return apiClient<Shop>(`/stores/${id}`, {}, token);
  },
};