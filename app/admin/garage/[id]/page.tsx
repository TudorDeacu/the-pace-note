"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { TrashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import BlockEditor, { Block } from "@/components/BlockEditor";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";

export default function EditProject() {
    const router = useRouter();
    const params = useParams();
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function fetchProject() {
            if (!params?.id) return;
            const { data, error } = await supabase
                .from('projects')
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
                console.error("Error loading project:", error);
                toast.error("Proiectul nu a fost găsit");
                router.push("/admin/garage");
            }
            setLoading(false);
        }
        fetchProject();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (!title.trim()) {
                toast.error("Titlul este obligatoriu");
                setSaving(false);
                return;
            }

            const { error } = await supabase
                .from('projects')
                .update({
                    title,
                    content: { blocks, excerpt },
                })
                .eq('id', params?.id);

            if (error) {
                console.error("Supabase update error:", error);
                throw new Error(error.message);
            }
            
            toast.success("Proiect actualizat!");
            router.push("/admin/garage");
            router.refresh();

        } catch (err: any) {
            console.error(err);
            toast.error("Eroare la salvare: " + err.message);
            setSaving(false);
        }
    };

    const executeDelete = async () => {
        setSaving(true);
        setIsDeleteModalOpen(false);
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', params?.id);

            if (error) {
                console.error("Supabase delete error:", error);
                toast.error("Eroare la ștergere: " + error.message);
                setSaving(false);
                return;
            }
            
            toast.success("Proiect șters!");
            router.push("/admin/garage");
            router.refresh();

        } catch (err: any) {
            toast.error("Eroare la ștergere: " + err.message);
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <Link href="/admin/garage" className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors uppercase text-sm font-bold tracking-widest">
                <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Garage
            </Link>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">Edit Project</h1>
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

                <BlockEditor blocks={blocks} setBlocks={setBlocks} supabaseClient={supabase} />
            </div>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Șterge Proiectul"
                description="Ești sigur că vrei să ștergi acest proiect? Acțiunea este ireversibilă."
                confirmText="ȘTERGE"
                onConfirm={executeDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
}
