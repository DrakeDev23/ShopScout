import type { ReactNode } from "react";

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string;
    positive?: boolean;
}

export function StatCard({ icon, label, value, positive }: StatCardProps) {
    return (
        <div className="rounded-xl border border-[#E4E7EC] bg-white p-4">
            <div className="flex items-center gap-2 text-[#9CA3AF]">
                {icon}
                <span className="text-xs font-medium">{label}</span>
            </div>
            <p
                className={`mt-2 text-2xl font-semibold ${positive ? "text-[#1F9254]" : "text-[#161A23]"}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                {value}
            </p>
        </div>
    );
}