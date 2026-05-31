"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";
import { useTranslationContext } from "@/context/TranslationContext";
import { unsubscribeSubscriber, resubscribeSubscriber } from "../actions";
import toast from "react-hot-toast";

function UnsubscribeContent() {
    const { t } = useTranslationContext();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "unsubscribed" | "subscribed" | "error">("loading");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setErrorMsg(t("Token-ul de dezabonare lipsește sau este invalid."));
            return;
        }

        async function performUnsubscribe() {
            const res = await unsubscribeSubscriber(token!);
            if (res.error) {
                setStatus("error");
                setErrorMsg(res.error);
            } else {
                setStatus("unsubscribed");
                toast.success(t("Te-ai dezabonat cu succes."));
            }
        }

        performUnsubscribe();
    }, [token, t]);

    const handleResubscribe = async () => {
        if (!token) return;
        setStatus("loading");
        const res = await resubscribeSubscriber(token);
        if (res.error) {
            setStatus("error");
            setErrorMsg(res.error);
            toast.error(res.error);
        } else {
            setStatus("subscribed");
            toast.success(t("Abonamentul a fost reactivat!"));
        }
    };

    return (
        <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 p-8 rounded-lg text-center shadow-xl backdrop-blur-md">
            {status === "loading" && (
                <div className="space-y-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-r-2 border-red-600 border-b-2"></div>
                    <p className="text-zinc-400 text-sm"><T>Se procesează solicitarea ta...</T></p>
                </div>
            )}

            {status === "unsubscribed" && (
                <div className="space-y-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30 text-red-500">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2"><T>Te-ai dezabonat</T></h2>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            <T>Adresa ta de email a fost eliminată din lista de trimitere a newsletter-ului. Nu vei mai primi e-mailuri de la noi.</T>
                        </p>
                    </div>
                    <div className="pt-4 border-t border-zinc-800">
                        <p className="text-xs text-zinc-500 mb-3"><T>Ai dat click din greșeală?</T></p>
                        <button
                            onClick={handleResubscribe}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-widest text-xs px-6 py-2.5 rounded transition-colors cursor-pointer"
                        >
                            <T>Reabonează-te</T>
                        </button>
                    </div>
                </div>
            )}

            {status === "subscribed" && (
                <div className="space-y-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-900/30 text-green-500">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2"><T>Abonament Reactivat</T></h2>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            <T>Te-ai reabonat cu succes! Vei primi în continuare noutățile noastre pe adresa de email.</T>
                        </p>
                    </div>
                    <div className="pt-4 border-t border-zinc-800">
                        <button
                            onClick={() => setStatus("unsubscribed")}
                            className="text-xs text-zinc-500 hover:text-red-500 transition-colors underline cursor-pointer"
                        >
                            <T>Vreau să mă dezabonez din nou</T>
                        </button>
                    </div>
                </div>
            )}

            {status === "error" && (
                <div className="space-y-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30 text-red-500">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2"><T>A apărut o eroare</T></h2>
                        <p className="text-red-400 text-sm">{errorMsg}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <div className="min-h-screen bg-black flex flex-col justify-between">
            <Navbar />
            <main className="flex-grow flex items-center justify-center pt-24 px-6 lg:px-8">
                <Suspense fallback={
                    <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 p-8 rounded-lg text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-r-2 border-red-600 border-b-2"></div>
                    </div>
                }>
                    <UnsubscribeContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
