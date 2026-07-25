import { useState } from "react";
import { Heart, Filter, Store } from "lucide-react";
import type { LikedStore } from "../types/types";
import { LikedStoreCard } from "../store-card/LikedStoreCard";

interface LikedStoresTabProps {
  stores: LikedStore[];
  searchQuery: string;
  onUnlikeStore: (id: string) => void;
  onShareStore: (store: LikedStore) => void;
}

export function LikedStoresTab({
  stores,
  searchQuery,
  onUnlikeStore,
  onShareStore,
}: LikedStoresTabProps) {
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(stores.map((s) => s.category)))];

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === "All" || store.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FDEEEA] text-[#E2542D]">
            <Heart size={16} fill="#E2542D" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#161A23]">Liked Stores</h2>
            <p className="text-[11px] text-[#5B6472]">
              Showing {filteredStores.length} of {stores.length} favorited stores
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter size={14} className="shrink-0 text-[#9CA3AF]" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? "bg-[#161A23] text-white"
                  : "bg-[#F7F8FA] text-[#5B6472] hover:bg-[#E4E7EC]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredStores.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E4E7EC] bg-white py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F8FA] text-[#9CA3AF]">
            <Store size={24} />
          </div>
          <h3 className="mt-4 text-sm font-bold text-[#161A23]">No liked stores found</h3>
          <p className="mt-1 max-w-xs text-xs text-[#5B6472]">
            {searchQuery
              ? "No stores match your search query."
              : "You haven't added any stores to your favorites list yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStores.map((store) => (
            <LikedStoreCard
              key={store.id}
              store={store}
              onUnlike={onUnlikeStore}
              onShare={onShareStore}
            />
          ))}
        </div>
      )}
    </div>
  );
}
