import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polyline, Popup, Circle, Tooltip } from "react-leaflet";
import { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, Footprints, LogOut, ChevronRight, MapPin } from "lucide-react";

import type { LatLng } from "./types";
import { SHOPS, CEBU_CENTER } from "./data";
import { MapMarkers } from "./MapMarkers";
import { FitBounds, LocateControl, FlyToLocation } from "./MapHelpers";
import { useDeviceLocation } from "./useDeviceLocation";
import { LocationSearchModal } from "./LocationSearchModal";
import { AuthPanel } from "./login";
import { ShopCard } from "./ShopCard";
import { getRoutes, type RoutesByMode, type TravelMode } from "./routing";
import { useAuth } from "../context/AuthContext";

const USER_LOCATION_ICON = L.divIcon({
    className: "user-location-marker",
    html: `<div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;"><div style="position:absolute;width:24px;height:24px;border-radius:50%;background:rgba(66,133,244,0.3);animation:pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div><div style="width:14px;height:14px;border-radius:50%;background:#4285F4;border:2.5px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4);position:relative;"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

const CARTO_KEY = import.meta.env.VITE_CARTO_API_KEY || "cb1_5f0o_1_01a12d9e30619fa7cf2505ac";

interface ShopScoutMapProps {
    onSelectView?: (view: "customer" | "owner") => void;
}

export default function ShopScoutMap({ onSelectView }: ShopScoutMapProps = {}) {
    const { user, isGuest, logout, setView } = useAuth();
    const isAuthenticated = !!user || isGuest;
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [panelOpen, setPanelOpen] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);
    const [saved, setSaved] = useState<Set<number>>(new Set());
    const [toast, setToast] = useState("");
    const [userPos, setUserPos] = useState<LatLng | null>(() => {
        try {
            const saved = localStorage.getItem("shopscout_user_pos");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length === 2) return parsed as LatLng;
            }
        } catch {
            return null;
        }
        return null;
    });
    const [locationName, setLocationName] = useState(() => {
        return localStorage.getItem("shopscout_location_name") || "";
    });
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [flyTarget, setFlyTarget] = useState<LatLng | null>(null);
    const [locationModalOpen, setLocationModalOpen] = useState(false);
    const [travelMode, setTravelMode] = useState<TravelMode>("car");
    const [pinnedShopId, setPinnedShopId] = useState<number | null>(() => {
        try {
            const saved = localStorage.getItem("shopscout_pinned_shop_id");
            return saved ? Number(saved) : null;
        } catch {
            return null;
        }
    });
    const [routeState, setRouteState] = useState<{ key: string; routes: RoutesByMode } | null>(null);
    const [pendingShopId, setPendingShopId] = useState<number | null>(null);
    const [fitKey, setFitKey] = useState(0);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const hasQuery = debouncedQuery.trim().length > 0;

    const terms = debouncedQuery.toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = useMemo(() => {
        if (!hasQuery) return [];
        return SHOPS.filter((s) => {
            const haystack = [s.name, s.brand, s.stock, s.address, ...(s.tags ?? [])]
                .join(" ")
                .toLowerCase();
            return terms.every((t) => haystack.includes(t));
        });
    }, [hasQuery, terms]);

    const selectedShop = filtered.find((s) => s.id === selected) ?? null;
    const pinnedShop = pinnedShopId ? (SHOPS.find((s) => s.id === pinnedShopId) ?? null) : null;
    const targetShop = selectedShop ?? pinnedShop;

    const shopsToDisplay = useMemo(() => {
        if (!pinnedShop) return filtered;
        if (filtered.some((s) => s.id === pinnedShop.id)) return filtered;
        return [...filtered, pinnedShop];
    }, [filtered, pinnedShop]);

    const routeKey = targetShop && userPos
        ? `${targetShop.id}|${userPos[0]},${userPos[1]}`
        : null;

    useEffect(() => {
        if (!routeKey || !targetShop || !userPos) return;
        const controller = new AbortController();
        getRoutes(userPos, [targetShop.lat, targetShop.lng], controller.signal)
            .then((routes) => setRouteState({ key: routeKey, routes }))
            .catch((err) => {
                if (err?.name !== "AbortError") console.warn("Route error:", err);
            });
        return () => controller.abort();
    }, [routeKey, targetShop, userPos]);

    const routes = routeState && routeState.key === routeKey ? routeState.routes : null;
    const routeLoading = routeKey !== null && routes === null;
    const activeRoute = routes ? routes[travelMode] : null;

    function flashToast(msg: string, durationMs = 2800) {
        setToast(msg);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(""), durationMs);
    }

    useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

    function saveUserPos(pos: LatLng, name: string) {
        setUserPos(pos);
        setLocationName(name);
        try {
            localStorage.setItem("shopscout_user_pos", JSON.stringify(pos));
            localStorage.setItem("shopscout_location_name", name);
        } catch {
            return;
        }
    }

    const { locate } = useDeviceLocation({
        onUpdate: (lat, lng, acc) => {
            const pos: LatLng = [lat, lng];
            saveUserPos(pos, "");
            setAccuracy(acc);
            setFlyTarget(pos);
        },
        onDone: (best) => {
            if (best > 500) {
                flashToast(`Your browser only gave an approximate location (±${(best / 1000).toFixed(1)} km). Tap "Search your location" on your pin to set your exact spot.`, 7000);
            } else {
                flashToast(`Centered on your location (±${Math.round(best)} m)`);
            }
        },
        onError: (msg) => flashToast(msg, 7000),
    });

    function requestDeviceLocation() {
        flashToast("Getting your exact location...");
        locate();
    }

    useEffect(() => {
        locate();
    }, [locate]);

    function handleSelectExactLocation(lat: number, lng: number, name: string) {
        const pos: LatLng = [lat, lng];
        setUserPos(pos);
        setAccuracy(null);
        setFlyTarget(pos);
        const shortName = name.split(",")[0].trim();
        setLocationName(shortName);
        try {
            localStorage.setItem("shopscout_user_pos", JSON.stringify(pos));
            localStorage.setItem("shopscout_location_name", shortName);
        } catch {
            return;
        }
        flashToast(`Location set to ${shortName}`);
    }

    function handleToggleSave(id: number) {
        setSaved((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    function handleFeedback() {
        if (isGuest) {
            flashToast("Sign in to save shops and leave feedback");
            setPanelOpen(true);
        }
    }

    function handleTogglePin(shopId: number) {
        if (pinnedShopId === shopId) {
            setPinnedShopId(null);
            try {
                localStorage.removeItem("shopscout_pinned_shop_id");
            } catch {
                return;
            }
            flashToast("Location unpinned from map");
        } else {
            setPinnedShopId(shopId);
            try {
                localStorage.setItem("shopscout_pinned_shop_id", String(shopId));
            } catch {
                return;
            }
            setFitKey((k) => k + 1);
            const shop = SHOPS.find((s) => s.id === shopId);
            flashToast(`Pinned path to ${shop?.name ?? "destination"}! Path will stay on map.`);
        }
    }

    useEffect(() => {
        if (!isAuthenticated) {
            const timer = setTimeout(() => setSelected(null), 0);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated]);

    function handleSelectShop(id: number) {
        if (!isAuthenticated) {
            setPendingShopId(id);
            flashToast("Please log in or click Guest to view this shop location");
            setPanelOpen(true);
            return;
        }
        setSelected(id);
    }

    return (
        <div className="relative h-screen w-full overflow-hidden font-sans">
            <div
                style={{ zIndex: 2000 }}
                className="absolute left-0 right-0 top-0 flex items-center gap-3 p-3 md:p-4"
            >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#161A23] shadow-md">
                    <Footprints size={19} className="text-white" />
                </div>

                <button
                    type="button"
                    onClick={() => setLocationModalOpen(true)}
                    title="Search address, neighborhood or city"
                    className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-[#E4E7EC] bg-white px-3 shadow-sm hover:bg-[#F7F8FA] transition-colors"
                >
                    <MapPin size={17} className="text-[#E2542D] shrink-0" />
                    <span className="text-xs font-medium text-[#161A23] max-w-[100px] sm:max-w-[150px] truncate">
                        {locationName || "Set Location"}
                    </span>
                </button>

                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={17} />
                    <input
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelected(null);
                        }}
                        placeholder="Search shoes, brands, or stores nearby"
                        className="h-11 w-full rounded-xl border border-[#E4E7EC] bg-white pl-10 pr-4 text-sm text-[#161A23] shadow-sm placeholder:text-[#9CA3AF] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E2542D]"
                    />
                    {query && (
                        <button
                            onClick={() => { setQuery(""); setSelected(null); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#5B6472]"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                {user || isGuest ? (
                    <button
                        onClick={() => isGuest ? setPanelOpen(true) : logout()}
                        className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-[#E4E7EC] bg-white px-3 shadow-sm hover:bg-[#F7F8FA]"
                    >
                        {isGuest ? (
                            <>
                                <span className="rounded border border-dashed border-[#D7DCE3] px-1.5 py-0.5 text-[10px] font-medium text-[#5B6472]">GUEST</span>
                                <ChevronRight size={14} className="text-[#9CA3AF]" />
                            </>
                        ) : (
                            <>
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF6F3] text-[11px] font-medium text-[#158F76]">
                                    {user?.fullName ? user.fullName.split(" ").map((n: string) => n[0]).join("") : "JD"}
                                </div>
                                <LogOut size={14} className="text-[#9CA3AF]" />
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            setPanelOpen(true);
                        }}
                        className="relative h-11 shrink-0 rounded-xl bg-[#161A23] px-4 text-sm font-medium text-white shadow-sm hover:bg-black"
                    >
                        Log in
                    </button>
                )}
            </div>

            {!userPos && (
                <div
                    style={{ zIndex: 1000 }}
                    className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-xl border border-[#E4E7EC] bg-white/95 px-4 py-2 shadow-lg backdrop-blur-sm"
                >
                    <span className="h-2 w-2 rounded-full bg-[#E2542D] animate-ping" />
                    <span className="text-xs text-[#5B6472]">Allow location or search your place:</span>
                    <button
                        type="button"
                        onClick={requestDeviceLocation}
                        className="rounded-lg bg-[#E2542D] px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-[#d04622] active:scale-95 transition-all"
                    >
                        Allow Location
                    </button>
                    <button
                        type="button"
                        onClick={() => setLocationModalOpen(true)}
                        className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        Search Address
                    </button>
                </div>
            )}

            <MapContainer
                center={userPos ?? CEBU_CENTER}
                zoom={15}
                className="h-full w-full"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url={CARTO_KEY
                        ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_KEY}`
                        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                    subdomains="abcd"
                    maxZoom={20}
                />

                <FlyToLocation target={flyTarget} />

                <MapMarkers
                    shops={shopsToDisplay}
                    selected={selected}
                    pinnedId={pinnedShopId}
                    isAuthenticated={isAuthenticated}
                    onSelect={handleSelectShop}
                />

                {activeRoute && userPos && targetShop && (
                    <>
                        <Polyline
                            positions={activeRoute.path}
                            pathOptions={{ color: "#FFFFFF", weight: 8, opacity: 0.9 }}
                        />
                        <Polyline
                            positions={activeRoute.path}
                            pathOptions={{
                                color: travelMode === "walk" ? "#158F76" : travelMode === "bike" ? "#2563EB" : "#E2542D",
                                weight: 5,
                                opacity: 0.95,
                                dashArray: activeRoute.estimated || travelMode === "walk" ? "8, 8" : undefined,
                            }}
                        />
                        {!activeRoute.estimated && (
                            <>
                                <Polyline
                                    positions={[userPos, activeRoute.path[0]]}
                                    pathOptions={{ color: "#5B6472", weight: 3, opacity: 0.7, dashArray: "2, 6" }}
                                />
                                <Polyline
                                    positions={[activeRoute.path[activeRoute.path.length - 1], [targetShop.lat, targetShop.lng]]}
                                    pathOptions={{ color: "#5B6472", weight: 3, opacity: 0.7, dashArray: "2, 6" }}
                                />
                            </>
                        )}
                        <FitBounds key={`${routeKey}|${fitKey}`} points={activeRoute.path} />
                    </>
                )}

                {userPos && accuracy && (
                    <Circle
                        center={userPos}
                        radius={accuracy}
                        pathOptions={{
                            color: "#4285F4",
                            fillColor: "#4285F4",
                            fillOpacity: 0.12,
                            weight: 1.5,
                            opacity: 0.35,
                        }}
                    />
                )}

                {userPos && (
                    <Marker
                        position={userPos}
                        icon={USER_LOCATION_ICON}
                    >
                        {!locationName && (
                            <Tooltip permanent interactive direction="top" offset={[0, -14]}>
                                <button
                                    type="button"
                                    onClick={() => setLocationModalOpen(true)}
                                    className="flex items-center gap-1 text-[11px] font-medium text-[#161A23]"
                                >
                                    <Search size={11} className="text-[#E2542D]" />
                                    Not here? <span className="text-[#E2542D] underline">Search your location</span>
                                </button>
                            </Tooltip>
                        )}
                        <Popup>
                            <div className="text-xs">
                                <span className="font-semibold text-[#161A23]">
                                    {locationName ? `Your Location (${locationName})` : "Your Current Location"}
                                </span>
                                {accuracy && (
                                    <p className="text-[10px] text-gray-500 mt-0.5">
                                        Accurate within ±{accuracy >= 1000 ? `${(accuracy / 1000).toFixed(1)} km` : `${Math.round(accuracy)} m`}
                                    </p>
                                )}
                                <p className="text-[10px] text-gray-500 mt-1.5">Want a more exact spot?</p>
                                <button
                                    type="button"
                                    onClick={() => setLocationModalOpen(true)}
                                    className="mt-1 flex w-full items-center justify-center gap-1 rounded-md bg-[#E2542D] px-2 py-1 text-[11px] font-semibold text-white hover:bg-[#d04622]"
                                >
                                    <Search size={11} /> Search a specific location
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                )}

                <LocateControl onLocate={requestDeviceLocation} />
            </MapContainer>

            {!hasQuery && (
                <div
                    style={{ zIndex: 999 }}
                    className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center pb-10"
                >
                    <div className="rounded-xl border border-[#E4E7EC] bg-white/90 px-5 py-3 shadow-md backdrop-blur-sm">
                        <p className="text-center text-sm text-[#5B6472]">
                            Search a shoe, brand, or store to see nearby shops
                        </p>
                    </div>
                </div>
            )}

            {toast && (
                <div
                    style={{ zIndex: 1050 }}
                    className="absolute left-1/2 top-16 w-max max-w-[90vw] -translate-x-1/2 rounded-lg bg-[#161A23] px-4 py-2 text-center text-xs text-white shadow-lg"
                >
                    {toast}
                </div>
            )}

            {selectedShop && isAuthenticated && (
                <ShopCard
                    shop={selectedShop}
                    isGuest={isGuest}
                    saved={saved.has(selectedShop.id)}
                    hasUserPos={userPos !== null}
                    userPos={userPos}
                    routes={routes}
                    routeLoading={routeLoading}
                    travelMode={travelMode}
                    isPinned={pinnedShopId === selectedShop.id}
                    onTravelModeChange={setTravelMode}
                    onTogglePin={() => handleTogglePin(selectedShop.id)}
                    onToggleSave={handleToggleSave}
                    onFeedback={handleFeedback}
                    onClose={() => setSelected(null)}
                />
            )}

            {pinnedShop && !selectedShop && (
                <div
                    style={{ zIndex: 950 }}
                    className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-[#E4E7EC] bg-white p-3.5 shadow-xl md:bottom-6 md:left-auto md:right-6 md:w-80 animate-in fade-in slide-in-from-bottom-2 duration-150"
                >
                    <button
                        type="button"
                        onClick={() => handleSelectShop(pinnedShop.id)}
                        className="flex items-center gap-3 text-left flex-1 min-w-0"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E2542D] text-white shadow-sm">
                            <MapPin size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#E2542D]">Pinned Destination</p>
                            <p className="truncate text-sm font-semibold text-[#161A23]">{pinnedShop.name}</p>
                            {activeRoute && (
                                <p className="text-[11px] text-[#5B6472]">
                                    {activeRoute.distance >= 1000 ? `${(activeRoute.distance / 1000).toFixed(1)} km` : `${Math.round(activeRoute.distance)} m`} away
                                </p>
                            )}
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTogglePin(pinnedShop.id)}
                        title="Unpin destination and clear path"
                        className="ml-2 rounded-lg p-2 text-[#9CA3AF] hover:bg-[#F7F8FA] hover:text-[#161A23] transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {panelOpen && (
                <AuthPanel
                    onClose={() => {
                        setPanelOpen(false);
                        setPendingShopId(null);
                    }}
                    onGuest={() => {
                        setPanelOpen(false);
                        if (pendingShopId !== null) {
                            setSelected(pendingShopId);
                            setPendingShopId(null);
                        }
                    }}
                    onAuth={(target) => {
                        setPanelOpen(false);
                        if (pendingShopId !== null) {
                            setSelected(pendingShopId);
                            setPendingShopId(null);
                        }
                        setView(target);
                        if (onSelectView) {
                            onSelectView(target);
                        }
                    }}
                />
            )}

            <LocationSearchModal
                isOpen={locationModalOpen}
                onClose={() => setLocationModalOpen(false)}
                onSelectLocation={handleSelectExactLocation}
            />
        </div>
    );
}
