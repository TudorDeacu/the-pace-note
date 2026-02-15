"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Account() {
    const { t } = useLanguage();
    const { user, role, logout, isAuthenticated, loading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [loading, isAuthenticated, router]);

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    if (!isAuthenticated) return null; // Redirecting

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="pt-32 px-6 lg:px-8 max-w-7xl mx-auto pb-20">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight uppercase">
                            {t.account_page.title}
                        </h2>
                        <p className="mt-1 text-zinc-400">
                            Welcome back, <span className="text-white font-semibold">{user?.email}</span>
                        </p>
                        <p className="text-sm text-zinc-500 mt-1">Role: <span className="uppercase">{role || 'User'}</span></p>
                    </div>
                    <div className="mt-4 flex md:ml-4 md:mt-0">
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="ml-3 inline-flex items-center rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 uppercase tracking-wide mr-4"
                            >
                                Admin Dashboard
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={() => logout()}
                            className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 uppercase tracking-wide"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="mt-10 border-t border-zinc-800 pt-10">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-4">Account Details</h3>
                    <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800 max-w-2xl">
                        <dl className="divide-y divide-zinc-800">
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 text-zinc-400">First Name</dt>
                                <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">{user?.user_metadata?.first_name || 'N/A'}</dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 text-zinc-400">Last Name</dt>
                                <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">{user?.user_metadata?.last_name || 'N/A'}</dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 text-zinc-400">Username</dt>
                                <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">{user?.user_metadata?.username || 'N/A'}</dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 text-zinc-400">Email address</dt>
                                <dd className="mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0">{user?.email}</dd>
                            </div>

                        </dl>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
