import type { Product } from "./types";

export const isProductOutOfStock = (p: Pick<Product, "stock" | "outOfStock">) =>
    p.outOfStock || p.stock === 0;

export const isProductLowStock = (p: Pick<Product, "stock" | "outOfStock">) =>
    !isProductOutOfStock(p) && p.stock > 0 && p.stock <= 5;