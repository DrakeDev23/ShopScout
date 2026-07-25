import { Heart, Share2, Star, MapPin, Clock, ExternalLink, Tag } from "lucide-react";
import type { LikedStore } from "../types/types";

interface LikedStoreCardProps {
  store: LikedStore;
  onUnlike: (id: string) => void;
  onShare: (store: LikedStore) => void;
}

export function LikedStoreCard({ store, onUnlike, onShare }: LikedStoreCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 w-full overflow-hidden bg-[#F1F2F4]">
        <img
          src={store.imageUrl}
          alt={store.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute left-3 top-3 flex gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md ${
              store.isOpen ? "bg-[#10B981]/90" : "bg-[#EF4444]/90"
            }`}
          >
            {store.isOpen ? "Open Now" : "Closed"}
          </span>
          <span className="rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
            {store.category}
          </span>
        </div>

        <button
          onClick={() => onUnlike(store.id)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#E2542D] shadow-sm backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
          title="Remove from Liked Stores"
        >
          <Heart size={18} fill="#E2542D" />
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <h3 className="text-base font-bold text-white drop-shadow-sm">{store.name}</h3>
            <p className="text-xs text-white/80">{store.brand}</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-white/90 px-2 py-0.5 text-xs font-bold text-[#161A23] backdrop-blur-md">
            <Star size={13} className="fill-[#F59E0B] text-[#F59E0B]" />
            <span>{store.rating}</span>
            <span className="text-[10px] text-[#5B6472]">({store.reviewsCount})</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-2 text-xs text-[#5B6472]">
          <MapPin size={14} className="mt-0.5 shrink-0 text-[#9CA3AF]" />
          <span className="truncate">{store.address}</span>
          <span className="ml-auto font-medium text-[#161A23]">{store.distanceKm} km</span>
        </div>

        {store.featuredDeal && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#FDEEEA] px-3 py-2 text-xs text-[#E2542D]">
            <Tag size={14} className="shrink-0" />
            <span className="truncate font-semibold">{store.featuredDeal}</span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-[#F1F2F4] pt-3 text-[11px] text-[#9CA3AF]">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>Saved {store.likedAt}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onShare(store)}
              className="flex items-center gap-1.5 rounded-lg border border-[#E4E7EC] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#5B6472] hover:bg-[#F7F8FA] hover:text-[#161A23]"
            >
              <Share2 size={13} className="text-[#3B82F6]" />
              <span>Share</span>
            </button>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 rounded-lg bg-[#161A23] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-black"
            >
              <ExternalLink size={13} />
              <span>Directions</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
