import { useState } from "react";
import { X, Mail, Lock, Eye, EyeOff, User, Footprints, Store } from "lucide-react";
import type { AuthMode } from "./types";

interface AuthPanelProps {
    onClose: () => void;
    onGuest: () => void;
    onAuth: () => void;
}

type UserType = "customer" | "store";
type View = "welcome" | "form";

export function AuthPanel({ onClose, onGuest, onAuth }: AuthPanelProps) {
    const [view, setView] = useState<View>("welcome");
    const [mode, setMode] = useState<AuthMode>("signin");
    const [userType, setUserType] = useState<UserType>("customer");
    const [showPassword, setShowPassword] = useState(false);
    const isSignIn = mode === "signin";

    const goToForm = (type: UserType) => {
        setUserType(type);
        setMode("signin");
        setView("form");
    };

    return (
        <div
            style={{ zIndex: 1100 }}
            className="absolute inset-0 flex justify-end bg-black/30"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex h-full w-full max-w-sm flex-col bg-white px-8 py-8 shadow-2xl text-left [word-spacing:normal]"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161A23]">
                            <Footprints size={15} className="text-white" />
                        </div>
                        <span className="text-sm font-semibold text-[#161A23]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            ShopScout
                        </span>
                    </div>
                    <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#5B6472]"><X size={18} /></button>
                </div>

                {view === "welcome" ? (
                    <div className="flex flex-1 flex-col">
                        <h1 className="mt-8 text-2xl font-semibold text-[#161A23]">
                            Welcome to ShopScout
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-[#5B6472]">
                            Find, compare, and save shops in seconds.
                        </p>

                        <div className="mt-8 flex flex-col gap-3">
                            <button
                                onClick={onGuest}
                                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#D7DCE3] py-2.5 text-sm font-medium text-[#5B6472] hover:bg-[#F7F8FA]"
                            >
                                Continue as Guest
                            </button>
                            <p className="text-center text-[11px] text-[#9CA3AF]">
                                Guests can share results, but can't save shops, leave feedback, or keep search history.
                            </p>
                        </div>

                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-[#E4E7EC]" />
                            <span className="text-xs text-[#9CA3AF]">OR</span>
                            <div className="h-px flex-1 bg-[#E4E7EC]" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => goToForm("customer")}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E2542D] py-2.5 text-sm font-medium text-white hover:bg-[#c4471f]"
                            >
                                <User size={16} />
                                Sign in as Customer
                            </button>
                            <button
                                onClick={() => goToForm("store")}
                                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#D7DCE3] py-2.5 text-sm font-medium text-[#161A23] hover:bg-[#F7F8FA]"
                            >
                                <Store size={16} />
                                Sign in as Store Owner
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={() => setView("welcome")}
                            className="mt-6 self-start text-xs font-medium text-[#5B6472] hover:text-[#161A23]"
                        >
                            &larr; Back
                        </button>

                        <div className="mt-4 flex rounded-lg bg-[#F1F2F4] p-1">
                            {(["signin", "signup"] as AuthMode[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === m ? "bg-white text-[#161A23] shadow-sm" : "text-[#8B8F98]"}`}
                                >
                                    {m === "signin" ? "Sign in" : "Sign up"}
                                </button>
                            ))}
                        </div>

                        <h1 className="mt-8 text-2xl font-semibold text-[#161A23]">
                            {isSignIn ? "Welcome back" : "Create your account"}
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-[#5B6472]">
                            {userType === "customer"
                                ? isSignIn
                                    ? "Save shops and pick up your search history."
                                    : "Get a saved list and search history that follows you."
                                : isSignIn
                                    ? "Manage your store profile and offers."
                                    : "Set up your store profile to start listing offers."}
                        </p>

                        <form onSubmit={(e) => { e.preventDefault(); onAuth(); }} className="mt-6 space-y-4">
                            {!isSignIn && (
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
                                    <input
                                        type="text"
                                        placeholder={userType === "customer" ? "Full name" : "Store name"}
                                        className="w-full rounded-lg border border-[#D7DCE3] py-2.5 pl-9 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E2542D]"
                                    />
                                </div>
                            )}
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
                                <input type="email" placeholder="Email" className="w-full rounded-lg border border-[#D7DCE3] py-2.5 pl-9 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E2542D]" />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full rounded-lg border border-[#D7DCE3] py-2.5 pl-9 pr-9 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E2542D]"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <button type="submit" className="w-full rounded-lg bg-[#E2542D] py-2.5 text-sm font-medium text-white hover:bg-[#c4471f]">
                                {isSignIn ? "Sign in" : "Create account"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}