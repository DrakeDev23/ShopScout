import { Minus, Pencil, Plus, Trash2 } from "lucide-react";
import type { Product } from "./types";
import { isProductLowStock, isProductOutOfStock } from "./utils";

interface ProductsTabProps {
    products: Product[];
    lowStockCount: number;
    outOfStockCount: number;
    onAdd: () => void;
    onEdit: (p: Product) => void;
    onDelete: (p: Product) => void;
    onAdjustStock: (id: string, delta: number) => void;
    onSetStock: (id: string, value: number) => void;
    onSetPrice: (id: string, value: number) => void;
    onToggleOutOfStock: (id: string) => void;
}

export function ProductsTab({
    products,
    lowStockCount,
    outOfStockCount,
    onAdd,
    onEdit,
    onDelete,
    onAdjustStock,
    onSetStock,
    onSetPrice,
    onToggleOutOfStock,
}: ProductsTabProps) {
    return (
        <div>
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Products
                    </h1>
                    <p className="mt-1.5 text-sm text-[#5B6472]">
                        {products.length} listed · {lowStockCount} low stock · {outOfStockCount} out of stock
                    </p>
                </div>
                <button onClick={onAdd} className="flex items-center gap-1.5 rounded-lg bg-[#E2542D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#c4471f]">
                    <Plus size={16} />
                    Add product
                </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-[#E4E7EC] bg-white">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[#E4E7EC] text-xs text-[#9CA3AF]">
                            <th className="px-5 py-3 font-medium">Product</th>
                            <th className="px-5 py-3 font-medium">Price</th>
                            <th className="px-5 py-3 font-medium">Stock</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                            <th className="px-5 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#9CA3AF]">
                                    No products yet. Add your first one to appear in shopper searches.
                                </td>
                            </tr>
                        )}
                        {products.map((p) => {
                            const isOut = isProductOutOfStock(p);
                            const isLow = isProductLowStock(p);

                            return (
                                <tr key={p.id} className="border-b border-[#F1F2F4] last:border-0">
                                    <td className="px-5 py-3.5">
                                        <p className="font-medium text-[#161A23]">{p.name}</p>
                                        <p className="text-xs text-[#9CA3AF]">{p.category}</p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1 text-[#5B6472]">
                                            <span>$</span>
                                            <input
                                                type="number"
                                                min={0}
                                                step={0.01}
                                                value={p.price}
                                                onChange={(e) => onSetPrice(p.id, parseFloat(e.target.value) || 0)}
                                                className="w-20 rounded-md border border-[#D7DCE3] px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E2542D]"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => onAdjustStock(p.id, -1)} className="flex h-6 w-6 items-center justify-center rounded-md border border-[#D7DCE3] text-[#5B6472] hover:bg-[#F7F8FA]">
                                                <Minus size={12} />
                                            </button>
                                            <input
                                                type="number"
                                                min={0}
                                                value={p.stock}
                                                onChange={(e) => onSetStock(p.id, parseInt(e.target.value, 10) || 0)}
                                                className="w-14 rounded-md border border-[#D7DCE3] px-2 py-1 text-center text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E2542D]"
                                            />
                                            <button onClick={() => onAdjustStock(p.id, 1)} className="flex h-6 w-6 items-center justify-center rounded-md border border-[#D7DCE3] text-[#5B6472] hover:bg-[#F7F8FA]">
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <button
                                            onClick={() => onToggleOutOfStock(p.id)}
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                isOut
                                                    ? "bg-[#FDEEEA] text-[#E2542D]"
                                                    : isLow
                                                      ? "bg-[#FFF4E5] text-[#B5730B]"
                                                      : "bg-[#EAF7EE] text-[#1F9254]"
                                            }`}
                                            title="Toggle out of stock"
                                        >
                                            {isOut ? "Out of stock" : isLow ? "Low stock" : "In stock"}
                                        </button>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button onClick={() => onEdit(p)} className="flex h-7 w-7 items-center justify-center rounded-md text-[#5B6472] hover:bg-[#F1F2F4]">
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={() => onDelete(p)} className="flex h-7 w-7 items-center justify-center rounded-md text-[#5B6472] hover:bg-[#FDEEEA] hover:text-[#E2542D]">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}