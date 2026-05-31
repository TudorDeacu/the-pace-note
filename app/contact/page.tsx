"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";
import { useState } from "react";
import { sendContactEmail } from "./actions";

export default function Contact() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("submitting");

        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const subject = formData.get("subject") as string;
        const message = formData.get("message") as string;

        try {
            const result = await sendContactEmail(name, email, subject, message);
            if (result.success) {
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
                            <div className="mt-6 flex gap-6 text-zinc-400">
                                <a href="https://www.instagram.com/thepacenote/" target="_blank" rel="noopener noreferrer" className="hover:text-[#e9482f] transition-colors" title="Instagram">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                    </svg>
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=61583479544402" target="_blank" rel="noopener noreferrer" className="hover:text-[#e9482f] transition-colors" title="Facebook">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z" />
                                    </svg>
                                </a>
                                <a href="https://www.youtube.com/channel/UC1hSXkxGPGsaXFuNtKLIjvA" target="_blank" rel="noopener noreferrer" className="hover:text-[#e9482f] transition-colors" title="YouTube">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                                <a href="https://discord.gg/w3eTEN8JvS" target="_blank" rel="noopener noreferrer" className="hover:text-[#e9482f] transition-colors" title="Discord">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 01-1.873-.894.077.077 0 01-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 01.077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 01.078.009c.12.099.246.195.373.289a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.955 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                                    </svg>
                                </a>
                            </div>
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
