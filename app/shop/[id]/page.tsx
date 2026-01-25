"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    dimensions: string;
    images: string[] | null;
}

export default function ProductPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        async function fetchProduct() {
            if (!params?.id) return;

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', params.id)
                .single();

            if (data) {
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setSelectedImage(data.images[0]);
                }
            } else {
                console.error("Error fetching product:", error);
            }
            setLoading(false);
        }
        fetchProduct();
    }, [params?.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Loading product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center flex-col gap-4">
                <p className="text-white">Product not found.</p>
                <Link href="/shop" className="text-red-500 hover:text-red-400">Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="pt-32 px-6 lg:px-8 max-w-7xl mx-auto pb-20">
                <Link href="/shop" className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors uppercase text-sm font-bold tracking-widest">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Shop
                </Link>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
                    {/* Image Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-zinc-800">
                            {selectedImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-zinc-600">No Image</div>
                            )}
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`flex-none w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === img ? "border-red-600" : "border-transparent"}`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 lg:mt-0">
                        <h1 className="text-3xl font-bold uppercase tracking-tighter sm:text-4xl">{product.name}</h1>
                        <p className="text-2xl mt-4 font-medium text-red-500">{product.price} RON</p>

                        <div className="mt-8 border-t border-zinc-800 pt-8">
                            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Description</h3>
                            <div className="mt-4 prose prose-invert">
                                <p className="whitespace-pre-wrap">{product.description}</p>
                            </div>
                        </div>

                        {product.dimensions && (
                            <div className="mt-8 border-t border-zinc-800 pt-8">
                                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Dimensions</h3>
                                <p className="mt-2">{product.dimensions}</p>
                            </div>
                        )}

                        <div className="mt-8 border-t border-zinc-800 pt-8">
                            <p className="text-sm text-zinc-400">
                                Stock: <span className={product.stock > 0 ? "text-green-500" : "text-red-500"}>{product.stock > 0 ? `${product.stock} available` : "Out of Stock"}</span>
                            </p>
                        </div>

                        <button
                            className="mt-8 w-full bg-red-600 px-8 py-4 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={product.stock <= 0}
                        >
                            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
