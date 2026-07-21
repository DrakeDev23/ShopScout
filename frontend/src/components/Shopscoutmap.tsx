import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import {
    Search, X, Star, Navigation2, Heart, MessageSquare,
    User, Mail, Lock, Eye, EyeOff, ChevronRight, Footprints, LogOut, LocateFixed
} from "lucide-react";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Shop {
    id: number;
    name: string;
    brand: string;
    lat: number;
    lng: number;
    price: string;
    rating: number;
    distance: string;
    stock: string;
    address: string;
}

type AuthState = "guest" | "user" | null;
type AuthMode = "signin" | "signup";

const SHOPS: Shop[] = [
    {
        id: 1, name: "Shoe Salon – SM Cebu", brand: "Nike · Adidas",
        lat: 10.3110, lng: 123.9180, price: "$$", rating: 4.6,
        distance: "0.4 km", stock: "Air Max 90 in stock",
        address: "SM City Cebu, North Reclamation, Cebu City"
    },
    {
        id: 2, name: "Toby's Sports – Ayala", brand: "New Balance · ASICS",
        lat: 10.3189, lng: 123.9050, price: "$$$", rating: 4.8,
        distance: "0.7 km", stock: "Fresh Foam 1080 in stock",
        address: "Ayala Center Cebu, Cebu Business Park"
    },
    {
        id: 3, name: "Olympic Village – Carbon", brand: "Puma · Reebok",
        lat: 10.2958, lng: 123.9012, price: "$", rating: 4.2,
        distance: "1.1 km", stock: "RS-X in stock",
        address: "Carbon Market Area, Cebu City"
    },
    {
        id: 4, name: "ROX – Fuente Osmeña", brand: "Hoka · Salomon",
        lat: 10.3055, lng: 123.8938, price: "$$$", rating: 4.7,
        distance: "1.4 km", stock: "Speedgoat 5 in stock",
        address: "Fuente Osmeña Circle, Cebu City"
    },
    {
        id: 5, name: "Landmark Shoes – IT Park", brand: "Vans · Converse",
        lat: 10.3224, lng: 123.9046, price: "$$", rating: 4.3,
        distance: "1.8 km", stock: "Old Skool in stock",
        address: "Cebu IT Park, Apas, Cebu City"
    },
    {
        id: 6, name: "Vincci – Robinsons Galleria", brand: "Steve Madden · Skechers",
        lat: 10.3074, lng: 123.8892, price: "$$", rating: 4.0,
        distance: "2.1 km", stock: "D'Lites in stock",
        address: "Robinsons Galleria, General Maxilom, Cebu City"
    },
];

function makeIcon(active: boolean) {
    const color = active ? "#161A23" : "#E2542D";
    const svg = encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="46" viewBox="0 0 34 46">
          <path d="M17 0C7.6 0 0 7.6 0 17c0 13 17 29 17 29S34 30 34 17C34 7.6 26.4 0 17 0z" fill="${color}"/>
          <circle cx="17" cy="17" r="7" fill="white" opacity="0.9"/>
        </svg>`);
    return L.icon({
        iconUrl: `data:image/svg+xml,${svg}`,
        iconSize: [34, 46],
        iconAnchor: [17, 46],
        popupAnchor: [0, -48],
    });
}

function LocateControl({ onLocate }: { onLocate: (lat: number, lng: number) => void }) {
    const map = useMap();

    function locate() {
        map.locate({ setView: true, maxZoom: 16 });
        map.once("locationfound", (e) => {
            onLocate(e.latlng.lat, e.latlng.lng);
        });
    }

    return (
        <button
            onClick={locate}
            title="Use my location"
            style={{ zIndex: 900 }}
            className="absolute bottom-24 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:bg-[#F7F8FA] border border-[#E4E7EC]"
        >
            <LocateFixed size={18} className="text-[#E2542D]" />
        </button>
    );
}

function GuestLockNotice({ label, onSignIn }: { label: string; onSignIn: () => void }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-[#D7DCE3] bg-[#F7F8FA] px-3 py-2">
            <span className="flex items-center gap-1.5 text-xs text-[#5B6472]">
                <Lock size={13} /> Sign in to {label}
            </span>
            <button onClick={onSignIn} className="text-xs font-medium text-[#E2542D] hover:underline">
                Sign in
            </button>
        </div>
    );
}

interface ShopCardProps {
    shop: Shop;
    isGuest: boolean;
    saved: boolean;
    onToggleSave: (id: number) => void;
    onFeedback: () => void;
    onClose: () => void;
}

function ShopCard({ shop, isGuest, saved, onToggleSave, onFeedback, onClose }: ShopCardProps) {
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
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#161A23] py-2 text-xs font-medium text-white hover:bg-black">
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

interface AuthPanelProps {
    onClose: () => void;
    onGuest: () => void;
    onAuth: () => void;
}

function AuthPanel({ onClose, onGuest, onAuth }: AuthPanelProps) {
    const [mode, setMode] = useState<AuthMode>("signin");
    const [showPassword, setShowPassword] = useState(false);
    const isSignIn = mode === "signin";

    return (
        <div
            style={{ zIndex: 1100 }}
            className="absolute inset-0 flex justify-end bg-black/30"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex h-full w-full max-w-sm flex-col bg-white p-6 shadow-2xl"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161A23]">
                            <Footprints size={15} className="text-white" />
                        </div>
                        <span className="text-sm font-semibold text-[#161A23]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            ShopScout
                        </span>
                    </div>
                    <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#5B6472]"><X size={18} /></button>
                </div>

                <div className="mt-6 flex rounded-lg bg-[#F1F2F4] p-1">
                    {(["signin", "signup"] as AuthMode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === m ? "bg-white text-[#161A23] shadow-sm" : "text-[#8B8F98]"}`}
                        >
                            {m === "signin" ? "Sign in" : "Sign up"}
                        </button>
                    ))}
                </div>

                <h1 className="mt-6 text-xl font-semibold text-[#161A23]">
                    {isSignIn ? "Welcome back" : "Create your account"}
                </h1>
                <p className="mt-1 text-sm text-[#5B6472]">
                    {isSignIn ? "Save shops and pick up your search history." : "Get a saved list and search history that follows you."}
                </p>

                <form onSubmit={(e) => { e.preventDefault(); onAuth(); }} className="mt-5 space-y-3">
                    {!isSignIn && (
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
                            <input type="text" placeholder="Full name" className="w-full rounded-lg border border-[#D7DCE3] py-2.5 pl-9 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E2542D]" />
                        </div>
                    )}
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
                        <input type="email" placeholder="Email" className="w-full rounded-lg border border-[#D7DCE3] py-2.5 pl-9 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E2542D]" />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full rounded-lg border border-[#D7DCE3] py-2.5 pl-9 pr-9 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E2542D]"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    <button type="submit" className="w-full rounded-lg bg-[#E2542D] py-2.5 text-sm font-medium text-white hover:bg-[#c4471f]">
                        {isSignIn ? "Sign in" : "Create account"}
                    </button>
                </form>

                <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#E4E7EC]" />
                    <span className="text-xs text-[#9CA3AF]">or</span>
                    <div className="h-px flex-1 bg-[#E4E7EC]" />
                </div>

                <button
                    onClick={onGuest}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#D7DCE3] py-2.5 text-sm font-medium text-[#5B6472] hover:bg-[#F7F8FA]"
                >
                    Continue as guest
                </button>
                <p className="mt-2 text-center text-[11px] text-[#9CA3AF]">
                    Guests can share results, but can't save shops, leave feedback, or keep search history.
                </p>
            </div>
        </div>
    );
}

interface MapMarkersProps {
    shops: Shop[];
    selected: number | null;
    onSelect: (id: number) => void;
}

function MapMarkers({ shops, selected, onSelect }: MapMarkersProps) {
    return (
        <>
            {shops.map((shop) => (
                <Marker
                    key={shop.id}
                    position={[shop.lat, shop.lng]}
                    icon={makeIcon(selected === shop.id)}
                    eventHandlers={{ click: () => onSelect(shop.id) }}
                >
                    <Popup>
                        <strong>{shop.name}</strong><br />
                        <span style={{ fontSize: 12, color: "#5B6472" }}>{shop.brand}</span>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}

const CEBU_CENTER: [number, number] = [10.3157, 123.8854];

export default function ShopScoutMap() {
    const [query, setQuery] = useState("");
    const [auth, setAuth] = useState<AuthState>(null);
    const [panelOpen, setPanelOpen] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);
    const [saved, setSaved] = useState<Set<number>>(new Set());
    const [toast, setToast] = useState("");
    const [userPos, setUserPos] = useState<[number, number] | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isGuest = auth === "guest";

    const hasQuery = query.trim().length > 0;

    const filtered = hasQuery
        ? SHOPS.filter((s) => {
            const q = query.toLowerCase();
            return s.name.toLowerCase().includes(q) || s.brand.toLowerCase().includes(q);
        })
        : [];

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

                <MapMarkers shops={filtered} selected={selected} onSelect={setSelected} />

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
                    onToggleSave={handleToggleSave}
                    onFeedback={handleFeedback}
                    onClose={() => setSelected(null)}
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