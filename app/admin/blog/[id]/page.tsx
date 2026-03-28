"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { TrashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import BlockEditor, { Block } from "@/components/BlockEditor";

export default function EditArticle() {
    const router = useRouter();
    const params = useParams();
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function fetchArticle() {
            if (!params?.id) return;
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', params.id)
                .single();

            if (data) {
                setTitle(data.title);
                if (data.content?.blocks) {
                    setBlocks(data.content.blocks);
                }
                if (data.content?.excerpt) {
                    setExcerpt(data.content.excerpt);
                }
            } else {
                console.error("Error loading article:", error);
                alert("Article not found");
                router.push("/admin/blog");
            }
            setLoading(false);
        }
        fetchArticle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase
            .from('articles')
            .update({
                title,
                content: { blocks, excerpt },
            })
            .eq('id', params?.id);

        if (error) {
            console.error(error);
            alert("Error updating article: " + error.message);
            setSaving(false);
        } else {
            router.push("/admin/blog");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;

        setSaving(true);
        const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', params?.id);

        if (error) {
            alert("Error deleting article: " + error.message);
            setSaving(false);
        } else {
            router.push("/admin/blog");
        }
    };

    if (loading) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <Link href="/admin/blog" className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors uppercase text-sm font-bold tracking-widest">
                <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Blog
            </Link>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">Edit Article</h1>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={saving}
                        className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-red-500 px-4 py-2 rounded font-bold uppercase tracking-widest hover:bg-red-900/20 hover:border-red-900 transition-colors disabled:opacity-50"
                    >
                        <TrashIcon className="w-5 h-5" /> Delete
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-red-600 px-6 py-2.5 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-colors disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Update"}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Meta Inputs */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2">Article Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none text-xl font-bold"
                            placeholder="Enter title..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2">Excerpt</label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={3}
                            className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none"
                            placeholder="Brief summary..."
                        />
                    </div>
                </div>

                <BlockEditor blocks={blocks} setBlocks={setBlocks} />
            </div>
        </div>
    );
}
