import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { encryptUrlParam } from "@/utils/encryption";

interface Gallery {
    id: string;
    title: string;
    event_date: string;
    cover_image: string;
    media: any[];
    created_at: string;
}

export default async function GalleryPage() {
    const supabase = await createClient();
    let galleries: Gallery[] = [];

    const { data } = await supabase
        .from('galleries')
        .select('*')
        .order('event_date', { ascending: false });

    if (data) {
        galleries = data;
    }

    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl uppercase"><T>Galerie</T></h2>
                    </div>
                    <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-zinc-800 pt-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {!galleries || galleries.length === 0 ? (
                            <div className="col-span-full text-center text-zinc-500 italic py-12">
                                <T>Nu există nicio galerie momentan.</T>
                            </div>
                        ) : (
                            galleries.map((gallery) => {
                                return (
                                    <article key={gallery.id} className="relative flex flex-col items-start justify-between bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-red-900 transition-colors group overflow-hidden">
                                        <div className="relative h-64 w-full overflow-hidden">
                                            {gallery.cover_image ? (
                                                <Image
                                                    src={gallery.cover_image}
                                                    alt={gallery.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-zinc-600"><T>Fără imagine</T></div>
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col flex-1 w-full">
                                            <div className="flex items-center gap-x-4 text-xs mb-4">
                                                <time dateTime={gallery.event_date} className="text-zinc-500">
                                                    {new Date(gallery.event_date).toLocaleDateString()}
                                                </time>
                                                <span className="text-zinc-500 bg-black px-2 py-1 rounded border border-zinc-800">
                                                    {gallery.media?.length || 0} <T>fișiere media</T>
                                                </span>
                                            </div>
                                            <div className="group flex-1">
                                                <h3 className="text-xl font-semibold leading-6 text-white group-hover:text-red-500 transition-colors uppercase tracking-wide">
                                                    <Link href={`/gallery/${encryptUrlParam(gallery.id)}`}>
                                                        <span className="absolute inset-0" />
                                                        {gallery.title}
                                                    </Link>
                                                </h3>
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
