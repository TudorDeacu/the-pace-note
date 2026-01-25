"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl uppercase">{t.about.title}</h2>
                        <p className="mt-6 text-lg leading-8 text-zinc-300">
                            {t.about.p1}
                        </p>
                        <p className="mt-6 text-lg leading-8 text-zinc-300">
                            {t.about.p2}
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
