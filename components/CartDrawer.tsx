"use client";

import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { XMarkIcon, TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CartDrawer() {
    const { items, cartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

    return (
        <Transition show={cartOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setCartOpen}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-zinc-900 bg-opacity-75 transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <TransitionChild
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <DialogPanel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-black shadow-xl border-l border-zinc-800">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <DialogTitle className="text-lg font-bold text-white uppercase tracking-widest">
                                                    Shopping Cart
                                                </DialogTitle>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative -m-2 p-2 text-zinc-400 hover:text-gray-500"
                                                        onClick={() => setCartOpen(false)}
                                                    >
                                                        <span className="absolute -inset-0.5" />
                                                        <span className="sr-only">Close panel</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                <div className="flow-root">
                                                    {items.length === 0 ? (
                                                        <p className="text-zinc-500 text-center py-10">Your cart is empty.</p>
                                                    ) : (
                                                        <ul role="list" className="-my-6 divide-y divide-zinc-800">
                                                            {items.map((item) => (
                                                                <li key={item.id} className="flex py-6">
                                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-zinc-800 relative">
                                                                        {item.image ? (
                                                                            <Image
                                                                                src={item.image}
                                                                                alt={item.name}
                                                                                fill
                                                                                className="object-cover object-center"
                                                                            />
                                                                        ) : (
                                                                            <div className="h-full w-full bg-zinc-900 flex items-center justify-center text-zinc-700 text-xs">No Img</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="ml-4 flex flex-1 flex-col">
                                                                        <div>
                                                                            <div className="flex justify-between text-base font-medium text-white">
                                                                                <h3>
                                                                                    {item.name}
                                                                                </h3>
                                                                                <p className="ml-4">{item.price * item.quantity} RON</p>
                                                                            </div>
                                                                            {item.size && (
                                                                                <p className="mt-1 text-sm text-zinc-400">Size: {item.size}</p>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                                            <div className="flex items-center border border-zinc-800 rounded">
                                                                                <button
                                                                                    className="p-1 px-2 text-zinc-400 hover:text-white"
                                                                                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                                                                >
                                                                                    <MinusIcon className="h-3 w-3" />
                                                                                </button>
                                                                                <span className="px-2 text-white">{item.quantity}</span>
                                                                                <button
                                                                                    className="p-1 px-2 text-zinc-400 hover:text-white"
                                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                                >
                                                                                    <PlusIcon className="h-3 w-3" />
                                                                                </button>
                                                                            </div>

                                                                            <button
                                                                                type="button"
                                                                                className="font-medium text-red-500 hover:text-red-400 flex items-center gap-1"
                                                                                onClick={() => removeFromCart(item.id)}
                                                                            >
                                                                                <TrashIcon className="h-4 w-4" />
                                                                                Remove
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-zinc-800 px-4 py-6 sm:px-6">
                                            <div className="flex justify-between text-base font-medium text-white">
                                                <p className="uppercase tracking-widest">Subtotal</p>
                                                <p>{cartTotal} RON</p>
                                            </div>
                                            <p className="mt-0.5 text-sm text-zinc-500">Shipping and taxes calculated at checkout.</p>
                                            <div className="mt-6">
                                                <Link
                                                    href="/checkout"
                                                    className="flex items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-500 uppercase tracking-widest"
                                                    onClick={() => setCartOpen(false)}
                                                >
                                                    Checkout
                                                </Link>
                                            </div>
                                            <div className="mt-6 flex justify-center text-center text-sm text-zinc-500">
                                                <p>
                                                    or{" "}
                                                    <button
                                                        type="button"
                                                        className="font-medium text-red-500 hover:text-red-400"
                                                        onClick={() => setCartOpen(false)}
                                                    >
                                                        Continue Shopping
                                                        <span aria-hidden="true"> &rarr;</span>
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
