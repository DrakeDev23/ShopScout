import type { ReactNode } from "react";

interface NavItemProps {
    icon: ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
    badge?: number;
}

export function NavItem({ icon, label, active, onClick, badge }: NavItemProps) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-[#FDEEEA] text-[#E2542D]" : "text-[#5B6472] hover:bg-[#F7F8FA]"
            }`}
        >
            <span className="flex items-center gap-2.5">
                {icon}
                {label}
            </span>
            {!!badge && (
                <span className="rounded-full bg-[#E2542D] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {badge}
                </span>
            )}
        </button>
    );
}