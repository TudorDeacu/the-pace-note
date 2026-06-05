"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const { resetPasswordForEmail } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const result = await resetPasswordForEmail(email);

            if (result.error) {
                setErrorMessage(result.error);
                setStatus("error");
            } else {
                setStatus("success");
            }
        } catch (err: any) {
            console.error("Forgot password form submit error:", err);
            setErrorMessage(err?.message || "A apărut o eroare neașteptată. Te rugăm să încerci din nou.");
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center mt-32 md:mt-40 px-4 sm:px-6 pb-12">
                <div className="w-full max-w-md bg-zinc-900/50 p-6 md:p-8 rounded-lg border border-zinc-800">
                    <Link href="/login" className="inline-flex items-center text-sm font-semibold text-zinc-400 hover:text-red-500 transition-colors uppercase tracking-widest mb-6">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        <T>Înapoi la Logare</T>
                    </Link>

                    <h1 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest"><T>Resetare parolă</T></h1>

                    {status === "success" ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 uppercase"><T>Email trimis!</T></h3>
                            <p className="text-zinc-400 text-sm mt-4">
                                <T>Dacă adresa introdusă este asociată unui cont, vei primi în curând un email cu instrucțiunile pentru resetarea parolei.</T>
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <p className="text-sm text-zinc-400 mb-6">
                                <T>Introdu adresa de email asociată contului tău, iar noi îți vom trimite un link pentru a-ți alege o nouă parolă.</T>
                            </p>

                            {status === "error" && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded mb-4 text-sm">
                                    <T>{errorMessage}</T>
                                </div>
                            )}

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

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full bg-red-600 text-white font-bold uppercase tracking-widest py-3 rounded hover:bg-red-500 transition-colors disabled:opacity-50 mt-4"
                            >
                                {status === "loading" ? <T>Se trimite...</T> : <T>Trimite link</T>}
                            </button>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
