import L from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { LocateFixed } from "lucide-react";
import type { LatLng } from "./types";

export function FitBounds({ points }: { points: LatLng[] }) {
    const map = useMap();
    useEffect(() => {
        if (points.length >= 2) {
            map.fitBounds(L.latLngBounds(points), { padding: [80, 80] });
        }
    }, [map, points]);
    return null;
}

export function LocateControl({ onLocate }: { onLocate: (lat: number, lng: number) => void }) {
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