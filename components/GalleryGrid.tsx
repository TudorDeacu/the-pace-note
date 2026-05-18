"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Lightbox from "@/components/Lightbox";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

interface MediaItem {
    url: string;
    type: 'image' | 'video';
    name?: string;
}

export default function GalleryGrid({ media }: { media: MediaItem[] }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const safeMedia = Array.isArray(media) ? media : [];

    useEffect(() => {
        if (safeMedia.length <= 1) return;
        const timer = setTimeout(() => {
            handleNextClick();
        }, 5000);
        return () => clearTimeout(timer);
    }, [currentIndex, safeMedia.length]);

    if (safeMedia.length === 0) {
        return (
            <div className="text-center text-white bg-red-600 font-bold p-12 rounded-xl my-12 border-4 border-yellow-400">
                <h2>DEBUG INFO: ARRAY GOL</h2>
                <p>Nu s-au găsit elemente valide în galerie.</p>
                <p className="mt-4 text-sm font-normal">Valoarea inițială primită: {JSON.stringify(media)}</p>
            </div>
        );
    }

    const openLightbox = () => {
        setLightboxOpen(true);
    };

    const handleNextClick = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % safeMedia.length);
    };

    const handlePreviousClick = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? safeMedia.length - 1 : prev - 1));
    };

    return (
        <section className="w-full flex flex-col items-center justify-center my-8">
            <style>{`
                @keyframes fadeInCarousel {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
                .carousel-img-block {
                    display: block;
                    animation: fadeInCarousel 0.6s ease;
                }
            `}</style>
            
            <div className="relative flex items-center justify-center max-w-[800px] w-full mx-auto overflow-hidden rounded-2xl bg-white shadow-[0_10px_20px_rgba(0,0,0,0.08)] h-[300px] md:h-[500px]">
                
                {/* Previous Button */}
                {safeMedia.length > 1 && (
                    <button 
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/40 text-white border-none rounded-full text-2xl cursor-pointer flex items-center justify-center opacity-80 hover:opacity-100 hover:bg-white/60 transition-all z-10 p-0 leading-none"
                        onClick={handlePreviousClick}
                    >
                        &lt;
                    </button>
                )}

                {/* Images Container */}
                <div 
                    className="w-full h-full cursor-pointer flex items-center justify-center bg-black"
                    onClick={openLightbox}
                >
                    {safeMedia.map((item, index) => {
                        const isVisible = currentIndex === index;
                        
                        if (!item.url) return null;

                        return (
                            <div 
                                key={index} 
                                className={`w-full h-full relative ${isVisible ? 'carousel-img-block' : 'hidden'}`}
                            >
                                {item.type === 'image' ? (
                                    <Image
                                        src={item.url}
                                        alt={item.name || `Gallery item ${index + 1}`}
                                        fill
                                        className="object-cover rounded-xl"
                                        priority={index === 0}
                                    />
                                ) : (
                                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                                        <video
                                            src={item.url}
                                            className="w-full h-full object-cover rounded-xl"
                                            controls={false}
                                            autoPlay={isVisible}
                                            muted
                                            loop
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors pointer-events-none">
                                            <PlayCircleIcon className="w-16 h-16 text-white/80 drop-shadow-lg" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Next Button */}
                {safeMedia.length > 1 && (
                    <button 
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/40 text-white border-none rounded-full text-2xl cursor-pointer flex items-center justify-center opacity-80 hover:opacity-100 hover:bg-white/60 transition-all z-10 p-0 leading-none"
                        onClick={handleNextClick}
                    >
                        &gt;
                    </button>
                )}
            </div>

            {/* Lightbox Component */}
            <Lightbox
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                media={safeMedia}
                initialIndex={currentIndex}
            />
        </section>
    );
}
