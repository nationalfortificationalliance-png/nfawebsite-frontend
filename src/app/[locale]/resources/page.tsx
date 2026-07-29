import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Icon, { IconName } from '@/components/Icon';
import {
    getLaboratories, Laboratory,
    getIndustryChallenges, IndustryChallenge,
    getGuidelineDocuments, GuidelineDocument,
    getStrapiMediaUrl,
} from '@/lib/api';

export const metadata: Metadata = {
    title: 'Resources | National Fortification Alliance',
    description: 'Approved micronutrient laboratories, industry challenges, and guideline documents from the National Fortification Alliance Nigeria.',
};

export const revalidate = 60;

const LABS_FALLBACK: Laboratory[] = [
    { id: 1, documentId: '1', name: 'Saag Chemicals', location: 'Lagos', contact: '08025589200', order: 1 },
    { id: 2, documentId: '2', name: 'Remaben Scientific Services Ltd', location: 'Ikeja', contact: '08023037743', order: 2 },
    { id: 3, documentId: '3', name: 'Bato Chemical Labs Ltd', location: 'Ogun State', contact: '08091972222', order: 3 },
    { id: 4, documentId: '4', name: 'Jawura Environmental Services Ltd', location: 'Lagos', contact: '09058592802', order: 4 },
    { id: 5, documentId: '5', name: 'LS Scientific Limited', location: 'Ikeja', contact: '08094709004', order: 5 },
    { id: 6, documentId: '6', name: 'Alfa Laboratories', location: 'Lagos', contact: '08023093103', order: 6 },
    { id: 7, documentId: '7', name: 'Katchey Laboratory', location: 'Ikeja', contact: '08036209410', order: 7 },
    { id: 8, documentId: '8', name: 'Bureau Veritas Nigeria Ltd', location: 'Ogun State', contact: '08095559245', order: 8 },
];

const CHALLENGES_FALLBACK: IndustryChallenge[] = [
    { text: 'Scarcity of Vitamin A Palmitate', category: 'Supply Chain' },
    { text: 'Foreign exchange constraints affecting premix supply', category: 'Supply Chain' },
    { text: 'Technical limitations in fortification equipment', category: 'Technical & Equipment' },
    { text: 'Challenges with shelf-life stability studies', category: 'Technical & Equipment' },
    { text: 'Technical capacity gaps in micronutrient testing', category: 'Technical & Equipment' },
    { text: 'Inconsistencies in laboratory analytical results', category: 'Quality & Compliance' },
    { text: 'Packaging and storage limitations', category: 'Quality & Compliance' },
    { text: 'Informal retail packaging challenges', category: 'Quality & Compliance' },
    { text: 'Inconsistent customs tariff implementation', category: 'Regulatory & Customs' },
    { text: 'Inadequate monitoring of imported products', category: 'Regulatory & Customs' },
].map((c, i) => ({ id: i + 1, documentId: String(i + 1), text: c.text, category: c.category, order: i + 1 }));

const CHALLENGE_CATEGORY_ORDER = ['Supply Chain', 'Technical & Equipment', 'Quality & Compliance', 'Regulatory & Customs'];
const CHALLENGE_CATEGORY_ICONS: Record<string, IconName> = {
    'Supply Chain': 'truck',
    'Technical & Equipment': 'settings',
    'Quality & Compliance': 'microscope',
    'Regulatory & Customs': 'landmark',
};

export default async function ResourcesPage() {
    const laboratoriesData = await getLaboratories();
    const labs = laboratoriesData.length ? laboratoriesData : LABS_FALLBACK;
    const industryChallengesData = await getIndustryChallenges();
    const challenges = industryChallengesData.length ? industryChallengesData : CHALLENGES_FALLBACK;
    const documents = await getGuidelineDocuments();

    return (
        <main className="resources-page">
            <style>{`
                .res-hero {
                    position: relative;
                    min-height: 340px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    background: linear-gradient(135deg, rgba(0, 82, 73, 0.94) 0%, rgba(6, 78, 59, 0.9) 100%);
                }
                .res-hero-content {
                    position: relative;
                    z-index: 2;
                    padding: 3.5rem 0 2.75rem;
                }
                .res-hero .breadcrumb { justify-content: flex-start; margin-bottom: 1.5rem; }
                .res-hero .breadcrumb a, .res-hero .breadcrumb span { color: rgba(255,255,255,0.8); }
                .res-hero .breadcrumb a:hover { color: #fff; }
                .res-hero h1 { color: #fff; max-width: 720px; margin-bottom: 1rem; }
                .res-hero p { color: rgba(255,255,255,0.95); max-width: 720px; font-size: 1.1rem; line-height: 1.7; }

                .labs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                    margin-top: 3rem;
                }
                .lab-card {
                    background: #fff;
                    border: 1px solid var(--border-light);
                    border-radius: 16px;
                    padding: 1.75rem;
                    transition: all 0.3s ease;
                    display: flex;
                    gap: 1.25rem;
                }
                .lab-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
                    border-color: var(--wfp-blue-light);
                }
                .lab-icon {
                    width: 48px;
                    height: 48px;
                    background: var(--wfp-blue-light);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--wfp-blue);
                    flex-shrink: 0;
                }
                .lab-info { flex: 1; }
                .lab-name { font-weight: 700; font-size: 1.05rem; color: var(--text-primary); margin-bottom: 0.5rem; }
                .lab-location, .lab-contact {
                    display: flex; align-items: center; gap: 0.5rem;
                    font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.25rem;
                }
                .lab-contact { font-weight: 500; margin-bottom: 0; }

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

            <div className="res-hero">
                <div className="container res-hero-content">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span>Resources</span>
                    </div>
                    <h1>Resources</h1>
                    <p>
                        Approved micronutrient laboratories, industry challenges, and technical guideline documents supporting Nigeria&apos;s food fortification programme.
                    </p>
                </div>
            </div>

            {/* Approved Labs */}
            <section className="section">
                <div className="container">
                    <p className="section-eyebrow">Quality Assurance</p>
                    <h2 className="section-title">Approved Micronutrient Laboratories</h2>
                    <p className="section-lead">
                        The NFA, in collaboration with the Institute of Public Analysts of Nigeria (IPAN), recognizes accredited laboratories supporting micronutrient analysis and compliance monitoring.
                    </p>

                    <div className="labs-grid">
                        {labs.map((lab) => (
                            <div key={lab.id} className="lab-card">
                                <div className="lab-icon">
                                    <Icon name="microscope" size={24} />
                                </div>
                                <div className="lab-info">
                                    <div className="lab-name">{lab.name}</div>
                                    <div className="lab-location">
                                        <Icon name="map-pin" size={14} />
                                        {lab.location}
                                    </div>
                                    <div className="lab-contact">
                                        <Icon name="phone" size={14} />
                                        {lab.contact}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Industry Challenges */}
            <section className="section" style={{ background: 'var(--bg-off)' }}>
                <div className="container">
                    <p className="section-eyebrow" style={{ color: 'var(--wfp-red, #dc2626)' }}>Transparency</p>
                    <h2 className="section-title">Industry Challenges</h2>
                    <p className="section-lead">
                        Identifying and addressing operational hurdles is critical. The NFA actively works to mitigate the following identified industry challenges:
                    </p>
                    <div className="challenges-groups">
                        {CHALLENGE_CATEGORY_ORDER
                            .map((category) => ({ category, items: challenges.filter((c) => c.category === category) }))
                            .filter((group) => group.items.length > 0)
                            .map((group) => (
                                <div key={group.category} className="challenge-group">
                                    <h4 className="challenge-group-title">
                                        <Icon name={CHALLENGE_CATEGORY_ICONS[group.category] || 'settings'} size={18} />
                                        {group.category}
                                    </h4>
                                    <div className="challenges-grid">
                                        {group.items.map((challenge) => (
                                            <div key={challenge.id} className="challenge-item">
                                                <span>{challenge.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </section>

            {/* Guideline Documents */}
            <section className="section">
                <div className="container">
                    <p className="section-eyebrow">Downloads</p>
                    <h2 className="section-title">Guideline Documents</h2>
                    <p className="section-lead">
                        Regulatory guidelines, technical reports, and reference documents for fortification stakeholders.
                    </p>

                    {documents.length > 0 ? (
                        <div className="docs-grid">
                            {documents.map((doc) => {
                                const publishedDate = doc.published_date
                                    ? new Date(doc.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                    : null;
                                const fileUrl = doc.file ? getStrapiMediaUrl(doc.file.url) : null;
                                return (
                                    <div key={doc.id} className="doc-card">
                                        <div className="doc-icon">
                                            <Icon name="file-text" size={24} />
                                        </div>
                                        <div className="doc-info">
                                            <div className="doc-title">{doc.title}</div>
                                            {doc.description && <div className="doc-desc">{doc.description}</div>}
                                            <div className="doc-meta">
                                                <span className="doc-badge">{doc.category}</span>
                                                {publishedDate && <span>{publishedDate}</span>}
                                                {doc.file_size && <span>{doc.file_size}</span>}
                                            </div>
                                            {fileUrl && (
                                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="doc-download">
                                                    <Icon name="arrow-right" size={14} /> Download
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="res-empty">Guideline documents will be published here shortly.</p>
                    )}
                </div>
            </section>
        </main>
    );
}
