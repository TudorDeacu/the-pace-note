"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeftIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

import stickerPack from "../../images/sticker_pack.png";
import tshirtBlack from "../../images/tshirt_black.png";
import hoodiePaddock from "../../images/hoodie_paddock.png";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    dimensions?: string;
    images: any[] | null;
    sizes?: string[];
}

const DEMO_PRODUCTS: Product[] = [
    {
        id: "demo-1",
        name: "TPN Sticker Pack",
        price: 49,
        description: "High quality vinyl stickers. Weatherproof and durable. Perfect for your car, helmet, or laptop. Includes 5 unique designs.",
        stock: 50,
        dimensions: "Various sizes (approx 5-10cm)",
        images: [stickerPack],
    },
    {
        id: "demo-2",
        name: "Signature T-Shirt",
        price: 129,
        description: "Premium cotton blend t-shirt with minimalist TPN branding. Athletic fit, pre-shrunk, and designed for comfort in the paddock or on the street.",
        stock: 25,
        sizes: ["S", "M", "L", "XL", "XXL"],
        images: [tshirtBlack],
    },
    {
        id: "demo-3",
        name: "Paddock Hoodie",
        price: 249,
        description: "Heavyweight charcoal hoodie. Ultra-soft interior, perfect for cold track days. Features embroidered logo and reinforced stitching.",
        stock: 15,
        sizes: ["S", "M", "L", "XL"],
        images: [hoodiePaddock],
    },
];

export default function ProductPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<any | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const supabase = createClient();

    useEffect(() => {
        async function fetchProduct() {
            if (!params?.id) return;
            const id = params.id as string;

            if (id.startsWith("demo-")) {
                const demoProduct = DEMO_PRODUCTS.find((p) => p.id === id);
                if (demoProduct) {
                    setProduct(demoProduct);
                    if (demoProduct.images && demoProduct.images.length > 0) {
                        setSelectedImage(demoProduct.images[0]);
                    }
                }
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
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
                        <div className="aspect-square w-full overflow-hidden rounded-lg bg-zinc-800 relative">
                            {selectedImage ? (
                                <Image
                                    src={selectedImage}
                                    alt={product.name}
                                    fill
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
                                        className={`flex-none w-20 h-20 rounded-md overflow-hidden border-2 relative ${selectedImage === img ? "border-red-600" : "border-transparent"}`}
                                    >
                                        <Image src={img} alt="" fill className="w-full h-full object-cover" />
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
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-3">Select Size</h3>
                                    <div className="flex gap-3">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`min-w-[3rem] h-12 px-4 rounded flex items-center justify-center text-sm font-bold uppercase transition-colors ${selectedSize === size
                                                    ? "bg-white text-black"
                                                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-3">Quantity</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center rounded bg-zinc-900">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-3 text-zinc-400 hover:text-white transition-colors"
                                        >
                                            <MinusIcon className="w-4 h-4" />
                                        </button>
                                        <span className="w-10 text-center font-bold">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="p-3 text-zinc-400 hover:text-white transition-colors"
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-zinc-500">
                                        {product.stock} available
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            className="mt-8 w-full bg-red-600 px-8 py-4 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
                            disabled={product.stock <= 0 || (!!product.sizes && !selectedSize)}
                            onClick={() => {
                                if (product) {
                                    addToCart(product, selectedSize, quantity);
                                }
                            }}
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
