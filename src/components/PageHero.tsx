import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMediaUrl } from '@/lib/api';

interface PageHeroProps {
    title: string;
    description: string;
    breadcrumbs: { label: string; href?: string }[];
    heroImage?: { url: string } | null;
    fallbackImage: string;
}

export default function PageHero({
    title,
    description,
    breadcrumbs,
    heroImage,
    fallbackImage,
}: PageHeroProps) {
    const imageUrl = heroImage?.url ? getStrapiMediaUrl(heroImage.url) : fallbackImage;

    return (
        <div className="page-hero">
            <div className="page-hero-bg">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                    priority
                />
            </div>
            <div className="container page-hero-content">
                <div className="breadcrumb">
                    {breadcrumbs.map((crumb, index) => (
                        <span key={index}>
                            {crumb.href ? (
                                <Link href={crumb.href}>{crumb.label}</Link>
                            ) : (
                                <span>{crumb.label}</span>
                            )}
                            {index < breadcrumbs.length - 1 && (
                                <span className="breadcrumb-sep">›</span>
                            )}
                        </span>
                    ))}
                </div>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>

            <style jsx>{`
                .page-hero {
                    position: relative;
                    min-height: 420px;
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
                    background: linear-gradient(135deg, rgba(0, 82, 73, 0.92) 0%, rgba(6, 78, 59, 0.88) 100%);
                    z-index: 1;
                }
                .page-hero-content {
                    position: relative;
                    z-index: 2;
                    padding: 5rem 0 4rem;
                }
                .page-hero h1 {
                    color: #fff;
                    max-width: 720px;
                    margin-bottom: 1rem;
                }
                .page-hero p {
                    color: rgba(255,255,255,0.95);
                    max-width: 720px;
                    font-size: 1.15rem;
                    line-height: 1.7;
                }
                .page-hero .breadcrumb {
                    margin-bottom: 2rem;
                }
                .page-hero .breadcrumb a,
                .page-hero .breadcrumb span {
                    color: rgba(255,255,255,0.8);
                }
                .page-hero .breadcrumb a:hover {
                    color: #fff;
                }

                @media (max-width: 900px) {
                    .page-hero {
                        min-height: 360px;
                    }
                    .page-hero-content {
                        padding: 4rem 0 3.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .page-hero {
                        min-height: 320px;
                    }
                    .page-hero-content {
                        padding: 3rem 0 2.5rem;
                    }
                    .page-hero p {
                        font-size: 1rem;
                    }
                }

                @media (max-width: 600px) {
                    .page-hero {
                        min-height: 280px;
                    }
                    .page-hero-content {
                        padding: 2.5rem 0 2rem;
                    }
                    .page-hero .breadcrumb {
                        margin-bottom: 1.5rem;
                        font-size: 0.85rem;
                    }
                    .page-hero p {
                        font-size: 0.95rem;
                    }
                }

                @media (max-width: 400px) {
                    .page-hero {
                        min-height: 240px;
                    }
                    .page-hero-content {
                        padding: 2rem 0 1.75rem;
                    }
                }
            `}</style>
        </div>
    );
}
