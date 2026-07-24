'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Icon from '@/components/Icon';

interface GalleryImage {
    id: number;
    url: string;
    alt: string;
}

export default function GalleryLightbox({ images }: { images: GalleryImage[] }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const close = useCallback(() => setActiveIndex(null), []);
    const showPrev = useCallback(
        () => setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
        [images.length]
    );
    const showNext = useCallback(
        () => setActiveIndex((i) => (i === null ? i : (i + 1) % images.length)),
        [images.length]
    );

    useEffect(() => {
        if (activeIndex === null) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };
        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [activeIndex, close, showPrev, showNext]);

    const active = activeIndex !== null ? images[activeIndex] : null;

    return (
        <>
            <div className="gallery-grid">
                {images.map((img, i) => (
                    <button
                        key={img.id}
                        type="button"
                        className="gallery-item"
                        onClick={() => setActiveIndex(i)}
                        aria-label={`View ${img.alt} full size`}
                    >
                        <Image
                            src={img.url}
                            alt={img.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                            style={{ objectFit: 'cover' }}
                        />
                        <span className="gallery-zoom-hint">
                            <Icon name="search" size={20} />
                        </span>
                    </button>
                ))}
            </div>

            {active && (
                <div className="lightbox-backdrop" onClick={close}>
                    <button type="button" className="lightbox-close" onClick={close} aria-label="Close">
                        ×
                    </button>
                    {images.length > 1 && (
                        <button
                            type="button"
                            className="lightbox-nav lightbox-prev"
                            onClick={(e) => { e.stopPropagation(); showPrev(); }}
                            aria-label="Previous image"
                        >
                            ‹
                        </button>
                    )}
                    <div className="lightbox-image-wrap" onClick={(e) => e.stopPropagation()}>
                        <img src={active.url} alt={active.alt} className="lightbox-image" />
                    </div>
                    {images.length > 1 && (
                        <button
                            type="button"
                            className="lightbox-nav lightbox-next"
                            onClick={(e) => { e.stopPropagation(); showNext(); }}
                            aria-label="Next image"
                        >
                            ›
                        </button>
                    )}
                    {images.length > 1 && (
                        <span className="lightbox-counter">{activeIndex! + 1} / {images.length}</span>
                    )}
                </div>
            )}
        </>
    );
}
