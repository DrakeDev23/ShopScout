export interface Shop {
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

export type AuthState = "guest" | "user" | null;
export type AuthMode = "signin" | "signup";

export type LatLng = [number, number];