import type { Shop, LatLng } from "./types";

export const SHOPS: Shop[] = [
    {
        id: 1, name: "Shoe Salon – SM Cebu", brand: "Nike · Adidas",
        lat: 10.3110, lng: 123.9180, price: "$$", rating: 4.6,
        distance: "0.4 km", stock: "Air Max 90 in stock",
        address: "SM City Cebu, North Reclamation, Cebu City"
    },
    {
        id: 2, name: "Toby's Sports – Ayala", brand: "New Balance · ASICS",
        lat: 10.3189, lng: 123.9050, price: "$$$", rating: 4.8,
        distance: "0.7 km", stock: "Fresh Foam 1080 in stock",
        address: "Ayala Center Cebu, Cebu Business Park"
    },
    {
        id: 3, name: "Olympic Village – Carbon", brand: "Puma · Reebok",
        lat: 10.2958, lng: 123.9012, price: "$", rating: 4.2,
        distance: "1.1 km", stock: "RS-X in stock",
        address: "Carbon Market Area, Cebu City"
    },
    {
        id: 4, name: "ROX – Fuente Osmeña", brand: "Hoka · Salomon",
        lat: 10.3055, lng: 123.8938, price: "$$$", rating: 4.7,
        distance: "1.4 km", stock: "Speedgoat 5 in stock",
        address: "Fuente Osmeña Circle, Cebu City"
    },
    {
        id: 5, name: "Landmark Shoes – IT Park", brand: "Vans · Converse",
        lat: 10.3224, lng: 123.9046, price: "$$", rating: 4.3,
        distance: "1.8 km", stock: "Old Skool in stock",
        address: "Cebu IT Park, Apas, Cebu City"
    },
    {
        id: 6, name: "Vincci – Robinsons Galleria", brand: "Steve Madden · Skechers",
        lat: 10.3074, lng: 123.8892, price: "$$", rating: 4.0,
        distance: "2.1 km", stock: "D'Lites in stock",
        address: "Robinsons Galleria, General Maxilom, Cebu City"
    },
];

export const CEBU_CENTER: LatLng = [10.3157, 123.8854];