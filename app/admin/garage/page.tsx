import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function AdminGarage() {
    const supabase = await createClient();
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">Garage Management</h1>
                <Link
                    href="/admin/garage/new"
                    className="bg-red-600 px-4 py-2 rounded text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-colors"
                >
                    Add New Project
                </Link>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                {!projects || projects.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 italic">
                        No projects found. Start by adding one.
                    </div>
                ) : (
                    <ul role="list" className="divide-y divide-zinc-800">
                        {projects.map((project) => (
                            <li key={project.id} className="flex items-center justify-between gap-x-6 py-5 px-6 hover:bg-zinc-800/50 transition-colors">
                                <div className="min-w-0">
                                    <div className="flex items-start gap-x-3">
                                        <p className="text-sm font-semibold leading-6 text-white uppercase tracking-wide">
                                            {project.title}
                                        </p>
                                        <p
                                            className={`rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${project.published
                                                ? "text-green-400 bg-green-400/10 ring-green-400/20"
                                                : "text-amber-400 bg-amber-400/10 ring-amber-400/20"
                                                }`}
                                        >
                                            {project.published ? "Published" : "Draft"}
                                        </p>
                                    </div>
                                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-zinc-400">
                                        <p className="truncate">/{project.slug}</p>
                                        <p>•</p>
                                        <p>
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-none items-center gap-x-4">
                                    <Link
                                        href={`/admin/garage/${project.id}`}
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
