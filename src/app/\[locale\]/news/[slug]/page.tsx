import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Icon, { IconName } from '@/components/Icon';
import { getNewsBySlug, getAllNews, getStrapiMediaUrl } from '@/lib/api';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await getNewsBySlug(slug);
    if (!article) return { title: 'Article Not Found' };
    
    // Check for SEO component from Strapi
    const seo = (article as any).seo;
    const title = seo?.metaTitle || article.title;
    const description = seo?.metaDescription || article.excerpt || article.title;
    const ogImage = seo?.shareImage?.url ? getStrapiMediaUrl(seo.shareImage.url) : null;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: ogImage ? [ogImage] : [],
        }
    };
}

export async function generateStaticParams() {
    const { data } = await getAllNews(1, 100);
    return data.map((a) => ({ slug: a.slug }));
}

export const revalidate = 60;

const CATEGORY_ICONS: Record<string, IconName> = {
    news: 'newspaper', event: 'calendar', announcement: 'megaphone', report: 'bar-chart',
};

export default async function NewsDetailPage({ params }: Props) {
    const { slug } = await params;
    const article = await getNewsBySlug(slug);
    if (!article) notFound();

    const { title, excerpt, body, date, image, category, publishedAt } = article;
    const imageUrl = getStrapiMediaUrl(image?.url);
    const hasImage = !!image?.url;

    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
    });

    return (
        <>
            <style>{`
        .article-hero {
          background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-primary) 100%);
          padding: 3.5rem 0 5rem;
          color: white;
        }
        .article-hero h1 { color: white; max-width: 780px; }
        .article-meta {
          display: flex; gap: 1rem; align-items: center;
          flex-wrap: wrap; margin-bottom: 1.25rem; margin-top: 1rem;
        }
        .article-date { color: rgba(255,255,255,0.75); font-size: 0.875rem; }
        .article-featured-img {
          position: relative; height: 420px; border-radius: 16px;
          overflow: hidden; box-shadow: var(--shadow-xl);
          margin-top: -3rem;
        }
        .article-body-wrap {
          max-width: 780px; margin: 0 auto;
          padding: 3rem 0 4rem;
        }
        .article-excerpt {
          font-size: 1.15rem;
          font-weight: 500;
          color: var(--color-gray-600);
          border-left: 4px solid var(--color-primary);
          padding-left: 1rem;
          margin-bottom: 2rem;
          line-height: 1.75;
        }
        .article-richtext { color: var(--color-gray-800); line-height: 1.85; }
        .article-richtext h2, .article-richtext h3 { margin: 2rem 0 0.75rem; color: var(--color-navy); }
        .article-richtext p { margin-bottom: 1rem; }
        .article-richtext ul, .article-richtext ol {
          padding-left: 1.5rem; margin-bottom: 1rem;
        }
        .article-richtext li { margin-bottom: 0.4rem; }
        .article-back {
          display: inline-flex; align-items: center; gap: 0.4rem;
          color: var(--color-primary); font-weight: 600;
          margin-bottom: 1.5rem; transition: gap 0.2s;
        }
        .article-back:hover { gap: 0.65rem; }
        .article-category-badge {
          display: inline-flex; align-items: center; gap: 0.35rem;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white; padding: 0.3rem 0.9rem;
          border-radius: 100px; font-size: 0.8rem; font-weight: 600;
        }
      `}</style>

            {/* Hero */}
            <div className="article-hero">
                <div className="container">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <Link href="/news">News & Events</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span style={{ color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{title}</span>
                    </div>
                    <div className="article-meta">
                        <span className="article-category-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Icon name={CATEGORY_ICONS[category] || 'newspaper'} size={14} /> {category}
                        </span>
                        <span className="article-date" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.75)' }}>
                            <Icon name="calendar" size={14} /> {formattedDate}
                        </span>
                    </div>
                    <h1>{title}</h1>
                </div>
            </div>

            {/* Featured image */}
            {hasImage && (
                <div className="container" style={{ paddingTop: '0' }}>
                    <div className="article-featured-img">
                        <Image src={imageUrl} alt={title} fill style={{ objectFit: 'cover' }} priority />
                    </div>
                </div>
            )}

            {/* Body */}
            <div className="container">
                <div className="article-body-wrap">
                    <Link href="/news" className="article-back">← Back to News</Link>
                    {excerpt && <p className="article-excerpt">{excerpt}</p>}
                    <div
                        className="article-richtext"
                        dangerouslySetInnerHTML={{ __html: body }}
                    />
                </div>
            </div>
        </>
    );
}
