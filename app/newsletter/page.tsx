"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function Newsletter() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl uppercase">{t.newsletter.title}</h2>
                        <p className="mt-2 text-lg leading-8 text-zinc-400">
                            {t.newsletter.description}
                        </p>
                    </div>
                    {/* Form placeholder */}
                    <div className="mt-6 flex max-w-md gap-x-4">
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            placeholder={t.newsletter.placeholder}
                            autoComplete="email"
                            className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
                        />
                        <button
                            type="button"
                            className="flex-none rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                            {t.newsletter.button}
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
