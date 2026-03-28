"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";
import { createClient } from "@/utils/supabase/client";

interface Block {
    id: string;
    type: "paragraph" | "heading" | "image" | "image-text";
    content: string;
    imageUrl?: string;
    caption?: string;
    imageSide?: "left" | "right";
}

export default function About() {
    const [blocks, setBlocks] = useState<Block[] | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchArticle() {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('slug', 'page-about-us')
                .single();

            if (data && data.content && data.content.blocks && data.content.blocks.length > 0) {
                setBlocks(data.content.blocks);
            }
            setLoading(false);
        }
        fetchArticle();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto pb-20">
                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-3xl lg:mx-0">
                        {loading ? (
                            <div className="animate-pulse flex space-x-4">
                                <div className="flex-1 space-y-6 py-1">
                                    <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-zinc-800 rounded"></div>
                                        <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        ) : blocks ? (
                            <div className="space-y-12">
                                <h1 className="text-4xl font-bold uppercase tracking-tighter sm:text-5xl mb-12"><T>Despre Noi</T></h1>
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
                        ) : (
                            <div className="space-y-12">
                                <h1 className="text-4xl font-bold uppercase tracking-tighter sm:text-5xl mb-12"><T>Despre Noi</T></h1>
                                <p className="text-zinc-500 italic">No content available yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
