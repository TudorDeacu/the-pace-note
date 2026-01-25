import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function AdminShop() {
    const supabase = await createClient();
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">Shop Management</h1>
                <Link
                    href="/admin/shop/new"
                    className="bg-red-600 px-4 py-2 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-colors"
                >
                    Add New Product
                </Link>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                {!products || products.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 italic">
                        No products found. Start by adding one.
                    </div>
                ) : (
                    <ul role="list" className="divide-y divide-zinc-800">
                        {products.map((product) => (
                            <li key={product.id} className="flex items-center justify-between gap-x-6 py-5 px-6 hover:bg-zinc-800/50 transition-colors">
                                <div className="min-w-0 flex items-center gap-4">
                                    {product.images && product.images[0] && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={product.images[0]} alt={product.name} className="h-12 w-12 flex-none rounded-md bg-zinc-800 object-cover" />
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold leading-6 text-white uppercase tracking-wide">
                                            {product.name}
                                        </p>
                                        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-zinc-400">
                                            <p>{product.price} RON</p>
                                            <p>•</p>
                                            <p>Stock: {product.stock}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-none items-center gap-x-4">
                                    <Link
                                        href={`/admin/shop/${product.id}`}
                                        className="hidden rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 sm:block uppercase tracking-wider"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
