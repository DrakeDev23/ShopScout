import { createContext, useContext } from "react";
import { useUser } from "@clerk/clerk-react";

export type AuthRole = "customer" | "owner" | "guest" | null;
export type AppView = "map" | "customer" | "owner";
export type ClerkUser = ReturnType<typeof useUser>["user"];

export interface AuthContextType {
  user: ClerkUser;
  role: AuthRole;
  view: AppView;
  isGuest: boolean;
  isLoaded: boolean;
  setView: (view: AppView) => void;
  getToken: () => Promise<string | null>;
  setGuestMode: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider } from "./AuthProvider";
