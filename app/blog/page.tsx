"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

import blogTrackDay from "../images/blog_track_day.png";
import blogSimRacing from "../images/blog_sim_racing.png";
import blogMaintenance from "../images/blog_maintenance.png";

export interface Article {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    created_at: string;
    excerpt?: string;
    imageUrl?: any; // StaticImageData or string
    image_url?: string;
    is_demo?: boolean;
}

const DEMO_ARTICLES: Article[] = [
    {
        id: "demo-1",
        title: "Mastering the Track: A Beginner's Guide",
        slug: "mastering-the-track",
        published: true,
        created_at: new Date().toISOString(),
        excerpt: "Learn the fundamentals of high-performance driving, from racing lines to braking points.",
        imageUrl: blogTrackDay,
    },
    {
        id: "demo-2",
        title: "The Ultimate Sim Racing Setup",
        slug: "ultimate-sim-racing-setup",
        published: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        excerpt: "How to build a professional-grade sim rig at home for immersive practice.",
        imageUrl: blogSimRacing,
    },
    {
        id: "demo-3",
        title: "Essential Car Maintenance Tips",
        slug: "essential-maintenance-tips",
        published: true,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        excerpt: "Keep your performance car running smoothly with these key maintenance habits.",
        imageUrl: blogMaintenance,
    },
];

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

            if (data && data.length > 0) {
                // Filter logic: Show REAL articles if any exist; otherwise show DEMO articles.
                const realArticles = data.filter((a: any) => a.is_demo === false);
                const demoArticles = data.filter((a: any) => a.is_demo === true);

                if (realArticles.length > 0) {
                    setArticles(realArticles);
                } else {
                    if (demoArticles.length > 0) {
                        setArticles(demoArticles);
                    } else {
                        setArticles(DEMO_ARTICLES);
                    }
                }
            } else {
                setArticles(DEMO_ARTICLES);
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
                                <article key={article.id} className="flex flex-col items-start justify-between bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-red-900 transition-colors group overflow-hidden">
                                    <div className="relative h-48 w-full overflow-hidden">
                                        {article.imageUrl ? (
                                            <Image
                                                src={article.image_url || article.imageUrl}
                                                alt={article.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-zinc-600">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col flex-1 w-full">
                                        <div className="flex items-center gap-x-4 text-xs mb-4">
                                            <time dateTime={article.created_at} className="text-zinc-500">
                                                {new Date(article.created_at).toLocaleDateString()}
                                            </time>
                                        </div>
                                        <div className="group relative flex-1">
                                            <h3 className="text-lg font-semibold leading-6 text-white group-hover:text-red-500 transition-colors uppercase tracking-wide">
                                                <Link href={`/blog/${article.slug}`}>
                                                    <span className="absolute inset-0" />
                                                    {article.title}
                                                </Link>
                                            </h3>
                                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
                                                {article.excerpt || "Click to read more..."}
                                            </p>
                                        </div>
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
