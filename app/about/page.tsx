import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import T from "@/components/T";
import { createClient } from "@/utils/supabase/server";

interface Block {
    id: string;
    type: "paragraph" | "heading" | "image" | "image-text";
    content: string;
    imageUrl?: string;
    caption?: string;
    imageSide?: "left" | "right";
}

export default async function About() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', 'page-about-us')
        .single();

    let blocks: Block[] | null = null;
    if (data && data.content && data.content.blocks && data.content.blocks.length > 0) {
        blocks = data.content.blocks;
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto pb-20">
                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-3xl lg:mx-0">
                        {blocks ? (
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
