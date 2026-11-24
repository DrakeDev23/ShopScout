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

export function FlyToLocation({ target }: { target: LatLng | null }) {
    const map = useMap();

    useEffect(() => {
        if (target) {
            map.flyTo(target, 16, { animate: true, duration: 1.2 });
        }
    }, [target, map]);

    return null;
}


export function LocateControl({ onLocate }: { onLocate: () => void }) {
    return (
        <button
            type="button"
            onClick={onLocate}
            title="Point to my exact location"
            style={{ zIndex: 900 }}
            className="absolute bottom-24 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg hover:bg-[#F7F8FA] border border-[#E4E7EC] text-[#E2542D] transition-all hover:scale-105 active:scale-95"
        >
            <LocateFixed size={20} />
        </button>
    );
}
