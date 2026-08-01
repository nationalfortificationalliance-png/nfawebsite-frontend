'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface Breadcrumb {
    label: string;
    href?: string;
}

interface PageHeroProps {
    image: { src: string; alt: string };
    title: ReactNode;
    description: ReactNode;
    breadcrumbs: Breadcrumb[];
    children?: ReactNode;
}

export default function PageHero({ image, title, description, breadcrumbs, children }: PageHeroProps) {
    return (
        <div className="page-hero">
            <div className="page-hero-bg">
                <Image src={image.src} alt={image.alt} fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            </div>
            <div className="container page-hero-content">
                <div className="breadcrumb">
                    {breadcrumbs.map((crumb, index) => (
                        <span key={index}>
                            {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span>{crumb.label}</span>}
                            {index < breadcrumbs.length - 1 && <span className="breadcrumb-sep">›</span>}
                        </span>
                    ))}
                </div>
                <h1>{title}</h1>
                <p>{description}</p>
                {children}
            </div>

            <style jsx>{`
                .page-hero {
                    position: relative;
                    min-height: 340px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }
                .page-hero-bg {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                }
                .page-hero-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(0, 82, 73, 0.72) 0%, rgba(6, 78, 59, 0.65) 100%);
                    z-index: 1;
                }
                .page-hero-content {
                    position: relative;
                    z-index: 2;
                    padding: 3.5rem 0 2.75rem;
                }
                .page-hero h1 {
                    color: #fff;
                    max-width: 720px;
                    margin-bottom: 1rem;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.35);
                }
                .page-hero p {
                    color: rgba(255,255,255,0.97);
                    max-width: 720px;
                    font-size: 1.15rem;
                    line-height: 1.7;
                    text-shadow: 0 1px 6px rgba(0,0,0,0.3);
                }
                .page-hero :global(.breadcrumb) {
                    margin-bottom: 2rem;
                    padding: 0.4rem 0.9rem;
                    background: rgba(0,0,0,0.28);
                    border-radius: 100px;
                    display: inline-flex;
                    backdrop-filter: blur(4px);
                }
                .page-hero :global(.breadcrumb a),
                .page-hero :global(.breadcrumb span) {
                    color: rgba(255,255,255,0.85);
                    font-weight: 600;
                }
                .page-hero :global(.breadcrumb a:hover) {
                    color: #fff;
                }

                @media (max-width: 900px) {
                    .page-hero {
                        height: 60vh;
                        min-height: 500px;
                    }
                    .page-hero h1 {
                        font-size: 2rem;
                    }
                    .page-hero p {
                        font-size: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}
