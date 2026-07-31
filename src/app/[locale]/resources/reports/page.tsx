import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getReports, getComplianceReports } from '@/lib/api';
import ReportsRepository from '@/components/ReportsRepository';
import ComplianceDashboard from '@/components/ComplianceDashboard';

export const metadata: Metadata = {
    title: 'Reports & Data | National Fortification Alliance',
    description: 'Searchable repository of compliance, surveillance, and evaluation reports, plus the national fortification compliance dashboard.',
};

export const revalidate = 60;

// Same rotating hero-image pool used elsewhere on the site (HeroCarousel, About, News, Resources).
const REPORTS_HERO_IMAGES = [
    { src: '/about-hero.jpg', alt: 'Laboratory quality assurance' },
    { src: '/factory.jpg', alt: 'Food fortification production line' },
    { src: '/news_hero.jpg', alt: 'Fortification stakeholders and partners' },
];

export default async function ReportsDataPage() {
    const [reports, complianceReports] = await Promise.all([
        getReports(),
        getComplianceReports(),
    ]);

    // Randomly picked per request/revalidation — this is a Server Component (no re-render), so impurity here is intentional and safe.
    // eslint-disable-next-line react-hooks/purity
    const heroImage = REPORTS_HERO_IMAGES[Math.floor(Math.random() * REPORTS_HERO_IMAGES.length)];

    const lastUpdated = reports
        .map((r) => r.published_date)
        .filter((d): d is string => Boolean(d))
        .sort()
        .at(-1);
    const lastUpdatedLabel = lastUpdated
        ? new Date(lastUpdated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Reports & Data | National Fortification Alliance',
        description: 'Searchable repository of compliance, surveillance, and evaluation reports, plus the national fortification compliance dashboard.',
        hasPart: reports.map((r) => ({
            '@type': 'DigitalDocument',
            name: r.title,
            description: r.description,
            datePublished: r.published_date,
        })),
    };

    return (
        <main className="reports-data-page">
            <style>{`
                .rd-hero {
                    position: relative;
                    min-height: 300px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }
                .rd-hero-bg { position: absolute; inset: 0; z-index: 0; }
                .rd-hero-overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    background: linear-gradient(135deg, rgba(0, 82, 73, 0.94) 0%, rgba(6, 78, 59, 0.9) 100%);
                }
                .rd-hero-content { position: relative; z-index: 2; padding: 3.5rem 0 2.75rem; }
                .rd-hero .breadcrumb { justify-content: flex-start; margin-bottom: 1.5rem; }
                .rd-hero .breadcrumb a, .rd-hero .breadcrumb span { color: rgba(255,255,255,0.8); }
                .rd-hero .breadcrumb a:hover { color: #fff; }
                .rd-hero h1 { color: #fff; max-width: 720px; margin-bottom: 1rem; }
                .rd-hero p { color: rgba(255,255,255,0.95); max-width: 720px; font-size: 1.1rem; line-height: 1.7; }
                .rd-hero-stats {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1.75rem;
                    margin-top: 1.75rem;
                }
                .rd-hero-stat { color: #fff; }
                .rd-hero-stat-num { font-size: 1.6rem; font-weight: 800; line-height: 1; }
                .rd-hero-stat-label { font-size: 0.78rem; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.3rem; }
            `}</style>

            <div className="rd-hero">
                <div className="rd-hero-bg">
                    <Image src={heroImage.src} alt={heroImage.alt} fill style={{ objectFit: 'cover' }} priority />
                </div>
                <div className="rd-hero-overlay" />
                <div className="container rd-hero-content">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <Link href="/resources">Resources</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span>Reports &amp; Data</span>
                    </div>
                    <h1>Reports &amp; Data</h1>
                    <p>
                        National fortification compliance figures and a searchable repository of compliance, surveillance, and evaluation reports from NAFDAC, SON, FCCPC, and partners.
                    </p>
                    <div className="rd-hero-stats">
                        <div className="rd-hero-stat">
                            <div className="rd-hero-stat-num">{reports.length}</div>
                            <div className="rd-hero-stat-label">Reports</div>
                        </div>
                        {lastUpdatedLabel && (
                            <div className="rd-hero-stat">
                                <div className="rd-hero-stat-num" style={{ fontSize: '1.1rem' }}>{lastUpdatedLabel}</div>
                                <div className="rd-hero-stat-label">Last Updated</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <section className="section" id="dashboard" style={{ scrollMarginTop: '100px' }}>
                <div className="container">
                    <p className="section-eyebrow">Compliance Dashboard</p>
                    <h2 className="section-title">National Fortification Compliance</h2>
                    <p className="section-lead">
                        Annual compliance figures for mandatory fortification vehicles across Nigeria, tracked year by year.
                    </p>
                    <ComplianceDashboard reports={complianceReports} />
                </div>
            </section>

            <section className="section" id="repository" style={{ background: 'var(--bg-off)', scrollMarginTop: '100px' }}>
                <div className="container">
                    <p className="section-eyebrow">Downloads</p>
                    <h2 className="section-title">Reports Repository</h2>
                    <p className="section-lead">
                        Search and filter compliance, surveillance, laboratory, and evaluation reports by year, agency, report type, food vehicle, or topic.
                    </p>
                    <ReportsRepository reports={reports} />
                </div>
            </section>
        </main>
    );
}
