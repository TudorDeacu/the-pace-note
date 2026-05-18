import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { encryptUrlParam } from "@/utils/encryption";
import T from "@/components/T";

export default async function AdminGalleries() {
    const supabase = await createClient();
    const { data: galleries } = await supabase
        .from('galleries')
        .select('*')
        .order('event_date', { ascending: false });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white"><T>Gestiune Galerii</T></h1>
                <Link
                    href="/admin/galleries/new"
                    className="bg-red-600 px-4 py-2 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-colors"
                >
                    <T>Creare Galerie Nouă</T>
                </Link>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                {!galleries || galleries.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 italic">
                        <T>Nu a fost găsită nicio galerie. Începe prin a crea una.</T>
                    </div>
                ) : (
                    <ul role="list" className="divide-y divide-zinc-800">
                        {galleries.map((gallery) => (
                            <li key={gallery.id} className="flex items-center justify-between gap-x-6 py-5 px-6 hover:bg-zinc-800/50 transition-colors">
                                <div className="min-w-0">
                                    <div className="flex items-start gap-x-3">
                                        <p className="text-sm font-semibold leading-6 text-white uppercase tracking-wide">
                                            {gallery.title}
                                        </p>
                                        <p
                                            className={`rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset text-blue-400 bg-blue-400/10 ring-blue-400/20`}
                                        >
                                            {gallery.media?.length || 0} <T>fișiere media</T>
                                        </p>
                                    </div>
                                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-zinc-400">
                                        <p><T>Data Eveniment:</T> {new Date(gallery.event_date).toLocaleDateString()}</p>
                                        <p>•</p>
                                        <p>
                                            <T>Creat:</T> {new Date(gallery.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-none items-center gap-x-4">
                                    <Link
                                        href={`/admin/galleries/${encryptUrlParam(gallery.id)}`}
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
