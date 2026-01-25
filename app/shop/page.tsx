"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    images: string[] | null;
}

export default function Shop() {
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchProducts() {
            const { data } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) {
                setProducts(data);
            }
            setLoading(false);
        }
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl uppercase">{t.shop.title}</h2>
                        <p className="mt-2 text-lg leading-8 text-zinc-400">
                            {t.shop.description}
                        </p>
                    </div>
                    <div className="mt-10 border-t border-zinc-800 pt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {loading ? (
                            <p className="text-zinc-500">Loading products...</p>
                        ) : products.length === 0 ? (
                            <p className="text-zinc-500 italic">{t.shop.empty}</p>
                        ) : (
                            products.map((product) => (
                                <a key={product.id} href={`/shop/${product.id}`} className="group"> {/* Link to single product page */}
                                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-zinc-800 xl:aspect-h-8 xl:aspect-w-7">
                                        {product.images && product.images[0] ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="h-full w-full object-cover object-center group-hover:opacity-75"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-zinc-600">No Image</div>
                                        )}
                                    </div>
                                    <h3 className="mt-4 text-sm text-zinc-300 uppercase tracking-wide font-bold">{product.name}</h3>
                                    <p className="mt-1 text-lg font-medium text-white">{product.price} RON</p>
                                </a>
                            ))
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
