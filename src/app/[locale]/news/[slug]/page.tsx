import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Icon, { IconName } from '@/components/Icon';
import GalleryLightbox from '@/components/GalleryLightbox';
import { getNewsBySlug, getAllNews, getStrapiMediaUrl } from '@/lib/api';
import { generateSEOMetadata, generateArticleSchema, generateBreadcrumbSchema } from '@/components/SEO';
import { locales } from '@/i18n';
import { MOCK_NEWS } from '@/lib/mockData';

interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

interface ArticleWithSeo {
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        shareImage?: { url?: string };
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    let article = await getNewsBySlug(slug);

    // Fallback to mock data if not found in Strapi
    if (!article) {
        article = MOCK_NEWS.find((a) => a.slug === slug) || null;
    }

    if (!article) return { title: 'Article Not Found' };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nfawebsite-frontend.vercel.app';
    const seo = (article as ArticleWithSeo).seo;
    const title = seo?.metaTitle || article.title;
    const description = seo?.metaDescription || article.excerpt || article.title;
    const ogImage = seo?.shareImage?.url ? getStrapiMediaUrl(seo.shareImage.url) : getStrapiMediaUrl(article.image?.url);

    const canonicalUrl = locale === 'en'
        ? `${siteUrl}/news/${slug}`
        : `${siteUrl}/${locale}/news/${slug}`;

    return generateSEOMetadata({
        title,
        description,
        keywords: [
            article.category,
            'NFA news',
            'food fortification updates',
            'nutrition Nigeria',
            ...(article.tags ? article.tags.split(',').map((t: string) => t.trim()) : []),
        ],
        canonical: canonicalUrl,
        ogImage,
        ogType: 'article',
        publishedTime: article.publishedAt,
        modifiedTime: article.publishedAt,
        locale,
        alternateLocales: locales.map((loc) => ({
            locale: loc,
            url: loc === 'en'
                ? `${siteUrl}/news/${slug}`
                : `${siteUrl}/${loc}/news/${slug}`,
        })),
    });
}

export async function generateStaticParams() {
    const { data } = await getAllNews(1, 100);
    // Include mock news slugs when Strapi is empty
    const slugs = data.length > 0
        ? data.map((a) => ({ slug: a.slug }))
        : MOCK_NEWS.map((a) => ({ slug: a.slug }));
    return slugs;
}

export const revalidate = 60;

const CATEGORY_ICONS: Record<string, IconName> = {
    news: 'newspaper', event: 'calendar', communique: 'scroll-text', report: 'bar-chart',
};

export default async function NewsDetailPage({ params }: Props) {
    const { slug, locale } = await params;
    let article = await getNewsBySlug(slug);

    // Fallback to mock data if not found in Strapi
    if (!article) {
        article = MOCK_NEWS.find((a) => a.slug === slug) || null;
    }

    if (!article) notFound();

    const { title, excerpt, body, date, image, gallery, file, category, publishedAt } = article;
    const imageUrl = getStrapiMediaUrl(image?.url);
    const hasImage = !!image?.url;
    const hasGallery = gallery && gallery.length > 0;
    const fileUrl = file?.url ? getStrapiMediaUrl(file.url) : null;

    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
    });

    // Generate structured data
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nfawebsite-frontend.vercel.app';
    const homeUrl = locale === 'en' ? siteUrl : `${siteUrl}/${locale}`;
    const newsUrl = locale === 'en' ? `${siteUrl}/news` : `${siteUrl}/${locale}/news`;
    const articleUrl = locale === 'en' ? `${siteUrl}/news/${slug}` : `${siteUrl}/${locale}/news/${slug}`;

    const articleSchema = generateArticleSchema({
        title,
        description: excerpt || title,
        publishedDate: publishedAt,
        modifiedDate: publishedAt,
        imageUrl: imageUrl,
        url: articleUrl,
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: homeUrl },
        { name: 'News & Events', url: newsUrl },
        { name: title, url: articleUrl },
    ]);

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <style>{`
        .article-hero {
          background: linear-gradient(135deg, var(--wfp-green-dark, #006639) 0%, var(--wfp-navy, #064e3b) 100%);
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
          border-left: 4px solid var(--wfp-green, #008751);
          padding-left: 1rem;
          margin-bottom: 2rem;
          line-height: 1.75;
        }
        .article-richtext { color: var(--color-gray-800); line-height: 1.85; font-size: 1.05rem; }
        .article-richtext h2 {
          margin: 2.75rem 0 1rem; color: var(--color-navy);
          font-size: 1.5rem; font-weight: 800;
        }
        .article-richtext h3 {
          margin: 2.5rem 0 1rem; color: var(--color-navy);
          font-size: 1.2rem; font-weight: 700;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--wfp-green, #008751);
          display: inline-block;
        }
        .article-richtext p { margin-bottom: 1.15rem; }
        .article-richtext strong { color: var(--color-navy); font-weight: 700; }
        .article-richtext ul, .article-richtext ol {
          padding-left: 0; margin: 0 0 1.5rem; list-style: none;
        }
        .article-richtext ul li {
          position: relative; padding-left: 1.6rem; margin-bottom: 0.65rem;
        }
        .article-richtext ul li::before {
          content: ''; position: absolute; left: 0; top: 0.55rem;
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--wfp-green, #008751);
        }
        .article-richtext ol {
          padding-left: 1.4rem; list-style: decimal;
        }
        .article-richtext ol li { margin-bottom: 0.65rem; padding-left: 0.3rem; }
        .article-richtext a { color: var(--wfp-green, #008751); text-decoration: underline; }
        .article-richtext blockquote {
          margin: 1.75rem 0; padding: 1.1rem 1.4rem;
          background: var(--bg-off, #f6f7f8);
          border-left: 4px solid var(--wfp-green, #008751);
          border-radius: 8px;
          font-style: italic; color: var(--color-gray-700, #374151);
        }
        .article-back {
          display: inline-flex; align-items: center; gap: 0.4rem;
          color: var(--wfp-green, #008751); font-weight: 600;
          margin-bottom: 1.5rem; transition: gap 0.2s;
        }
        .article-back:hover { gap: 0.65rem; }
        .article-download {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--wfp-green, #008751); color: white;
          font-weight: 600; padding: 0.65rem 1.25rem;
          border-radius: 8px; margin-bottom: 2rem;
          transition: background 0.2s;
        }
        .article-download:hover { background: var(--wfp-green-dark, #006639); }
        .article-category-badge {
          display: inline-flex; align-items: center; gap: 0.35rem;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white; padding: 0.3rem 0.9rem;
          border-radius: 100px; font-size: 0.8rem; font-weight: 600;
        }
        .article-gallery {
          margin-top: 3rem;
          padding-top: 2.5rem;
          border-top: 1px solid var(--border-light);
        }
        .article-gallery h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .gallery-item {
          position: relative;
          height: 240px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-off);
          transition: transform 0.3s var(--ease-out);
          cursor: pointer;
        }
        .gallery-item:hover {
          transform: scale(1.02);
          box-shadow: var(--shadow-lg);
        }
        .gallery-item { border: none; padding: 0; display: block; width: 100%; }
        .gallery-zoom-hint {
          position: absolute; top: 0.6rem; right: 0.6rem;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(0,0,0,0.55); color: white;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.2s;
        }
        .gallery-item:hover .gallery-zoom-hint { opacity: 1; }
        .lightbox-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.9);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem;
        }
        .lightbox-image-wrap { max-width: 92vw; max-height: 88vh; }
        .lightbox-image {
          max-width: 92vw; max-height: 88vh;
          width: auto; height: auto;
          display: block; border-radius: 6px;
          box-shadow: var(--shadow-xl);
        }
        .lightbox-close {
          position: absolute; top: 1.25rem; right: 1.5rem;
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.12); color: white;
          font-size: 1.75rem; line-height: 1; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .lightbox-close:hover { background: rgba(255,255,255,0.25); }
        .lightbox-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 52px; height: 52px; border-radius: 50%;
          background: rgba(255,255,255,0.12); color: white;
          font-size: 2rem; line-height: 1; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .lightbox-nav:hover { background: rgba(255,255,255,0.25); }
        .lightbox-prev { left: 1.5rem; }
        .lightbox-next { right: 1.5rem; }
        .lightbox-counter {
          position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
          color: rgba(255,255,255,0.85); font-size: 0.875rem;
          background: rgba(0,0,0,0.4); padding: 0.3rem 0.9rem; border-radius: 100px;
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
                    {fileUrl && (
                        <a href={fileUrl} download className="article-download">
                            <Icon name="file-text" size={16} /> Download {category === 'communique' ? 'Communiqué' : 'Document'} (PDF)
                        </a>
                    )}
                    <div
                        className="article-richtext"
                        dangerouslySetInnerHTML={{ __html: body }}
                    />

                    {/* Gallery Section */}
                    {hasGallery && (
                        <div className="article-gallery">
                            <h3>Photo Gallery</h3>
                            <GalleryLightbox
                                images={gallery!.map((img) => ({
                                    id: img.id,
                                    url: getStrapiMediaUrl(img.url),
                                    alt: img.alternativeText || title,
                                }))}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
