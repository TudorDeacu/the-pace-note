"use client";

import { useState, useEffect, useMemo } from "react";
import Lightbox from "@/components/Lightbox";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

interface MediaItem {
    url: string;
    type: 'image' | 'video';
    name?: string;
}

interface GridImage {
    src: string;
    width: number;
    height: number;
    alt: string;
    originalIndex: number;
}

export default function GalleryGrid({ media }: { media: MediaItem[] }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gridImages, setGridImages] = useState<GridImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const safeMedia = useMemo(() => {
        return Array.isArray(media) ? media.filter(m => m.type === 'image' && m.url) : [];
    }, [media]);

    useEffect(() => {
        if (safeMedia.length === 0) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        const loadImages = async () => {
            const loadedImages: GridImage[] = [];
            
            const loadPromises = safeMedia.map((item, index) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    img.src = item.url;
                    img.onload = () => {
                        loadedImages[index] = {
                            src: item.url,
                            width: img.naturalWidth || 400,
                            height: img.naturalHeight || 300,
                            alt: item.name || `Gallery item ${index + 1}`,
                            originalIndex: index
                        };
                        resolve();
                    };
                    img.onerror = () => {
                        // fallback dimensions if image fails to load sizes
                        loadedImages[index] = {
                            src: item.url,
                            width: 400,
                            height: 300,
                            alt: item.name || `Gallery item ${index + 1}`,
                            originalIndex: index
                        };
                        resolve();
                    };
                });
            });

            await Promise.all(loadPromises);
            
            if (isMounted) {
                // Filter out any undefined just in case
                setGridImages(loadedImages.filter(Boolean));
                setIsLoading(false);
            }
        };

        loadImages();

        return () => {
            isMounted = false;
        };
    }, [safeMedia]);

    if (safeMedia.length === 0) {
        return (
            <div className="text-center text-zinc-500 italic p-12 my-12">
                Nu există poze în acest album.
            </div>
        );
    }

    const handleImageClick = ({ index }: { index: number }) => {
        setCurrentIndex(gridImages[index].originalIndex);
        setLightboxOpen(true);
    };

    return (
        <section className="w-full my-8">
            {isLoading ? (
                <div className="flex items-center justify-center h-64 text-zinc-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e9482f]"></div>
                    <span className="ml-3 uppercase tracking-widest text-sm font-bold">Se încarcă fotografiile...</span>
                </div>
            ) : (
                <div className="w-full">
                    <RowsPhotoAlbum 
                        photos={gridImages} 
                        onClick={handleImageClick}
                        targetRowHeight={180}
                        spacing={4}
                    />
                </div>
            )}

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
