"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { TrashIcon, ArrowUpIcon, ArrowDownIcon, PhotoIcon, Bars3BottomLeftIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

type BlockType = "paragraph" | "heading" | "image" | "image-text";

interface Block {
    id: string;
    type: BlockType;
    content: string; // For image-text, this will be the text content
    imageUrl?: string; // For image and image-text
    caption?: string;
    imageSide?: "left" | "right"; // For image-text
}

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
            }
            setLoading(false);
        }
        fetchArticle();
    }, [params?.id]);

    const addBlock = (type: BlockType) => {
        const newBlock: Block = {
            id: crypto.randomUUID(),
            type,
            content: "",
            imageUrl: type === "image" || type === "image-text" ? "" : undefined,
            caption: type === "image" || type === "image-text" ? "" : undefined,
            imageSide: type === "image-text" ? "left" : undefined,
        };
        setBlocks([...blocks, newBlock]);
    };

    const updateBlock = (id: string, field: keyof Block, value: string) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const moveBlock = (index: number, direction: -1 | 1) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === blocks.length - 1)) return;
        const newBlocks = [...blocks];
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[index + direction];
        newBlocks[index + direction] = temp;
        setBlocks(newBlocks);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase
            .from('articles')
            .update({
                title,
                content: { blocks, excerpt },
            })
            .eq('id', params.id);

        if (error) {
            console.error(error);
            alert("Error updating article: " + error.message);
            setSaving(false);
        } else {
            router.push("/admin/blog");
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">Edit Article</h1>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-red-600 px-6 py-2.5 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-colors disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Update"}
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

                {/* Blocks Editor */}
                <div className="space-y-4">
                    {blocks.map((block, index) => (
                        <div key={block.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-lg p-4 transition-all hover:border-zinc-700">
                            {/* Block Controls (Absolute) */}
                            <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button onClick={() => moveBlock(index, -1)} className="p-1.5 text-zinc-400 hover:text-white bg-black/50 rounded" title="Move Up">
                                    <ArrowUpIcon className="w-4 h-4" />
                                </button>
                                <button onClick={() => moveBlock(index, 1)} className="p-1.5 text-zinc-400 hover:text-white bg-black/50 rounded" title="Move Down">
                                    <ArrowDownIcon className="w-4 h-4" />
                                </button>
                                <button onClick={() => removeBlock(block.id)} className="p-1.5 text-red-500 hover:text-red-400 bg-black/50 rounded" title="Delete">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Block Content Input */}
                            <div className="mr-8">
                                {block.type === "heading" && (
                                    <input
                                        type="text"
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                                        className="w-full bg-transparent text-white text-2xl font-bold outline-none placeholder:text-zinc-600"
                                        placeholder="Heading..."
                                    />
                                )}
                                {block.type === "paragraph" && (
                                    <textarea
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                                        rows={Math.max(3, block.content.split('\n').length)}
                                        className="w-full bg-transparent text-zinc-300 outline-none resize-none placeholder:text-zinc-600"
                                        placeholder="Write your paragraph here..."
                                    />
                                )}
                                {block.type === "image" && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-zinc-800 rounded">
                                                <PhotoIcon className="w-6 h-6 text-zinc-400" />
                                            </div>
                                            <input
                                                type="url"
                                                value={block.imageUrl || ""}
                                                onChange={(e) => updateBlock(block.id, "imageUrl", e.target.value)}
                                                className="flex-1 bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm outline-none focus:border-red-600"
                                                placeholder="Image URL (e.g., https://...)"
                                            />
                                        </div>
                                        {block.imageUrl && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={block.imageUrl} alt="Preview" className="max-h-64 rounded bg-black/20" />
                                        )}
                                        <input
                                            type="text"
                                            value={block.caption || ""}
                                            onChange={(e) => updateBlock(block.id, "caption", e.target.value)}
                                            className="w-full bg-transparent text-zinc-500 text-sm outline-none text-center italic"
                                            placeholder="Image caption (optional)..."
                                        />
                                    </div>
                                )}
                                {block.type === "image-text" && (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4 border-b border-zinc-800 pb-4 mb-2">
                                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Layout:</span>
                                            <button
                                                onClick={() => updateBlock(block.id, "imageSide", "left")}
                                                className={`px-3 py-1 text-xs rounded uppercase font-bold tracking-wider transition-colors ${block.imageSide === "left" ? "bg-red-600 text-white" : "bg-black/50 text-zinc-400 hover:text-white"}`}
                                            >
                                                Image Left
                                            </button>
                                            <button
                                                onClick={() => updateBlock(block.id, "imageSide", "right")}
                                                className={`px-3 py-1 text-xs rounded uppercase font-bold tracking-wider transition-colors ${block.imageSide === "right" ? "bg-red-600 text-white" : "bg-black/50 text-zinc-400 hover:text-white"}`}
                                            >
                                                Image Right
                                            </button>
                                        </div>

                                        <div className={`flex flex-col md:flex-row gap-6 ${block.imageSide === "right" ? "md:flex-row-reverse" : ""}`}>
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <PhotoIcon className="w-5 h-5 text-zinc-400" />
                                                    <input
                                                        type="url"
                                                        value={block.imageUrl || ""}
                                                        onChange={(e) => updateBlock(block.id, "imageUrl", e.target.value)}
                                                        className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm outline-none focus:border-red-600"
                                                        placeholder="Image URL..."
                                                    />
                                                </div>
                                                {block.imageUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={block.imageUrl} alt="Preview" className="w-full rounded bg-black/20 object-cover" />
                                                ) : (
                                                    <div className="w-full aspect-video bg-black/20 rounded border border-zinc-800 border-dashed flex items-center justify-center text-zinc-600 text-sm">
                                                        No image
                                                    </div>
                                                )}
                                                <input
                                                    type="text"
                                                    value={block.caption || ""}
                                                    onChange={(e) => updateBlock(block.id, "caption", e.target.value)}
                                                    className="w-full bg-transparent text-zinc-500 text-xs outline-none text-center italic"
                                                    placeholder="Caption..."
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <textarea
                                                    value={block.content}
                                                    onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                                                    rows={8}
                                                    className="w-full h-full bg-black/20 border border-zinc-800 rounded p-4 text-zinc-300 outline-none resize-none placeholder:text-zinc-600 focus:border-red-600"
                                                    placeholder="Write your text here..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Block Menu */}
                <div className="flex gap-4 justify-center py-8 border-t border-zinc-900 border-dashed">
                    <button onClick={() => addBlock("heading")} className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all bg-zinc-900/50">
                        <span className="font-bold text-lg">H</span> Heading
                    </button>
                    <button onClick={() => addBlock("paragraph")} className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all bg-zinc-900/50">
                        <Bars3BottomLeftIcon className="w-5 h-5" /> Paragraph
                    </button>
                    <button onClick={() => addBlock("image")} className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all bg-zinc-900/50">
                        <PhotoIcon className="w-5 h-5" /> Image
                    </button>
                    <button onClick={() => addBlock("image-text")} className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all bg-zinc-900/50">
                        <ArrowsRightLeftIcon className="w-5 h-5" /> Split (Img+Txt)
                    </button>
                </div>
            </div>
        </div>
    );
}
