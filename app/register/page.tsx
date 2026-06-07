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
import toast from "react-hot-toast";
import { sendWelcomeEmailForRegistration } from "@/app/newsletter/actions";
import GoogleIcon from "@/components/GoogleIcon";

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
    const [title, setTitle] = useState("");

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

        const result = await signup(email, password, firstName, lastName, username, title);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            // Trigger welcome email in background
            sendWelcomeEmailForRegistration(email, lastName).catch((err) =>
                console.error("Failed to send welcome email:", err)
            );

            toast.success(t("Înregistrare cu succes! Te rugăm să îți verifici emailul pentru a confirma contul."));
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
                    <div className="w-full max-w-5xl bg-black p-6 md:p-8 rounded-lg border border-zinc-800">
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

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-1"><T>Apelativ</T></label>
                                            <select
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-zinc-900 text-zinc-400">Selectează...</option>
                                                <option value="Domnul" className="bg-zinc-900">Domnul</option>
                                                <option value="Doamna / Domnișoara" className="bg-zinc-900">Doamna / Domnișoara</option>
                                            </select>
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

                            {/* Right Side: Social signup */}
                            <div className="flex-1 flex flex-col justify-center border-t md:border-t-0 md:border-l border-zinc-800 pt-8 md:pt-0 md:pl-8">
                                <p className="text-center text-zinc-400 text-sm mb-4 uppercase tracking-widest"><T>Înregistrare rapidă</T></p>
                                <button
                                    type="button"
                                    onClick={() => handleSocialSignup('google')}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 rounded hover:bg-zinc-200 transition-colors disabled:opacity-50"
                                >
                                    <GoogleIcon />
                                    <T>Continuă cu Google</T>
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
        </div>
    );
}
