import { useState } from "react";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";

export default function Login() {
    const [mode, setMode] = useState("signin");
    const [showPassword, setShowPassword] = useState(false);

    const isSignIn = mode === "signin";

    return (
        <div className="flex w-full h-screen">
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-500 via-purple-600 to-purple-900 p-12">
                <p className="text-white text-lg max-w-md leading-relaxed">
                    Find the items you need without the hassle of searching through countless shops.
                    Discover products, explore stores, and save time with everything in one place.
                </p>
            </div>

            <div className="flex-1 flex items-center justify-center bg-white">
                <div className="w-full max-w-sm">
                    <div className="flex mb-8 border-b border-gray-200">
                        <button
                            onClick={() => setMode("signin")}
                            className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
                                isSignIn
                                    ? "border-purple-600 text-purple-600"
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            Sign in
                        </button>
                        <button
                            onClick={() => setMode("signup")}
                            className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
                                !isSignIn
                                    ? "border-purple-600 text-purple-600"
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            Sign up
                        </button>
                    </div>

                    <h1 className="text-2xl font-semibold mb-6 text-gray-900">
                        {isSignIn ? "Welcome back" : "Create your account"}
                    </h1>

                    <form className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Email or username"
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
                            {isSignIn ? "Login" : "Sign up"}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-6">
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