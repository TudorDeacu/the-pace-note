import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { decryptUrlParam } from "@/utils/encryption";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import GalleryGrid from "@/components/GalleryGrid";

export const dynamic = "force-dynamic";

export default async function GalleryDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const galleryId = decryptUrlParam(decodedId);

    if (!galleryId) {
        notFound();
    }

    const supabase = await createClient();

    const { data: gallery } = await supabase
        .from('galleries')
        .select('*')
        .eq('id', galleryId)
        .single();

    if (!gallery) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto pb-24">
                <div className="py-12">
                    <Link href="/gallery" className="inline-flex items-center text-sm font-semibold text-zinc-400 hover:text-red-500 transition-colors uppercase tracking-widest mb-8">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        <T>Înapoi la Galerii</T>
                    </Link>
                    <div className="mx-auto max-w-2xl lg:mx-0 mb-12 border-b border-zinc-800 pb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl uppercase mb-4">{gallery.title}</h2>
                        <time dateTime={gallery.event_date} className="text-lg leading-8 text-red-500 font-semibold tracking-widest">
                            {new Date(gallery.event_date).toLocaleDateString()}
                        </time>
                    </div>

                    <GalleryGrid media={gallery.media || []} />
                </div>
            </main>
            <Footer />
        </div>
    );
}
