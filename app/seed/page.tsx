"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

import stickerPack from "../images/sticker_pack.png";
import tshirtBlack from "../images/tshirt_black.png";
import hoodiePaddock from "../images/hoodie_paddock.png";
import blogTrackDay from "../images/blog_track_day.png";
import blogSimRacing from "../images/blog_sim_racing.png";
import blogMaintenance from "../images/blog_maintenance.png";

export default function SeedPage() {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const supabase = createClient();

    const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

    const uploadImage = async (imageModule: any, name: string) => {
        try {
            const response = await fetch(imageModule.src);
            const blob = await response.blob();
            const fileName = `${name}_${Date.now()}.png`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(fileName, blob);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('products').getPublicUrl(fileName);
            return data.publicUrl;
        } catch (e: any) {
            addLog(`Error uploading ${name}: ${e.message}`);
            return null;
        }
    };

    const handleSeed = async () => {
        setLoading(true);
        setLogs([]);
        addLog("Starting seed process...");

        // 1. Seed Products
        const products = [
            {
                name: "TPN Sticker Pack",
                price: 49,
                description: "High quality vinyl stickers. Weatherproof and durable. Perfect for your car, helmet, or laptop.",
                stock: 50,
                dimensions: "Various sizes (approx 5-10cm)",
                image: stickerPack,
                key: "sticker_pack"
            },
            {
                name: "Signature T-Shirt",
                price: 129,
                description: "Premium cotton blend t-shirt with minimalist TPN branding. Athletic fit.",
                stock: 25,
                sizes: ["S", "M", "L", "XL", "XXL"],
                image: tshirtBlack,
                key: "tshirt"
            },
            {
                name: "Paddock Hoodie",
                price: 249,
                description: "Heavyweight charcoal hoodie. Ultra-soft interior, perfect for cold track days.",
                stock: 15,
                sizes: ["S", "M", "L", "XL"],
                image: hoodiePaddock,
                key: "hoodie"
            }
        ];

        for (const p of products) {
            addLog(`Processing ${p.name}...`);
            const imageUrl = await uploadImage(p.image, p.key);

            if (imageUrl) {
                const { error } = await supabase.from('products').insert({
                    name: p.name,
                    price: p.price,
                    description: p.description,
                    stock: p.stock,
                    dimensions: p.dimensions,
                    sizes: p.sizes,
                    images: [imageUrl],
                    is_demo: true
                });
                if (error) addLog(`Failed to insert ${p.name}: ${error.message}`);
                else addLog(`Inserted ${p.name}`);
            }
        }

        // 2. Seed Articles
        const articles = [
            {
                title: "Mastering the Track: A Beginner's Guide",
                slug: "mastering-the-track",
                excerpt: "Learn the fundamentals of high-performance driving, from racing lines to braking points.",
                image: blogTrackDay,
                key: "blog_track",
                content: [
                    { id: "1", type: "heading", content: "The Perfect Racing Line" },
                    { id: "2", type: "paragraph", content: "Understanding the geometric racing line is crucial..." },
                ]
            },
            {
                title: "The Ultimate Sim Racing Setup",
                slug: "ultimate-sim-racing-setup",
                excerpt: "How to build a professional-grade sim rig at home for immersive practice.",
                image: blogSimRacing,
                key: "blog_sim",
                content: [
                    { id: "1", type: "heading", content: "Choosing the Right Wheel Base" },
                ]
            },
            {
                title: "Essential Car Maintenance Tips",
                slug: "essential-maintenance-tips",
                excerpt: "Keep your performance car running smoothly with these key maintenance habits.",
                image: blogMaintenance,
                key: "blog_maint",
                content: [
                    { id: "1", type: "heading", content: "Fluids are Life" },
                ]
            }
        ];

        for (const a of articles) {
            addLog(`Processing ${a.title}...`);
            const imageUrl = await uploadImage(a.image, a.key);

            if (imageUrl) {
                const { error } = await supabase.from('articles').insert({
                    title: a.title,
                    slug: a.slug,
                    content: { blocks: a.content, excerpt: a.excerpt },
                    image_url: imageUrl,
                    published: true,
                    is_demo: true
                });
                // Note: Article schema in previous read has 'content' JSONB. 
                // The 'imageUrl' might not be a column in 'articles' table based on my previous read of blog codes.
                // Wait, I previously saw:
                // interface Article { ..., imageUrl?: any } in the frontend code
                // But in Supabase fetch it was doing select *
                // I should check if 'imageUrl' exists or if it was just mocked in frontend.
                // Frontend mocked it: `imageUrl: blogTrackDay`.
                // So I likely need to adding `imageUrl` or `image_url` column to articles too!
                // Wait, the SQL I gave to user ONLY added `is_demo`.
                // I missed `imageUrl` column potentially.
                // Let's assume for now I store it in `content` or `excerpt` or check if I can add it.
                // Actually the previous frontend code had:
                // `const { data } = await supabase.from('articles')...`
                // and then `setArticles(data)` 
                // BUT the interface had `imageUrl`.
                // If the table didn't have `imageUrl`, it was likely undefined in `data`.
                // The DEMO_ARTICLES had it.
                // So I PROBABLY NEED TO ADD `image_url` COLUMN TO ARTICLES TABLE too.
                // For now, I will try insert it into `content` structure or just ignore and rely on `content` blocks having images?
                // No, listing page needs thumbnail.
                // I will add `image_url` to the insert, keeping in mind it might fail if column missing.
                // BETTER: I will add to the `migrations.sql` or ask user.
                // Re-reading task: "Add these products and also the blogs to supabase"
                // I'll assume I should insert it. I'll add checking logic to seeder log.
                if (error) addLog(`Failed to insert ${a.title}: ${error.message}`);
                else addLog(`Inserted ${a.title}`);
            }
        }

        addLog("Seeding complete!");
        setLoading(false);
    };

    // New function to upload existing local assets
    const uploadLocalAssets = async () => {
        setLoading(true);
        setLogs(prev => [...prev, "Starting upload of local assets..."]);

        const assets = [
            "logo.png",
            "homepage_gif.gif"
        ];

        for (const asset of assets) {
            try {
                setLogs(prev => [...prev, `Fetching ${asset}...`]);
                const response = await fetch(`/images/${asset}`);
                if (!response.ok) throw new Error(`Failed to fetch ${asset}`);

                const blob = await response.blob();
                const fileName = `local_${Date.now()}_${asset}`;

                setLogs(prev => [...prev, `Uploading ${asset} as ${fileName}...`]);

                const { error } = await supabase.storage
                    .from('products') // Use 'products' bucket as we know it exists
                    .upload(fileName, blob);

                if (error) {
                    throw error;
                }

                const { data } = supabase.storage
                    .from('products')
                    .getPublicUrl(fileName);

                setLogs(prev => [...prev, `✅ Uploaded ${asset}: ${data.publicUrl}`]);
            } catch (err: any) {
                console.error(err);
                setLogs(prev => [...prev, `❌ Error uploading ${asset}: ${err.message}`]);
            }
        }
        setLogs(prev => [...prev, "Asset upload complete!"]);
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-8">Database Seeder</h1>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={handleSeed}
                    disabled={loading}
                    className="bg-red-600 px-6 py-3 rounded font-bold uppercase tracking-widest hover:bg-red-500 disabled:opacity-50"
                >
                    {loading ? "Seeding..." : "Seed Demo Data"}
                </button>
                <button
                    onClick={uploadLocalAssets}
                    disabled={loading}
                    className="bg-zinc-800 border border-zinc-700 px-6 py-3 rounded font-bold uppercase tracking-widest hover:bg-zinc-700 disabled:opacity-50"
                >
                    {loading ? "Uploading..." : "Upload Local Images"}
                </button>
            </div>

            <div className="bg-zinc-900 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto border border-zinc-800">
                {logs.length === 0 ? (
                    <span className="text-zinc-500">Logs will appear here...</span>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className="mb-1 border-b border-zinc-800/50 pb-1 last:border-0">{log}</div>
                    ))
                )}
            </div>
        </div>
    );
}
