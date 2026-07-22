import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import { Search, X, Footprints, LogOut, ChevronRight } from "lucide-react";

import type { AuthState, Shop, LatLng } from "./types";
import { SHOPS, CEBU_CENTER } from "./data";
import { MapMarkers } from "./MapMarkers";
import { FitBounds, LocateControl } from "./MapHelpers";
import { ShopCard } from "./ShopCard";
import { AuthPanel } from "./login";

export default function ShopScoutMap() {
    const [query, setQuery] = useState("");
    const [auth, setAuth] = useState<AuthState>(null);
    const [panelOpen, setPanelOpen] = useState(true);
    const [selected, setSelected] = useState<number | null>(null);
    const [saved, setSaved] = useState<Set<number>>(new Set());
    const [toast, setToast] = useState("");
    const [userPos, setUserPos] = useState<LatLng | null>(null);
    const [route, setRoute] = useState<LatLng[] | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isGuest = auth === "guest";
    const hasQuery = query.trim().length > 0;

    const filtered = hasQuery
        ? SHOPS.filter((s) => {
            const q = query.toLowerCase();
            return s.name.toLowerCase().includes(q) || s.brand.toLowerCase().includes(q);
        })
        : [];

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
                () => {}
            );
        }
    }, []);

    function flashToast(msg: string) {
        setToast(msg);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(""), 2400);
    }

    useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

    function handleToggleSave(id: number) {
        setSaved((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    function handleFeedback() {
        if (isGuest) {
            flashToast("Sign in to save shops and leave feedback");
            setPanelOpen(true);
        }
    }

    function handleDirections(shop: Shop) {
        if (!userPos) return;
        const shopPos: LatLng = [shop.lat, shop.lng];
        setRoute([userPos, shopPos]);
    }

    const selectedShop = filtered.find((s) => s.id === selected) ?? null;

    return (
        <div className="relative h-screen w-full overflow-hidden font-sans">
            <div
                style={{ zIndex: 1000 }}
                className="absolute left-0 right-0 top-0 flex items-center gap-3 p-3 md:p-4"
            >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#161A23] shadow-md">
                    <Footprints size={19} className="text-white" />
                </div>

                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={17} />
                    <input
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelected(null);
                            setRoute(null);
                        }}
                        placeholder="Search shoes, brands, or stores nearby"
                        className="h-11 w-full rounded-xl border border-[#E4E7EC] bg-white pl-10 pr-4 text-sm text-[#161A23] shadow-sm placeholder:text-[#9CA3AF] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E2542D]"
                    />
                    {query && (
                        <button
                            onClick={() => { setQuery(""); setSelected(null); setRoute(null); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#5B6472]"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                {auth ? (
                    <button
                        onClick={() => isGuest ? setPanelOpen(true) : setAuth(null)}
                        className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-[#E4E7EC] bg-white px-3 shadow-sm hover:bg-[#F7F8FA]"
                    >
                        {isGuest ? (
                            <>
                                <span className="rounded border border-dashed border-[#D7DCE3] px-1.5 py-0.5 text-[10px] font-medium text-[#5B6472]">GUEST</span>
                                <ChevronRight size={14} className="text-[#9CA3AF]" />
                            </>
                        ) : (
                            <>
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF6F3] text-[11px] font-medium text-[#158F76]">JD</div>
                                <LogOut size={14} className="text-[#9CA3AF]" />
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={() => setPanelOpen(true)}
                        className="h-11 shrink-0 rounded-xl bg-[#161A23] px-4 text-sm font-medium text-white shadow-sm hover:bg-black"
                    >
                        Log in
                    </button>
                )}
            </div>

            <MapContainer
                center={userPos ?? CEBU_CENTER}
                zoom={14}
                className="h-full w-full"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapMarkers shops={filtered} selected={selected} onSelect={(id) => { setSelected(id); setRoute(null); }} />

                {route && (
                    <>
                        <Polyline
                            positions={route}
                            pathOptions={{
                                color: "#E2542D",
                                weight: 4,
                                opacity: 0.9,
                                dashArray: "10, 8",
                            }}
                        />
                        <FitBounds points={route} />
                    </>
                )}

                {userPos && (
                    <Marker
                        position={userPos}
                        icon={L.divIcon({
                            className: "",
                            html: `<div style="width:16px;height:16px;border-radius:50%;background:#4285F4;border:3px solid white;box-shadow:0 0 0 3px rgba(66,133,244,0.35);"></div>`,
                            iconSize: [16, 16],
                            iconAnchor: [8, 8],
                        })}
                    />
                )}

                <LocateControl onLocate={(lat, lng) => setUserPos([lat, lng])} />
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
                    className="absolute left-1/2 top-16 -translate-x-1/2 rounded-lg bg-[#161A23] px-4 py-2 text-xs text-white shadow-lg"
                >
                    {toast}
                </div>
            )}

            {selectedShop && (
                <ShopCard
                    shop={selectedShop}
                    isGuest={isGuest}
                    saved={saved.has(selectedShop.id)}
                    hasUserPos={userPos !== null}
                    onDirections={() => handleDirections(selectedShop)}
                    onToggleSave={handleToggleSave}
                    onFeedback={handleFeedback}
                    onClose={() => { setSelected(null); setRoute(null); }}
                />
            )}

            {panelOpen && (
                <AuthPanel
                    onClose={() => setPanelOpen(false)}
                    onGuest={() => { setAuth("guest"); setPanelOpen(false); }}
                    onAuth={() => { setAuth("user"); setPanelOpen(false); }}
                />
            )}
        </div>
    );
}