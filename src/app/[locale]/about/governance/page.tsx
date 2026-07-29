import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import GovernanceRepAccordion from '@/components/GovernanceRepAccordion';
import { getGovernanceRepresentatives, getStrapiMediaUrl, getMemberOrganizations, MemberOrganization } from '@/lib/api';

export const metadata: Metadata = {
    title: 'Governance & Compliance | National Fortification Alliance',
    description: 'Learn about the roles, responsibilities, regulatory monitoring, and industry compliance structure of the NFA Nigeria.',
};

const STEERING_COMMITTEE = [
    'Industry Representatives',
    'Federal Ministry of Health and Social Welfare',
    'Federal Ministry of Education',
    'Standards Organisation of Nigeria',
    'National Agency for Food and Drug Administration and Control',
    'Federal Competition and Consumer Protection Commission'
];

const MEMBER_LOGO_FALLBACK: Record<string, string> = {
    'Standards Organisation of Nigeria (SON)': '/son_png.png',
    'National Agency for Food and Drug Administration and Control (NAFDAC)': '/NAFDAC_emblem.png',
    'Federal Competition and Consumer Protection Commission (FCCPC)': '/fccpc_logo.png',
    'Federal Ministry of Health and Social Welfare (FMoHSW) — Nutrition Department': '/Nigeria_Federal_Ministry_of_Health_Logo.png',
};

const MEMBERS_FALLBACK: MemberOrganization[] = [
    { name: 'Standards Organisation of Nigeria (SON)', category: 'Core Members' },
    { name: 'National Agency for Food and Drug Administration and Control (NAFDAC)', category: 'Core Members' },
    { name: 'Federal Ministry of Education (FME)', category: 'Core Members' },
    { name: 'Federal Competition and Consumer Protection Commission (FCCPC)', category: 'Core Members' },
    { name: 'Federal Ministry of Health and Social Welfare (FMoHSW) — Nutrition Department', category: 'Core Members' },
    { name: 'Federal Ministry of Agriculture and Food Security (FMAFS)', category: 'Core Members' },
    { name: 'Federal Ministry of Budget and Economic Planning (FMBEP)', category: 'Core Members' },
    { name: 'Institute of Public Analysts of Nigeria (IPAN)', category: 'Core Members' },
    { name: 'Federal Ministry of Information and National Orientation (FMINO)', category: 'Core Members' },
    { name: 'Industry', category: 'Core Members' },
    { name: 'Development Partners (GAIN, HKI, TechnoServe, WFP, UNICEF, etc.)', category: 'Stakeholders' },
    { name: 'Academia', category: 'Stakeholders' },
    { name: 'Professional Associations (e.g., NIFST, NSN)', category: 'Stakeholders' },
    { name: 'Civil Society Organisations (CSOs) / Non-Governmental Organisations (NGOs)', category: 'Stakeholders' },
    { name: 'Media', category: 'Stakeholders' },
].map((m, i) => ({ id: i + 1, documentId: String(i + 1), order: i + 1, ...m }));

export default async function GovernancePage() {
    const representatives = await getGovernanceRepresentatives();
    const memberOrganizationsData = await getMemberOrganizations();
    const members = memberOrganizationsData.length ? memberOrganizationsData : MEMBERS_FALLBACK;
    const coreMembers = members.filter((m) => m.category === 'Core Members');
    const stakeholderMembers = members.filter((m) => m.category === 'Stakeholders');

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
                    background: linear-gradient(135deg, rgba(0, 82, 73, 0.84) 0%, rgba(6, 78, 59, 0.80) 100%);
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

                .overview-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2rem;
                    margin-top: 3rem;
                }
                .overview-card {
                    background: #fff;
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-md);
                    padding: 1.75rem;
                    text-align: center;
                }
                .overview-card-icon {
                    width: 56px;
                    height: 56px;
                    margin: 0 auto 1rem;
                    border-radius: 16px;
                    background: var(--wfp-blue-light);
                    color: var(--wfp-blue);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .overview-card h4 { font-size: 1rem; color: var(--wfp-navy); margin-bottom: 0.5rem; }
                .overview-card p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }

                .monitoring-flow {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    margin-top: 3rem;
                }
                .monitor-arrow {
                    color: var(--wfp-gold);
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                }
                .monitor-card {
                    flex: 1;
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
                    .overview-grid { grid-template-columns: repeat(2, 1fr); }
                    .monitoring-flow { flex-direction: column; }
                    .monitor-arrow { transform: rotate(90deg); }
                }
                @media (max-width: 560px) {
                    .overview-grid { grid-template-columns: 1fr; }
                }

                .reps-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.75rem;
                    margin-top: 3.5rem;
                    align-items: start;
                }
                .rep-card {
                    background: #fff;
                    border: 1px solid var(--border-light);
                    border-radius: 24px;
                    padding: 1.75rem;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.04);
                    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                    text-align: center;
                }
                .rep-card:hover {
                    box-shadow: 0 20px 60px rgba(0,0,0,0.08);
                    border-color: var(--wfp-blue-light);
                }
                .rep-org-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: var(--wfp-blue-light);
                    border-radius: 999px;
                    padding: 0.3rem 0.9rem 0.3rem 0.3rem;
                    max-width: 100%;
                    margin-bottom: 1rem;
                }
                .rep-org-chip.no-logo {
                    padding: 0.4rem 0.9rem;
                }
                .rep-org-chip-logo {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .rep-org-chip-text {
                    font-size: 0.72rem;
                    font-weight: 800;
                    color: var(--wfp-navy);
                    letter-spacing: 0.01em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .rep-photo-wrap {
                    position: relative;
                    width: 112px;
                    height: 112px;
                    aspect-ratio: 1 / 1;
                    border-radius: 50%;
                    overflow: hidden;
                    background: linear-gradient(135deg, rgba(0, 82, 73, 0.95) 0%, rgba(6, 78, 59, 0.9) 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    margin: 0 auto 1rem;
                }
                .rep-photo-fallback {
                    font-size: 2rem;
                    font-weight: 900;
                    color: rgba(255,255,255,0.85);
                    letter-spacing: -0.02em;
                }
                .rep-card-unassigned {
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
                .rep-name {
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: var(--wfp-navy);
                    line-height: 1.25;
                }
                .rep-title {
                    font-size: 0.85rem;
                    color: var(--wfp-blue);
                    font-weight: 600;
                    margin-top: 0.3rem;
                    line-height: 1.4;
                }
                .rep-org {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin-top: 0.15rem;
                }
                .rep-updated {
                    font-size: 0.72rem;
                    color: var(--text-muted);
                    margin-top: 0.4rem;
                    font-style: italic;
                }
                .rep-accordion {
                    margin-top: 1.25rem;
                    text-align: left;
                }
                .rep-collapsible {
                    border-top: 1px solid var(--border-light);
                }
                .rep-collapsible-summary {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.75rem;
                    cursor: pointer;
                    background: none;
                    border: none;
                    padding: 0.85rem 0;
                    font-size: 0.72rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--wfp-blue);
                }
                .rep-collapsible-icon {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--wfp-blue);
                    flex-shrink: 0;
                }
                .rep-collapsible-body {
                    font-size: 0.88rem;
                    color: var(--text-secondary);
                    line-height: 1.65;
                    padding-bottom: 1rem;
                }
                .rep-responsibility-list {
                    list-style: none;
                    padding-left: 0;
                    margin: 0;
                }
                .rep-responsibility-list li {
                    position: relative;
                    padding-left: 1.5rem;
                    margin-bottom: 0.65rem;
                    font-size: 0.86rem;
                    color: var(--text-secondary);
                    line-height: 1.55;
                }
                .rep-responsibility-list li::before {
                    content: "✓";
                    color: var(--wfp-blue);
                    font-weight: 900;
                    position: absolute;
                    left: 0;
                    top: 0;
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

            {/* Governance Overview */}
            <section className="section">
                <div className="container">
                    <p className="section-eyebrow">Overview</p>
                    <h2 className="section-title">How the Alliance Is Governed</h2>
                    <p className="section-lead">
                        The NFA brings together regulators, government ministries, industry, and development partners under a shared governance structure that sets standards, monitors compliance, and drives Nigeria&apos;s food fortification programme forward.
                    </p>
                    <div className="overview-grid">
                        <div className="overview-card">
                            <div className="overview-card-icon"><Icon name="users" size={26} /></div>
                            <h4>Leadership</h4>
                            <p>Representatives from each member organization guide the Alliance&apos;s strategic direction.</p>
                        </div>
                        <div className="overview-card">
                            <div className="overview-card-icon"><Icon name="heart-handshake" size={26} /></div>
                            <h4>Membership</h4>
                            <p>Core government bodies and technical partners collaborate across sectors.</p>
                        </div>
                        <div className="overview-card">
                            <div className="overview-card-icon"><Icon name="landmark" size={26} /></div>
                            <h4>Steering Committee</h4>
                            <p>Provides high-level strategic oversight and cross-sectoral accountability.</p>
                        </div>
                        <div className="overview-card">
                            <div className="overview-card-icon"><Icon name="shield" size={26} /></div>
                            <h4>Regulatory Monitoring</h4>
                            <p>Compliance is tracked from factory production through to household consumption.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alliance Leadership & Representatives */}
            {representatives.length > 0 && (
                <section className="section" style={{ background: 'var(--bg-off)' }}>
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
                                const lastUpdated = rep.last_updated
                                    ? new Date(rep.last_updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                    : null;

                                const accordionItems = [
                                    isAssigned && rep.bio
                                        ? { key: 'bio', label: `About ${rep.name!.split(' ').slice(-1)[0]}`, content: <p>{rep.bio}</p> }
                                        : null,
                                    rep.organization_profile
                                        ? { key: 'org', label: `About ${orgLabel}`, content: <p>{rep.organization_profile}</p> }
                                        : null,
                                    rep.key_contributions?.length > 0
                                        ? {
                                            key: 'contributions',
                                            label: 'Key Responsibilities',
                                            content: (
                                                <ul className="rep-responsibility-list">
                                                    {rep.key_contributions.map((item, i) => <li key={i}>{item}</li>)}
                                                </ul>
                                            ),
                                        }
                                        : null,
                                ].filter(Boolean) as { key: string; label: string; content: React.ReactNode }[];

                                return (
                                    <div key={rep.id} className={`rep-card${isAssigned ? '' : ' rep-card-unassigned'}`}>
                                        <div className={`rep-org-chip${orgLogo ? '' : ' no-logo'}`}>
                                            {orgLogo && (
                                                <span className="rep-org-chip-logo">
                                                    <Image src={orgLogo} alt="" width={22} height={22} style={{ objectFit: 'contain' }} />
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
                                                    sizes="112px"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : isAssigned ? (
                                                <span className="rep-photo-fallback">{initials}</span>
                                            ) : (
                                                <Icon name="users" size={40} />
                                            )}
                                        </div>
                                        {isAssigned ? (
                                            <>
                                                <div className="rep-name">{rep.name}</div>
                                                <div className="rep-title">{rep.title}</div>
                                            </>
                                        ) : (
                                            <div className="rep-name rep-name-placeholder">Representative yet to be assigned</div>
                                        )}
                                        <div className="rep-org">{rep.organization_name}</div>
                                        {lastUpdated && <div className="rep-updated">Last updated: {lastUpdated}</div>}

                                        {accordionItems.length > 0 && <GovernanceRepAccordion items={accordionItems} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Full Membership Categories */}
            <section className="section">
                <div className="container">
                    <div className="membership-section">
                        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Broad Participation</p>
                        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Membership of the NFA</h2>

                        <div className="membership-grid">
                            <div className="member-cat-card">
                                <h4><Icon name="landmark" size={18} /> Core Government Members</h4>
                                <ul className="member-list">
                                    {coreMembers.map((m) => {
                                        const logoSrc = m.logo ? getStrapiMediaUrl(m.logo.url) : MEMBER_LOGO_FALLBACK[m.name];
                                        return (
                                            <li key={m.id}>
                                                {logoSrc && <Image src={logoSrc} alt="" width={24} height={24} className="member-logo-mini" />}
                                                {m.name}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div className="member-cat-card">
                                <h4><Icon name="heart-handshake" size={18} /> Development &amp; Technical Partners</h4>
                                <ul className="member-list">
                                    {stakeholderMembers.map((m) => {
                                        const logoSrc = m.logo ? getStrapiMediaUrl(m.logo.url) : MEMBER_LOGO_FALLBACK[m.name];
                                        return (
                                            <li key={m.id}>
                                                {logoSrc && <Image src={logoSrc} alt="" width={24} height={24} className="member-logo-mini" />}
                                                {m.name}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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


            {/* Regulatory Monitoring Framework */}
            <section className="section" style={{ background: 'var(--bg-off)' }}>
                <div className="container">
                    <p className="section-eyebrow" style={{ color: 'var(--wfp-blue)' }}>Compliance</p>
                    <h2 className="section-title">Regulatory Monitoring Framework</h2>
                    <p className="section-lead">According to the NFA Regulatory Framework, food fortification monitoring in Nigeria progresses across three major levels to ensure product quality from production to consumption.</p>

                    <div className="monitoring-flow">
                        <div className="monitor-card">
                            <div className="monitor-icon-box" style={{ background: '#f0f7ff', color: 'var(--wfp-blue)' }}>
                                <Icon name="settings" size={32} />
                            </div>
                            <h3>Factory Level</h3>
                            <p>Conducted by the <strong>Standards Organisation of Nigeria (SON)</strong> to ensure compliance during the production process.</p>
                        </div>
                        <div className="monitor-arrow"><Icon name="arrow-right" size={28} /></div>
                        <div className="monitor-card">
                            <div className="monitor-icon-box" style={{ background: '#f5f3ff', color: 'var(--wfp-navy)' }}>
                                <Icon name="truck" size={32} />
                            </div>
                            <h3>Distribution & Retail</h3>
                            <p>Conducted by the <strong>National Agency for Food and Drug Administration and Control (NAFDAC)</strong> at market and port levels.</p>
                        </div>
                        <div className="monitor-arrow"><Icon name="arrow-right" size={28} /></div>
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

            {/* Visual Feature Section — Collaboration Infrastructure */}
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
        </main>
    );
}
