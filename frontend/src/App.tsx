import { useState } from "react";
import Shopscoutmap from "./components/ShopScoutMap";
import StoreOwnerDashboard from "./components/Storeownerdashboard";
import CustomerDashboard from "./components/customer-dashboard/CustomerDashboard";

type AppView = "map" | "customer" | "owner";

export default function App() {
  const [view, setView] = useState<AppView>("map");

  const handleLogout = () => {
    setView("map");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F8FA] font-sans">
      <div className="h-full w-full">
        {view === "map" && <Shopscoutmap onSelectView={(v) => setView(v)} />}
        {view === "customer" && <CustomerDashboard onLogout={handleLogout} />}
        {view === "owner" && <StoreOwnerDashboard onLogout={handleLogout} />}
      </div>
    </div>
  );
}