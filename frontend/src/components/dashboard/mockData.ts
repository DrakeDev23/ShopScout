import type { Product, SearchTrendPoint, StoreProfile, TopTerm } from "./types";

export const initialProducts: Product[] = [
    { id: "p1", name: "Trail Runner Sneaker", category: "Footwear", price: 89.0, stock: 14, outOfStock: false },
    { id: "p2", name: "Canvas Tote Bag", category: "Accessories", price: 24.5, stock: 0, outOfStock: true },
    { id: "p3", name: "Wool Blend Beanie", category: "Accessories", price: 18.0, stock: 32, outOfStock: false },
    { id: "p4", name: "Insulated Water Bottle", category: "Outdoor", price: 21.0, stock: 6, outOfStock: false },
    { id: "p5", name: "Lightweight Windbreaker", category: "Apparel", price: 64.0, stock: 9, outOfStock: false },
];

export const initialProfile: StoreProfile = {
    name: "Northbound Supply Co.",
    category: "Outdoor & Apparel",
    description: "Everyday gear for people who'd rather be outside. Family-run since 2014.",
    address: "412 Alder St, Portland, OR",
    phone: "(503) 555-0142",
    email: "hello@northboundsupply.com",
    hours: "Mon–Sat, 10am–7pm",
};

export const searchTrend: SearchTrendPoint[] = [
    { day: "Mon", searches: 42 },
    { day: "Tue", searches: 58 },
    { day: "Wed", searches: 51 },
    { day: "Thu", searches: 73 },
    { day: "Fri", searches: 89 },
    { day: "Sat", searches: 121 },
    { day: "Sun", searches: 97 },
];

export const topTerms: TopTerm[] = [
    { term: "windbreaker", count: 134 },
    { term: "trail sneaker", count: 98 },
    { term: "wool beanie", count: 71 },
    { term: "water bottle", count: 46 },
    { term: "tote bag", count: 29 },
];

export const TOTAL_VIEWS = 2847;