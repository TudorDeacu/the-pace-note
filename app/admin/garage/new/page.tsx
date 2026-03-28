"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import BlockEditor, { Block } from "@/components/BlockEditor";

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

export default function NewProject() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const slug = slugify(title) + '-' + Date.now().toString().slice(-4); // Ensure uniqueness

        const { error } = await supabase
            .from('projects')
            .insert({
                title,
                slug,
                content: { blocks, excerpt }, // Store blocks and excerpt in JSONB
                published: true // Default to published for now
            });

        if (error) {
            console.error(error);
            alert("Error saving project: " + error.message);
            setLoading(false);
        } else {
            router.push("/admin/garage");
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">New Project</h1>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-red-600 px-6 py-2.5 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-colors disabled:opacity-50"
                >
                    {loading ? "Publishing..." : "Publish"}
                </button>
            </div>

            <div className="space-y-6">
                {/* Meta Inputs */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2">Project Title</label>
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
