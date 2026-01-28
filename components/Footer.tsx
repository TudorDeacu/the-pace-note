"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="bg-black text-white py-12 border-t border-zinc-900">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-xl font-bold uppercase tracking-tighter">The Pace Note</span>
                        <p className="text-zinc-500 text-sm mt-2">{t.footer.tagline}</p>
                    </div>
                    <div className="flex flex-col gap-6 items-center md:items-start">
                        <div className="flex gap-6 text-sm text-zinc-400 justify-center">
                            <Link href="/about" className="hover:text-red-600 transition-colors uppercase tracking-widest center">{t.nav.about}</Link>
                            <Link href="/newsletter" className="hover:text-red-600 transition-colors uppercase tracking-widest center">{t.nav.newsletter}</Link>
                            <Link href="/contact" className="hover:text-red-600 transition-colors uppercase tracking-widest center">{t.nav.contact}</Link>
                        </div>
                        <div className="flex gap-6 text-sm text-zinc-400 justify-center">
                            {/* Social placeholders or real links if provided */}
                            <Link href="https://www.instagram.com/thepacenote/" className="hover:text-red-600 transition-colors uppercase tracking-widest center">Instagram</Link>
                            <Link href="https://www.facebook.com/profile.php?id=61583479544402" className="hover:text-red-600 transition-colors uppercase tracking-widest center">Facebook</Link>
                            <Link href="https://www.youtube.com/channel/UC1hSXkxGPGsaXFuNtKLIjvA" className="hover:text-red-600 transition-colors uppercase tracking-widest center">YouTube</Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-zinc-900 text-center text-xs text-zinc-600">
                    &copy; {new Date().getFullYear()} The Pace Note. {t.footer.rights}
                </div>
            </div>
        </footer>
    );
}
