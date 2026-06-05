"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";
import toast from "react-hot-toast";
import { sendWelcomeEmailForRegistration } from "@/app/newsletter/actions";

export const dynamic = "force-dynamic";

export default function CompleteProfile() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const supabase = createClient();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Prefill first name and last name from Google metadata if available
    // Note: In this project's database schema, firstName represents "Nume" (Surname) and lastName represents "Prenume" (Given Name)
    useEffect(() => {
        if (user) {
            const meta = user.user_metadata;
            if (meta) {
                if (meta.family_name || meta.last_name) {
                    setFirstName(meta.family_name || meta.last_name || "");
                }
                if (meta.given_name || meta.first_name) {
                    setLastName(meta.given_name || meta.first_name || "");
                }
            }
        }
    }, [user]);

    // Protect route - send unauthenticated users back to login page
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);
        setErrorMsg("");

        // Basic validation
        const trimmedUsername = username.trim().toLowerCase();
        if (trimmedUsername.length < 3) {
            setErrorMsg("Numele de utilizator trebuie să aibă cel puțin 3 caractere.");
            setSubmitting(false);
            return;
        }

        try {
            // Upsert the profile to update metadata.
            // Using upsert ensures that even if the db trigger failed previously, the profile row is created.
            const { error } = await supabase
                .from("profiles")
                .upsert({
                    id: user.id,
                    email: user.email,
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    username: trimmedUsername,
                    phone_number: phoneNumber.trim()
                });

            if (error) {
                console.error("Profile complete error:", error);
                // Code 23505 is PostgreSQL unique key violation (username already exists)
                if (error.code === "23505") {
                    setErrorMsg("Acest nume de utilizator este deja utilizat de altcineva.");
                } else {
                    setErrorMsg("A apărut o eroare la salvarea datelor. Te rugăm să încerci din nou.");
                }
                setSubmitting(false);
            } else {
                // Trigger welcome email in background
                if (user.email) {
                    sendWelcomeEmailForRegistration(user.email, lastName.trim()).catch((err) => 
                        console.error("Failed to send welcome email for Google signup:", err)
                    );
                }

                toast.success("Contul tău a fost configurat cu succes!");
                router.refresh();
                router.push("/account");
            }
        } catch (err) {
            console.error("Complete profile exception:", err);
            setErrorMsg("A apărut o eroare neașteptată.");
            setSubmitting(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-center items-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-r-2 border-red-600 border-b-2"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col justify-between">
            <Navbar />
            <main className="flex-1 flex flex-col items-center mt-32 md:mt-40 px-4 sm:px-6 pb-12">
                <div className="w-full max-w-md bg-zinc-900/50 p-6 md:p-8 rounded-lg border border-zinc-800 shadow-xl backdrop-blur-md">
                    <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest text-center">
                        <T>Finalizare Cont</T>
                    </h1>
                    <p className="text-sm text-zinc-400 text-center mb-6 leading-relaxed">
                        <T>Te-ai conectat prin Google. Te rugăm să îți adaugi detaliile personale pentru a-ți finaliza profilul.</T>
                    </p>

                    {errorMsg && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded mb-4 text-sm">
                            {errorMsg}
                        </div>
                    )}

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
                            <label className="block text-sm font-medium text-zinc-400 mb-1">
                                <T>Nume Utilizator</T>
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors lower"
                                placeholder="numeutilizator"
                                required
                            />
                            <p className="text-zinc-500 text-xs mt-1">
                                <T>Va fi vizibil pe profilul tău și în comentarii.</T>
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1"><T>Număr Telefon</T></label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none transition-colors"
                                placeholder="07xx xxx xxx"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-red-600 text-white font-bold uppercase tracking-widest py-3 rounded hover:bg-red-500 transition-colors disabled:opacity-50 mt-4 cursor-pointer"
                        >
                            {submitting ? <T>Se salvează...</T> : <T>Finalizează Contul</T>}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
