"use client";

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    isOpen,
    title,
    description,
    confirmText = "Șterge",
    cancelText = "Anulează",
    onConfirm,
    onCancel
}: ConfirmModalProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onCancel}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 text-left align-middle shadow-2xl transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20">
                                        <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                                    </div>
                                    <DialogTitle
                                        as="h3"
                                        className="text-lg font-bold leading-6 text-white uppercase tracking-widest"
                                    >
                                        {title}
                                    </DialogTitle>
                                </div>
                                
                                <div className="mt-4">
                                    <p className="text-sm text-zinc-400">
                                        {description}
                                    </p>
                                </div>

                                <div className="mt-8 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-sm font-bold uppercase tracking-widest text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors focus:outline-none"
                                        onClick={onCancel}
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-bold uppercase tracking-widest text-white hover:bg-red-500 transition-colors focus:outline-none"
                                        onClick={onConfirm}
                                    >
                                        {confirmText}
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
