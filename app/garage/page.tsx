"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";
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
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl uppercase"><T>Garaj</T></h2>
                        {/*
                        <p className="mt-2 text-lg leading-8 text-zinc-400">
                            <T>Proiectele noastre și mașinile care ne inspiră.</T>
                        </p>
                        */}
                    </div>

                    <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-zinc-800 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {loading ? (
                            <div className="col-span-full text-center text-zinc-500 italic py-12"><T>Se încarcă...</T></div>
                        ) : !projects || projects.length === 0 ? (
                            <div className="col-span-full text-center text-zinc-500 italic py-12">
                                <T>În lucru.</T>
                            </div>
                        ) : (
                            projects.map((project) => {
                                const thumbnail = project.image_url || 
                                    (project.content?.blocks?.find((b: any) => (b.type === 'image' || b.type === 'image-text') && b.imageUrl)?.imageUrl);

                                return (
                                    <article key={project.id} className="flex flex-col items-start justify-between bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-red-900 transition-colors group overflow-hidden">
                                        <div className="relative h-48 w-full overflow-hidden">
                                            {thumbnail ? (
                                                <Image
                                                    src={thumbnail}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-zinc-600"><T>Fără imagine</T></div>
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col flex-1 w-full">
                                            <div className="flex items-center gap-x-4 text-xs mb-4">
                                                <time dateTime={project.created_at} className="text-zinc-500">
                                                    {new Date(project.created_at).toLocaleDateString()}
                                                </time>
                                            </div>
                                            <div className="group relative flex-1">
                                                <h3 className="text-lg font-semibold leading-6 text-white group-hover:text-red-500 transition-colors uppercase tracking-wide">
                                                    <Link href={`/garage/${project.slug}`}>
                                                        <span className="absolute inset-0" />
                                                        {project.title}
                                                    </Link>
                                                </h3>
                                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
                                                    {project.content?.excerpt || project.content?.blocks?.find((b: any) => b.type === 'paragraph')?.content || <T>Citește Mai Mult</T>}
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
