import { useState } from "react";
import { MapPin, User, Store } from "lucide-react";
import Shopscoutmap from "./components/ShopScoutMap";
import StoreOwnerDashboard from "./components/Storeownerdashboard";
import CustomerDashboard from "./components/customer-dashboard/CustomerDashboard";

type AppView = "map" | "customer" | "owner";

export default function App() {
  const [view, setView] = useState<AppView>("customer");

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7F8FA] font-sans">
      <div
        style={{ zIndex: 1100 }}
        className="fixed bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-[#E4E7EC] bg-white/95 p-1.5 shadow-xl backdrop-blur-md"
      >
        <button
          onClick={() => setView("map")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            view === "map"
              ? "bg-[#161A23] text-white shadow-sm"
              : "text-[#5B6472] hover:bg-[#F7F8FA] hover:text-[#161A23]"
          }`}
        >
          <MapPin size={15} />
          <span>Map View</span>
        </button>

        <button
          onClick={() => setView("customer")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            view === "customer"
              ? "bg-[#161A23] text-white shadow-sm"
              : "text-[#5B6472] hover:bg-[#F7F8FA] hover:text-[#161A23]"
          }`}
        >
          <User size={15} className={view === "customer" ? "text-[#E2542D]" : ""} />
          <span>Customer Dashboard</span>
        </button>

        <button
          onClick={() => setView("owner")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            view === "owner"
              ? "bg-[#161A23] text-white shadow-sm"
              : "text-[#5B6472] hover:bg-[#F7F8FA] hover:text-[#161A23]"
          }`}
        >
          <Store size={15} className={view === "owner" ? "text-[#3B82F6]" : ""} />
          <span>Store Owner</span>
        </button>
      </div>

      <div className="h-full w-full">
        {view === "map" && <Shopscoutmap onSelectView={(v) => setView(v)} />}
        {view === "customer" && <CustomerDashboard />}
        {view === "owner" && <StoreOwnerDashboard />}
      </div>
    </div>
  );
}