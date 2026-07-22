import L from "leaflet";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export function makeIcon(active: boolean) {
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