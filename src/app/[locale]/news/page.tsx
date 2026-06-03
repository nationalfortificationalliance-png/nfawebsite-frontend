import type { Metadata } from 'next';
import Link from 'next/link';
import Icon from '@/components/Icon';
import NewsCard from '@/components/NewsCard';
import { getAllNews, type NewsEvent } from '@/lib/api';
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
        /* Hero (Guidelines Style) */
        .news-hero { background: var(--wfp-navy); padding: 4.5rem 0 3.5rem; }
        .news-hero h1 { color: #fff; max-width: 640px; margin-bottom: 0.5rem; }
        .news-hero p { color: rgba(255,255,255,.72); max-width: 520px; }
        .news-hero .breadcrumb { justify-content: flex-start; margin-bottom: 1.5rem; }
        .news-hero .breadcrumb a, .news-hero .breadcrumb span { color: rgba(255,255,255,.6); }
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

            {/* Guidelines-style Hero */}
            <div className="news-hero">
                <div className="container">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span>News & Events</span>
                    </div>
                    <h1>News & Events</h1>
                    <p>Stay updated on the National Fortification Project — news, events, reports, and announcements.</p>
                </div>
            </div>

            {/* Filter bar */}
            <div className="news-filter-bar">
                <div className="container">
                    <div className="news-filter-inner">
                        <span className="filter-chip active">All</span>
                        {categories.map((c) => (
                            <span key={c} className="filter-chip">{c}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* News Grid */}
            <section className="section">
                <div className="container">
                    {isMock && (
                        <div style={{ background: '#fff3e0', color: '#e65100', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Icon name="sparkles" size={16} /> Viewing sample data. Add articles in the Strapi CMS to replace this placeholder content.
                        </div>
                    )}

                    {total > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <p className="news-count" style={{ margin: 0 }}>Showing {news.length} of {total} items</p>
                        </div>
                    )}

                    <div className="grid-3">
                        {news.map((article: NewsEvent) => (
                            <NewsCard key={article.id} article={article} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
