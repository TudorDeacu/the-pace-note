import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function AdminBlog() {
    const supabase = await createClient();
    const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">Blog Management</h1>
                <Link
                    href="/admin/blog/new"
                    className="bg-red-600 px-4 py-2 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-colors"
                >
                    Add New Article
                </Link>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                {!articles || articles.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 italic">
                        No articles found. Start by adding one.
                    </div>
                ) : (
                    <ul role="list" className="divide-y divide-zinc-800">
                        {articles.map((article) => (
                            <li key={article.id} className="flex items-center justify-between gap-x-6 py-5 px-6 hover:bg-zinc-800/50 transition-colors">
                                <div className="min-w-0">
                                    <div className="flex items-start gap-x-3">
                                        <p className="text-sm font-semibold leading-6 text-white uppercase tracking-wide">
                                            {article.title}
                                        </p>
                                        <p
                                            className={`rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${article.published
                                                    ? "text-green-400 bg-green-400/10 ring-green-400/20"
                                                    : "text-amber-400 bg-amber-400/10 ring-amber-400/20"
                                                }`}
                                        >
                                            {article.published ? "Published" : "Draft"}
                                        </p>
                                    </div>
                                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-zinc-400">
                                        <p className="truncate">/{article.slug}</p>
                                        <p>•</p>
                                        <p>
                                            {new Date(article.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-none items-center gap-x-4">
                                    <Link
                                        href={`/admin/blog/${article.id}`}
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
