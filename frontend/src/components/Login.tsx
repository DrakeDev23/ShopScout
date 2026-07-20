import { useState } from "react";
import { Eye, EyeOff, Mail, User, Lock, ShoppingBag } from "lucide-react";

export default function Login() {
    const [mode, setMode] = useState("signin");
    const [showPassword, setShowPassword] = useState(false);

    const isSignIn = mode === "signin";

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-white">
            <div className="relative flex flex-col justify-between md:justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 px-6 py-10 md:flex-1 md:p-14">
                <div className="flex items-center gap-2 text-white">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                        <ShoppingBag size={18} />
                    </div>
                    <span className="text-base font-medium">ShopScout</span>
                </div>

                <div className="hidden md:block max-w-md mt-8">
                    <p className="text-2xl font-medium text-white leading-snug">
                        Find what you need, without the hassle.
                    </p>
                    <p className="mt-3 text-purple-100 leading-normal">
                        Discover products, explore stores, and save time with everything in one place.
                    </p>
                </div>

                <p className="hidden md:block text-purple-200 text-sm">
                    Trusted by shoppers who value their time.
                </p>
            </div>

            <div className="flex flex-1 items-center justify-center px-6 py-10 md:p-14">
                <div className="w-full max-w-sm">
                    <div className="flex mb-6 rounded-lg bg-gray-100 p-1">
                        <button
                            onClick={() => setMode("signin")}
                            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                                isSignIn
                                    ? "bg-white text-purple-700 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Sign in
                        </button>
                        <button
                            onClick={() => setMode("signup")}
                            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                                !isSignIn
                                    ? "bg-white text-purple-700 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Sign up
                        </button>
                    </div>

                    <h1 className="text-2xl font-semibold text-gray-900">
                        {isSignIn ? "Welcome back" : "Create your account"}
                    </h1>
                    <p className="mt-1 mb-5 text-sm text-gray-500">
                        {isSignIn
                            ? "Sign in to keep tracking the best deals."
                            : "It only takes a minute to get started."}
                    </p>

                    <form className="space-y-3">
                        {!isSignIn && (
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="First name"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        {!isSignIn && (
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                placeholder={isSignIn ? "Email or username" : "Email"}
                                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
                        >
                            {isSignIn ? "Login" : "Create account"}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Mail size={18} />
                        Connect with email
                    </button>
                </div>
            </div>
        </div>
    );
}