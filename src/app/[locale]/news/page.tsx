import type { Metadata } from 'next';
import Icon from '@/components/Icon';
import NewsFilter from '@/components/NewsFilter';
import PageHero from '@/components/PageHero';
import { getAllNews, getMeetingSchedule } from '@/lib/api';
import { MOCK_NEWS } from '@/lib/mockData';

export const metadata: Metadata = {
    title: 'News & Events',
    description: 'Latest news, events, announcements, and reports from the National Fortification Alliance Nigeria.',
};

export const revalidate = 60;

export default async function NewsPage() {
    const { data: dbNews } = await getAllNews(1, 12);

    const isMock = dbNews.length === 0;
    const news = isMock ? MOCK_NEWS : dbNews;

    const baseCategories = ['news', 'event', 'communique'];
    const hasReportItems = news.some((item) => item.category === 'report');
    const categories = hasReportItems ? [...baseCategories, 'report'] : baseCategories;

    const meetings = await getMeetingSchedule();

    return (
        <>
            <style>{`
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
          max-width: 420px;
          margin: 0 auto;
        }
        .news-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--wfp-green-light, #e6f4ee);
          color: var(--wfp-green, #008751);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }
        .news-empty-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        .news-empty-text {
          color: var(--color-gray-400);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .news-empty-reset {
          display: inline-flex;
          align-items: center;
          padding: 0.6rem 1.4rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--wfp-green, #008751);
          background: transparent;
          color: var(--wfp-green, #008751);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s var(--ease-out);
        }
        .news-empty-reset:hover {
          background: var(--wfp-green, #008751);
          color: #fff;
        }
        .news-count {
          font-size: 0.875rem;
          color: var(--color-gray-400);
          margin-bottom: 1.5rem;
          text-align: right;
        }

        /* Meeting Schedule Timeline */
        .meetings-timeline-section {
          background: var(--bg-off);
          padding: 4rem 0;
          border-bottom: 1px solid var(--border-light);
        }
        .meetings-timeline {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-top: 2.5rem;
        }
        .timeline-card {
          flex: 1;
          min-width: 220px;
          background: #fff;
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 1.75rem;
          position: relative;
          border-top: 3px solid var(--wfp-gold);
        }
        .timeline-year {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--wfp-navy);
          margin-bottom: 1rem;
        }
        .timeline-host-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.5rem 0;
          font-size: 0.85rem;
        }
        .timeline-host-row + .timeline-host-row {
          border-top: 1px solid var(--border-light);
        }
        .timeline-host-label {
          color: var(--text-muted);
          font-weight: 600;
        }
        .timeline-host-pill {
          display: inline-block;
          background: var(--wfp-blue-light);
          color: var(--wfp-blue);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.3rem 0.85rem;
          border-radius: 999px;
        }

      `}</style>

            <PageHero
                image={{ src: '/news_hero.jpg', alt: 'News and Events' }}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'News & Events' }]}
                title="News & Events"
                description="Stay updated on the National Fortification Alliance — news, events, reports, and communiqués."
            />

            {isMock && (
                <div style={{ background: '#fff3e0', color: '#e65100', padding: '0.75rem 1rem', borderRadius: '8px', margin: '2rem auto', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '1200px' }}>
                    <Icon name="sparkles" size={16} /> Viewing sample data. Add articles in the Strapi CMS to replace this placeholder content.
                </div>
            )}

            {/* Meeting Schedule Timeline */}
            <section className="meetings-timeline-section">
                <div className="container">
                    <p className="section-eyebrow">Collaboration</p>
                    <h2 style={{ marginBottom: '0.5rem' }}>NFA Biannual Meetings</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '640px' }}>
                        The Alliance convenes twice yearly to review programme implementation, discuss technical updates, strengthen coordination, review compliance, and agree on strategic actions.
                    </p>
                    <div className="meetings-timeline">
                        {meetings.map((m) => (
                            <div className="timeline-card" key={m.id}>
                                <div className="timeline-year">{m.year}</div>
                                <div className="timeline-host-row">
                                    <span className="timeline-host-label">June Host</span>
                                    <span className="timeline-host-pill">{m.june_host}</span>
                                </div>
                                <div className="timeline-host-row">
                                    <span className="timeline-host-label">December Host</span>
                                    <span className="timeline-host-pill">{m.december_host}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filter bar & News Grid */}
            <NewsFilter allNews={news} categories={categories} />
        </>
    );
}
