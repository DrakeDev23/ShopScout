import { useState } from "react";
import { Share2, Filter, Link2 } from "lucide-react";
import type { SharedItem } from "../types/types";
import { SharedItemCard } from "../item-card/SharedItemCard";

interface SharedItemsTabProps {
  items: SharedItem[];
  searchQuery: string;
  onRemoveShare: (id: string) => void;
}

export function SharedItemsTab({
  items,
  searchQuery,
  onRemoveShare,
}: SharedItemsTabProps) {
  const [platformFilter, setPlatformFilter] = useState<string>("All");

  const platforms = ["All", "Copy Link", "WhatsApp", "Facebook", "Twitter"];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform =
      platformFilter === "All" || item.platform === platformFilter;

    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E4E7EC] bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#3B82F6]">
            <Share2 size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#161A23]">Shared Stores & Deals</h2>
            <p className="text-[11px] text-[#5B6472]">
              Track clicks and interactions on links you shared
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter size={14} className="shrink-0 text-[#9CA3AF]" />
          {platforms.map((plat) => (
            <button
              key={plat}
              onClick={() => setPlatformFilter(plat)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                platformFilter === plat
                  ? "bg-[#161A23] text-white"
                  : "bg-[#F7F8FA] text-[#5B6472] hover:bg-[#E4E7EC]"
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E4E7EC] bg-white py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F8FA] text-[#9CA3AF]">
            <Link2 size={24} />
          </div>
          <h3 className="mt-4 text-sm font-bold text-[#161A23]">No shared links found</h3>
          <p className="mt-1 max-w-xs text-xs text-[#5B6472]">
            {searchQuery
              ? "No shares match your search query."
              : "Share your favorite stores and deals with friends to see link performance here."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredItems.map((item) => (
            <SharedItemCard
              key={item.id}
              item={item}
              onRemoveShare={onRemoveShare}
            />
          ))}
        </div>
      )}
    </div>
  );
}
