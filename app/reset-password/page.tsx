"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const { updatePassword } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setErrorMessage("Parolele nu se potrivesc.");
            setStatus("error");
            return;
        }

        if (password.length < 6) {
            setErrorMessage("Parola trebuie să conțină cel puțin 6 caractere.");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        const result = await updatePassword(password);

        if (result.error) {
            setErrorMessage(result.error);
            setStatus("error");
        } else {
            setStatus("success");
            // Redirect after a short delay
            setTimeout(() => {
                router.push("/account");
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center mt-32 md:mt-40 px-4 sm:px-6 pb-12">
                <div className="w-full max-w-md bg-zinc-900/50 p-6 md:p-8 rounded-lg border border-zinc-800">

                    <h1 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest"><T>Alege o nouă parolă</T></h1>

                    {status === "success" ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 uppercase"><T>Parolă actualizată!</T></h3>
                            <p className="text-zinc-400 text-sm mt-4">
                                <T>Vei fi redirecționat automat către contul tău în câteva secunde...</T>
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <p className="text-sm text-zinc-400 mb-6">
                                <T>Introdu noua ta parolă mai jos pentru a o actualiza.</T>
                            </p>

                            {status === "error" && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded mb-4 text-sm">
                                    <T>{errorMessage}</T>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1"><T>Noua Parolă</T></label>
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
                                <label className="block text-sm font-medium text-zinc-400 mb-1"><T>Confirmă Noua Parolă</T></label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full bg-red-600 text-white font-bold uppercase tracking-widest py-3 rounded hover:bg-red-500 transition-colors disabled:opacity-50 mt-6"
                            >
                                {status === "loading" ? <T>Se actualizează...</T> : <T>Actualizează parola</T>}
                            </button>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
