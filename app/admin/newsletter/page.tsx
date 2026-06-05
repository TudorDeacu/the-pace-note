"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import T from "@/components/T";
import toast from "react-hot-toast";
import { broadcastNewsletter } from "./actions";

export default function AdminNewsletter() {
    const [subscribersCount, setSubscribersCount] = useState(0);
    const [loadingStats, setLoadingStats] = useState(true);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function fetchSubscribersCount() {
            const { count } = await supabase
                .from('newsletter_subscribers')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'subscribed');
            
            if (count !== null) setSubscribersCount(count);
            setLoadingStats(false);
        }
        fetchSubscribersCount();
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !message) {
            toast.error("Completează subiectul și mesajul!");
            return;
        }

        if (!confirm(`Ești sigur că vrei să trimiți acest mail către ${subscribersCount} abonați?`)) {
            return;
        }

        setIsSending(true);
        const toastId = toast.loading("Se trimite newsletter-ul...");

        // We convert basic line breaks to <br/> for HTML rendering
        const formattedMessage = message.replace(/\n/g, "<br/>");

        const result = await broadcastNewsletter(subject, formattedMessage);

        if (result.error) {
            toast.error(result.error, { id: toastId });
        } else {
            toast.success(`Succes! Au fost trimise ${result.count} email-uri.`, { id: toastId });
            setSubject("");
            setMessage("");
        }

        setIsSending(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold uppercase tracking-tighter mb-8 text-white"><T>Newsletter</T></h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                    <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider"><T>Compune Mesaj</T></h2>
                    <form onSubmit={handleSend} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2 uppercase tracking-wide"><T>Subiect</T></label>
                            <input
                                type="text"
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Subiectul email-ului..."
                                className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wide"><T>Conținut</T></label>
                                <span className="text-xs text-zinc-500"><T>Sfat: Poți folosi</T> <code className="bg-black px-1 rounded">[Nume]</code> <T>pentru a personaliza.</T></span>
                            </div>
                            <textarea
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={10}
                                placeholder="Salut [Nume],&#10;&#10;Avem noutăți..."
                                className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500 font-mono text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSending || subscribersCount === 0}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-widest px-6 py-3 rounded transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {isSending ? <T>Se trimite...</T> : <T>Trimite către toți abonații</T>}
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4"><T>Audiență</T></h2>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">
                                {loadingStats ? "..." : subscribersCount}
                            </span>
                            <span className="text-zinc-500 uppercase text-xs tracking-wider"><T>Abonați Activi</T></span>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg">
                        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4"><T>Cum funcționează?</T></h2>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Când trimiți un newsletter, sistemul va trimite câte un email individual către fiecare abonat din baza de date. 
                            Fiecare email va avea design-ul "The Pace Note" automat integrat.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
