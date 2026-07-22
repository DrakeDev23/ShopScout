export type Tab = "profile" | "products" | "stats";

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    outOfStock: boolean;
}

export interface StoreProfile {
    name: string;
    category: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
}

export interface SearchTrendPoint {
    day: string;
    searches: number;
}

export interface TopTerm {
    term: string;
    count: number;
}