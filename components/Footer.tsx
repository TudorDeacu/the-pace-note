"use client";

import Link from "next/link";
// import LanguageToggle from "./LanguageToggle";
import T from "./T";

export default function Footer() {
    return (
        <footer className="bg-black text-white py-12 border-t border-zinc-900">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-xl font-bold uppercase tracking-tighter">The Pace Note</span>
                        <p className="text-zinc-500 text-sm mt-2">Orange Tainted Dreams.</p>
                    </div>
                    <div className="flex flex-col gap-6 items-center md:items-start">
                        <div className="flex gap-6 text-sm text-zinc-400 justify-center">
                            <Link href="/about" className="hover:text-red-600 transition-colors uppercase tracking-widest center"><T>Despre Noi</T></Link>
                            <Link href="/newsletter" className="hover:text-red-600 transition-colors uppercase tracking-widest center"><T>Newsletter</T></Link>
                            <Link href="/contact" className="hover:text-red-600 transition-colors uppercase tracking-widest center"><T>Contact</T></Link>
                            <Link href="/terms" className="hover:text-red-600 transition-colors uppercase tracking-widest center"><T>Terms & Conditions</T></Link>
                        </div>
                        <div className="flex gap-6 text-sm text-zinc-400 justify-center">
                            {/* Social placeholders or real links if provided */}
                            <Link href="https://www.instagram.com/thepacenote/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors uppercase tracking-widest center">Instagram</Link>
                            <Link href="https://www.facebook.com/profile.php?id=61583479544402" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors uppercase tracking-widest center">Facebook</Link>
                            <Link href="https://www.youtube.com/channel/UC1hSXkxGPGsaXFuNtKLIjvA" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors uppercase tracking-widest center">YouTube</Link>
                        </div>
                        {/* 
                        <div className="flex justify-center md:justify-start w-full">
                            <LanguageToggle />
                        </div>
                        */}
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-zinc-900 text-center text-xs text-zinc-600">
                    &copy; {new Date().getFullYear()} The Pace Note. <T>Toate drepturile rezervate.</T>
                </div>
            </div>
        </footer >
    );
}
