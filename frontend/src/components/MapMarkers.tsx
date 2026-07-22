import { Marker, Popup } from "react-leaflet";
import { makeIcon } from "./mapIcons";
import type { Shop } from "./types";

interface MapMarkersProps {
    shops: Shop[];
    selected: number | null;
    onSelect: (id: number) => void;
}

export function MapMarkers({ shops, selected, onSelect }: MapMarkersProps) {
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