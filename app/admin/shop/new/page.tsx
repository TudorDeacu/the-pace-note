"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function NewProduct() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        stock: "",
        dimensions: "",
    });
    const [images, setImages] = useState<string[]>([""]);

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };

    const addImageField = () => {
        setImages([...images, ""]);
    };

    const removeImageField = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages.length ? newImages : [""]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const validImages = images.filter(img => img.trim() !== "");

        const { error } = await supabase
            .from('products')
            .insert({
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                stock: parseInt(formData.stock),
                dimensions: formData.dimensions,
                images: validImages,
            });

        if (error) {
            console.error(error);
            alert("Error saving product: " + error.message);
            setLoading(false);
        } else {
            router.push("/admin/shop");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        setLoading(true);
        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file);

        if (uploadError) {
            alert('Error uploading image: ' + uploadError.message);
            setLoading(false);
            return;
        }

        const { data } = supabase.storage.from('products').getPublicUrl(filePath);

        // Add the new URL to images
        const newImages = [...images];
        // Find first empty slot or append
        const emptyIndex = newImages.indexOf("");
        if (emptyIndex !== -1) {
            newImages[emptyIndex] = data.publicUrl;
        } else {
            newImages.push(data.publicUrl);
        }
        setImages(newImages);
        setLoading(false);
    };

    return (
        <div className="pb-20">
            <h1 className="text-3xl font-bold uppercase tracking-tighter text-white mb-8">Add New Product</h1>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-zinc-900 border border-zinc-800 p-8 rounded-lg">
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold leading-6 text-white uppercase tracking-widest">Product Name</label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="price" className="block text-sm font-semibold leading-6 text-white uppercase tracking-widest">Price (RON)</label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="price"
                                id="price"
                                required
                                min="0"
                                step="0.01"
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-semibold leading-6 text-white uppercase tracking-widest">Stock</label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="stock"
                                id="stock"
                                required
                                min="0"
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="dimensions" className="block text-sm font-semibold leading-6 text-white uppercase tracking-widest">Dimensions</label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="dimensions"
                            id="dimensions"
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                            placeholder="e.g. 50x70 cm"
                            value={formData.dimensions}
                            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold leading-6 text-white uppercase tracking-widest mb-2">Images</label>
                    <div className="space-y-3">
                        {images.map((img, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="url"
                                    required={index === 0}
                                    placeholder="Image URL"
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                                    value={img}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImageField(index)}
                                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                    disabled={images.length === 1}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addImageField}
                            className="text-sm text-red-500 font-bold uppercase tracking-wide hover:text-red-400 flex items-center gap-1"
                        >
                            <PlusIcon className="w-4 h-4" /> Add Another Image
                        </button>
                    </div>
                    <div className="mt-4 border-t border-zinc-800 pt-4">
                        <label className="block text-sm font-semibold leading-6 text-zinc-400 uppercase tracking-widest mb-2">Or Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="block w-full text-sm text-zinc-400
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-zinc-800 file:text-white
                              hover:file:bg-zinc-700
                            "
                        />
                        <p className="mt-1 text-xs text-zinc-500">Uploads to &apos;products&apos; bucket.</p>
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-semibold leading-6 text-white uppercase tracking-widest">Description</label>
                    <div className="mt-2">
                        <textarea
                            name="description"
                            id="description"
                            rows={5}
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-red-600 px-8 py-3 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
