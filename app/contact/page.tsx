"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";
import { useState } from "react";

export default function Contact() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("submitting");

        const formData = new FormData(event.currentTarget);
        formData.append("access_key", "6dd4ca17-bea0-4d6a-88f9-1aecd9f99d2c");
        formData.append("subject", `New message from The Pace Note: ${formData.get("subject")}`);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                setStatus("success");
                (event.target as HTMLFormElement).reset();
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="py-24 sm:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl uppercase"><T>Contact</T></h2>
                        <p className="mt-2 text-lg leading-8 text-zinc-400">
                            <T>Ai o întrebare sau vrei să colaborăm? Lăsă-ne un mesaj și îți vom răspunde în cel mai scurt timp.</T>
                        </p>
                        <div className="mt-10 border-t border-zinc-800 pt-10">
                            <p className="text-zinc-300">thepacenote.crew@gmail.com</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-zinc-900/50 p-8 rounded-lg border border-zinc-800">
                        {status === "success" ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center h-full space-y-4">
                                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white uppercase"><T>Mesaj Trimis!</T></h3>
                                <p className="text-zinc-400"><T>Îți mulțumim pentru mesaj. Te vom contacta în curând.</T></p>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="mt-4 text-red-500 hover:text-red-400 font-semibold text-sm uppercase tracking-widest transition-colors"
                                >
                                    <T>Trimite alt mesaj</T>
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={onSubmit}>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold leading-6 text-white uppercase tracking-widest">
                                        <T>Nume</T>
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            required
                                            className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold leading-6 text-white uppercase tracking-widest">
                                        <T>Email</T>
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            required
                                            className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold leading-6 text-white uppercase tracking-widest">
                                        <T>Subiect</T>
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            type="text"
                                            name="subject"
                                            id="subject"
                                            required
                                            className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold leading-6 text-white uppercase tracking-widest">
                                        <T>Mesaj</T>
                                    </label>
                                    <div className="mt-2.5">
                                        <textarea
                                            name="message"
                                            id="message"
                                            rows={4}
                                            required
                                            className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                {status === "error" && (
                                    <p className="text-red-500 text-sm font-bold uppercase tracking-widest text-center">
                                        <T>A apărut o eroare. Vă rugăm să încercați din nou.</T>
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className="block w-full rounded-md bg-red-600 px-3.5 py-2.5 text-center text-sm font-bold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {status === "submitting" ? <T>Se trimite...</T> : <T>Trimite mesaj</T>}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
