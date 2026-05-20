import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { encryptUrlParam } from "@/utils/encryption";
import T from "@/components/T";

export default async function AdminBlog() {
    const supabase = await createClient();
    const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .not('slug', 'like', 'page-%') // Exclude all dynamic admin pages
        .order('created_at', { ascending: false });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white"><T>Gestiune Blog</T></h1>
                <Link
                    href="/admin/blog/new"
                    className="bg-red-600 px-4 py-2 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-colors"
                >
                    <T>Adaugă Articol Nou</T>
                </Link>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                {!articles || articles.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 italic">
                        <T>Nu au fost găsite articole. Începe prin a adăuga unul.</T>
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
                                            {article.published ? <T>Publicat</T> : <T>Schiță</T>}
                                        </p>
                                    </div>
                                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-zinc-400">
                                        <p className="truncate">/{article.slug}</p>
                                        <p>•</p>
                                        <p>
                                            {new Date(article.created_at).toLocaleDateString()}
                                        </p>
                                        <p>•</p>
                                        <p className="text-zinc-300 font-semibold flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            {article.views || 0} <T>accesări</T>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-none items-center gap-x-4">
                                    <Link
                                        href={`/admin/blog/${encryptUrlParam(article.id)}`}
                                        className="hidden rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 sm:block uppercase tracking-wider"
                                    >
                                        <T>Editează</T>
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
