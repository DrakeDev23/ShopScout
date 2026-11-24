import { useState, useEffect, useRef } from "react";
import { MapPin, Search, Loader2, X } from "lucide-react";

interface NominatimResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
    address?: {
        city?: string;
        town?: string;
        municipality?: string;
        province?: string;
        state?: string;
    };
}

interface LocationSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (lat: number, lng: number, name: string) => void;
}

export function LocationSearchModal({
    isOpen,
    onClose,
    onSelectLocation,
}: LocationSearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<NominatimResult[]>([]);
    const [loading, setLoading] = useState(false);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (!query.trim()) {
            const timer = setTimeout(() => {
                setResults([]);
                setLoading(false);
            }, 0);
            return () => clearTimeout(timer);
        }

        searchTimeout.current = setTimeout(async () => {
            setLoading(true);

            try {
                const trimmed = query.trim();
                const outsideKeywords = /\b(manila|quezon|makati|taguig|bgc|pasig|davao|iloilo|bacolod|baguio|cavite|laguna|bulacan|pampanga|angeles|cagayan|mandaluyong|paranaque|pasay|valenzuela|caloocan|alabang)\b/i;
                
                const isFullAddress = trimmed.includes(",") || outsideKeywords.test(trimmed) || trimmed.split(/\s+/).length >= 3;

                if (isFullAddress) {
                    const fullUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        trimmed
                    )}&countrycodes=ph&limit=6&addressdetails=1`;
                    const res = await fetch(fullUrl);
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setResults(data);
                    }
                } else {
                    const cebuUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        trimmed
                    )}&viewbox=123.2,11.4,124.2,9.4&bounded=1&countrycodes=ph&limit=6&addressdetails=1`;

                    const res = await fetch(cebuUrl);
                    const data = await res.json();

                    if (Array.isArray(data) && data.length > 0) {
                        setResults(data);
                    } else {
                        const fullUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                            trimmed
                        )}&countrycodes=ph&limit=6&addressdetails=1`;
                        const fullRes = await fetch(fullUrl);
                        const fullData = await fullRes.json();
                        if (Array.isArray(fullData)) {
                            setResults(fullData);
                        } else {
                            setResults([]);
                        }
                    }
                }
            } catch (err) {
                console.error("Geocoding failed:", err);
            } finally {
                setLoading(false);
            }
        }, 350);

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [query]);

    if (!isOpen) return null;

    return (
        <div style={{ zIndex: 3000 }} className="fixed inset-0 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E2542D]/10 text-[#E2542D]">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-[#161A23]">Search Location</h3>
                            <p className="text-[11px] text-gray-500">Search Cebu places or enter full address for other areas</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="relative mt-4">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                    <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search Cebu (or full address outside Cebu, e.g. BGC, Taguig)..."
                        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/60 pl-10 pr-9 text-sm text-[#161A23] placeholder:text-gray-400 focus:border-[#E2542D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E2542D]/20 transition-all"
                    />
                    {loading ? (
                        <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-gray-400" size={16} />
                    ) : query ? (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={15} />
                        </button>
                    ) : null}
                </div>

                <div className="mt-3.5 max-h-64 overflow-y-auto divide-y divide-gray-100">
                    {results.length > 0 ? (
                        results.map((r) => {
                            const isCebu =
                                r.display_name.toLowerCase().includes("cebu") ||
                                r.address?.province?.toLowerCase().includes("cebu");

                            return (
                                <button
                                    key={r.place_id}
                                    onClick={() => {
                                        onSelectLocation(parseFloat(r.lat), parseFloat(r.lon), r.display_name);
                                        onClose();
                                    }}
                                    className="flex w-full items-start gap-3 p-3 text-left rounded-xl hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-[#E2542D]/10 group-hover:text-[#E2542D] text-gray-500 transition-colors mt-0.5">
                                        <MapPin size={15} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-[#161A23] truncate">
                                            {r.display_name.split(",")[0]}
                                        </p>
                                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                                            {r.display_name.split(",").slice(1).join(",").trim()}
                                        </p>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                                            isCebu
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : "bg-blue-50 text-blue-700 border border-blue-200"
                                        }`}
                                    >
                                        {isCebu ? "Cebu" : "Outside Cebu"}
                                    </span>
                                </button>
                            );
                        })
                    ) : query.trim() && !loading ? (
                        <div className="py-8 text-center">
                            <p className="text-xs text-gray-500 font-medium">No locations found</p>
                            <p className="text-[11px] text-gray-400 mt-1">
                                For locations outside Cebu, please include the city or province (e.g., &quot;Ayala Ave, Makati&quot;).
                            </p>
                        </div>
                    ) : !query.trim() ? (
                        <div className="py-6 text-center text-xs text-gray-400">
                            Search any Cebu neighborhood or landmark, or type a full address for areas outside Cebu.
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
