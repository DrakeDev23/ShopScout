import { useState, useEffect, type ReactNode } from "react";
import { useUser, useClerk, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { AuthContext, type AuthRole, type AppView } from "./AuthContext";

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

  useEffect(() => {
    if (!isLoaded) return;
    const isAuthenticated = !!user || isGuest;
    if (view !== "map" && !isAuthenticated) {
      const timer = setTimeout(() => setView("map"), 0);
      return () => clearTimeout(timer);
    }
  }, [view, user, isGuest, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !user) return;
    const metaRole = user.unsafeMetadata?.role as AuthRole;
    if (metaRole === "owner" || metaRole === "customer") {
      const timer = setTimeout(() => setView(metaRole), 0);
      return () => clearTimeout(timer);
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
