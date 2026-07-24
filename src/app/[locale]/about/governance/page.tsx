import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import { getGovernanceRepresentatives, getStrapiMediaUrl, getLaboratories, Laboratory } from '@/lib/api';

export const metadata: Metadata = {
    title: 'Governance & Compliance | National Fortification Alliance',
    description: 'Learn about the roles, responsibilities, regulatory monitoring, and industry compliance structure of the NFA Nigeria.',
};

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

const MEETINGS = [
    { year: '2026', june: 'NAFDAC', december: 'Industry' },
    { year: '2027', june: 'SON', december: 'FCCPC' },
    { year: '2028', june: 'FMoHSW', december: 'NAFDAC' }
];

const CHALLENGES = [
    'Scarcity of Vitamin A Palmitate',
    'Foreign exchange constraints affecting premix supply',
    'Technical limitations in fortification equipment',
    'Inconsistencies in laboratory analytical results',
    'Challenges with shelf-life stability studies',
    'Packaging and storage limitations',
    'Inconsistent customs tariff implementation',
    'Inadequate monitoring of imported products',
    'Informal retail packaging challenges',
    'Technical capacity gaps in micronutrient testing'
];

const STEERING_COMMITTEE = [
    'Industry Representatives',
    'Federal Ministry of Health and Social Welfare',
    'Federal Ministry of Education',
    'Standards Organisation of Nigeria',
    'National Agency for Food and Drug Administration and Control',
    'Federal Competition and Consumer Protection Commission'
];

const MEMBERSHIP: Record<string, { name: string; logo?: string }[]> = {
    core: [
        { name: 'Standards Organisation of Nigeria (SON)', logo: '/son_png.png' },
        { name: 'National Agency for Food and Drug Administration and Control (NAFDAC)', logo: '/NAFDAC_emblem.png' },
        { name: 'Federal Ministry of Education (FME)' },
        { name: 'Federal Competition and Consumer Protection Commission (FCCPC)', logo: '/fccpc_logo.png' },
        { name: 'Federal Ministry of Health and Social Welfare (FMoHSW) — Nutrition Department', logo: '/Nigeria_Federal_Ministry_of_Health_Logo.png' },
        { name: 'Federal Ministry of Agriculture and Food Security (FMAFS)' },
        { name: 'Federal Ministry of Budget and Economic Planning (FMBEP)' },
        { name: 'Institute of Public Analysts of Nigeria (IPAN)' },
        { name: 'Federal Ministry of Information and National Orientation (FMINO)' },
        { name: 'Industry' }
    ],
    stakeholders: [
        { name: 'Development Partners (GAIN, HKI, TechnoServe, WFP, UNICEF, etc.)' },
        { name: 'Academia' },
        { name: 'Professional Associations (e.g., NIFST, NSN)' },
        { name: 'Civil Society Organisations (CSOs) / Non-Governmental Organisations (NGOs)' },
        { name: 'Media' }
    ]
};

export default async function GovernancePage() {
    const representatives = await getGovernanceRepresentatives();
    const laboratoriesData = await getLaboratories();
    const labs = laboratoriesData.length ? laboratoriesData : LABS_FALLBACK;

    return (
        <main className="governance-page">
            <style>{`
                /* Hero with Image */
                .gov-hero {
                    position: relative;
                    min-height: 420px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }
                .gov-hero-bg {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                }
                .gov-hero-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(0, 82, 73, 0.92) 0%, rgba(6, 78, 59, 0.88) 100%);
                    z-index: 1;
                }
                .gov-hero-content {
                    position: relative;
                    z-index: 2;
                    padding: 5rem 0 4rem;
                }
                .gov-hero h1 {
                    color: #fff;
                    max-width: 720px;
                    margin-bottom: 1rem;
                }
                .gov-hero p {
                    color: rgba(255,255,255,0.95);
                    max-width: 720px;
                    font-size: 1.15rem;
                    line-height: 1.7;
                }
                .gov-hero .breadcrumb {
                    margin-bottom: 2rem;
                }
                .gov-hero .breadcrumb a,
                .gov-hero .breadcrumb span {
                    color: rgba(255,255,255,0.8);
                }
                .gov-hero .breadcrumb a:hover {
                    color: #fff;
                }

                .roles-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 2.5rem;
                    margin-top: 4rem;
                }

                .monitoring-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                    margin-top: 3rem;
                }
                .monitor-card {
                    background: #fff;
                    padding: 3rem 2rem;
                    border-radius: 32px;
                    text-align: center;
                    border: 1px solid var(--border-light);
                    transition: all 0.3s;
                }
                .monitor-card:hover {
                    border-color: var(--wfp-blue);
                    box-shadow: var(--shadow-xl);
                }
                .monitor-icon-box {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 2rem;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                }
                
                .monitor-card h3 { font-size: 1.3rem; margin-bottom: 1rem; color: var(--wfp-navy); }
                .monitor-card p { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; }

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
                .lab-info {
                    flex: 1;
                }
                .lab-name {
                    font-weight: 700;
                    font-size: 1.05rem;
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                }
                .lab-location {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    margin-bottom: 0.25rem;
                }
                .lab-contact {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                }
                
                .challenges-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1rem;
                    margin-top: 2rem;
                }
                .challenge-item {
                    background: #fff;
                    padding: 1rem;
                    border: 1px solid var(--border-light);
                    border-left: 4px solid var(--wfp-red, #dc2626);
                    border-radius: 4px;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }

                .membership-section {
                    margin-top: 4rem;
                }
                .membership-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                }
                .member-cat-card {
                    background: #fff;
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-md);
                    padding: 1.5rem;
                }
                .member-cat-card h4 {
                    font-size: 1rem;
                    color: var(--wfp-blue);
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border-bottom: 1px solid var(--bg-off);
                    padding-bottom: 0.5rem;
                }
                .member-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .member-list li {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    margin-bottom: 0.75rem;
                    line-height: 1.4;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .member-list li::before {
                    content: "•";
                    color: var(--wfp-gold);
                }
                .member-logo-mini {
                    width: 24px;
                    height: 24px;
                    object-fit: contain;
                    flex-shrink: 0;
                    filter: grayscale(100%);
                    opacity: 0.7;
                    transition: all 0.2s;
                }
                .member-list li:hover .member-logo-mini {
                    filter: grayscale(0%);
                    opacity: 1;
                    transform: scale(1.1);
                }

                @media (max-width: 900px) {
                    .monitoring-grid { grid-template-columns: 1fr; }
                }

                .reps-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    margin-top: 3.5rem;
                }
                .rep-row {
                    display: flex;
                    gap: 2.25rem;
                    background: #fff;
                    border: 1px solid var(--border-light);
                    border-radius: 28px;
                    padding: 2rem;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.04);
                    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .rep-row:hover {
                    box-shadow: 0 20px 60px rgba(0,0,0,0.08);
                    border-color: var(--wfp-blue-light);
                }
                .rep-row-media {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.9rem;
                    flex-shrink: 0;
                    width: 240px;
                }
                .rep-org-chip {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    background: var(--wfp-blue-light);
                    border-radius: 999px;
                    padding: 0.4rem 1rem 0.4rem 0.4rem;
                    max-width: 100%;
                }
                .rep-org-chip.no-logo {
                    padding: 0.5rem 1rem;
                }
                .rep-org-chip-logo {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .rep-org-chip-text {
                    font-size: 0.78rem;
                    font-weight: 800;
                    color: var(--wfp-navy);
                    letter-spacing: 0.01em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .rep-photo-wrap {
                    position: relative;
                    width: 240px;
                    height: 240px;
                    border-radius: 28px;
                    overflow: hidden;
                    background: linear-gradient(135deg, rgba(0, 82, 73, 0.95) 0%, rgba(6, 78, 59, 0.9) 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .rep-photo-fallback {
                    font-size: 4.5rem;
                    font-weight: 900;
                    color: rgba(255,255,255,0.85);
                    letter-spacing: -0.02em;
                }
                .rep-row-unassigned {
                    background: var(--bg-off);
                }
                .rep-photo-wrap-placeholder {
                    background: #fff;
                    border: 2px dashed var(--border-light);
                    color: var(--text-muted);
                }
                .rep-name-placeholder {
                    font-style: italic;
                    font-weight: 700;
                    color: var(--text-muted);
                }
                .rep-row-content {
                    flex: 1;
                    min-width: 0;
                }
                .rep-name {
                    font-size: 1.3rem;
                    font-weight: 800;
                    color: var(--wfp-navy);
                    line-height: 1.25;
                }
                .rep-title {
                    font-size: 0.9rem;
                    color: var(--wfp-blue);
                    font-weight: 600;
                    margin-top: 0.3rem;
                    line-height: 1.4;
                }
                .rep-org {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    margin-top: 0.15rem;
                    margin-bottom: 1.25rem;
                }
                .rep-collapsible {
                    border-top: 1px solid var(--border-light);
                    padding: 1rem 0;
                }
                .rep-collapsible summary {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    list-style: none;
                    font-size: 0.78rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--wfp-blue);
                }
                .rep-collapsible summary::-webkit-details-marker {
                    display: none;
                }
                .rep-collapsible summary::after {
                    content: '+';
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--wfp-blue);
                    transition: transform 0.2s ease;
                }
                .rep-collapsible[open] summary::after {
                    transform: rotate(45deg);
                }
                .rep-collapsible-body {
                    font-size: 0.92rem;
                    color: var(--text-secondary);
                    line-height: 1.7;
                    margin-top: 0.9rem;
                }
                .rep-responsibility-list {
                    list-style: none;
                    padding-left: 0;
                    margin-top: 0.9rem;
                }
                .rep-responsibility-list li {
                    position: relative;
                    padding-left: 1.5rem;
                    margin-bottom: 0.75rem;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    line-height: 1.6;
                }
                .rep-responsibility-list li::before {
                    content: "✓";
                    color: var(--wfp-blue);
                    font-weight: 900;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
                @media (max-width: 640px) {
                    .rep-row {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }
                    .rep-collapsible summary {
                        justify-content: center;
                        gap: 0.5rem;
                    }
                }
            `}</style>

            <div className="gov-hero">
                <div className="gov-hero-bg">
                    <Image
                        src="/about-hero.jpg"
                        alt="Governance and Compliance"
                        fill
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
                <div className="container gov-hero-content">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <Link href="/about">About</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span>Governance & Compliance</span>
                    </div>
                    <h1>Governance & Compliance</h1>
                    <p>
                        The NFA operates through a collaborative governance framework involving regulators, policymakers, industry representatives, development partners, academia, and civil society.
                    </p>
                </div>
            </div>

            {/* Alliance Leadership & Representatives */}
            {representatives.length > 0 && (
                <section className="section">
                    <div className="container">
                        <p className="section-eyebrow">People</p>
                        <h2 className="section-title">Alliance Leadership &amp; Representatives</h2>
                        <p className="section-lead">Meet the individuals representing each member organization on the National Fortification Alliance.</p>

                        <div className="reps-grid">
                            {representatives.map((rep) => {
                                const isAssigned = Boolean(rep.name);
                                const orgLogo = rep.organization_logo ? getStrapiMediaUrl(rep.organization_logo.url) : null;
                                const orgLabel = rep.organization_short_name || rep.organization_name;
                                const initials = isAssigned
                                    ? rep.name!
                                        .split(' ')
                                        .filter((w) => /^[A-Z]/.test(w))
                                        .map((w) => w[0])
                                        .join('')
                                        .slice(0, 2)
                                    : '';
                                return (
                                    <div key={rep.id} className={`rep-row${isAssigned ? '' : ' rep-row-unassigned'}`}>
                                        <div className="rep-row-media">
                                            <div className={`rep-org-chip${orgLogo ? '' : ' no-logo'}`}>
                                                {orgLogo && (
                                                    <span className="rep-org-chip-logo">
                                                        <Image src={orgLogo} alt="" width={28} height={28} style={{ objectFit: 'contain' }} />
                                                    </span>
                                                )}
                                                <span className="rep-org-chip-text">{orgLabel}</span>
                                            </div>
                                            <div className={`rep-photo-wrap${isAssigned ? '' : ' rep-photo-wrap-placeholder'}`}>
                                                {isAssigned && rep.photo ? (
                                                    <Image
                                                        src={getStrapiMediaUrl(rep.photo.url)}
                                                        alt={rep.name!}
                                                        fill
                                                        sizes="240px"
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                ) : isAssigned ? (
                                                    <span className="rep-photo-fallback">{initials}</span>
                                                ) : (
                                                    <Icon name="users" size={56} />
                                                )}
                                            </div>
                                        </div>
                                        <div className="rep-row-content">
                                            {isAssigned ? (
                                                <>
                                                    <div className="rep-name">{rep.name}</div>
                                                    <div className="rep-title">{rep.title}</div>
                                                </>
                                            ) : (
                                                <div className="rep-name rep-name-placeholder">Representative yet to be assigned</div>
                                            )}
                                            <div className="rep-org">{rep.organization_name}</div>

                                            {isAssigned && rep.bio && (
                                                <details className="rep-collapsible" open>
                                                    <summary>About {rep.name!.split(' ').slice(-1)[0]}</summary>
                                                    <p className="rep-collapsible-body">{rep.bio}</p>
                                                </details>
                                            )}

                                            {rep.organization_profile && (
                                                <details className="rep-collapsible">
                                                    <summary>About {orgLabel}</summary>
                                                    <p className="rep-collapsible-body">{rep.organization_profile}</p>
                                                </details>
                                            )}

                                            {rep.key_contributions?.length > 0 && (
                                                <details className="rep-collapsible" open={!isAssigned}>
                                                    <summary>Key Responsibilities</summary>
                                                    <ul className="rep-responsibility-list">
                                                        {rep.key_contributions.map((item, i) => (
                                                            <li key={i}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </details>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Steering Committee Section */}
            <section className="section" style={{ background: 'var(--bg-off)', borderBottom: '1px solid var(--border-light)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <p className="section-eyebrow">Leadership</p>
                            <h2>NFA Steering Committee</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '1rem' }}>
                                The Steering Committee provides high-level strategic direction and oversight for the National Fortification Alliance, ensuring policy alignment and cross-sectoral accountability.
                            </p>
                        </div>
                        <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
                            <h4 style={{ marginBottom: '1.5rem', color: 'var(--wfp-navy)' }}>Committee Membership</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {STEERING_COMMITTEE.map((m, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                                        <Icon name="check-circle" size={16} style={{ color: 'var(--wfp-green)', flexShrink: 0 }} /> {m}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Regulatory Monitoring System */}
            <section className="section" style={{ background: 'var(--bg-off)' }}>
                <div className="container">
                    <p className="section-eyebrow" style={{ color: 'var(--wfp-blue)' }}>Compliance</p>
                    <h2 className="section-title">Regulatory Monitoring System</h2>
                    <p className="section-lead">According to the NFA Regulatory Framework, food fortification monitoring in Nigeria operates across three major levels to ensure product quality from production to consumption.</p>
                    
                    <div className="monitoring-grid">
                        <div className="monitor-card">
                            <div className="monitor-icon-box" style={{ background: '#f0f7ff', color: 'var(--wfp-blue)' }}>
                                <Icon name="settings" size={32} />
                            </div>
                            <h3>Factory Level</h3>
                            <p>Conducted by the <strong>Standards Organisation of Nigeria (SON)</strong> to ensure compliance during the production process.</p>
                        </div>
                        <div className="monitor-card">
                            <div className="monitor-icon-box" style={{ background: '#f5f3ff', color: 'var(--wfp-navy)' }}>
                                <Icon name="truck" size={32} />
                            </div>
                            <h3>Distribution & Retail</h3>
                            <p>Conducted by the <strong>National Agency for Food and Drug Administration and Control (NAFDAC)</strong> at market and port levels.</p>
                        </div>
                        <div className="monitor-card">
                            <div className="monitor-icon-box" style={{ background: '#f0fdf4', color: 'var(--wfp-green)' }}>
                                <Icon name="home" size={32} />
                            </div>
                            <h3>Household Level</h3>
                            <p>Conducted by the <strong>Federal Competition and Consumer Protection Commission (FCCPC)</strong>.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Feature Section */}
            <section className="section" style={{ background: 'linear-gradient(135deg, var(--wfp-blue-light) 0%, rgba(0, 135, 81, 0.08) 100%)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <p className="section-eyebrow" style={{ color: 'var(--wfp-blue)' }}>Collaboration</p>
                            <h2 style={{ fontSize: '2.25rem', marginBottom: '1.5rem' }}>Building Nigeria&apos;s Food Fortification Infrastructure</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                                Through multi-sectoral coordination, the NFA strengthens regulatory frameworks, laboratory capacity, and industry compliance to ensure every Nigerian has access to fortified foods.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                                <div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--wfp-blue)', marginBottom: '0.5rem' }}>8</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Accredited Laboratories</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--wfp-blue)', marginBottom: '0.5rem' }}>6</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Key Stakeholder Groups</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', aspectRatio: '4/3', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                            <Image
                                src="/factory.jpg"
                                alt="Food fortification infrastructure"
                                fill
                                sizes="(max-width: 900px) 100vw, 50vw"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

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

            {/* Biannual Meetings & Challenges */}
            <section className="section" style={{ background: 'var(--bg-off)' }}>
                <div className="container">
                    <div className="roles-grid" style={{ marginTop: 0, gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                        
                        {/* Meetings */}
                        <div>
                            <p className="section-eyebrow">Collaboration</p>
                            <h2 style={{ marginBottom: '1.5rem' }}>NFA Biannual Meetings</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                The Alliance convenes twice yearly to review programme implementation, discuss technical updates, strengthen coordination, review compliance, and agree on strategic actions.
                            </p>
                            
                            <div className="table-container" style={{ marginTop: '1rem' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Year</th>
                                            <th>June Meeting Host</th>
                                            <th>December Meeting Host</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MEETINGS.map((m, idx) => (
                                            <tr key={idx}>
                                                <td><strong>{m.year}</strong></td>
                                                <td>{m.june}</td>
                                                <td>{m.december}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Challenges */}
                        <div>
                            <p className="section-eyebrow" style={{ color: 'var(--wfp-red, #dc2626)' }}>Transparency</p>
                            <h2 style={{ marginBottom: '1.5rem' }}>Industry Challenges</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                Identifying and addressing operational hurdles is critical. The NFA actively works to mitigate the following identified industry challenges:
                            </p>
                            <div className="challenges-grid">
                                {CHALLENGES.map((challenge, idx) => (
                                    <div key={idx} className="challenge-item">
                                        {challenge}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Full Membership Categories */}
                    <div className="membership-section">
                        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Broad Participation</p>
                        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Membership of the NFA</h2>
                        
                        <div className="membership-grid">
                            <div className="member-cat-card">
                                <h4><Icon name="landmark" size={18} /> Core Members</h4>
                                <ul className="member-list">
                                    {MEMBERSHIP.core.map((m, i) => (
                                        <li key={i}>
                                            {m.logo && <Image src={m.logo} alt="" width={24} height={24} className="member-logo-mini" />}
                                            {m.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="member-cat-card">
                                <h4><Icon name="heart-handshake" size={18} /> Stakeholders</h4>
                                <ul className="member-list">
                                    {MEMBERSHIP.stakeholders.map((m, i) => (
                                        <li key={i}>
                                            {m.logo && <Image src={m.logo} alt="" width={24} height={24} className="member-logo-mini" />}
                                            {m.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
