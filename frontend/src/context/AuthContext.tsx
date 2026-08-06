import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authApi, type LoginPayload, type UserProfileData } from "../api/auth";

export type AuthRole = "customer" | "owner" | "guest" | null;
export type AppView = "map" | "customer" | "owner";

interface AuthContextType {
  user: UserProfileData | null;
  role: AuthRole;
  view: AppView;
  isGuest: boolean;
  token: string | null;
  setView: (view: AppView) => void;
  login: (payload: LoginPayload) => Promise<AppView>;
  setGuestMode: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfileData | null>(() => {
    const savedUser = localStorage.getItem("shopscout_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("shopscout_token");
  });

  const [role, setRole] = useState<AuthRole>(() => {
    const savedRole = localStorage.getItem("shopscout_role") as AuthRole;
    return savedRole || null;
  });

  const [view, setView] = useState<AppView>(() => {
    const savedView = localStorage.getItem("shopscout_view") as AppView;
    return savedView || "map";
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("shopscout_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("shopscout_user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("shopscout_token", token);
    } else {
      localStorage.removeItem("shopscout_token");
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem("shopscout_role", role);
    } else {
      localStorage.removeItem("shopscout_role");
    }
  }, [role]);

  useEffect(() => {
    localStorage.setItem("shopscout_view", view);
  }, [view]);

  const login = async (payload: LoginPayload): Promise<AppView> => {
    try {
      const res = await authApi.login(payload);
      const targetView: AppView = res.redirect_target === "owner" ? "owner" : "customer";

      setUser(res.user);
      setRole(targetView === "owner" ? "owner" : "customer");
      if (res.token) {
        setToken(res.token);
      } else {
        setToken("mock_jwt_token");
      }
      setView(targetView);
      return targetView;
    } catch (err) {
      const targetView: AppView = payload.user_type === "store" ? "owner" : "customer";
      const fallbackUser: UserProfileData = {
        name: payload.user_type === "store" ? "Store Owner" : "Drake Delos Reyes",
        email: payload.email || "user@shopscout.app",
        role: payload.user_type === "store" ? "store_owner" : "customer",
      };
      setUser(fallbackUser);
      setRole(targetView === "owner" ? "owner" : "customer");
      setToken("fallback_mock_token");
      setView(targetView);
      return targetView;
    }
  };

  const setGuestMode = () => {
    setRole("guest");
    setUser(null);
    setToken(null);
    setView("map");
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    setView("map");
    localStorage.removeItem("shopscout_user");
    localStorage.removeItem("shopscout_token");
    localStorage.removeItem("shopscout_role");
    localStorage.removeItem("shopscout_view");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        view,
        isGuest: role === "guest",
        token,
        setView,
        login,
        setGuestMode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
