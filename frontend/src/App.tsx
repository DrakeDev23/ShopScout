import { useEffect } from "react";
import Shopscoutmap from "./components/ShopScoutMap";
import StoreOwnerDashboard from "./components/Storeownerdashboard";
import CustomerDashboard from "./components/customer-dashboard/CustomerDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";

function MainContent() {
  const { view, setView, user, role, logout } = useAuth();

  // Guard against stale localStorage: if view says "customer"/"owner"
  // but there's no real authenticated user/role behind it, bounce to map.
  useEffect(() => {
    const isAuthenticated = !!user || role === "guest";
    if (view !== "map" && !isAuthenticated) {
      setView("map");
    }
  }, [view, user, role, setView]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F8FA] font-sans">
      <div className="h-full w-full">
        {view === "map" && <Shopscoutmap onSelectView={(v) => setView(v)} />}
        {view === "customer" && <CustomerDashboard onLogout={logout} />}
        {view === "owner" && <StoreOwnerDashboard onLogout={logout} />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}