"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../app/images/logo.png";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    const { isAuthenticated, isAdmin } = useAuth();

    // Filter out "Account" from main nav if not authenticated, or keep it and let it redirect to login?
    // Usually "Account" in nav is fine, page handles redirect. But we can make it dynamic.
    // For now I'll just leave it and add Login if not authenticated.
    // Actually, users usually expect "Login" instead of "Account" if logged out.
    // I'll filter out "Account" from the `navigation` array if not logged in, but let's just modify the array.

    const navigation = [
        { name: t.nav.home, href: "/" },
        { name: t.nav.blog, href: "/blog" },
        { name: t.nav.garage, href: "/garage" },
        { name: t.nav.shop, href: "/shop" },
    ];

    if (isAuthenticated) {
        navigation.push({ name: t.nav.account, href: "/account" });
    }

    return (
        <header className="bg-black text-white selection:bg-red-600 fixed w-full z-50 border-b border-zinc-900/50 backdrop-blur-md bg-black/80">
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5 focus:outline-none flex items-center gap-4">
                        <span className="sr-only">The Pace Note</span>
                        <Image
                            src={logo}
                            alt="The Pace Note"
                            className="h-10 w-auto"
                            priority
                        />
                        <span className="text-xl font-bold uppercase tracking-tighter text-white">The Pace Note</span>
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-zinc-400 hover:text-white"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-semibold leading-6 text-zinc-300 hover:text-white hover:text-red-500 transition-colors uppercase tracking-widest"
                        >
                            {item.name}
                        </Link>
                    ))}

                    {/* Auth Links */}
                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="text-sm font-bold leading-6 text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest"
                                >
                                    Admin
                                </Link>
                            )}
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="text-sm font-semibold leading-6 text-zinc-300 hover:text-white hover:text-red-500 transition-colors uppercase tracking-widest"
                        >
                            Login
                        </Link>
                    )}
                    <button
                        onClick={() => setLanguage(language === "RO" ? "EN" : "RO")}
                        className="text-sm font-semibold leading-6 text-zinc-300 hover:text-red-500 transition-colors uppercase tracking-widest ml-4"
                    >
                        {language}
                    </button>
                </div>
            </nav>
            <Dialog
                as="div"
                className="lg:hidden"
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
            >
                <div className="fixed inset-0 z-50 bg-black/90" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10 text-white">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3">
                            <span className="sr-only">The Pace Note</span>
                            <Image
                                src={logo}
                                alt="The Pace Note"
                                className="h-8 w-auto"
                            />
                            <span className="font-bold text-lg uppercase tracking-tighter">The Pace Note</span>
                        </Link>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-zinc-400 hover:text-white"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-zinc-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-zinc-100 hover:bg-zinc-900 hover:text-red-500 uppercase tracking-widest"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <button
                                    onClick={() => {
                                        setLanguage(language === "RO" ? "EN" : "RO");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-zinc-100 hover:bg-zinc-900 hover:text-red-500 uppercase tracking-widest text-left w-full"
                                >
                                    Language: {language}
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
}
