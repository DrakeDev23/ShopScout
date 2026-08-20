import Shopscoutmap from "./components/ShopScoutMap";
import StoreOwnerDashboard from "./components/Storeownerdashboard";
import CustomerDashboard from "./components/customer-dashboard/CustomerDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";

function MainContent() {
  const { view, setView, logout } = useAuth();

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