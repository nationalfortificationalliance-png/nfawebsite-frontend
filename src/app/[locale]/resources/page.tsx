import type { Metadata } from 'next';
import {
    getLaboratories,
    getIndustryChallenges,
    getGuidelineDocuments,
} from '@/lib/api';
import ResourceCentre from '@/components/ResourceCentre';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
    title: 'Resources | National Fortification Alliance',
    description: 'Approved micronutrient laboratories, industry challenges, and guideline documents from the National Fortification Alliance Nigeria.',
};

export const revalidate = 60;

// Same rotating hero-image pool used elsewhere on the site (HeroCarousel, About, News).
const RESOURCES_HERO_IMAGES = [
    { src: '/about-hero.jpg', alt: 'Laboratory quality assurance' },
    { src: '/factory.jpg', alt: 'Food fortification production line' },
    { src: '/news_hero.jpg', alt: 'Fortification stakeholders and partners' },
];

export default async function ResourcesPage() {
    const labs = await getLaboratories();
    const challenges = await getIndustryChallenges();
    const documents = await getGuidelineDocuments();

    // Randomly picked per request/revalidation — this is a Server Component (no re-render), so impurity here is intentional and safe.
    // eslint-disable-next-line react-hooks/purity
    const heroImage = RESOURCES_HERO_IMAGES[Math.floor(Math.random() * RESOURCES_HERO_IMAGES.length)];

    const lastUpdated = documents
        .map((d) => d.published_date)
        .filter((d): d is string => Boolean(d))
        .sort()
        .at(-1);
    const lastUpdatedLabel = lastUpdated
        ? new Date(lastUpdated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Resources | National Fortification Alliance',
        description: 'Approved micronutrient laboratories, industry challenges, and guideline documents from the National Fortification Alliance Nigeria.',
        hasPart: documents.map((d) => ({
            '@type': 'DigitalDocument',
            name: d.title,
            description: d.description,
            datePublished: d.published_date,
        })),
    };

    return (
        <main className="resources-page">
            <style>{`
                .res-hero-stats {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1.75rem;
                    margin-top: 1.75rem;
                }
                .res-hero-stat { color: #fff; }
                .res-hero-stat-num { font-size: 1.6rem; font-weight: 800; line-height: 1; }
                .res-hero-stat-label { font-size: 0.78rem; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.3rem; }

                .challenges-groups {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    margin-top: 2rem;
                }
                .challenge-group-title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--wfp-red, #dc2626);
                    margin: 0 0 0.5rem;
                }
                .challenges-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 0.4rem;
                }
                .challenge-item {
                    background: #fff;
                    display: flex;
                    align-items: flex-start;
                    width: 100%;
                    padding: 0.55rem 0.85rem;
                    border: 1px solid var(--border-light);
                    border-radius: 8px;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    line-height: 1.4;
                    transition: all 0.2s ease;
                }
                .challenge-item:hover {
                    transform: translateX(4px);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.06);
                    border-color: var(--wfp-red, #dc2626);
                }

                .docs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                    margin-top: 3rem;
                }
                .doc-card {
                    background: #fff;
                    border: 1px solid var(--border-light);
                    border-radius: 16px;
                    padding: 1.75rem;
                    display: flex;
                    gap: 1.25rem;
                    transition: all 0.3s ease;
                }
                .doc-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
                    border-color: var(--wfp-blue-light);
                }
                .doc-icon {
                    width: 48px;
                    height: 48px;
                    background: var(--wfp-gold-light, #fef3c7);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--wfp-gold, #b45309);
                    flex-shrink: 0;
                }
                .doc-info { flex: 1; min-width: 0; }
                .doc-title { font-weight: 700; font-size: 1.02rem; color: var(--text-primary); margin-bottom: 0.4rem; }
                .doc-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.75rem; }
                .doc-meta { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem; }
                .doc-badge {
                    display: inline-block;
                    background: var(--wfp-blue-light);
                    color: var(--wfp-blue);
                    font-size: 0.72rem;
                    font-weight: 700;
                    padding: 0.2rem 0.65rem;
                    border-radius: 999px;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                }
                .doc-download {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--wfp-blue);
                }
                .doc-download:hover { text-decoration: underline; }

                .res-empty {
                    text-align: center;
                    padding: 3rem 2rem;
                    color: var(--text-muted);
                    font-size: 0.95rem;
                }

            `}</style>

            <PageHero
                image={{ src: heroImage.src, alt: heroImage.alt }}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Resources' }]}
                title="Resources"
                description="Approved micronutrient laboratories, industry challenges, and technical guideline documents supporting Nigeria's food fortification programme."
            >
                <div className="res-hero-stats">
                    <div className="res-hero-stat">
                        <div className="res-hero-stat-num">{labs.length}</div>
                        <div className="res-hero-stat-label">Laboratories</div>
                    </div>
                    <div className="res-hero-stat">
                        <div className="res-hero-stat-num">{documents.length}</div>
                        <div className="res-hero-stat-label">Guideline Documents</div>
                    </div>
                    {lastUpdatedLabel && (
                        <div className="res-hero-stat">
                            <div className="res-hero-stat-num" style={{ fontSize: '1.1rem' }}>{lastUpdatedLabel}</div>
                            <div className="res-hero-stat-label">Last Updated</div>
                        </div>
                    )}
                </div>
            </PageHero>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <ResourceCentre labs={labs} challenges={challenges} documents={documents} />
        </main>
    );
}
