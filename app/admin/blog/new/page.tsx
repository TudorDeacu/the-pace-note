"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import BlockEditor, { Block } from "@/components/BlockEditor";
import { submitArticle } from "@/app/admin/actions";

// Simple slugify function
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

export default function NewArticle() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState(""); 
    const [imageUrl, setImageUrl] = useState("");
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    
    // Crucial: Memoize the Supabase Client to prevent recreation dropping active network requests and causing browser lock deadlocks
    const [supabase] = useState(() => createClient());

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
            alert("Error uploading thumbnail: " + err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!title.trim()) {
                throw new Error("Title is required");
            }

            const slug = slugify(title) + '-' + Date.now().toString().slice(-4); // Ensure uniqueness

            const result = await submitArticle({
                title,
                slug,
                content: { blocks, excerpt, image_url: imageUrl }, // Store fallback in JSONB as well
                published: true // Default to published for now, or add a toggle
            });

            if (result.error) {
                console.error("Action error:", result.error);
                throw new Error(result.error);
            }
            setIsPublished(true);
            setTimeout(() => {
                router.push("/admin/blog");
                router.refresh();
            }, 1500);
            
        } catch (err: any) {
            console.error(err);
            alert("Error saving article: " + err.message);
            setLoading(false); // Reset loading purely only on error
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">New Article</h1>
                <button
                    onClick={handleSubmit}
                    disabled={loading || isPublished || uploadingImage}
                    className="bg-red-600 px-6 py-2.5 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-all disabled:opacity-50"
                >
                    {isPublished ? "Published!" : loading ? "Publishing..." : "Publish"}
                </button>
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

                {/* Blocks Editor Component */}
                <BlockEditor blocks={blocks} setBlocks={setBlocks} supabaseClient={supabase} />
            </div>
        </div>
    );
}
