import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { makeIcon } from "./mapIcons";
import type { Shop } from "./types";

interface MapMarkersProps {
    shops: Shop[];
    selected: number | null;
    pinnedId?: number | null;
    isAuthenticated?: boolean;
    onSelect: (id: number) => void;
}

export function MapMarkers({
    shops,
    selected,
    pinnedId,
    isAuthenticated = true,
    onSelect,
}: MapMarkersProps) {
    return (
        <>
            {shops.map((shop) => {
                const isSelected = selected === shop.id;
                const isPinned = pinnedId === shop.id;
                return (
                    <Marker
                        key={shop.id}
                        position={[shop.lat, shop.lng]}
                        icon={makeIcon(isSelected || isPinned)}
                        eventHandlers={{
                            click: (e) => {
                                if (!isAuthenticated) {
                                    L.DomEvent.stopPropagation(e);
                                }
                                onSelect(shop.id);
                            },
                        }}
                    >
                        {isAuthenticated && (
                            <Popup>
                                <div className="text-xs">
                                    <strong className="text-[#161A23]">{shop.name}</strong>
                                    {isPinned && (
                                        <span className="ml-1.5 rounded bg-[#E2542D] px-1 py-0.5 text-[10px] font-semibold text-white">
                                            Pinned
                                        </span>
                                    )}
                                    <br />
                                    <span className="text-[11px] text-[#5B6472]">{shop.brand}</span>
                                </div>
                            </Popup>
                        )}
                    </Marker>
                );
            })}
        </>
    );
}
