import { X, Star, Navigation2, Heart, MessageSquare } from "lucide-react";
import { GuestLockNotice } from "./GuestLockNotice";
import type { Shop } from "./types";

interface ShopCardProps {
    shop: Shop;
    isGuest: boolean;
    saved: boolean;
    hasUserPos: boolean;
    onDirections: () => void;
    onToggleSave: (id: number) => void;
    onFeedback: () => void;
    onClose: () => void;
}

export function ShopCard({ shop, isGuest, saved, hasUserPos, onDirections, onToggleSave, onFeedback, onClose }: ShopCardProps) {
    return (
        <div
            style={{ zIndex: 950 }}
            className="absolute bottom-4 left-4 right-4 rounded-2xl border border-[#E4E7EC] bg-white p-4 shadow-xl md:bottom-6 md:left-auto md:right-6 md:w-80"
        >
            <button onClick={onClose} className="absolute right-3 top-3 text-[#9CA3AF] hover:text-[#5B6472]">
                <X size={16} />
            </button>

            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#E2542D]">{shop.distance} away</p>
            <h3 className="mt-0.5 text-lg font-semibold text-[#161A23]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {shop.name}
            </h3>
            <p className="text-sm text-[#5B6472]">{shop.brand}</p>
            <p className="mt-0.5 text-[11px] text-[#9CA3AF]">{shop.address}</p>

            <div className="mt-2 flex items-center gap-3 text-xs text-[#5B6472]">
                <span className="flex items-center gap-1 text-[#161A23]">
                    <Star size={13} className="fill-[#E2542D] text-[#E2542D]" /> {shop.rating}
                </span>
                <span>{shop.price}</span>
                <span className="font-mono">{shop.stock}</span>
            </div>

            <div className="mt-3 flex gap-2">
                <button
                    onClick={onDirections}
                    disabled={!hasUserPos}
                    title={!hasUserPos ? "Allow location to get directions" : ""}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors ${hasUserPos
                        ? "bg-[#161A23] text-white hover:bg-black"
                        : "cursor-not-allowed bg-[#E4E7EC] text-[#9CA3AF]"
                        }`}
                >
                    <Navigation2 size={13} /> Directions
                </button>
                <button
                    onClick={() => isGuest && onFeedback()}
                    disabled={isGuest}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-medium ${isGuest ? "cursor-not-allowed border-[#E4E7EC] text-[#C2C6CC]" : "border-[#D7DCE3] text-[#161A23] hover:bg-[#F7F8FA]"}`}
                >
                    <MessageSquare size={13} />
                </button>
                <button
                    onClick={() => isGuest ? onFeedback() : onToggleSave(shop.id)}
                    disabled={isGuest}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-medium ${isGuest
                        ? "cursor-not-allowed border-[#E4E7EC] text-[#C2C6CC]"
                        : saved
                            ? "border-[#158F76] bg-[#EAF6F3] text-[#158F76]"
                            : "border-[#D7DCE3] text-[#161A23] hover:bg-[#F7F8FA]"
                        }`}
                >
                    <Heart size={13} className={saved ? "fill-[#158F76]" : ""} />
                </button>
            </div>

            {isGuest && (
                <div className="mt-3">
                    <GuestLockNotice label="save shops and leave feedback" onSignIn={onFeedback} />
                </div>
            )}
        </div>
    );
}