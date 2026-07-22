import { X } from "lucide-react";
import type { Product } from "./types";
import { LabeledInput } from "./LabeledInput";

interface ProductModalProps {
    product: Product;
    isNew: boolean;
    onChange: (p: Product) => void;
    onCancel: () => void;
    onSave: () => void;
}

export function ProductModal({ product, isNew, onChange, onCancel, onSave }: ProductModalProps) {
    const valid = product.name.trim().length > 0;

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/30" onClick={onCancel}>
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">{isNew ? "Add product" : "Edit product"}</h3>
                    <button onClick={onCancel} className="text-[#9CA3AF] hover:text-[#5B6472]">
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-5 space-y-4">
                    <LabeledInput label="Product name" value={product.name} onChange={(v) => onChange({ ...product, name: v })} />
                    <LabeledInput label="Category" value={product.category} onChange={(v) => onChange({ ...product, category: v })} />
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-[#5B6472]">Price</label>
                            <input
                                type="number"
                                min={0}
                                step={0.01}
                                value={product.price}
                                onChange={(e) => onChange({ ...product, price: parseFloat(e.target.value) || 0 })}
                                className="mt-1.5 w-full rounded-lg border border-[#D7DCE3] px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E2542D]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-[#5B6472]">Stock</label>
                            <input
                                type="number"
                                min={0}
                                value={product.stock}
                                onChange={(e) => {
                                    const stock = parseInt(e.target.value, 10) || 0;
                                    onChange({ ...product, stock, outOfStock: stock === 0 });
                                }}
                                className="mt-1.5 w-full rounded-lg border border-[#D7DCE3] px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E2542D]"
                            />
                        </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-[#5B6472]">
                        <input
                            type="checkbox"
                            checked={product.outOfStock}
                            onChange={(e) =>
                                onChange({
                                    ...product,
                                    outOfStock: e.target.checked,
                                    stock: e.target.checked ? 0 : product.stock,
                                })
                            }
                            className="h-4 w-4 rounded border-[#D7DCE3] text-[#E2542D] focus:ring-[#E2542D]"
                        />
                        Mark as out of stock
                    </label>
                </div>

                <div className="mt-6 flex gap-3">
                    <button onClick={onCancel} className="flex-1 rounded-lg border border-[#D7DCE3] py-2.5 text-sm font-medium text-[#5B6472] hover:bg-[#F7F8FA]">
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        disabled={!valid}
                        className="flex-1 rounded-lg bg-[#E2542D] py-2.5 text-sm font-medium text-white hover:bg-[#c4471f] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isNew ? "Add product" : "Save changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}