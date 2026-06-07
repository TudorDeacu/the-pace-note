"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import GoogleIcon from "@/components/GoogleIcon";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login, signInWithGoogle } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await login(email, password, rememberMe);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.refresh();
            router.push("/account"); // Redirect to account page
        }
    };

    const handleSocialLogin = async (provider: 'google') => {
        setLoading(true);
        setError("");
        let result;
        if (provider === 'google') result = await signInWithGoogle();

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
        // Redirect is handled by Supabase OAuth
    };

    return (
        <div className="relative min-h-screen bg-black">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-35 grayscale"
                    src="https://zlcqqmcvbhixcmeapofz.supabase.co/storage/v1/object/public/other/home_gif.mp4"
                />
            </div>
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex flex-col items-center mt-32 md:mt-40 px-4 sm:px-6 pb-12">
                    <div className="w-full max-w-md bg-black p-6 md:p-8 rounded-lg border border-zinc-800">
                        <h1 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest text-center"><T>Logare</T></h1>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded mb-4 text-sm">
                                <T>{error}</T>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1"><T>Email</T></label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1"><T>Parolă</T></label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                                <div className="mt-2 flex justify-end">
                                    <Link href="/forgot-password" className="text-sm font-semibold text-zinc-400 hover:text-red-500 transition-colors">
                                        <T>Ai uitat parola?</T>
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-600"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400">
                                    <T>Păstrează-mă logat</T>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 text-white font-bold uppercase tracking-widest py-3 rounded hover:bg-red-500 transition-colors disabled:opacity-50 mt-2"
                            >
                                {loading ? <T>Se autentifică...</T> : <T>Autentificare</T>}
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-zinc-800" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                                    <span className="bg-black px-3 text-zinc-500"><T>sau</T></span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('google')}
                                disabled={loading}
                                className="mt-6 w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 rounded hover:bg-zinc-200 transition-colors disabled:opacity-50"
                            >
                                <GoogleIcon />
                                <T>Continuă cu Google</T>
                            </button>
                        </div>

                        <p className="mt-6 text-center text-zinc-500 text-sm">
                            <T>Nu ai cont?</T>{" "}
                            <Link href="/register" className="text-white hover:text-red-500 transition-colors font-semibold">
                                <T>Înregistrează-te</T>
                            </Link>
                        </p>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
