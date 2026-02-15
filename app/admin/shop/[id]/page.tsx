"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { PlusIcon, TrashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    dimensions?: string;
    sizes?: string[]; // Array of strings or null
    images: string[] | null;
}

export default function EditProduct() {
    const router = useRouter();
    const params = useParams();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        stock: "",
        dimensions: "",
    });
    const [images, setImages] = useState<string[]>([""]);
    const [sizes, setSizes] = useState<string[]>([]); // S, M, L, XL etc.

    // Fetch Product Data
    useEffect(() => {
        async function fetchProduct() {
            if (!params?.id) return;

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', params.id)
                .single();

            if (data) {
                setFormData({
                    name: data.name,
                    price: data.price.toString(),
                    description: data.description || "",
                    stock: data.stock.toString(),
                    dimensions: data.dimensions || "",
                });
                setImages(data.images || [""]);
                setSizes(data.sizes || []);
            } else {
                console.error("Error fetching product:", error);
                alert("Product not found");
                router.push("/admin/shop");
            }
            setLoading(false);
        }
        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.id]);

    // Image Handlers
    const handleImageChange = (index: number, value: string) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };

    const addImageField = () => setImages([...images, ""]);
    const removeImageField = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages.length ? newImages : [""]);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        setSaving(true);
        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file);

        if (uploadError) {
            alert('Error uploading image: ' + uploadError.message);
            setSaving(false);
            return;
        }

        const { data } = supabase.storage.from('products').getPublicUrl(filePath);

        const newImages = [...images];
        const emptyIndex = newImages.indexOf("");
        if (emptyIndex !== -1) newImages[emptyIndex] = data.publicUrl;
        else newImages.push(data.publicUrl);

        setImages(newImages);
        setSaving(false);
    };

    // Size Handlers
    const handleSizeChange = (index: number, value: string) => {
        const newSizes = [...sizes];
        newSizes[index] = value.toUpperCase();
        setSizes(newSizes);
    };
    const addSizeField = () => setSizes([...sizes, ""]);
    const removeSizeField = (index: number) => {
        setSizes(sizes.filter((_, i) => i !== index));
    };

    // Submit Handler (Update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const validImages = images.filter(img => img.trim() !== "");
        const validSizes = sizes.filter(s => s.trim() !== "");

        const { error } = await supabase
            .from('products')
            .update({
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                stock: parseInt(formData.stock),
                dimensions: formData.dimensions,
                images: validImages,
                sizes: validSizes.length > 0 ? validSizes : null // Send null if empty
            })
            .eq('id', params?.id);

        if (error) {
            alert("Error updating product: " + error.message);
            setSaving(false);
        } else {
            router.push("/admin/shop");
        }
    };

    // Delete Handler
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

        setSaving(true);
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', params?.id);

        if (error) {
            alert("Error deleting product: " + error.message);
            setSaving(false);
        } else {
            router.push("/admin/shop");
        }
    };

    if (loading) return <div className="p-20 text-white">Loading...</div>;

    return (
        <div className="pb-20 max-w-4xl mx-auto">
            <Link href="/admin/shop" className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors uppercase text-sm font-bold tracking-widest">
                <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Shop
            </Link>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">Edit Product</h1>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-red-500 px-4 py-2 rounded font-bold uppercase tracking-widest hover:bg-red-900/20 hover:border-red-900 transition-colors disabled:opacity-50"
                >
                    <TrashIcon className="w-5 h-5" /> Delete Product
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 border border-zinc-800 p-8 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-white uppercase tracking-widest mb-2">Product Name</label>
                        <input
                            type="text"
                            required
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-red-600 sm:text-sm px-3"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-white uppercase tracking-widest mb-2">Dimensions (Optional)</label>
                        <input
                            type="text"
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-red-600 sm:text-sm px-3"
                            placeholder="e.g. 10x10cm"
                            value={formData.dimensions}
                            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-white uppercase tracking-widest mb-2">Price (RON)</label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-red-600 sm:text-sm px-3"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-white uppercase tracking-widest mb-2">Stock</label>
                        <input
                            type="number"
                            required
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-red-600 sm:text-sm px-3"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        />
                    </div>
                </div>

                {/* Sizes Section */}
                <div>
                    <label className="block text-sm font-semibold text-white uppercase tracking-widest mb-2">Sizes (Optional)</label>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size, index) => (
                            <div key={index} className="flex items-center gap-1">
                                <input
                                    type="text"
                                    className="w-16 rounded-md border-0 bg-white/5 py-1 text-center text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-red-600 text-sm uppercase"
                                    value={size}
                                    onChange={(e) => handleSizeChange(index, e.target.value)}
                                />
                                <button type="button" onClick={() => removeSizeField(index)} className="text-zinc-500 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                        ))}
                        <button type="button" onClick={addSizeField} className="px-3 py-1 bg-zinc-800 text-xs text-white uppercase font-bold rounded hover:bg-zinc-700">Add Size</button>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">e.g. S, M, L, XL</p>
                </div>

                {/* Images Section */}
                <div>
                    <label className="block text-sm font-semibold text-white uppercase tracking-widest mb-2">Images</label>
                    <div className="space-y-3">
                        {images.map((img, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="url"
                                    placeholder="Image URL"
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-red-600 sm:text-sm px-3"
                                    value={img}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                />
                                <button type="button" onClick={() => removeImageField(index)} className="p-2 text-zinc-400 hover:text-red-500">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addImageField} className="text-sm text-red-500 font-bold uppercase tracking-wide flex items-center gap-1">
                            <PlusIcon className="w-4 h-4" /> Add Another Image
                        </button>

                        <div className="mt-4 border-t border-zinc-800 pt-4">
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Or Upload</label>
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-white uppercase tracking-widest mb-2">Description</label>
                    <textarea
                        rows={5}
                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-red-600 sm:text-sm px-3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="pt-4 border-t border-zinc-800">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-red-600 px-8 py-3 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-colors disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Update Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
