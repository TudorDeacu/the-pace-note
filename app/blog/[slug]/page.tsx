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
