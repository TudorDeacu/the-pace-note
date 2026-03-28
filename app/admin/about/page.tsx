"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import BlockEditor, { Block } from "@/components/BlockEditor";

export default function EditAboutPage() {
    const router = useRouter();
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [articleId, setArticleId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function fetchArticle() {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('slug', 'page-about-us')
                .single();

            if (data) {
                setArticleId(data.id);
                if (data.content?.blocks) {
                    setBlocks(data.content.blocks);
                }
            } else {
                // Not found is fine, we just haven't created it yet
                // Initialize with fallback hardcoded text from the old about page
                setBlocks([
                    { id: Math.random().toString(36).substring(2), type: "heading", content: "Pasiunea pentru Motorsport", imageUrl: undefined, caption: undefined, imageSide: undefined },
                    { id: Math.random().toString(36).substring(2), type: "paragraph", content: "The Pace Note a luat naștere din dorința de a aduce mai aproape de fani acțiunea, adrenalina și poveștile nescrise din motorsportul românesc și internațional.", imageUrl: undefined, caption: undefined, imageSide: undefined },
                    { id: Math.random().toString(36).substring(2), type: "paragraph", content: "Suntem o echipă de entuziaști, piloți amatori și jurnaliști dedicați, uniți de mirosul de benzină și sunetul motoarelor turate la maximum.", imageUrl: undefined, caption: undefined, imageSide: undefined },
                    { id: Math.random().toString(36).substring(2), type: "paragraph", content: "Misiunea noastră este să oferim conținut de calitate, analize detaliate și reportaje de la fața locului, acoperind totul, de la raliuri și viteză în coastă, până la sim racing și track days.", imageUrl: undefined, caption: undefined, imageSide: undefined },
                    { id: Math.random().toString(36).substring(2), type: "paragraph", content: "Credem cu tărie în educația auto și promovăm conducerea defensivă pe drumurile publice, încurajând pasionații să-și testeze limitele doar într-un cadru organizat, pe circuit.", imageUrl: undefined, caption: undefined, imageSide: undefined },
                    { id: Math.random().toString(36).substring(2), type: "paragraph", content: "Alătură-te comunității noastre și hai să împărtășim împreună pasiunea pentru tot ce înseamnă cu adevărat 'The Pace Note' - nota de dictare perfectă care te ajută să găsești trasa ideală.", imageUrl: undefined, caption: undefined, imageSide: undefined },
                    { id: Math.random().toString(36).substring(2), type: "heading", content: "Echipa The Pace Note", imageUrl: undefined, caption: undefined, imageSide: undefined }
                ]);
            }
            setLoading(false);
        }
        fetchArticle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        if (articleId) {
            // Update existing
            const { error } = await supabase
                .from('articles')
                .update({
                    content: { blocks },
                })
                .eq('id', articleId);
            
            if (error) {
                console.error(error);
                alert("Error updating page: " + error.message);
            } else {
                alert("Page updated successfully!");
                router.push("/about");
            }
        } else {
            // Create new
            const { error } = await supabase
                .from('articles')
                .insert({
                    title: 'Despre Noi',
                    slug: 'page-about-us',
                    content: { blocks },
                    published: true
                });
            
            if (error) {
                console.error(error);
                alert("Error saving page: " + error.message);
            } else {
                alert("Page created successfully!");
                router.push("/about");
            }
        }
        setSaving(false);
    };

    if (loading) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">Edit "About Us" Page</h1>
                <div className="flex gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-red-600 px-6 py-2.5 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-colors disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Publish Page"}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg mb-8">
                    <p className="text-zinc-400 text-sm">
                        This content will replace the static text on the public "Despre Noi" page once you click Publish Page.
                        Any added blocks will be instantly visible on the live site!
                    </p>
                </div>

                <BlockEditor blocks={blocks} setBlocks={setBlocks} />
            </div>
        </div>
    );
}
