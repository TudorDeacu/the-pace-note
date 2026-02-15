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

interface Project {
    id: string;
    title: string;
    content: {
        blocks: Block[];
        excerpt?: string;
    };
    created_at: string;
}

export default function GarageProject() {
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchProject() {
            if (!params?.slug) return;
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('slug', params.slug)
                .single();

            if (data) {
                setProject(data);
            } else {
                console.error("Error loading project:", error);
            }
            setLoading(false);
        }
        fetchProject();
    }, [params?.slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black">
                <Navbar />
                <main className="pt-32 px-6 max-w-4xl mx-auto min-h-[60vh] flex items-center justify-center">
                    <p className="text-zinc-500">Loading project...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-black">
                <Navbar />
                <main className="pt-32 px-6 max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
                    <Link href="/garage" className="text-red-500 hover:text-red-400">Back to Garage</Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="pt-32 pb-20 px-6 lg:px-8 max-w-4xl mx-auto">
                <Link href="/garage" className="inline-flex items-center text-zinc-500 hover:text-white mb-8 transition-colors uppercase text-sm font-bold tracking-widest">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Garage
                </Link>

                <article className="prose prose-invert max-w-none">
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4">{project.title}</h1>
                        <time className="text-zinc-500 text-sm font-mono block">
                            {new Date(project.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                    </header>

                    <div className="space-y-8">
                        {project.content?.blocks?.map((block) => (
                            <div key={block.id}>
                                {block.type === "heading" && (
                                    <h2 className="text-2xl font-bold uppercase tracking-wide mt-8 mb-4 border-l-4 border-red-600 pl-4">{block.content}</h2>
                                )}
                                {block.type === "paragraph" && (
                                    <p className="text-zinc-300 leading-relaxed whitespace-pre-line text-lg">{block.content}</p>
                                )}
                                {block.type === "image" && block.imageUrl && (
                                    <figure className="my-8">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={block.imageUrl} alt={block.caption || ""} className="w-full rounded-lg bg-zinc-900" />
                                        {block.caption && (
                                            <figcaption className="text-center text-zinc-500 text-sm mt-3 italic">{block.caption}</figcaption>
                                        )}
                                    </figure>
                                )}
                                {block.type === "image-text" && (
                                    <div className={`flex flex-col md:flex-row gap-8 items-center ${block.imageSide === "right" ? "md:flex-row-reverse" : ""}`}>
                                        <div className="flex-1 w-full">
                                            {block.imageUrl && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={block.imageUrl} alt={block.caption || ""} className="w-full rounded-lg bg-zinc-900" />
                                            )}
                                        </div>
                                        <div className="flex-1 w-full">
                                            <p className="text-zinc-300 leading-relaxed whitespace-pre-line text-lg">{block.content}</p>
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
