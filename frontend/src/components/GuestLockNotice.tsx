import { Lock } from "lucide-react";

export function GuestLockNotice({ label, onSignIn }: { label: string; onSignIn: () => void }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-[#D7DCE3] bg-[#F7F8FA] px-3 py-2">
            <span className="flex items-center gap-1.5 text-xs text-[#5B6472]">
                <Lock size={13} /> Sign in to {label}
            </span>
            <button onClick={onSignIn} className="text-xs font-medium text-[#E2542D] hover:underline">
                Sign in
            </button>
        </div>
    );
}