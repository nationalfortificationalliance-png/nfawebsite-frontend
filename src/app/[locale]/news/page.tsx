import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import NewsFilter from '@/components/NewsFilter';
import { getAllNews, getMeetingSchedule, getComplianceReports, MeetingSchedule, ComplianceReport } from '@/lib/api';
import { MOCK_NEWS } from '@/lib/mockData';

export const metadata: Metadata = {
    title: 'News & Events',
    description: 'Latest news, events, announcements, and reports from the National Fortification Alliance Nigeria.',
};

export const revalidate = 60;

const MEETINGS_FALLBACK: MeetingSchedule[] = [
    { id: 1, documentId: '1', year: '2026', june_host: 'NAFDAC', december_host: 'Industry', order: 1 },
    { id: 2, documentId: '2', year: '2027', june_host: 'SON', december_host: 'FCCPC', order: 2 },
    { id: 3, documentId: '3', year: '2028', june_host: 'FMoHSW', december_host: 'NAFDAC', order: 3 },
];

const COMPLIANCE_REPORTS_FALLBACK: ComplianceReport[] = [
    { id: 1, documentId: '1', year: '2024', national_compliance: '57%', salt_compliance: '67%', veg_oil_compliance: '58%', flour_compliance: '48%', source: 'NAFDAC Compliance Monitoring Report', order: 1 },
];

export default async function NewsPage() {
    const { data: dbNews, total: dbTotal } = await getAllNews(1, 12);

    const isMock = dbNews.length === 0;
    const news = isMock ? MOCK_NEWS : dbNews;
    const total = isMock ? MOCK_NEWS.length : dbTotal;

    const categories = ['news', 'event', 'communique', 'report'];

    const meetingScheduleData = await getMeetingSchedule();
    const meetings = meetingScheduleData.length ? meetingScheduleData : MEETINGS_FALLBACK;

    const complianceReportsData = await getComplianceReports();
    const complianceReports = complianceReportsData.length ? complianceReportsData : COMPLIANCE_REPORTS_FALLBACK;

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

        /* Compliance Reports */
        .compliance-reports-section {
          background: #fff;
          padding: 4rem 0;
          border-bottom: 1px solid var(--border-light);
        }
        .compliance-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-top: 2.5rem;
        }
        .compliance-card {
          flex: 1;
          min-width: 260px;
          background: var(--bg-off);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 1.75rem;
          border-top: 3px solid var(--wfp-blue);
        }
        .compliance-year {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--wfp-navy);
          margin-bottom: 1rem;
        }
        .compliance-headline {
          font-size: 2rem;
          font-weight: 800;
          color: var(--wfp-blue);
          margin-bottom: 0.25rem;
        }
        .compliance-headline-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
        }
        .compliance-sub-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          font-size: 0.85rem;
        }
        .compliance-sub-row + .compliance-sub-row {
          border-top: 1px solid var(--border-light);
        }
        .compliance-sub-label {
          color: var(--text-muted);
          font-weight: 600;
        }
        .compliance-sub-val {
          font-weight: 700;
          color: var(--wfp-navy);
        }
        .compliance-source {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 1rem;
          font-style: italic;
        }
      `}</style>

            {/* Hero with Background */}
            <div className="news-hero">
                <div className="news-hero-bg">
                    <Image
                        src="/news_hero.jpg"
                        alt="News and Events"
                        fill
                        sizes="100vw"
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
                    <p>Stay updated on the National Fortification Alliance — news, events, reports, and communiqués.</p>
                </div>
            </div>

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

            {/* Compliance Reports */}
            <section className="compliance-reports-section">
                <div className="container">
                    <p className="section-eyebrow">Reports</p>
                    <h2 style={{ marginBottom: '0.5rem' }}>Fortification Compliance Reports</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '640px' }}>
                        Annual compliance figures for mandatory fortification vehicles across Nigeria, updated year by year.
                    </p>
                    <div className="compliance-grid">
                        {complianceReports.map((r) => (
                            <div className="compliance-card" key={r.id}>
                                <div className="compliance-year">{r.year}</div>
                                <div className="compliance-headline">{r.national_compliance}</div>
                                <div className="compliance-headline-label">National Compliance</div>
                                {r.salt_compliance && (
                                    <div className="compliance-sub-row">
                                        <span className="compliance-sub-label">Salt (Iodized)</span>
                                        <span className="compliance-sub-val">{r.salt_compliance}</span>
                                    </div>
                                )}
                                {r.veg_oil_compliance && (
                                    <div className="compliance-sub-row">
                                        <span className="compliance-sub-label">Veg Oil (Vit A)</span>
                                        <span className="compliance-sub-val">{r.veg_oil_compliance}</span>
                                    </div>
                                )}
                                {r.flour_compliance && (
                                    <div className="compliance-sub-row">
                                        <span className="compliance-sub-label">Flour (Vit A)</span>
                                        <span className="compliance-sub-val">{r.flour_compliance}</span>
                                    </div>
                                )}
                                {r.source && <div className="compliance-source">Source: {r.source}</div>}
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
