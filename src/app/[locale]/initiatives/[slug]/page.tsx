import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Icon, { IconName } from '@/components/Icon';
import { getInitiativeBySlug, getAllInitiatives, getStrapiMediaUrl } from '@/lib/api';
import { generateSEOMetadata } from '@/components/SEO';
import { locales } from '@/i18n';

interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const initiative = await getInitiativeBySlug(slug);
    if (!initiative) return { title: 'Initiative Not Found' };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nfawebsite-frontend.vercel.app';
    const canonicalUrl = locale === 'en'
        ? `${siteUrl}/initiatives/${slug}`
        : `${siteUrl}/${locale}/initiatives/${slug}`;

    return generateSEOMetadata({
        title: `${initiative.title} | National Fortification Alliance`,
        description: initiative.description,
        keywords: [initiative.title, initiative.category, 'food fortification', 'nutrition Nigeria'],
        canonical: canonicalUrl,
        ogImage: getStrapiMediaUrl(initiative.image?.url),
        locale,
        alternateLocales: locales.map((loc) => ({
            locale: loc,
            url: loc === 'en'
                ? `${siteUrl}/initiatives/${slug}`
                : `${siteUrl}/${loc}/initiatives/${slug}`,
        })),
    });
}

export async function generateStaticParams() {
    const initiatives = await getAllInitiatives();
    return initiatives.map((initiative) => ({ slug: initiative.slug }));
}

export const revalidate = 60;

const RECENTLY_UPDATED_DAYS = 30;

export default async function InitiativeDetailPage({ params }: Props) {
    const { slug } = await params;
    const initiative = await getInitiativeBySlug(slug);
    if (!initiative) notFound();

    const { title, description, objectives, highlights, image, category, status } = initiative;
    const imageUrl = getStrapiMediaUrl(image?.url);
    const hasImage = !!image?.url;
    const isRecentlyUpdated = initiative.updatedAt
        ? (Date.now() - new Date(initiative.updatedAt).getTime()) / 86_400_000 <= RECENTLY_UPDATED_DAYS
        : false;

    return (
        <>
            <style>{`
                .initiative-hero {
                    background: linear-gradient(135deg, var(--wfp-green-dark, #006639) 0%, var(--wfp-navy, #064e3b) 100%);
                    padding: 3.5rem 0 5rem;
                    color: white;
                }
                .initiative-hero h1 { color: white; max-width: 780px; }
                .initiative-meta {
                    display: flex; gap: 0.75rem; align-items: center;
                    flex-wrap: wrap; margin-bottom: 1.25rem; margin-top: 1rem;
                }
                .initiative-badge {
                    display: inline-flex; align-items: center; gap: 0.35rem;
                    background: rgba(255,255,255,0.15);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white; padding: 0.3rem 0.9rem;
                    border-radius: 100px; font-size: 0.8rem; font-weight: 600;
                    text-transform: capitalize;
                }
                .initiative-badge.updated {
                    background: rgba(245, 158, 11, 0.25);
                    border-color: rgba(245, 158, 11, 0.5);
                }
                .initiative-featured-img {
                    position: relative; height: 380px; border-radius: 16px;
                    overflow: hidden; box-shadow: var(--shadow-xl);
                    margin-top: -3rem;
                }
                .initiative-body-wrap {
                    max-width: 780px; margin: 0 auto;
                    padding: 3rem 0 4rem;
                }
                .initiative-description {
                    font-size: 1.15rem;
                    color: var(--color-gray-700, #374151);
                    line-height: 1.8;
                    margin-bottom: 2rem;
                }
                .initiative-section h2 {
                    font-size: 1.4rem; font-weight: 800; color: var(--color-navy);
                    margin: 2.5rem 0 1rem;
                }
                .initiative-highlights {
                    list-style: none; padding: 0; margin: 0;
                }
                .initiative-highlights li {
                    display: flex; gap: 0.75rem; padding: 0.75rem 0;
                    border-bottom: 1px solid var(--border-light);
                    color: var(--color-gray-700, #374151); line-height: 1.6;
                }
                .initiative-highlights li:last-child { border-bottom: none; }
                .initiative-highlights li::before {
                    content: '→'; color: var(--wfp-green, #008751); font-weight: 800; line-height: 1.4;
                }
                .initiative-back {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    color: var(--wfp-green, #008751); font-weight: 600;
                    margin-bottom: 1.5rem; transition: gap 0.2s;
                }
                .initiative-back:hover { gap: 0.65rem; }
            `}</style>

            <div className="initiative-hero">
                <div className="container">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <Link href="/initiatives">Initiatives</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span style={{ color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{title}</span>
                    </div>
                    <div className="initiative-meta">
                        {category && (
                            <span className="initiative-badge"><Icon name={'trending-up' as IconName} size={14} /> {category}</span>
                        )}
                        {status && <span className="initiative-badge">{status}</span>}
                        {isRecentlyUpdated && (
                            <span className="initiative-badge updated">Recently updated</span>
                        )}
                    </div>
                    <h1>{title}</h1>
                </div>
            </div>

            {hasImage && (
                <div className="container" style={{ paddingTop: '0' }}>
                    <div className="initiative-featured-img">
                        <Image src={imageUrl} alt={title} fill style={{ objectFit: 'cover' }} priority />
                    </div>
                </div>
            )}

            <div className="container">
                <div className="initiative-body-wrap">
                    <Link href="/initiatives" className="initiative-back">← Back to Initiatives</Link>

                    <p className="initiative-description">{description}</p>

                    {objectives && (
                        <div className="initiative-section">
                            <h2>Objectives</h2>
                            <p style={{ color: 'var(--color-gray-700, #374151)', lineHeight: 1.8 }}>{objectives}</p>
                        </div>
                    )}

                    {highlights && highlights.length > 0 && (
                        <div className="initiative-section">
                            <h2>Key Highlights</h2>
                            <ul className="initiative-highlights">
                                {highlights.map((h) => (
                                    <li key={h.id}>{h.text}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
