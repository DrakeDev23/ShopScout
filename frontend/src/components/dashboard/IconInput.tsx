import type { ReactNode } from "react";

interface IconInputProps {
    icon: ReactNode;
    label: string;
    value: string;
    onChange: (v: string) => void;
}

export function IconInput({ icon, label, value, onChange }: IconInputProps) {
    return (
        <div>
            <label className="text-xs font-medium text-[#5B6472]">{label}</label>
            <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">{icon}</span>
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-lg border border-[#D7DCE3] py-2.5 pl-9 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E2542D]"
                />
            </div>
        </div>
    );
}