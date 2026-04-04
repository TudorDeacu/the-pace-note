"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { PhotoIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export const DEFAULT_HERO = "https://zlcqqmcvbhixcmeapofz.supabase.co/storage/v1/object/public/other/ultrace_gatti.jpeg";
export const DEFAULT_VISION = "https://zlcqqmcvbhixcmeapofz.supabase.co/storage/v1/object/public/other/visiontpn.jpeg";
export const DEFAULT_SPLIT = "https://zlcqqmcvbhixcmeapofz.supabase.co/storage/v1/object/public/other/home_gif.mp4";

const isVideo = (url: string) => !!url.match(/\.(mp4|webm|ogg)$/i);

export default function EditHomePageMedia() {
    const router = useRouter();
    const [articleId, setArticleId] = useState<string | null>(null);
    const [media, setMedia] = useState({
        heroMedia: DEFAULT_HERO,
        visionMedia: DEFAULT_VISION,
        splitMedia: DEFAULT_SPLIT
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function fetchArticle() {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('slug', 'page-home')
                .single();

            if (data) {
                setArticleId(data.id);
                if (data.content) {
                    setMedia({
                        heroMedia: data.content.heroMedia || DEFAULT_HERO,
                        visionMedia: data.content.visionMedia || DEFAULT_VISION,
                        splitMedia: data.content.splitMedia || DEFAULT_SPLIT
                    });
                }
            }
            setLoading(false);
        }
        fetchArticle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof media) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        setLoading(true);
        const { error: uploadError } = await supabase.storage
            .from('blogs')
            .upload(filePath, file);

        if (uploadError) {
            toast.error('Error uploading file: ' + uploadError.message);
            setLoading(false);
            return;
        }

        const { data } = supabase.storage.from('blogs').getPublicUrl(filePath);
        setMedia(prev => ({ ...prev, [field]: data.publicUrl }));
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const contentPayload = { ...media };

        if (articleId) {
            // Update existing
            const { error } = await supabase
                .from('articles')
                .update({ content: contentPayload })
                .eq('id', articleId);
            
            if (error) {
                toast.error("Error updating page: " + error.message);
            } else {
                toast.success("Home page media updated successfully!");
                router.push("/");
            }
        } else {
            // Create new
            const { error } = await supabase
                .from('articles')
                .insert({
                    title: 'Home Page Data',
                    slug: 'page-home',
                    content: contentPayload,
                    published: true
                });
            
            if (error) {
                toast.error("Error saving page: " + error.message);
            } else {
                toast.success("Home page media updated successfully!");
                router.push("/");
            }
        }
        setSaving(false);
    };

    const renderMediaPreview = (url: string) => {
        if (!url) return <div className="text-zinc-500 italic p-4 text-sm text-center">No media selected</div>;
        if (isVideo(url)) {
            return (
                <video autoPlay loop muted playsInline className="w-full h-48 object-cover rounded bg-black">
                    <source src={url} />
                </video>
            );
        }
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Preview" className="w-full h-48 object-cover rounded bg-black" />
        );
    };

    if (loading) return <div className="text-white p-8">Loading...</div>;

    const sections: { key: keyof typeof media, title: string, desc: string }[] = [
        { key: 'heroMedia', title: 'Top Hero Background', desc: 'The main background behind the large "The Pace Note" title on the very top of the page.' },
        { key: 'visionMedia', title: 'Viziune Section', desc: 'The large rectangular image shown clearly on the right or bottom of the Viziune text.' },
        { key: 'splitMedia', title: 'Povestea Noastră', desc: 'The background media under the "Orange Tainted Dreams" video area (currently the looping car detail).' },
    ];

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">Edit Home Page Media</h1>
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
                        Upload custom images or videos for the main homepage sections.
                        If you upload an MP4 or WebM, it will automatically loop in the background!
                        Ensure your files are compressed correctly so the page loads fast for your visitors.
                    </p>
                </div>

                {sections.map(section => (
                    <div key={section.key} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold uppercase tracking-wide text-white">{section.title}</h3>
                                <p className="text-sm text-zinc-500 mt-1">{section.desc}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Preview Window */}
                            <div className="rounded border border-zinc-800 bg-black/50 overflow-hidden relative group">
                                {renderMediaPreview(media[section.key])}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <label className="cursor-pointer bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-bold uppercase tracking-wide transition-colors">
                                        Upload New File
                                        <input type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={(e) => handleFileUpload(e, section.key)} />
                                    </label>
                                </div>
                            </div>

                            {/* Manual URL Input */}
                            <div className="space-y-3">
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Or Paste URL</label>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-800 rounded">
                                        <PhotoIcon className="w-5 h-5 text-zinc-400" />
                                    </div>
                                    <input
                                        type="url"
                                        value={media[section.key]}
                                        onChange={(e) => setMedia(prev => ({ ...prev, [section.key]: e.target.value }))}
                                        className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-white text-sm outline-none focus:border-red-600"
                                        placeholder="https://"
                                    />
                                </div>
                                <div className="flex gap-2 text-xs text-zinc-600">
                                    <button 
                                        onClick={() => setMedia(prev => ({ ...prev, [section.key]: "" }))}
                                        className="hover:text-red-500"
                                    >
                                        Clear
                                    </button>
                                    <span>•</span>
                                    <label className="cursor-pointer hover:text-white transition-colors">
                                        Browse Computer...
                                        <input type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={(e) => handleFileUpload(e, section.key)} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
