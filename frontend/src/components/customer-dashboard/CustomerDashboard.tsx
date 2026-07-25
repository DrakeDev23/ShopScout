import { useState } from "react";
import { Calendar, ShieldCheck, Heart, Share2, MousePointer } from "lucide-react";

import type { CustomerTab, LikedStore, SharedItem } from "./types/types";
import {
  initialCustomerProfile,
  initialLikedStores,
  initialSharedItems,
  initialCustomerStats,
} from "./mock-data/mockData";

import { SidebarNav } from "./sidebar/SidebarNav";
import { DashboardHeader } from "./header/DashboardHeader";
import { StatsCards } from "./stats-cards/StatsCards";
import { LikedStoresTab } from "./liked-stores/LikedStoresTab";
import { SharedItemsTab } from "./shared-items/SharedItemsTab";
import { ShareModal } from "./share-modal/ShareModal";

interface CustomerDashboardProps {
  onLogout?: () => void;
}

export default function CustomerDashboard({ onLogout }: CustomerDashboardProps = {}) {
  const [currentTab, setCurrentTab] = useState<CustomerTab>("liked");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [profile] = useState(initialCustomerProfile);
  const [likedStores, setLikedStores] = useState<LikedStore[]>(initialLikedStores);
  const [sharedItems, setSharedItems] = useState<SharedItem[]>(initialSharedItems);
  const [activeShareStore, setActiveShareStore] = useState<LikedStore | null>(null);

  const handleUnlikeStore = (id: string) => {
    setLikedStores((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRemoveShare = (id: string) => {
    setSharedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleConfirmShare = (
    store: LikedStore,
    platform: "Copy Link" | "WhatsApp" | "Facebook" | "Twitter",
    notes: string
  ) => {
    const newShare: SharedItem = {
      id: `share-${Date.now()}`,
      title: `${store.name} - ${store.brand}`,
      storeName: store.name,
      category: store.category,
      sharedUrl: `https://shopscout.app/store/${store.id}?ref=alex_m`,
      sharedAt: "Just now",
      platform,
      clicksCount: 1,
      imageUrl: store.imageUrl,
      notes,
    };

    setSharedItems((prev) => [newShare, ...prev]);
  };

  const getHeaderTitles = () => {
    switch (currentTab) {
      case "liked":
        return {
          title: "My Liked Stores",
          subtitle: "Explore your saved favorites, location details, and active deals.",
        };
      case "shared":
        return {
          title: "My Shared Items & Links",
          subtitle: "Manage referral links and view click performance from your shares.",
        };
      case "stats":
        return {
          title: "Account Overview & Statistics",
          subtitle: "Summary of your saved stores, shared links, and activity level.",
        };
    }
  };

  const { title, subtitle } = getHeaderTitles();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F8FA] text-[#161A23] font-sans">
      <SidebarNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        likedCount={likedStores.length}
        sharedCount={sharedItems.length}
        profile={profile}
        onLogout={onLogout}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          title={title}
          subtitle={subtitle}
        />

        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <StatsCards
              likedCount={likedStores.length}
              sharedCount={sharedItems.length}
              savedDealsCount={profile.savedDealsCount}
              stats={initialCustomerStats}
            />

            {currentTab === "liked" && (
              <LikedStoresTab
                stores={likedStores}
                searchQuery={searchQuery}
                onUnlikeStore={handleUnlikeStore}
                onShareStore={(store) => setActiveShareStore(store)}
              />
            )}

            {currentTab === "shared" && (
              <SharedItemsTab
                items={sharedItems}
                searchQuery={searchQuery}
                onRemoveShare={handleRemoveShare}
              />
            )}

            {currentTab === "stats" && (
              <div className="flex flex-col gap-6">
                <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="h-16 w-16 rounded-full object-cover ring-4 ring-[#F7F8FA]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-[#161A23]">{profile.name}</h2>
                        <span className="flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-xs font-semibold text-[#10B981]">
                          <ShieldCheck size={13} />
                          Verified Scout
                        </span>
                      </div>
                      <p className="text-xs text-[#5B6472]">{profile.email}</p>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-[#9CA3AF]">
                        <Calendar size={12} />
                        <span>Member since {profile.memberSince}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#F1F2F4] pb-4">
                      <div className="flex items-center gap-2">
                        <Heart size={18} className="text-[#E2542D]" />
                        <h3 className="text-sm font-bold text-[#161A23]">Liked Stores Summary</h3>
                      </div>
                      <span className="text-xs font-bold text-[#E2542D]">
                        {likedStores.length} Stores
                      </span>
                    </div>
                    <div className="mt-4 flex flex-col gap-3">
                      {likedStores.slice(0, 3).map((store) => (
                        <div
                          key={store.id}
                          className="flex items-center justify-between rounded-xl bg-[#F7F8FA] p-3"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={store.imageUrl}
                              alt={store.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-xs font-bold text-[#161A23]">{store.name}</p>
                              <p className="text-[11px] text-[#5B6472]">{store.category}</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-[#161A23]">
                            {store.distanceKm} km
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#F1F2F4] pb-4">
                      <div className="flex items-center gap-2">
                        <Share2 size={18} className="text-[#3B82F6]" />
                        <h3 className="text-sm font-bold text-[#161A23]">Recent Share Performance</h3>
                      </div>
                      <span className="text-xs font-bold text-[#3B82F6]">
                        {sharedItems.reduce((acc, item) => acc + item.clicksCount, 0)} Total Clicks
                      </span>
                    </div>
                    <div className="mt-4 flex flex-col gap-3">
                      {sharedItems.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-xl bg-[#F7F8FA] p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#3B82F6]">
                              <MousePointer size={16} />
                            </div>
                            <div>
                              <p className="truncate text-xs font-bold text-[#161A23]">{item.title}</p>
                              <p className="text-[11px] text-[#5B6472]">{item.platform}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-[#10B981]">
                            {item.clicksCount} clicks
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {activeShareStore && (
          <ShareModal
            store={activeShareStore}
            onClose={() => setActiveShareStore(null)}
            onConfirmShare={handleConfirmShare}
          />
        )}
      </div>
    </div>
  );
}
