import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { getTeamMembers, getStrapiMediaUrl, type TeamMember } from '@/lib/api';
import FunctionsAccordion from '@/components/FunctionsAccordion';

const SECRETARIAT_EMAIL = 'secretariat@nationalfortificationalliance.org.ng';
const SECRETARIAT_HERO_IMAGE = getStrapiMediaUrl('/uploads/6_B5_A4269_1_2_cbab97361b.jpg');

const CORE_FUNCTIONS = [
    {
        title: 'Coordinating Alliance Meetings',
        body: 'The Secretariat plans, organizes, and coordinates meetings of the National Fortification Alliance, the Steering Committee, technical working groups, and other stakeholder engagements. It prepares meeting agendas, facilitates deliberations, records proceedings, and follows up on agreed action points to ensure timely implementation.',
    },
    {
        title: 'Providing Technical and Administrative Support',
        body: 'The Secretariat provides continuous technical and administrative support to the Alliance by coordinating programmes, supporting committee activities, managing official correspondence, preparing technical documents, and facilitating collaboration among member institutions and development partners.',
    },
    {
        title: 'Managing Stakeholder Communication',
        body: 'The Secretariat serves as the primary communication hub for the Alliance, maintaining regular engagement with government ministries, regulatory agencies, industry associations, development partners, academia, civil society organizations, and other stakeholders. It supports information sharing, public awareness initiatives, and dissemination of technical guidance and official communications.',
    },
    {
        title: 'Monitoring Implementation of Alliance Decisions',
        body: 'The Secretariat tracks the implementation of resolutions, recommendations, and action plans approved by the Alliance and its committees. It monitors progress across member institutions, facilitates follow-up activities, and provides periodic updates to support accountability and continuous programme improvement.',
    },
    {
        title: 'Maintaining Records and Documentation',
        body: 'The Secretariat is responsible for preserving institutional memory through the maintenance of meeting minutes, communiqués, policy documents, technical reports, guidelines, correspondence, and other official records. It ensures that documentation is organized, accessible, and available to support decision-making and knowledge management.',
    },
    {
        title: 'Supporting Policy Implementation and Reporting',
        body: 'The Secretariat supports the implementation of national food fortification policies, standards, regulations, and strategic initiatives by coordinating reporting activities, compiling programme data, preparing progress reports, and providing evidence to inform policy review, programme evaluation, and strategic decision-making.',
    },
];

export const metadata: Metadata = {
    title: 'NFA Secretariat | National Fortification Alliance Nigeria',
    description: 'Meet the dedicated team at the NFA Secretariat coordinating the National Fortification Alliance across Nigeria.',
};

export const revalidate = 60;

// Local fallback data with the generated images
const FALLBACK_SECRETARIAT: TeamMember[] = [
    {
        id: 1,
        documentId: 'fallback-1',
        name: 'Mr. Abayomi Akinyemi',
        role: 'Deputy Director ICT',
        organization: 'NAFDAC',
        category: 'Secretariat',
        image: { id: 0, documentId: '', url: '/team-1.png' },
        phone: '08099837920',
        email: 'akinyemi.ta@nafdac.gov.ng',
        order: 1
    },
    {
        id: 2,
        documentId: 'fallback-2',
        name: 'Mr. Abubakar Tanimu Umar',
        role: 'Assistant Chief Regulatory Officer/Program Officer',
        organization: 'NAFDAC',
        category: 'Secretariat',
        image: { id: 0, documentId: '', url: '/team-2.png' },
        phone: '08035171719',
        email: 'umar.tanimu@nafdac.gov.ng',
        order: 2
    },
    {
        id: 3,
        documentId: 'fallback-3',
        name: 'Mrs. Joy Haanya',
        role: 'Assistant Chief Regulatory Officer/Program Officer',
        organization: 'NAFDAC',
        category: 'Secretariat',
        image: { id: 0, documentId: '', url: '/team-3.png' },
        phone: '08065217543',
        email: 'wandoo.haanya@nafdac.gov.ng',
        order: 3
    }
];

export default async function SecretariatPage() {
    // Fetch members specifically from the Secretariat category
    const backendMembers = await getTeamMembers('Secretariat');

    // Use backend data if available, otherwise fall back to hardcoded data
    const hasBackendData = backendMembers && backendMembers.length > 0;
    const displayMembers = hasBackendData ? backendMembers : FALLBACK_SECRETARIAT;
    const useFallback = !hasBackendData;

    return (
        <main className="secretariat-page">
            <style>{`
                /* Hero with Image */
                .secretariat-hero {
                    position: relative;
                    min-height: 340px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }
                .secretariat-hero-bg {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                }
                .secretariat-hero-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(0, 82, 73, 0.84) 0%, rgba(6, 78, 59, 0.80) 100%);
                    z-index: 1;
                }
                .secretariat-hero-content {
                    position: relative;
                    z-index: 2;
                    padding: 3.5rem 0 2.75rem;
                }
                .secretariat-hero h1 {
                    color: #fff;
                    max-width: 720px;
                    margin-bottom: 1rem;
                }
                .secretariat-hero p {
                    color: rgba(255,255,255,0.95);
                    max-width: 720px;
                    font-size: 1.15rem;
                    line-height: 1.7;
                }
                .secretariat-hero .breadcrumb {
                    margin-bottom: 2rem;
                }
                .secretariat-hero .breadcrumb a,
                .secretariat-hero .breadcrumb span {
                    color: rgba(255,255,255,0.8);
                }
                .secretariat-hero .breadcrumb a:hover {
                    color: #fff;
                }

                .members-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 2.5rem;
                    margin-top: 4rem;
                }

                .member-card {
                    background: #fff;
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    border: 1px solid var(--border-light);
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    display: flex;
                    flex-direction: column;
                }

                .member-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
                    border-color: var(--wfp-blue-light);
                }

                .member-image-wrap {
                    position: relative;
                    height: 320px;
                    width: 100%;
                    background: #f8fafc;
                }

                .member-info {
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }

                .member-org {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--wfp-blue);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.5rem;
                }

                .member-name {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin-bottom: 0.25rem;
                }

                .member-role {
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    margin-bottom: 0.75rem;
                }

                .member-contact {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    margin-bottom: 0.5rem;
                }

                .member-contact a {
                    color: var(--wfp-green);
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .member-contact a:hover {
                    color: var(--wfp-green-dark);
                    text-decoration: underline;
                }

                .member-contact-list {
                    margin-top: auto;
                    padding-top: 0.75rem;
                }

                .secretariat-intro {
                    max-width: 820px;
                    margin: 0 auto 1rem;
                }

                .secretariat-intro h2 {
                    text-align: center;
                    margin-bottom: 1.5rem;
                }

                .secretariat-intro p {
                    color: var(--text-secondary);
                    line-height: 1.8;
                    margin-bottom: 1.25rem;
                }

                .functions-section {
                    background: var(--bg-off);
                    padding: 5rem 0;
                }

                .functions-accordion {
                    max-width: 820px;
                    margin: 0 auto;
                    background: #fff;
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                }

                .functions-item {
                    border-bottom: 1px solid var(--border-light);
                }

                .functions-item:last-child {
                    border-bottom: none;
                }

                .functions-summary {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    cursor: pointer;
                    background: none;
                    border: none;
                    padding: 1.5rem 2rem;
                    text-align: left;
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .functions-item.open .functions-summary {
                    color: var(--wfp-blue);
                }

                .functions-icon {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: var(--wfp-blue);
                    flex-shrink: 0;
                }

                .functions-body {
                    font-size: 0.95rem;
                    line-height: 1.75;
                    color: var(--text-secondary);
                    padding: 0 2rem 1.5rem;
                }

                .cta-section {
                    background: linear-gradient(135deg, #005249 0%, #064e3b 100%);
                    padding: 5rem 0;
                }

                .btn-outline-light {
                    background: transparent;
                    border: 1.5px solid rgba(255,255,255,0.6);
                    color: #fff;
                }

                .btn-outline-light:hover {
                    background: rgba(255,255,255,0.1);
                    border-color: #fff;
                    color: #fff;
                }

                .admin-note {
                    background: #fefce8;
                    border: 1px solid #fef08a;
                    color: #854d0e;
                    padding: 1rem;
                    border-radius: var(--radius-md);
                    margin-bottom: 3rem;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                @media (max-width: 640px) {
                    .hero-title { font-size: 2.25rem; }
                    .members-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="secretariat-hero">
                <div className="secretariat-hero-bg">
                    <Image
                        src={SECRETARIAT_HERO_IMAGE}
                        alt="NFA Secretariat Team"
                        fill
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
                <div className="container secretariat-hero-content">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <Link href="/about">About</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span>Secretariat</span>
                    </div>
                    <h1>NFA Secretariat</h1>
                    <p>
                        A dedicated multidisciplinary team coordinating the National Fortification Alliance,
                        bridging the gap between policy, industry, and impact across all 36 states of Nigeria.
                    </p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div className="secretariat-intro">
                        <h2>About the NFA Secretariat</h2>
                        <p>
                            The National Fortification Alliance (NFA) Secretariat serves as the operational and coordinating hub of the
                            Alliance, providing the technical, administrative, and strategic support required to drive Nigeria&apos;s food
                            fortification programme. Hosted by the National Agency for Food and Drug Administration and Control (NAFDAC),
                            the Secretariat facilitates collaboration among government institutions, development partners, industry,
                            academia, civil society organizations, and other stakeholders committed to improving national nutrition outcomes.
                        </p>
                        <p>
                            Working under the guidance of the NFA Steering Committee and Governance, the Secretariat coordinates Alliance
                            activities, convenes technical and governance meetings, supports policy implementation, monitors progress
                            against agreed priorities, manages communications and knowledge resources, and promotes accountability across
                            member institutions. It also serves as the primary point of contact for stakeholders seeking information,
                            technical guidance, and partnership opportunities related to large-scale food fortification in Nigeria.
                        </p>
                        <p>
                            Through effective coordination, evidence-based planning, and multi-sectoral engagement, the Secretariat ensures
                            that the Alliance functions as a unified platform dedicated to reducing micronutrient deficiencies and improving
                            the health and nutrition of all Nigerians.
                        </p>
                    </div>

                    {useFallback && (
                        <div className="admin-note">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span><strong>Note to Administrator:</strong> To manage this team, update the &quot;Team Member&quot; collection in Strapi and set the category to &quot;Secretariat&quot;. Showing demonstration data below.</span>
                        </div>
                    )}

                    <div className="members-grid">
                        {(useFallback ? FALLBACK_SECRETARIAT : displayMembers).map((m, index) => {
                            const TEAM_FALLBACK_IMAGES = ['/team-1.png', '/team-2.png', '/team-3.png'];
                            const fallbackImage = TEAM_FALLBACK_IMAGES[index % TEAM_FALLBACK_IMAGES.length];
                            const imageUrl = m.image?.url ? getStrapiMediaUrl(m.image.url) : fallbackImage;
                            return (
                            <div key={m.id} className="member-card">
                                <div className="member-image-wrap">
                                    <Image
                                        src={imageUrl}
                                        alt={m.name}
                                        fill
                                        sizes="(max-width: 640px) 50vw, 280px"
                                        style={{ objectFit: 'cover', objectPosition: 'top' }}
                                    />
                                </div>
                                <div className="member-info">
                                    <div className="member-org">{m.organization || 'National Fortification Alliance'}</div>
                                    <h3 className="member-name">{m.name}</h3>
                                    <div className="member-role">{m.role}</div>
                                    <div className="member-contact-list">
                                        {m.phone && (
                                            <div className="member-contact">
                                                <Icon name="phone" size={14} aria-hidden="true" />
                                                <a href={`tel:${m.phone}`}>{m.phone}</a>
                                            </div>
                                        )}
                                        <div className="member-contact">
                                            <Icon name="mail" size={14} aria-hidden="true" />
                                            <a href={`mailto:${SECRETARIAT_EMAIL}`}>{SECRETARIAT_EMAIL}</a>
                                        </div>
                                        {m.email && (
                                            <div className="member-contact">
                                                <Icon name="mail" size={14} aria-hidden="true" />
                                                <a href={`mailto:${m.email}`}>{m.email}</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <div className="functions-section">
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Core Functions of the Secretariat</h2>
                    <p style={{ maxWidth: '800px', margin: '0 auto 3rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        The National Fortification Alliance (NFA) Secretariat serves as the central coordinating body responsible for
                        ensuring the effective functioning of the Alliance. It provides the administrative, technical, and operational
                        support required to facilitate collaboration among member institutions, coordinate national food fortification
                        activities, and monitor the implementation of the Alliance&apos;s strategic priorities.
                    </p>
                    <FunctionsAccordion items={CORE_FUNCTIONS} />
                </div>
            </div>

            {/* Mission section */}
            <div style={{ background: 'var(--bg-off)', padding: '5rem 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Our Role and Mission</h2>
                    <div style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)', textAlign: 'left' }}>
                        <p style={{ marginBottom: '1.25rem' }}>
                            The National Fortification Alliance (NFA) Secretariat is committed to providing the administrative, technical,
                            and strategic support required for the effective coordination and implementation of Nigeria&apos;s national food
                            fortification programme. As the operational arm of the Alliance, the Secretariat works to ensure that decisions
                            of the Steering Committee are translated into coordinated actions that strengthen food fortification across the
                            country.
                        </p>
                        <p>
                            The Secretariat facilitates technical coordination among government institutions, development partners,
                            industry, academia, and civil society organizations, promoting collaboration and alignment toward shared
                            nutrition objectives. It coordinates meetings of the Alliance and its technical committees, supports programme
                            planning and implementation, manages stakeholder communications, and provides monitoring and reporting support
                            to track progress, document achievements, and inform evidence-based decision-making.
                        </p>
                        <p style={{ marginTop: '1.25rem' }}>
                            Through effective coordination, transparent communication, and strong institutional partnerships, the
                            Secretariat contributes to the sustainable delivery of large-scale food fortification initiatives that improve
                            micronutrient intake, protect public health, and advance nutrition outcomes for all Nigerians.
                        </p>
                    </div>
                </div>
            </div>

            {/* Closing call-to-action */}
            <div className="cta-section">
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Work With the Secretariat</h2>
                    <p style={{ maxWidth: '640px', margin: '0 auto 2rem', color: 'rgba(255,255,255,0.9)' }}>
                        Have a question, a partnership idea, or need technical guidance on food fortification in Nigeria? Reach out to
                        the Secretariat directly.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/contact" className="btn btn-primary">Contact the Secretariat</Link>
                        <Link href="/resources" className="btn btn-outline-light">Access Secretariat Resources</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
