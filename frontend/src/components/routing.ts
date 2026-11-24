import type { LatLng } from "./types";

export type TravelMode = "car" | "motorcycle" | "bike" | "walk";

export const TRAVEL_MODES: TravelMode[] = ["car", "motorcycle", "bike", "walk"];

export interface RouteInfo {
    path: LatLng[];
    distance: number;
    duration: number;
    estimated: boolean;
}

export type RoutesByMode = Record<TravelMode, RouteInfo>;

const OSRM_PROFILES = {
    car: "https://routing.openstreetmap.de/routed-car/route/v1/driving",
    bike: "https://routing.openstreetmap.de/routed-bike/route/v1/bike",
    walk: "https://routing.openstreetmap.de/routed-foot/route/v1/foot",
} as const;

type OsrmProfile = keyof typeof OSRM_PROFILES;

const MOTORCYCLE_DURATION_FACTOR = 0.8;

const FALLBACK_SPEED_KMH: Record<TravelMode, number> = {
    car: 25,
    motorcycle: 30,
    bike: 14,
    walk: 4.8,
};

const DETOUR_FACTOR = 1.3;

export function haversineMeters(a: LatLng, b: LatLng): number {
    const R = 6371000;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(b[0] - a[0]);
    const dLng = toRad(b[1] - a[1]);
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
}

function estimateRoute(from: LatLng, to: LatLng, mode: TravelMode): RouteInfo {
    const distance = haversineMeters(from, to) * DETOUR_FACTOR;
    const duration = distance / ((FALLBACK_SPEED_KMH[mode] * 1000) / 3600);
    return { path: [from, to], distance, duration, estimated: true };
}

async function fetchOsrm(
    profile: OsrmProfile,
    from: LatLng,
    to: LatLng,
    signal?: AbortSignal,
): Promise<RouteInfo> {
    const coords = `${from[1]},${from[0]};${to[1]},${to[0]}`;
    const url = `${OSRM_PROFILES[profile]}/${coords}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`Routing failed (${res.status})`);
    const data = await res.json();
    const route = data?.routes?.[0];
    if (data?.code !== "Ok" || !route) throw new Error("No route found");
    const path: LatLng[] = (route.geometry.coordinates as [number, number][]).map(
        ([lng, lat]) => [lat, lng],
    );
    return { path, distance: route.distance, duration: route.duration, estimated: false };
}

export async function getRoutes(from: LatLng, to: LatLng, signal?: AbortSignal): Promise<RoutesByMode> {
    const profiles: OsrmProfile[] = ["car", "bike", "walk"];
    const results = await Promise.allSettled(profiles.map((p) => fetchOsrm(p, from, to, signal)));

    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const pick = (i: number, mode: TravelMode): RouteInfo => {
        const r = results[i];
        return r.status === "fulfilled" ? r.value : estimateRoute(from, to, mode);
    };

    const car = pick(0, "car");
    const motorcycle: RouteInfo = car.estimated
        ? estimateRoute(from, to, "motorcycle")
        : { ...car, duration: car.duration * MOTORCYCLE_DURATION_FACTOR };

    return { car, motorcycle, bike: pick(1, "bike"), walk: pick(2, "walk") };
}

export function formatDistance(meters: number): string {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(meters < 10000 ? 1 : 0)} km`;
}

export function formatDuration(seconds: number): string {
    const totalMin = Math.max(1, Math.round(seconds / 60));
    if (totalMin < 60) return `${totalMin} min`;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return m ? `${h} hr ${m} min` : `${h} hr`;
}
