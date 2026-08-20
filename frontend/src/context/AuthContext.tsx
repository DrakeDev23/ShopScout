import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useUser, useClerk, useAuth as useClerkAuth } from "@clerk/clerk-react";

export type AuthRole = "customer" | "owner" | "guest" | null;
export type AppView = "map" | "customer" | "owner";
type ClerkUser = ReturnType<typeof useUser>["user"];

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const { getToken: clerkGetToken } = useClerkAuth();
  const { signOut } = useClerk();

  const [isGuest, setIsGuest] = useState(false);

  const [view, setView] = useState<AppView>(() => {
    const savedView = localStorage.getItem("shopscout_view") as AppView;
    return savedView || "map";
  });

  useEffect(() => {
    localStorage.setItem("shopscout_view", view);
  }, [view]);

  const role: AuthRole = isGuest
    ? "guest"
    : user
    ? ((user.unsafeMetadata?.role as AuthRole) ?? null)
    : null;

  // Guard against stale view: if view says customer/owner but there's
  // no real signed-in user (and not guest), bounce to map.
  useEffect(() => {
    if (!isLoaded) return;
    const isAuthenticated = !!user || isGuest;
    if (view !== "map" && !isAuthenticated) {
      setView("map");
    }
  }, [view, user, isGuest, isLoaded]);

  // once signed in, route to the right dashboard based on role set at sign-up
  useEffect(() => {
    if (!isLoaded || !user) return;
    const metaRole = user.unsafeMetadata?.role as AuthRole;
    if (metaRole === "owner" || metaRole === "customer") {
      setView(metaRole);
    }
  }, [isLoaded, user]);

  const setGuestMode = () => {
    setIsGuest(true);
    setView("map");
  };

  const logout = () => {
    setIsGuest(false);
    setView("map");
    signOut();
  };

  const getToken = async () => {
    if (isGuest) return null;
    return clerkGetToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        view,
        isGuest,
        isLoaded,
        setView,
        getToken,
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