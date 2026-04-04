"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { TrashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import BlockEditor, { Block } from "@/components/BlockEditor";
import { updateArticle } from "@/app/admin/actions";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function EditArticle() {
    const router = useRouter();
    const params = useParams();
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // Crucial: Memoize the Supabase Client to prevent recreation dropping active network requests and causing browser lock deadlocks
    const [supabase] = useState(() => createClient());

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
                if (data.content?.excerpt) setExcerpt(data.content.excerpt);
                if (data.content?.image_url) setImageUrl(data.content.image_url);
                
                if (data.content?.blocks) {
                    setBlocks(data.content.blocks);
                }
            } else {
                console.error("Error loading article:", error);
                toast.error("Article not found");
                router.push("/admin/blog");
            }
            setLoading(false);
        }
        fetchArticle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.id]);

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `thumbnail-${Date.now()}.${fileExt}`;
            const { error } = await supabase.storage.from('blogs').upload(fileName, file);
            if (error) throw error;
            const { data } = supabase.storage.from('blogs').getPublicUrl(fileName);
            setImageUrl(data.publicUrl);
        } catch (err: any) {
            toast.error("Eroare la încărcarea imaginii: " + err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (!title.trim()) {
                throw new Error("Title is required");
            }
            if (!params?.id) throw new Error("Article ID is missing");

            const result = await updateArticle(params.id as string, {
                title,
                content: { blocks, excerpt, image_url: imageUrl },
            });

            if (result.error) {
                console.error("Action error:", result.error);
                throw new Error(result.error);
            }
            
            setIsPublished(true);
            toast.success("Articol salvat cu succes!");
            setTimeout(() => {
                router.push("/admin/blog");
                router.refresh();
            }, 1000);
            
            
        } catch (err: any) {
            console.error(err);
            toast.error("Eroare la salvarea articolului: " + err.message);
            setSaving(false);
        }
    };

    const executeDelete = async () => {
        setSaving(true);
        setIsDeleteModalOpen(false);
        try {
            const { error } = await supabase
                .from('articles')
                .delete()
                .eq('id', params?.id);

            if (error) {
                console.error("Supabase delete error:", error);
                toast.error("Eroare la ștergere: " + error.message);
                setSaving(false);
                return;
            }
            
            toast.success("Articol șters!");
            router.push("/admin/blog");
            router.refresh();
            
        } catch (err: any) {
            toast.error("Eroare neașteptată la ștergere: " + err.message);
            setSaving(false);
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
                        onClick={() => setIsDeleteModalOpen(true)}
                        disabled={saving}
                        className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-red-500 px-4 py-2 rounded font-bold uppercase tracking-widest hover:bg-red-900/20 hover:border-red-900 transition-colors disabled:opacity-50"
                    >
                        <TrashIcon className="w-5 h-5" /> Delete
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving || isPublished || uploadingImage}
                        className="bg-red-600 px-6 py-2.5 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-all disabled:opacity-50"
                    >
                        {isPublished ? "Published!" : saving ? "Saving..." : "Save Changes"}
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
                        <label className="block text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2">Thumbnail Image</label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailUpload}
                                disabled={uploadingImage}
                                className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 transition-colors"
                            />
                            {uploadingImage && <span className="text-zinc-500 text-sm">Uploading...</span>}
                        </div>
                        {imageUrl && (
                            <div className="mt-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imageUrl} alt="Thumbnail preview" className="w-full max-w-sm rounded-lg object-cover" />
                            </div>
                        )}
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

                <BlockEditor blocks={blocks} setBlocks={setBlocks} supabaseClient={supabase} />
            </div>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Șterge Articolul"
                description="Atenție! Această acțiune este permanentă și articolul va fi ireversibil șters din baza de date."
                confirmText="ȘTERGE DEFINITIV"
                onConfirm={executeDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
}
