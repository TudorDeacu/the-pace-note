"use client";

import { useState } from "react";
import { TrashIcon, ArrowUpIcon, ArrowDownIcon, PhotoIcon, Bars3BottomLeftIcon, ArrowsRightLeftIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/client";

export type BlockType = "paragraph" | "heading" | "image" | "image-text";

export interface Block {
    id: string;
    type: BlockType;
    content: string;
    imageUrl?: string;
    caption?: string;
    imageSide?: "left" | "right";
}

interface BlockEditorProps {
    blocks: Block[];
    setBlocks: (blocks: Block[]) => void;
}

export default function BlockEditor({ blocks, setBlocks }: BlockEditorProps) {
    const supabase = createClient();
    const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);

    const addBlock = (type: BlockType) => {
        const newBlock: Block = {
            id: crypto.randomUUID(), // Valid UUID using native web crypto API
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploadingBlockId(id);
        const { error: uploadError } = await supabase.storage
            .from('blogs')
            .upload(filePath, file);

        if (uploadError) {
            alert('Error uploading image: ' + uploadError.message);
            setUploadingBlockId(null);
            return;
        }

        const { data } = supabase.storage.from('blogs').getPublicUrl(filePath);
        updateBlock(id, "imageUrl", data.publicUrl);
        setUploadingBlockId(null);
    };

    return (
        <div className="space-y-4">
            {blocks.map((block, index) => (
                <div key={block.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-lg p-6 transition-all hover:border-zinc-700">
                    {/* Block Controls (Absolute) */}
                    <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onClick={() => moveBlock(index, -1)} className="p-2 text-zinc-400 hover:text-white bg-black/60 rounded" title="Move Up">
                            <ArrowUpIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => moveBlock(index, 1)} className="p-2 text-zinc-400 hover:text-white bg-black/60 rounded" title="Move Down">
                            <ArrowDownIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => removeBlock(block.id)} className="p-2 text-red-500 hover:text-red-400 bg-black/60 rounded" title="Delete">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Block Content Input */}
                    <div className="mr-12">
                        {block.type === "heading" && (
                            <input
                                type="text"
                                value={block.content}
                                onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                                className="w-full bg-transparent text-white text-2xl font-bold outline-none placeholder:text-zinc-600"
                                placeholder="Write heading here..."
                                autoFocus={!block.content}
                            />
                        )}
                        {block.type === "paragraph" && (
                            <textarea
                                value={block.content}
                                onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                                rows={Math.max(4, block.content.split('\n').length)}
                                className="w-full bg-black/20 text-zinc-300 outline-none resize-none placeholder:text-zinc-600 p-4 rounded-xl border border-zinc-800 focus:border-red-600 transition-colors"
                                placeholder="Write your paragraph here..."
                                autoFocus={!block.content}
                            />
                        )}
                        {block.type === "image" && (
                            <div className="space-y-6">
                                {!block.imageUrl ? (
                                    <div className="flex flex-col gap-4">
                                        {/* Massive Upload Zone */}
                                        <div className="relative border-2 border-dashed border-zinc-700 bg-black/30 hover:border-red-500 hover:bg-zinc-800 transition-all rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer group/upload">
                                            {uploadingBlockId === block.id ? (
                                                <div className="flex flex-col items-center animate-pulse">
                                                    <ArrowUpTrayIcon className="w-12 h-12 text-zinc-500 mb-3" />
                                                    <span className="text-white font-bold text-lg">Uploading Image...</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <ArrowUpTrayIcon className="w-12 h-12 text-zinc-500 group-hover/upload:text-red-500 mb-3 transition-colors" />
                                                    <span className="text-white font-bold text-xl mb-1">Upload Image from Laptop</span>
                                                    <span className="text-zinc-500 text-sm">Click here to browse files (PNG, JPG, WEBP)</span>
                                                </div>
                                            )}
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                                onChange={(e) => handleFileUpload(e, block.id)} 
                                                disabled={uploadingBlockId === block.id}
                                            />
                                        </div>

                                        <div className="relative flex items-center py-2">
                                            <div className="flex-grow border-t border-zinc-800"></div>
                                            <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs uppercase tracking-widest font-bold">OR PASTE URL</span>
                                            <div className="flex-grow border-t border-zinc-800"></div>
                                        </div>

                                        <input
                                            type="url"
                                            value={block.imageUrl || ""}
                                            onChange={(e) => updateBlock(block.id, "imageUrl", e.target.value)}
                                            className="w-full bg-black/50 border border-zinc-800 rounded-lg p-3.5 text-white text-sm outline-none focus:border-red-600 focus:bg-zinc-900 transition-colors"
                                            placeholder="https://example.com/image.jpg..."
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-start gap-4">
                                        <div className="relative group/preview inline-block max-w-full">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={block.imageUrl} alt="Preview" className="max-h-96 w-auto rounded-lg bg-black/50 shadow-lg object-contain border border-zinc-800" />
                                            <button 
                                                onClick={() => updateBlock(block.id, "imageUrl", "")}
                                                className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover/preview:opacity-100 transition-opacity hover:bg-red-500 shadow-xl"
                                                title="Remove Image"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="text"
                                    value={block.caption || ""}
                                    onChange={(e) => updateBlock(block.id, "caption", e.target.value)}
                                    className="w-full bg-transparent border-b border-transparent focus:border-zinc-700 text-zinc-400 text-sm outline-none text-center italic pb-2 transition-colors"
                                    placeholder="Add an optional caption for this image..."
                                />
                            </div>
                        )}
                        {block.type === "image-text" && (
                            <div className="flex flex-col gap-6">
                                {/* Controls Row */}
                                <div className="flex items-center gap-4 bg-black/30 p-2 border border-zinc-800 rounded-lg max-w-fit">
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2">Layout:</span>
                                    <button
                                        onClick={() => updateBlock(block.id, "imageSide", "left")}
                                        className={`px-4 py-1.5 text-xs rounded-md uppercase font-bold tracking-wider transition-colors ${block.imageSide === "left" ? "bg-red-600 text-white shadow" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}
                                    >
                                        Image Left
                                    </button>
                                    <button
                                        onClick={() => updateBlock(block.id, "imageSide", "right")}
                                        className={`px-4 py-1.5 text-xs rounded-md uppercase font-bold tracking-wider transition-colors ${block.imageSide === "right" ? "bg-red-600 text-white shadow" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}
                                    >
                                        Image Right
                                    </button>
                                </div>

                                <div className={`flex flex-col md:flex-row gap-8 ${block.imageSide === "right" ? "md:flex-row-reverse" : ""}`}>
                                    {/* Image Side */}
                                    <div className="flex-1 space-y-4">
                                        {!block.imageUrl ? (
                                            <div className="flex flex-col gap-4 h-full">
                                                <div className="relative border-2 border-dashed border-zinc-700 bg-black/30 hover:border-red-500 hover:bg-zinc-800 transition-all rounded-xl w-full h-full min-h-[250px] flex flex-col items-center justify-center cursor-pointer group/upload">
                                                    {uploadingBlockId === block.id ? (
                                                        <div className="flex flex-col items-center animate-pulse">
                                                            <ArrowUpTrayIcon className="w-10 h-10 text-zinc-500 mb-2" />
                                                            <span className="text-white font-bold">Uploading...</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center text-center p-4">
                                                            <ArrowUpTrayIcon className="w-10 h-10 text-zinc-500 group-hover/upload:text-red-500 mb-2 transition-colors" />
                                                            <span className="text-white font-bold">Upload from Laptop</span>
                                                        </div>
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                                        onChange={(e) => handleFileUpload(e, block.id)} 
                                                        disabled={uploadingBlockId === block.id}
                                                    />
                                                </div>
                                                <input
                                                    type="url"
                                                    value={block.imageUrl || ""}
                                                    onChange={(e) => updateBlock(block.id, "imageUrl", e.target.value)}
                                                    className="w-full bg-black/50 border border-zinc-800 rounded-lg p-3 text-white text-sm outline-none focus:border-red-600 transition-colors"
                                                    placeholder="Or paste URL here..."
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3">
                                                <div className="relative group/preview inline-block w-full">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={block.imageUrl} alt="Preview" className="w-full rounded-lg bg-black/20 object-cover border border-zinc-800" />
                                                    <button 
                                                        onClick={() => updateBlock(block.id, "imageUrl", "")}
                                                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover/preview:opacity-100 transition-opacity hover:bg-red-500"
                                                        title="Remove Image"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            type="text"
                                            value={block.caption || ""}
                                            onChange={(e) => updateBlock(block.id, "caption", e.target.value)}
                                            className="w-full bg-transparent border-b border-transparent focus:border-zinc-700 text-zinc-400 text-xs outline-none text-center italic pb-1"
                                            placeholder="Add an optional caption..."
                                        />
                                    </div>

                                    {/* Text Side */}
                                    <div className="flex-1">
                                        <textarea
                                            value={block.content}
                                            onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                                            rows={8}
                                            className="w-full h-full min-h-[250px] bg-black/20 border border-zinc-800 rounded-xl p-5 text-zinc-300 outline-none resize-none placeholder:text-zinc-600 focus:border-red-600 transition-colors"
                                            placeholder="Write your text side content here..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Add Block Menu */}
            <div className="flex flex-wrap gap-4 justify-center py-10 my-8 border-t border-zinc-900 border-dashed">
                <button onClick={() => addBlock("heading")} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all font-semibold uppercase text-xs tracking-wider">
                    <span className="font-bold text-lg">H</span> Heading
                </button>
                <button onClick={() => addBlock("paragraph")} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all font-semibold uppercase text-xs tracking-wider">
                    <Bars3BottomLeftIcon className="w-5 h-5" /> Paragraph
                </button>
                <button onClick={() => addBlock("image")} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all font-semibold uppercase text-xs tracking-wider">
                    <PhotoIcon className="w-5 h-5" /> Image
                </button>
                <button onClick={() => addBlock("image-text")} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all font-semibold uppercase text-xs tracking-wider">
                    <ArrowsRightLeftIcon className="w-5 h-5" /> Split (Img+Txt)
                </button>
            </div>
        </div>
    );
}
