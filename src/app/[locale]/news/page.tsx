import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import NewsFilter from '@/components/NewsFilter';
import { getAllNews } from '@/lib/api';
import { MOCK_NEWS } from '@/lib/mockData';

export const metadata: Metadata = {
    title: 'News & Events',
    description: 'Latest news, events, announcements, and reports from the National Fortification Alliance Nigeria.',
};

export const revalidate = 60;

export default async function NewsPage() {
    const { data: dbNews, total: dbTotal } = await getAllNews(1, 12);

    const isMock = dbNews.length === 0;
    const news = isMock ? MOCK_NEWS : dbNews;
    const total = isMock ? MOCK_NEWS.length : dbTotal;

    const categories = ['news', 'event', 'announcement', 'report'];

    return (
        <>
            <style>{`
        /* Hero with Image */
        .news-hero {
          position: relative;
          min-height: 420px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .news-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .news-hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0, 82, 73, 0.92) 0%, rgba(6, 78, 59, 0.88) 100%);
          z-index: 1;
        }
        .news-hero-content {
          position: relative;
          z-index: 2;
          padding: 5rem 0 4rem;
        }
        .news-hero h1 { color: #fff; max-width: 720px; margin-bottom: 1rem; }
        .news-hero p { color: rgba(255,255,255,0.95); max-width: 720px; font-size: 1.15rem; line-height: 1.7; }
        .news-hero .breadcrumb { justify-content: flex-start; margin-bottom: 2rem; }
        .news-hero .breadcrumb a, .news-hero .breadcrumb span { color: rgba(255,255,255,0.8); }
        .news-hero .breadcrumb a:hover { color: #fff; }

        /* Modern Filter Bar */
        .news-filter-bar {
          background: #fff;
          padding: 1.5rem 0;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 100px;
          z-index: 100;
        }
        .news-filter-inner {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
          background: #fff;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
          text-transform: capitalize;
        }
        .filter-chip:hover, .filter-chip.active {
          border-color: var(--wfp-blue);
          color: var(--wfp-blue);
          background: var(--wfp-blue-light);
        }
        .news-empty {
          text-align: center;
          padding: 5rem 2rem;
          color: var(--color-gray-400);
        }
        .news-empty-icon { font-size: 4rem; margin-bottom: 1rem; }
        .news-count {
          font-size: 0.875rem;
          color: var(--color-gray-400);
          margin-bottom: 1.5rem;
          text-align: right;
        }
      `}</style>

            {/* Hero with Background */}
            <div className="news-hero">
                <div className="news-hero-bg">
                    <Image
                        src="/hero-2.png"
                        alt="News and Events"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
                <div className="container news-hero-content">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span>News & Events</span>
                    </div>
                    <h1>News & Events</h1>
                    <p>Stay updated on the National Fortification Project — news, events, reports, and announcements.</p>
                </div>
            </div>

            {isMock && (
                <div style={{ background: '#fff3e0', color: '#e65100', padding: '0.75rem 1rem', borderRadius: '8px', margin: '2rem auto', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '1200px' }}>
                    <Icon name="sparkles" size={16} /> Viewing sample data. Add articles in the Strapi CMS to replace this placeholder content.
                </div>
            )}

            {/* Filter bar & News Grid */}
            <NewsFilter allNews={news} categories={categories} />
        </>
    );
}
