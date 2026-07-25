import { Footprints, Heart, Share2, BarChart3, UserCheck, LogOut } from "lucide-react";
import type { CustomerTab, CustomerProfile } from "../types/types";

interface SidebarNavProps {
  currentTab: CustomerTab;
  onSelectTab: (tab: CustomerTab) => void;
  likedCount: number;
  sharedCount: number;
  profile: CustomerProfile;
  onLogout?: () => void;
}

export function SidebarNav({
  currentTab,
  onSelectTab,
  likedCount,
  sharedCount,
  profile,
  onLogout,
}: SidebarNavProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[#E4E7EC] bg-white px-5 py-6">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#161A23] shadow-sm">
          <Footprints size={18} className="text-white" />
        </div>
        <div>
          <span
            className="text-base font-bold tracking-tight text-[#161A23]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ShopScout
          </span>
          <p className="text-[11px] font-medium text-[#E2542D]">Customer Hub</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-col gap-1.5">
        <button
          onClick={() => onSelectTab("liked")}
          className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
            currentTab === "liked"
              ? "bg-[#161A23] text-white shadow-sm"
              : "text-[#5B6472] hover:bg-[#F7F8FA] hover:text-[#161A23]"
          }`}
        >
          <div className="flex items-center gap-3">
            <Heart size={18} className={currentTab === "liked" ? "text-[#E2542D]" : "text-[#9CA3AF]"} />
            <span>Liked Stores</span>
          </div>
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
              currentTab === "liked"
                ? "bg-[#E2542D] text-white"
                : "bg-[#F1F2F4] text-[#5B6472]"
            }`}
          >
            {likedCount}
          </span>
        </button>

        <button
          onClick={() => onSelectTab("shared")}
          className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
            currentTab === "shared"
              ? "bg-[#161A23] text-white shadow-sm"
              : "text-[#5B6472] hover:bg-[#F7F8FA] hover:text-[#161A23]"
          }`}
        >
          <div className="flex items-center gap-3">
            <Share2 size={18} className={currentTab === "shared" ? "text-[#3B82F6]" : "text-[#9CA3AF]"} />
            <span>Shared Items</span>
          </div>
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
              currentTab === "shared"
                ? "bg-[#3B82F6] text-white"
                : "bg-[#F1F2F4] text-[#5B6472]"
            }`}
          >
            {sharedCount}
          </span>
        </button>

        <button
          onClick={() => onSelectTab("stats")}
          className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
            currentTab === "stats"
              ? "bg-[#161A23] text-white shadow-sm"
              : "text-[#5B6472] hover:bg-[#F7F8FA] hover:text-[#161A23]"
          }`}
        >
          <div className="flex items-center gap-3">
            <BarChart3 size={18} className={currentTab === "stats" ? "text-[#10B981]" : "text-[#9CA3AF]"} />
            <span>Overview & Stats</span>
          </div>
        </button>
      </nav>

      <div className="mt-auto flex flex-col gap-2 rounded-xl border border-[#E4E7EC] bg-[#F7F8FA] p-3.5">
        <div className="flex items-center gap-3">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="truncate text-xs font-semibold text-[#161A23]">{profile.name}</p>
              <UserCheck size={12} className="text-[#10B981]" />
            </div>
            <p className="truncate text-[11px] text-[#9CA3AF]">{profile.email}</p>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#E4E7EC] bg-white py-2 text-xs font-semibold text-[#EF4444] transition-colors hover:bg-[#FDEEEA]"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
