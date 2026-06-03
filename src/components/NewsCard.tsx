'use client';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import MaterialCard, { MaterialCardContent, MaterialCardActions } from '@/components/MaterialCard';
import MaterialButton from '@/components/MaterialButton';
import { getStrapiMediaUrl } from '@/lib/api';
import type { NewsEvent } from '@/lib/api';

interface NewsCardProps {
  article: NewsEvent;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  news: { bg: 'var(--md-sys-color-secondary-container)', text: 'var(--md-sys-color-on-secondary-container)', label: 'News' },
  event: { bg: 'var(--md-sys-color-tertiary-container)', text: 'var(--md-sys-color-on-tertiary-container)', label: 'Event' },
  announcement: { bg: 'var(--md-sys-color-primary-container)', text: 'var(--md-sys-color-on-primary-container)', label: 'Announcement' },
  report: { bg: 'var(--md-sys-color-surface-variant)', text: 'var(--md-sys-color-on-surface-variant)', label: 'Report' },
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
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const categoryInfo = CATEGORY_COLORS[category] ?? {
    bg: 'var(--md-sys-color-surface-variant)',
    text: 'var(--md-sys-color-on-surface-variant)',
    label: category
  };

  const newsUrl = locale === 'en' ? `/news/${slug}` : `/${locale}/news/${slug}`;

  return (
    <MaterialCard variant="elevated" elevation={1} href={newsUrl}>
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
        <Image
          src={imgSrc}
          alt={title}
          fill
          style={{
            objectFit: 'cover',
            transition: 'transform var(--md-sys-motion-duration-medium4) var(--md-sys-motion-easing-emphasized)'
          }}
          sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, 33vw"
          unoptimized={!hasStrapi}
        />

        {/* Overlay gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 60%)'
        }} />

        {/* Featured badge */}
        {is_featured && (
          <div
            className="md-chip-filled"
            style={{
              position: 'absolute',
              top: 'var(--md-sys-spacing-3)',
              left: 'var(--md-sys-spacing-3)',
              background: 'var(--md-sys-color-secondary)',
              color: 'var(--md-sys-color-on-secondary)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: 'var(--md-sys-shadow-level2)'
            }}
          >
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <MaterialCardContent style={{ padding: 'var(--md-sys-spacing-4)' }}>
        {/* Meta */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--md-sys-spacing-2)',
          marginBottom: 'var(--md-sys-spacing-3)'
        }}>
          {/* Category chip */}
          <span
            className="md-chip"
            style={{
              background: categoryInfo.bg,
              color: categoryInfo.text,
              border: 'none',
              fontSize: 'var(--md-sys-typescale-label-small-size)',
              fontWeight: 'var(--md-sys-typescale-label-small-weight)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {categoryInfo.label}
          </span>

          {/* Date */}
          <span className="md-label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h3
          className="md-title-large"
          style={{
            marginBottom: 'var(--md-sys-spacing-2)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            transition: 'color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)'
          }}
        >
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p
            className="md-body-medium"
            style={{
              color: 'var(--md-sys-color-on-surface-variant)',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: 'var(--md-sys-spacing-4)'
            }}
          >
            {excerpt}
          </p>
        )}
      </MaterialCardContent>

      {/* Actions */}
      <MaterialCardActions>
        <MaterialButton variant="text" size="small">
          Read More →
        </MaterialButton>
      </MaterialCardActions>
    </MaterialCard>
  );
}
