'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { getStrapiMediaUrl } from '@/lib/api';
import type { NewsEvent } from '@/lib/api';

interface NewsCardProps { article: NewsEvent; }

const CATEGORY_BADGE: Record<string, [string, string]> = {
  news: ['bg-blue-50 text-blue-700', 'News'],
  event: ['bg-green-50 text-green-700', 'Event'],
  announcement: ['bg-amber-50 text-amber-700', 'Announcement'],
  report: ['bg-purple-50 text-purple-700', 'Report'],
};

const PLACEHOLDER_IMAGES: Record<string, string> = {
  news: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=640&h=420&fit=crop&q=75&auto=format',
  event: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=640&h=420&fit=crop&q=75&auto=format',
  announcement: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=640&h=420&fit=crop&q=75&auto=format',
  report: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=640&h=420&fit=crop&q=75&auto=format',
};

export default function NewsCard({ article }: NewsCardProps) {
  const locale = useLocale();
  const { title, excerpt, date, image, category, slug, is_featured } = article;
  const imgSrc = image?.url
    ? getStrapiMediaUrl(image.url)
    : (PLACEHOLDER_IMAGES[category] ?? PLACEHOLDER_IMAGES.news);
  const hasStrapi = !!image?.url;

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const [badgeClass, badgeLabel] = CATEGORY_BADGE[category] ?? ['bg-gray-100 text-gray-600', category];

  const newsUrl = locale === 'en' ? `/news/${slug}` : `/${locale}/news/${slug}`;

  return (
    <>
      <style>{`
        /* ── NewsCard - Consistent with app card system ── */
        .news-card {
          display: flex;
          flex-direction: column;
        }
        .news-card-img {
          aspect-ratio: 16/10; position: relative; overflow: hidden;
          background: var(--md-sys-color-surface-variant);
        }
        .news-card-img img { transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .news-card:hover .news-card-img img { transform: scale(1.05); }
        .news-card-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,.3) 0%, transparent 60%);
        }
        .news-card-featured-tag {
          position: absolute;
          top: var(--md-sys-spacing-4);
          left: var(--md-sys-spacing-4);
          background: var(--md-sys-color-secondary);
          color: var(--md-sys-color-on-secondary);
          font-size: var(--md-sys-typescale-label-small-size);
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: var(--md-sys-spacing-1) var(--md-sys-spacing-3);
          border-radius: var(--md-sys-shape-corner-full);
          box-shadow: var(--md-sys-shadow-level2);
        }
        .news-card-body {
          padding: var(--md-sys-spacing-7) var(--md-sys-spacing-6);
          display: flex; flex-direction: column; flex: 1;
        }
        .news-card-meta {
          display: flex; align-items: center;
          gap: var(--md-sys-spacing-3);
          margin-bottom: var(--md-sys-spacing-4);
        }
        .news-card-badge {
          font-size: var(--md-sys-typescale-label-small-size);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: var(--md-sys-spacing-1) var(--md-sys-spacing-2);
          border-radius: var(--md-sys-shape-corner-small);
        }
        .news-card-date {
          font-size: var(--md-sys-typescale-body-small-size);
          color: var(--md-sys-color-on-surface-variant);
          font-weight: 500;
        }
        .news-card-title {
          font-size: var(--md-sys-typescale-title-large-size);
          font-weight: 800;
          line-height: 1.4;
          color: var(--md-sys-color-on-surface);
          margin-bottom: var(--md-sys-spacing-3);
          transition: color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .news-card:hover .news-card-title { color: var(--md-sys-color-secondary); }
        .news-card-excerpt {
          font-size: var(--md-sys-typescale-body-medium-size);
          color: var(--md-sys-color-on-surface-variant);
          line-height: 1.65;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
          flex: 1;
          margin-bottom: var(--md-sys-spacing-6);
        }
        .news-card-link {
          font-size: var(--md-sys-typescale-label-large-size);
          font-weight: 700;
          color: var(--md-sys-color-secondary);
          display: inline-flex; align-items: center;
          gap: var(--md-sys-spacing-1);
          transition: gap var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
        }
        .news-card:hover .news-card-link { gap: var(--md-sys-spacing-3); }
      `}</style>

      <Link href={newsUrl} className="card news-card">
        <div className="news-card-img">
          <Image
            src={imgSrc}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, 33vw"
            unoptimized={!hasStrapi}
          />
          <div className="news-card-img-overlay" />
          {is_featured && <span className="news-card-featured-tag">Featured</span>}
        </div>
        <div className="news-card-body">
          <div className="news-card-meta">
            <span className={`news-card-badge ${badgeClass}`}>{badgeLabel}</span>
            <span className="news-card-date">{formattedDate}</span>
          </div>
          <h3 className="news-card-title">{title}</h3>
          {excerpt && <p className="news-card-excerpt">{excerpt}</p>}
          <span className="news-card-link">Read more →</span>
        </div>
      </Link>
    </>
  );
}
