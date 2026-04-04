"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isAdmin, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // If not authenticated, redirect to login
        if (!isAuthenticated && pathname !== "/admin/login") {
            router.push("/admin/login");
        }
    }, [isAuthenticated, router, pathname]);

    // Show loading or nothing while authentication state is being determined
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (!isAuthenticated) {
        return null; // Will redirect via useEffect
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
        <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row text-white w-full overflow-hidden">
            {/* Mobile Nav Top Bar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-black border-b border-zinc-800 shrink-0">
                <h1 className="text-xl font-bold uppercase tracking-tighter">TPN Admin</h1>
                <button
                    type="button"
                    className="p-2 text-zinc-400 hover:text-white focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
            </div>

            {/* Mobile Sidebar Dialog */}
            <Dialog as="div" className="relative z-50 md:hidden" open={isMobileMenuOpen} onClose={setIsMobileMenuOpen}>
                <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
                <div className="fixed inset-0 flex">
                    <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 flex-col bg-black border-r border-zinc-800">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                            <h1 className="text-xl font-bold uppercase tracking-tighter">TPN Admin</h1>
                            <button
                                type="button"
                                className="rounded-md p-2 text-zinc-400 hover:text-white focus:outline-none"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                            <Link
                                href="/admin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-4 py-2 rounded transition-colors ${pathname === "/admin" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                    }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/blog"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-4 py-2 rounded transition-colors ${pathname.startsWith("/admin/blog") ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                    }`}
                            >
                                Blog
                            </Link>
                            <Link
                                href="/admin/garage"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-4 py-2 rounded transition-colors ${pathname.startsWith("/admin/garage") ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                    }`}
                            >
                                Garage
                            </Link>
                            <Link
                                href="/admin/about"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-4 py-2 rounded transition-colors ${pathname.startsWith("/admin/about") ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                    }`}
                            >
                                About Us
                            </Link>
                            <Link
                                href="/admin/home"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-4 py-2 rounded transition-colors ${pathname.startsWith("/admin/home") ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                    }`}
                            >
                                Home Page
                            </Link>
                        </nav>
                        <div className="p-4 border-t border-zinc-900 space-y-3 shrink-0">
                            <Link
                                href="/"
                                className="block w-full px-4 py-2 text-center rounded transition-colors text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 text-sm font-semibold uppercase tracking-widest"
                            >
                                Exit to Site
                            </Link>
                            <button
                                onClick={logout}
                                className="block w-full px-4 py-2 text-center rounded transition-colors text-red-500 hover:text-white hover:bg-red-600 border border-red-900/30 hover:border-red-600 bg-red-950/20 text-sm font-semibold uppercase tracking-widest"
                            >
                                Logout
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 border-r border-zinc-800 bg-black min-h-screen flex-shrink-0 flex-col">
                <div>
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
                        {/* 
                        <Link
                            href="/admin/shop"
                            className={`block px-4 py-2 rounded transition-colors ${pathname.startsWith("/admin/shop") ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                }`}
                        >
                            Shop
                        </Link>
                        */}
                        <Link
                            href="/admin/garage"
                            className={`block px-4 py-2 rounded transition-colors ${pathname.startsWith("/admin/garage") ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                }`}
                        >
                            Garage
                        </Link>
                        <Link
                            href="/admin/about"
                            className={`block px-4 py-2 rounded transition-colors ${pathname.startsWith("/admin/about") ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                }`}
                        >
                            About Us
                        </Link>
                        <Link
                            href="/admin/home"
                            className={`block px-4 py-2 rounded transition-colors ${pathname.startsWith("/admin/home") ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                }`}
                        >
                            Home Page
                        </Link>
                    </nav>
                </div>

                {/* Exit Controls */}
                <div className="mt-auto p-4 border-t border-zinc-900 space-y-3">
                    <Link
                        href="/"
                        className="block w-full px-4 py-2 text-center rounded transition-colors text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 text-sm font-semibold uppercase tracking-widest"
                    >
                        Exit to Site
                    </Link>
                    <button
                        onClick={logout}
                        className="block w-full px-4 py-2 text-center rounded transition-colors text-red-500 hover:text-white hover:bg-red-600 border border-red-900/30 hover:border-red-600 bg-red-950/20 text-sm font-semibold uppercase tracking-widest"
                    >
                        Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0">
                {children}
            </main>
        </div>
    );
}
