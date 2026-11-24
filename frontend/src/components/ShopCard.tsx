import { X, Star, Heart, MessageSquare, Car, Motorbike, Bike, Footprints, Loader2, MapPin, PinOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GuestLockNotice } from "./GuestLockNotice";
import type { Shop, LatLng } from "./types";
import {
    TRAVEL_MODES,
    formatDistance,
    formatDuration,
    haversineMeters,
    type RoutesByMode,
    type TravelMode,
} from "./routing";

const MODE_META: Record<TravelMode, { label: string; Icon: LucideIcon }> = {
    car: { label: "Car", Icon: Car },
    motorcycle: { label: "Motor", Icon: Motorbike },
    bike: { label: "Bike", Icon: Bike },
    walk: { label: "Walk", Icon: Footprints },
};

interface ShopCardProps {
    shop: Shop;
    isGuest: boolean;
    saved: boolean;
    hasUserPos: boolean;
    userPos: LatLng | null;
    routes: RoutesByMode | null;
    routeLoading: boolean;
    travelMode: TravelMode;
    isPinned?: boolean;
    onTravelModeChange: (mode: TravelMode) => void;
    onTogglePin: () => void;
    onToggleSave: (id: number) => void;
    onFeedback: () => void;
    onClose: () => void;
}

export function ShopCard({
    shop, isGuest, saved, hasUserPos, userPos, routes, routeLoading, travelMode,
    isPinned = false,
    onTravelModeChange, onTogglePin, onToggleSave, onFeedback, onClose,
}: ShopCardProps) {
    const activeRoute = routes ? routes[travelMode] : null;
    const distanceLabel = activeRoute
        ? `${formatDistance(activeRoute.distance)} away · ${formatDuration(activeRoute.duration)} by ${MODE_META[travelMode].label.toLowerCase()}`
        : userPos
            ? `${formatDistance(haversineMeters(userPos, [shop.lat, shop.lng]))} away`
            : `${shop.distance} away`;

    return (
        <div
            style={{ zIndex: 950 }}
            className="absolute bottom-4 left-4 right-4 rounded-2xl border border-[#E4E7EC] bg-white p-4 shadow-xl md:bottom-6 md:left-auto md:right-6 md:w-80"
        >
            <button onClick={onClose} className="absolute right-3 top-3 text-[#9CA3AF] hover:text-[#5B6472]">
                <X size={16} />
            </button>

            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#E2542D]">{distanceLabel}</p>
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

            {hasUserPos && (
                <div className="mt-3">
                    <div className="grid grid-cols-4 gap-1.5">
                        {TRAVEL_MODES.map((mode) => {
                            const { label, Icon } = MODE_META[mode];
                            const r = routes?.[mode];
                            const active = mode === travelMode;
                            return (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => onTravelModeChange(mode)}
                                    title={r?.estimated ? "Estimated (routing service unavailable)" : label}
                                    className={`flex flex-col items-center gap-0.5 rounded-lg border px-1 py-1.5 text-[10px] transition-colors ${active
                                        ? "border-[#E2542D] bg-[#FDF0EC] text-[#161A23]"
                                        : "border-[#E4E7EC] text-[#5B6472] hover:bg-[#F7F8FA]"
                                        }`}
                                >
                                    <Icon size={15} className={active ? "text-[#E2542D]" : ""} />
                                    {routeLoading || !r ? (
                                        <Loader2 size={12} className="my-0.5 animate-spin text-[#9CA3AF]" />
                                    ) : (
                                        <>
                                            <span className="font-semibold leading-tight">
                                                {r.estimated ? "~" : ""}{formatDuration(r.duration)}
                                            </span>
                                            <span className="leading-tight text-[#9CA3AF]">{formatDistance(r.distance)}</span>
                                        </>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    {activeRoute?.estimated && (
                        <p className="mt-1 text-[10px] text-[#9CA3AF]">Routing service unavailable. Showing straight-line estimates.</p>
                    )}
                    {travelMode === "motorcycle" && activeRoute && !activeRoute.estimated && (
                        <p className="mt-1 text-[10px] text-[#9CA3AF]">Motor time is estimated from the car route.</p>
                    )}
                </div>
            )}

            <div className="mt-3 flex gap-2">
                <button
                    type="button"
                    onClick={onTogglePin}
                    disabled={!hasUserPos}
                    title={!hasUserPos ? "Allow location to pin destination" : isPinned ? "Unpin this destination" : "Pin this destination to map"}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                        !hasUserPos
                            ? "cursor-not-allowed bg-[#E4E7EC] text-[#9CA3AF]"
                            : isPinned
                            ? "bg-[#E2542D] text-white hover:bg-[#d04622] shadow-sm"
                            : "bg-[#161A23] text-white hover:bg-black shadow-sm"
                    }`}
                >
                    {isPinned ? (
                        <>
                            <PinOff size={14} /> Pinned (Unpin)
                        </>
                    ) : (
                        <>
                            <MapPin size={14} /> Pin this Location
                        </>
                    )}
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
