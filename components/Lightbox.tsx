"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";

interface MediaItem {
    url: string;
    type: 'image' | 'video';
    name?: string;
}

interface LightboxProps {
    isOpen: boolean;
    onClose: () => void;
    media: MediaItem[];
    initialIndex?: number;
}

export default function Lightbox({ isOpen, onClose, media, initialIndex = 0 }: LightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [isOpen, initialIndex]);

    if (!isOpen || !media || media.length === 0) return null;

    const currentMedia = media[currentIndex];

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % media.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    return (
        <Dialog as="div" className="relative z-[100]" open={isOpen} onClose={onClose}>
            <div className="fixed inset-0 bg-black/95 backdrop-blur-sm transition-opacity" aria-hidden="true" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <DialogPanel className="relative transform overflow-hidden transition-all w-full h-screen flex items-center justify-center">
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="fixed top-6 right-6 z-[110] p-3 text-zinc-400 hover:text-white bg-black/70 hover:bg-red-600 rounded-full transition-all focus:outline-none"
                        >
                            <XMarkIcon className="w-8 h-8" />
                        </button>

                        {/* Navigation Buttons */}
                        {media.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prev(); }}
                                    className="fixed left-6 top-1/2 -translate-y-1/2 z-[110] p-4 text-white bg-black/70 hover:bg-red-600 rounded-full transition-all focus:outline-none"
                                >
                                    <ChevronLeftIcon className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); next(); }}
                                    className="fixed right-6 top-1/2 -translate-y-1/2 z-[110] p-4 text-white bg-black/70 hover:bg-red-600 rounded-full transition-all focus:outline-none"
                                >
                                    <ChevronRightIcon className="w-8 h-8" />
                                </button>
                                
                                {/* Mobile Touch Areas for Next/Prev (fallback) */}
                                <div className="fixed inset-y-0 left-0 w-1/4 z-[105] md:hidden" onClick={(e) => { e.stopPropagation(); prev(); }} />
                                <div className="fixed inset-y-0 right-0 w-1/4 z-[105] md:hidden" onClick={(e) => { e.stopPropagation(); next(); }} />
                            </>
                        )}

                        {/* Media Content */}
                        <div className="relative w-full h-full flex items-center justify-center p-0 md:p-16" onClick={onClose}>
                            <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                {currentMedia.type === 'image' ? (
                                    <Image
                                        src={currentMedia.url}
                                        alt={currentMedia.name || "Gallery Image"}
                                        fill
                                        className="object-contain"
                                        sizes="100vw"
                                        quality={100}
                                        priority
                                    />
                                ) : (
                                    <video
                                        src={currentMedia.url}
                                        controls
                                        autoPlay
                                        className="max-w-full max-h-full outline-none shadow-2xl"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Counter */}
                        {media.length > 1 && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-full text-sm font-semibold tracking-widest">
                                {currentIndex + 1} / {media.length}
                            </div>
                        )}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
