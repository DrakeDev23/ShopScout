import { apiClient } from "./client";

export interface LoginPayload {
  email: string;
  password?: string;
  user_type: "customer" | "store";
}

export interface UserProfileData {
  name: string;
  email: string;
  role: "customer" | "store_owner";
}

export interface LoginResponseData {
  status: string;
  user_type: "customer" | "store";
  redirect_target: "customer" | "owner";
  user: UserProfileData;
  token?: string;
}

export const authApi = {
  login: (payload: LoginPayload): Promise<LoginResponseData> => {
    return apiClient<LoginResponseData>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
