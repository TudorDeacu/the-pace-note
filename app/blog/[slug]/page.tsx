"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface Block {
    id: string;
    type: "paragraph" | "heading" | "image" | "image-text";
    content: string;
    imageUrl?: string;
    caption?: string;
    imageSide?: "left" | "right";
}

import blogTrackDay from "../../images/blog_track_day.png";
import blogSimRacing from "../../images/blog_sim_racing.png";
import blogMaintenance from "../../images/blog_maintenance.png";

const DEMO_CONTENT: Record<string, Block[]> = {
    "mastering-the-track": [
        { id: "1", type: "heading", content: "The Perfect Racing Line" },
        { id: "2", type: "paragraph", content: "Understanding the geometric racing line is crucial for fast lap times. It's about maximizing the radius of the turn to maintain the highest possible average speed." },
        { id: "3", type: "image", content: "", imageUrl: blogTrackDay.src, caption: "Sunset session at the Nürburgring." },
        { id: "4", type: "paragraph", content: "Always look ahead. Your hands follow your eyes. If you look at the barrier, you will hit the barrier. Look at the apex, then immediately look for the exit." }
    ],
    "ultimate-sim-racing-setup": [
        { id: "1", type: "heading", content: "Choosing the Right Wheel Base" },
        { id: "2", type: "paragraph", content: "Direct Drive is the gold standard. It provides 1:1 force feedback without belts or gears dampening the detail." },
        { id: "3", type: "image-text", content: "A solid rig is just as important as the wheel. If your seat flexes under braking, you lose consistency.", imageUrl: blogSimRacing.src, caption: "Triple monitor setup with ambient lighting." },
    ],
    "essential-maintenance-tips": [
        { id: "1", type: "heading", content: "Fluids are Life" },
        { id: "2", type: "paragraph", content: "Oil, brake fluid, coolant. Check them regularly. High performance driving degrades fluids much faster than daily commuting." },
        { id: "3", type: "image", content: "", imageUrl: blogMaintenance.src, caption: "Regular checks prevent catastrophic failures." },
    ]
};

interface Article {
    id: string;
    title: string;
    slug: string;
    content: { blocks: Block[], excerpt?: string };
    published: boolean;
    created_at: string;
}

export default function ArticlePage() {
    const params = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchArticle() {
            if (!params?.slug) return;

            // Check for demo article first
            const demoSlug = typeof params.slug === 'string' ? params.slug : params.slug[0];
            if (DEMO_CONTENT[demoSlug]) {
                const demoTitle = demoSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
                setArticle({
                    id: "demo",
                    title: demoTitle,
                    slug: demoSlug,
                    content: { blocks: DEMO_CONTENT[demoSlug] },
                    published: true,
                    created_at: new Date().toISOString()
                });
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('slug', params.slug)
                .single();

            if (data) {
                setArticle(data);
            } else {
                console.error("Error fetching article:", error);
            }
            setLoading(false);
        }
        fetchArticle();
    }, [params?.slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Loading article...</p>
            </div>
        );
    }

    if (!article || !article.published) { // Optionally hide unpublished even if known slug
        return (
            <div className="min-h-screen bg-black flex items-center justify-center flex-col gap-4">
                <p className="text-white">Article not found.</p>
                <Link href="/blog" className="text-red-500 hover:text-red-400">Back to Blog</Link>
            </div>
        );
    }

    const blocks = article.content.blocks || [];

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="pt-32 px-6 lg:px-8 max-w-4xl mx-auto pb-20">
                <Link href="/blog" className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors uppercase text-sm font-bold tracking-widest">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Blog
                </Link>

                <article>
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl font-bold uppercase tracking-tighter sm:text-5xl mb-6">{article.title}</h1>
                        <time className="text-zinc-500 text-sm">
                            {new Date(article.created_at).toLocaleDateString()}
                        </time>
                    </header>

                    <div className="space-y-12">
                        {blocks.map((block) => (
                            <div key={block.id}>
                                {block.type === "heading" && (
                                    <h2 className="text-2xl font-bold uppercase tracking-wide text-white mb-4">{block.content}</h2>
                                )}
                                {block.type === "paragraph" && (
                                    <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-lg">
                                        {block.content}
                                    </div>
                                )}
                                {block.type === "image" && block.imageUrl && (
                                    <figure className="my-8">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={block.imageUrl} alt={block.caption || ""} className="w-full rounded-lg" />
                                        {block.caption && (
                                            <figcaption className="mt-2 text-center text-zinc-500 text-sm italic">{block.caption}</figcaption>
                                        )}
                                    </figure>
                                )}
                                {block.type === "image-text" && (
                                    <div className={`flex flex-col md:flex-row gap-8 items-center ${block.imageSide === "right" ? "md:flex-row-reverse" : ""}`}>
                                        <div className="flex-1">
                                            {block.imageUrl && (
                                                <figure>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={block.imageUrl} alt={block.caption || ""} className="w-full rounded-lg object-cover" />
                                                    {block.caption && (
                                                        <figcaption className="mt-2 text-center text-zinc-500 text-sm italic">{block.caption}</figcaption>
                                                    )}
                                                </figure>
                                            )}
                                        </div>
                                        <div className="flex-1 text-zinc-300 leading-relaxed whitespace-pre-wrap text-lg">
                                            {block.content}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
