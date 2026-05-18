"use client";

import { useState, useEffect } from "react";
import T from "./T";
import Link from "next/link";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted");
        setIsVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem("cookieConsent", "rejected");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pb-safe hidden md:block">
            {/* The wrapper keeps it readable, we give it a max width and center it slightly offset or full width, let's make it a floating banner */}
            <div className="max-w-4xl mx-auto bg-zinc-950/95 backdrop-blur border border-zinc-800 shadow-2xl shadow-black rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-bottom-5 fade-in duration-500">
                <div className="flex-1 text-sm text-zinc-300">
                    <p className="mb-2 font-bold text-white uppercase tracking-widest text-base">
                        <T>Politica de Cookie-uri</T>
                    </p>
                    <p className="leading-relaxed">
                        <T>Folosim cookie-uri pentru a vă îmbunătăți experiența de navigare, a analiza traficul site-ului și a personaliza conținutul. Prin apăsarea butonului "Accept", sunteți de acord cu utilizarea cookie-urilor.</T>{" "}
                        <Link href="/terms" className="text-red-500 hover:text-red-400 underline decoration-red-500/30 underline-offset-2">
                            <T>Află mai multe</T>
                        </Link>.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleReject}
                        className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-zinc-400 border border-zinc-800 hover:bg-zinc-900 hover:text-white rounded transition-colors"
                    >
                        <T>Respinge</T>
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-white bg-red-600 hover:bg-red-500 rounded transition-colors shadow-lg shadow-red-900/20"
                    >
                        <T>Accept Toate</T>
                    </button>
                </div>
            </div>
            {/* Mobile version sticking to bottom entirely */}
            <div className="flex md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 p-4 pb-safe flex-col gap-4 animate-in slide-in-from-bottom-5">
                <div className="text-xs text-zinc-300">
                    <span className="font-bold text-white uppercase block mb-1 tracking-wider"><T>Cookie-uri</T></span>
                    <T>Folosim cookie-uri pentru o experiență mai bună. Află mai multe din </T>
                    <Link href="/terms" className="text-red-500 hover:text-red-400"><T>Politica noastră</T></Link>.
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReject}
                        className="flex-1 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 border border-zinc-800 rounded active:bg-zinc-900"
                    >
                        <T>Respinge</T>
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white bg-red-600 rounded active:bg-red-500"
                    >
                        <T>Accept</T>
                    </button>
                </div>
            </div>
        </div>
    );
}
