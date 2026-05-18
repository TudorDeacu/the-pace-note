"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import T from "@/components/T";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function NewGallery() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [media, setMedia] = useState<{ url: string; type: 'image' | 'video'; name: string }[]>([]);
    
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    
    const [supabase] = useState(() => createClient());

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        try {
            console.log("Starting cover upload...");
            const fileExt = file.name.split('.').pop();
            const fileName = `cover-${Date.now()}.${fileExt}`;
            const { error } = await supabase.storage.from('galleries').upload(fileName, file);
            if (error) {
                console.error("Supabase upload error:", error);
                throw error;
            }
            console.log("Cover uploaded successfully");
            const { data } = supabase.storage.from('galleries').getPublicUrl(fileName);
            setCoverImage(data.publicUrl);
        } catch (err: any) {
            console.error("Catch block error cover upload:", err);
            const msg = err?.message || err?.error || JSON.stringify(err);
            toast.error("Eroare la încărcarea imaginii de copertă: " + msg);
            alert("Eroare la încărcare (Copertă): " + msg + "\n\nTe rog asigură-te că ai rulat scriptul SQL în Supabase pentru a crea bucket-ul 'galleries'.");
        } finally {
            console.log("Setting uploadingImage to false");
            setUploadingImage(false);
        }
    };

    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setUploadingMedia(true);
        
        try {
            console.log("Starting media upload...", files.length, "files");
            const newMedia: { url: string; type: 'image' | 'video'; name: string }[] = [];
            for (const file of files) {
                console.log("Uploading file:", file.name);
                const fileExt = file.name.split('.').pop();
                const isVideo = file.type.startsWith('video/');
                const fileName = `media-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                
                const { error } = await supabase.storage.from('galleries').upload(fileName, file);
                if (error) {
                    console.error("Supabase upload error:", error);
                    throw error;
                }
                
                const { data } = supabase.storage.from('galleries').getPublicUrl(fileName);
                newMedia.push({
                    url: data.publicUrl,
                    type: isVideo ? 'video' as const : 'image' as const,
                    name: file.name
                });
            }
            console.log("All media uploaded successfully");
            setMedia((prev) => [...prev, ...newMedia]);
            toast.success("Fișiere încărcate cu succes!");
        } catch (err: any) {
            console.error("Catch block error media upload:", err);
            const msg = err?.message || err?.error || JSON.stringify(err);
            toast.error("Eroare la încărcarea fișierelor media: " + msg);
            alert("Eroare la încărcare (Media): " + msg + "\n\nTe rog asigură-te că ai rulat scriptul SQL în Supabase.");
        } finally {
            console.log("Setting uploadingMedia to false");
            setUploadingMedia(false);
            e.target.value = ''; // Reset input
        }
    };

    const removeMedia = (index: number) => {
        setMedia((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!title.trim() || !eventDate) {
                throw new Error("Titlul și data sunt obligatorii.");
            }

            const { error } = await supabase.from('galleries').insert({
                title,
                event_date: eventDate,
                cover_image: coverImage,
                media: media
            });

            if (error) {
                throw error;
            }

            toast.success("Galeria a fost creată cu succes!");
            setTimeout(() => {
                router.push("/admin/galleries");
                router.refresh();
            }, 1500);
            
        } catch (err: any) {
            console.error(err);
            toast.error(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white"><T>Creare Galerie</T></h1>
                <button
                    onClick={handleSubmit}
                    disabled={loading || uploadingImage || uploadingMedia}
                    className="bg-red-600 px-6 py-2.5 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-all disabled:opacity-50"
                >
                    {loading ? <T>Se salvează...</T> : <T>Salvează Galeria</T>}
                </button>
            </div>

            <div className="space-y-6">
                {/* Meta Inputs */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2"><T>Titlu Galerie</T></label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none font-bold"
                                placeholder="Numele evenimentului..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2"><T>Data Evenimentului</T></label>
                            <input
                                type="date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-white focus:border-red-600 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2"><T>Imagine de Copertă</T></label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverUpload}
                                disabled={uploadingImage}
                                className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 transition-colors"
                            />
                            {uploadingImage && <span className="text-zinc-500 text-sm"><T>Se încarcă...</T></span>}
                        </div>
                        {coverImage && (
                            <div className="mt-4 relative w-64 h-40">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={coverImage} alt="Cover preview" className="w-full h-full rounded-lg object-cover border border-zinc-800" />
                                <button onClick={() => setCoverImage('')} className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors">
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Media Upload */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2"><T>Fișiere Media (Poze / Video)</T></label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={handleMediaUpload}
                                disabled={uploadingMedia}
                                className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 transition-colors"
                            />
                            {uploadingMedia && <span className="text-zinc-500 text-sm whitespace-nowrap"><T>Se încarcă...</T></span>}
                        </div>
                    </div>

                    {media.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest"><T>Fișiere Încărcate</T> ({media.length})</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {media.map((item, index) => (
                                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-black border border-zinc-800">
                                        {item.type === 'image' ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <video src={item.url} className="w-full h-full object-cover" />
                                        )}
                                        <button
                                            onClick={() => removeMedia(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                            <p className="text-[10px] text-white truncate">{item.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
