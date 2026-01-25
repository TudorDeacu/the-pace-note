"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Article {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    created_at: string;
    // excerpt?
}

export default function Blog() {
    const { t } = useLanguage();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchArticles() {
            const { data } = await supabase
                .from('articles')
                .select('*')
                .eq('published', true) // Only published
                .order('created_at', { ascending: false });

            if (data) {
                setArticles(data);
            }
            setLoading(false);
        }
        fetchArticles();
    }, []);

    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl uppercase">{t.blog.title}</h2>
                        <p className="mt-2 text-lg leading-8 text-zinc-400">
                            {t.blog.description}
                        </p>
                    </div>
                    <div className="mt-10 border-t border-zinc-800 pt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {loading ? (
                            <p className="text-zinc-500">Loading articles...</p>
                        ) : articles.length === 0 ? (
                            <p className="text-zinc-500 italic">{t.blog.empty}</p>
                        ) : (
                            articles.map((article) => (
                                <article key={article.id} className="flex flex-col items-start justify-between bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 hover:border-red-900 transition-colors group">
                                    <div className="flex items-center gap-x-4 text-xs">
                                        <time dateTime={article.created_at} className="text-zinc-500">
                                            {new Date(article.created_at).toLocaleDateString()}
                                        </time>
                                    </div>
                                    <div className="group relative">
                                        <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-red-500 transition-colors uppercase tracking-wide">
                                            <Link href={`/blog/${article.slug}`}>
                                                <span className="absolute inset-0" />
                                                {article.title}
                                            </Link>
                                        </h3>
                                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-400">
                                            {/* Excerpt functionality logic if available, else placeholder */}
                                            Click to read more...
                                        </p>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
