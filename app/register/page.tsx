"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";
import { useTranslationContext } from "@/context/TranslationContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Register() {
    const { t } = useTranslationContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signup, signInWithGoogle } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError(t("Parolele nu corespund"));
            return;
        }

        setLoading(true);

        const result = await signup(email, password, firstName, lastName, username);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            alert(t("Înregistrare cu succes! Te rugăm să îți verifici emailul pentru a confirma contul."));
            router.push("/login");
        }
    };

    const handleSocialSignup = async (provider: 'google') => {
        setLoading(true);
        setError("");
        let result;
        if (provider === 'google') result = await signInWithGoogle();

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center mt-32 md:mt-40 px-4 sm:px-6 pb-12">
                <div className="w-full max-w-5xl bg-zinc-900/50 p-6 md:p-8 rounded-lg border border-zinc-800">
                    <h1 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest text-center"><T>Înregistrare</T></h1>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded mb-4 text-sm text-center">
                            <T>{error}</T>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Side: Register Form */}
                        <div className="flex-[2]">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1"><T>Nume</T></label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1"><T>Prenume</T></label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1"><T>Nume utilizator</T></label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors"
                                        required
                                    />
                                </div>

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
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1"><T>Confirmă Parola</T></label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-600 text-white font-bold uppercase tracking-widest py-3 rounded hover:bg-red-500 transition-colors disabled:opacity-50 mt-2"
                                >
                                    {loading ? <T>Se înregistrează...</T> : <T>Înregistrare</T>}
                                </button>
                            </form>
                        </div>

                        {/* Separator */}
                        <div className="flex flex-row md:flex-col items-center justify-center">
                            <div className="flex-grow border-t md:border-t-0 md:border-l border-zinc-800 h-0 md:h-full w-full md:w-0"></div>
                            <span className="flex-shrink-0 mx-4 md:mx-0 md:my-4 text-zinc-500 text-sm"><T>sau</T></span>
                            <div className="flex-grow border-t md:border-t-0 md:border-l border-zinc-800 h-0 md:h-full w-full md:w-0"></div>
                        </div>

                        {/* Right Side: Social Login */}
                        <div className="flex-1 flex flex-col justify-center space-y-3">
                            <button
                                type="button"
                                onClick={() => handleSocialSignup('google')}
                                disabled={loading}
                                className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {/* Google Icon SVG */}
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-zinc-500 text-sm">
                        Ai deja un cont?{" "}
                        <Link href="/login" className="text-white hover:text-red-500 transition-colors font-semibold">
                            Loghează-te
                        </Link>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
