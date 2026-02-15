"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface Project {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    created_at: string;
    content: any;
    image_url?: string;
}

export default function Garage() {
    const { t } = useLanguage();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchProjects() {
            const { data } = await supabase
                .from('projects')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false });

            if (data) {
                setProjects(data);
            }
            setLoading(false);
        }
        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl uppercase">{t.garage.title}</h2>
                        <p className="mt-2 text-lg leading-8 text-zinc-400">
                            {t.garage.description}
                        </p>
                    </div>

                    <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-zinc-800 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {loading ? (
                            <div className="col-span-full text-center text-zinc-500 italic py-12">Loading projects...</div>
                        ) : !projects || projects.length === 0 ? (
                            <div className="col-span-full text-center text-zinc-500 italic py-12">
                                {t.garage.wip || "No projects in the garage yet. Check back soon!"}
                            </div>
                        ) : (
                            projects.map((project) => (
                                <article key={project.id} className="flex max-w-xl flex-col items-start justify-between group">
                                    <div className="relative w-full">
                                        {/* Image handling - first block image or placeholder */}
                                        {project.content?.blocks?.find((b: any) => b.type === 'image' || b.type === 'image-text')?.imageUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={project.content.blocks.find((b: any) => b.type === 'image' || b.type === 'image-text').imageUrl}
                                                alt={project.title}
                                                className="aspect-[16/9] w-full rounded-2xl bg-zinc-800 object-cover sm:aspect-[2/1] lg:aspect-[3/2] group-hover:opacity-80 transition-opacity"
                                            />
                                        ) : (
                                            <div className="aspect-[16/9] w-full rounded-2xl bg-zinc-900 border border-zinc-800 sm:aspect-[2/1] lg:aspect-[3/2] flex items-center justify-center text-zinc-700">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-x-4 text-xs mt-8">
                                        <time dateTime={project.created_at} className="text-zinc-500">
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </time>
                                    </div>
                                    <div className="group relative">
                                        <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-red-500 transition-colors uppercase tracking-wide">
                                            <Link href={`/garage/${project.slug}`}>
                                                <span className="absolute inset-0" />
                                                {project.title}
                                            </Link>
                                        </h3>
                                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-400">
                                            {project.content?.excerpt || project.content?.blocks?.find((b: any) => b.type === 'paragraph')?.content || "No description available."}
                                        </p>
                                    </div>
                                    <div className="relative mt-auto pt-8 flex items-center gap-x-4">
                                        <Link href={`/garage/${project.slug}`} className="text-sm font-semibold leading-6 text-red-600 hover:text-red-500 flex items-center gap-2 uppercase tracking-widest">
                                            Read More <ArrowRightIcon className="w-4 h-4" />
                                        </Link>
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
