"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";
import { useTranslationContext } from "@/context/TranslationContext";

export default function Contact() {
    const { t } = useTranslationContext();

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
                            <p className="text-zinc-300">contact@thepacenote.ro</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-zinc-900/50 p-8 rounded-lg border border-zinc-800">
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold leading-6 text-white uppercase tracking-widest">
                                    <T>Nume</T>
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
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
                                        className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="block w-full rounded-md bg-red-600 px-3.5 py-2.5 text-center text-sm font-bold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 uppercase tracking-widest transition-all"
                            >
                                <T>Trimite mesaj</T>
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
