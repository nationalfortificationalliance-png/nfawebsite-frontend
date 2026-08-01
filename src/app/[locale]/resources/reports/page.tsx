import type { Metadata } from 'next';
import { getReports, getComplianceReports } from '@/lib/api';
import ReportsRepository from '@/components/ReportsRepository';
import ComplianceDashboard from '@/components/ComplianceDashboard';
import PageHero from '@/components/PageHero';
import HeroStats from '@/components/HeroStats';
import { getLatestDateLabel } from '@/lib/utils';

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

    const lastUpdatedLabel = getLatestDateLabel(reports.map((r) => r.published_date));

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
            <PageHero
                image={{ src: heroImage.src, alt: heroImage.alt }}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }, { label: 'Reports & Data' }]}
                title="Reports & Data"
                description="National fortification compliance figures and a searchable repository of compliance, surveillance, and evaluation reports from NAFDAC, SON, FCCPC, and partners."
            >
                <HeroStats
                    items={[
                        { value: reports.length, label: 'Reports' },
                        ...(lastUpdatedLabel ? [{ value: lastUpdatedLabel, label: 'Last Updated', small: true }] : []),
                    ]}
                />
            </PageHero>

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
