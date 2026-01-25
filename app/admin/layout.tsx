"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If not authenticated, redirect to login
        if (!isAuthenticated && pathname !== "/admin/login") {
            router.push("/admin/login");
        }
    }, [isAuthenticated, router, pathname]);

    // Show loading or nothing while authentication state is being determined
    // (This simple check assumes isAuthenticated becomes true only after loading finishes, 
    // but AdminAuthContext should probably expose a 'loading' state for better UX, 
    // for now we rely on the context's internal loading state which prevents children render if we moved it up,
    // but here we just check values. Authentication check is async so there might be a flash.)

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (!isAuthenticated) {
        return null;
    }

    // Role check
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col gap-4">
                <p className="text-red-500 font-bold text-xl uppercase tracking-widest">Access Denied</p>
                <p className="text-zinc-400">You do not have permission to view this area.</p>
                <button
                    onClick={() => router.push("/admin/login")}
                    className="mt-4 bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700 transition-colors"
                >
                    Back to Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800 bg-black min-h-screen flex-shrink-0">
                <div className="p-6">
                    <h1 className="text-xl font-bold uppercase tracking-tighter">TPN Admin</h1>
                </div>
                <nav className="px-4 space-y-2">
                    <Link
                        href="/admin"
                        className={`block px-4 py-2 rounded transition-colors ${pathname === "/admin" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                            }`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/blog"
                        className={`block px-4 py-2 rounded transition-colors ${pathname.startsWith("/admin/blog") ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                            }`}
                    >
                        Blog
                    </Link>
                    <Link
                        href="/admin/shop"
                        className={`block px-4 py-2 rounded transition-colors ${pathname.startsWith("/admin/shop") ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                            }`}
                    >
                        Shop
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
