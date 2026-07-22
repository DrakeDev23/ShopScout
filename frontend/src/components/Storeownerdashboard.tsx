import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BarChart3, Footprints, Package, Store } from "lucide-react";
import { NavItem } from "./dashboard/NavItems";
import { ProductModal } from "./dashboard/ProductModal";
import { ProductsTab } from "./dashboard/ProductsTab";
import { ProfileTab } from "./dashboard/ProfileTab";
import { StatsTab } from "./dashboard/StatsTab";
import {
    initialProducts,
    initialProfile,
    searchTrend,
    topTerms,
    TOTAL_VIEWS,
} from "./dashboard/mockData";
import type { Product, StoreProfile, Tab } from "./dashboard/types";
import { isProductLowStock, isProductOutOfStock } from "./dashboard/utils";

export default function StoreOwnerDashboard() {
    const [tab, setTab] = useState<Tab>("products");
    const [profile, setProfile] = useState<StoreProfile>(initialProfile);
    const [draftProfile, setDraftProfile] = useState<StoreProfile>(initialProfile);
    const [profileSaved, setProfileSaved] = useState(false);

    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [editing, setEditing] = useState<Product | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

    const totalSearchAppearances = searchTrend.reduce((a, b) => a + b.searches, 0);
    const lowStockCount = products.filter(isProductLowStock).length;
    const outOfStockCount = products.filter(isProductOutOfStock).length;

    const maxTermCount = useMemo(
        () => Math.max(1, ...topTerms.map((t) => t.count)),
        []
    );

    useEffect(() => {
        if (!profileSaved) return;
        const id = window.setTimeout(() => setProfileSaved(false), 2000);
        return () => window.clearTimeout(id);
    }, [profileSaved]);

    const openNewProduct = () => {
        setEditing({ id: "", name: "", category: "", price: 0, stock: 0, outOfStock: false });
        setIsNew(true);
    };

    const openEditProduct = (p: Product) => {
        setEditing({ ...p });
        setIsNew(false);
    };

    const saveProduct = () => {
        if (!editing) return;

        const normalized: Product = {
            ...editing,
            stock: Math.max(0, editing.stock),
            price: Math.max(0, editing.price),
            outOfStock: editing.outOfStock || editing.stock === 0,
        };

        if (isNew) {
            setProducts((prev) => [...prev, { ...normalized, id: `p${Date.now()}` }]);
        } else {
            setProducts((prev) =>
                prev.map((p) => (p.id === normalized.id ? normalized : p))
            );
        }

        setEditing(null);
    };

    const deleteProduct = () => {
        if (!confirmDelete) return;
        setProducts((prev) => prev.filter((p) => p.id !== confirmDelete.id));
        setConfirmDelete(null);
    };

    const adjustStock = (id: string, delta: number) => {
        setProducts((prev) =>
            prev.map((p) => {
                if (p.id !== id) return p;
                const stock = Math.max(0, p.stock + delta);
                return { ...p, stock, outOfStock: stock === 0 };
            })
        );
    };

    const setStockValue = (id: string, value: number) => {
        setProducts((prev) =>
            prev.map((p) => {
                if (p.id !== id) return p;
                const stock = Math.max(0, value);
                return { ...p, stock, outOfStock: stock === 0 };
            })
        );
    };

    const setPrice = (id: string, value: number) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, price: Math.max(0, value) } : p))
        );
    };

    const toggleOutOfStock = (id: string) => {
        setProducts((prev) =>
            prev.map((p) => {
                if (p.id !== id) return p;
                const outOfStock = !isProductOutOfStock(p);
                return { ...p, outOfStock, stock: outOfStock ? 0 : p.stock };
            })
        );
    };

    const saveProfile = () => {
        setProfile(draftProfile);
        setProfileSaved(true);
    };

    return (
        <div className="flex h-full min-h-[640px] w-full bg-[#F7F8FA] text-[#161A23] [word-spacing:normal]">
            <aside className="flex w-60 shrink-0 flex-col border-r border-[#E4E7EC] bg-white px-4 py-6">
                <div className="flex items-center gap-2 px-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161A23]">
                        <Footprints size={15} className="text-white" />
                    </div>
                    <span
                        className="text-sm font-semibold"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        ShopScout
                    </span>
                </div>
                <p className="mt-1 px-2 text-[11px] text-[#9CA3AF]">Store dashboard</p>

                <nav className="mt-8 flex flex-col gap-1">
                    <NavItem
                        icon={<Store size={16} />}
                        label="Store profile"
                        active={tab === "profile"}
                        onClick={() => setTab("profile")}
                    />
                    <NavItem
                        icon={<Package size={16} />}
                        label="Products"
                        active={tab === "products"}
                        onClick={() => setTab("products")}
                        badge={outOfStockCount || undefined}
                    />
                    <NavItem
                        icon={<BarChart3 size={16} />}
                        label="Search statistics"
                        active={tab === "stats"}
                        onClick={() => setTab("stats")}
                    />
                </nav>

                <div className="mt-auto rounded-lg bg-[#F1F2F4] p-3">
                    <p className="text-xs font-medium text-[#161A23]">{profile.name}</p>
                    <p className="mt-0.5 text-[11px] text-[#9CA3AF]">{profile.category}</p>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto px-10 py-8">
                {tab === "profile" && (
                    <ProfileTab
                        draft={draftProfile}
                        setDraft={setDraftProfile}
                        onSave={saveProfile}
                        saved={profileSaved}
                    />
                )}

                {tab === "products" && (
                    <ProductsTab
                        products={products}
                        lowStockCount={lowStockCount}
                        outOfStockCount={outOfStockCount}
                        onAdd={openNewProduct}
                        onEdit={openEditProduct}
                        onDelete={setConfirmDelete}
                        onAdjustStock={adjustStock}
                        onSetStock={setStockValue}
                        onSetPrice={setPrice}
                        onToggleOutOfStock={toggleOutOfStock}
                    />
                )}

                {tab === "stats" && (
                    <StatsTab
                        totalViews={TOTAL_VIEWS}
                        totalSearchAppearances={totalSearchAppearances}
                        searchTrend={searchTrend}
                        topTerms={topTerms}
                        maxTermCount={maxTermCount}
                    />
                )}
            </main>

            {editing && (
                <ProductModal
                    product={editing}
                    isNew={isNew}
                    onChange={setEditing}
                    onCancel={() => setEditing(null)}
                    onSave={saveProduct}
                />
            )}

            {confirmDelete && (
                <div
                    className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/30"
                    onClick={() => setConfirmDelete(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDEEEA]">
                            <AlertTriangle size={18} className="text-[#E2542D]" />
                        </div>
                        <h3 className="mt-4 text-base font-semibold">
                            Delete {confirmDelete.name}?
                        </h3>
                        <p className="mt-1.5 text-sm text-[#5B6472]">
                            This removes the product from your store listing. This can't be undone.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 rounded-lg border border-[#D7DCE3] py-2.5 text-sm font-medium text-[#5B6472] hover:bg-[#F7F8FA]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteProduct}
                                className="flex-1 rounded-lg bg-[#E2542D] py-2.5 text-sm font-medium text-white hover:bg-[#c4471f]"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}