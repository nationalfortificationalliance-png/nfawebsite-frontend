import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { getPartners } from '@/lib/api';

export const metadata: Metadata = {
    title: 'Partners',
    description: 'Meet the government, UN, private sector, and civil society partners driving food fortification across Nigeria.',
};
export const revalidate = 60;

const PARTNER_TYPES: Record<string, { label: string; color: string; bg: string }> = {
    lead: { label: 'Lead Agency', color: '#1d4ed8', bg: '#dbeafe' },
    government: { label: 'Government', color: '#15803d', bg: '#dcfce7' },
    'un-agency': { label: 'UN Agency', color: '#0070bc', bg: '#e8f4fb' },
    'civil-society': { label: 'Civil Society', color: '#7e22ce', bg: '#f3e8ff' },
    'private-sector': { label: 'Private Sector', color: '#b45309', bg: '#fef3c7' },
    donor: { label: 'Donor', color: '#be123c', bg: '#ffe4e6' },
};

const STATIC_PARTNERS = [
    { id: 1, type: 'lead', name: 'WFP Nigeria', desc: 'Program lead and technical implementing partner, providing funding, coordination, and capacity building for the National Fortification Project.', logo: '/wfp-logo-standard-blue-en.svg' },
    { id: 2, type: 'government', name: 'NAFDAC', desc: 'National Authority for Food & Drugs Control — the regulatory body responsible for certifying processors, conducting audits, and enforcing fortification standards.', logo: '/NAFDAC_emblem.png' },
    { id: 3, type: 'government', name: 'Federal Ministry of Health', desc: 'Government policy owner of the national nutrition strategy, ensuring fortification aligns with Nigeria\'s public health and SDG commitments.', logo: '/Nigeria_Federal_Ministry_of_Health_Logo.png' },
    { id: 4, type: 'government', name: 'Standards Org. of Nigeria (SON)', desc: 'Sets and enforces product quality benchmarks for fortified foods, ensuring compliance with Nigerian and international standards.', logo: '/son_png.png' },
    { id: 10, type: 'government', name: 'FCCPC', desc: 'Federal Competition and Consumer Protection Commission — ensuring consumer rights and quality at the household level.', logo: '/fccpc_logo.png' },
    { id: 5, type: 'un-agency', name: 'UNICEF Nigeria', desc: 'Supports fortification interventions targeting child nutrition outcomes, providing technical assistance and advocacy aligned with child rights.', logo: '/UNICEF_Logo.png' },
    { id: 6, type: 'un-agency', name: 'WHO Nigeria', desc: 'Technical collaborator providing global evidence and WHO-aligned premix specifications for all six fortification vehicles.', logo: 'stethoscope' },
    { id: 7, type: 'civil-society', name: 'GAIN (Nigeria)', desc: 'Global Alliance for Improved Nutrition supports premix supply chain strengthening, market assessments, and private sector engagement in Nigeria.', logo: '/GAIN_logo_RVB.webp' },
    { id: 8, type: 'private-sector', name: 'Nigerian Food Processors Association', desc: 'Largest representative body for certified food manufacturers — a key implementation partner for reaching processors at scale across all 36 states.', logo: 'factory' },
    { id: 9, type: 'donor', name: 'Bill & Melinda Gates Foundation', desc: 'Strategic funder supporting research, evidence-generation, and innovation in Nigeria\'s food fortification program.', logo: '/gates foundation logo.svg' },
];

const IMPACT_QUICK = [
    { num: '9', label: 'Government Agencies' },
    { num: '18', label: 'UN & INGO Partners' },
    { num: '40+', label: 'Private Sector Partners' },
    { num: '7', label: 'Donor Organizations' },
];

export default async function PartnersPage() {
    const rawPartners = await getPartners();
    const partners = rawPartners.length > 0 ? rawPartners : STATIC_PARTNERS.map(p => ({
        id: p.id,
        documentId: `mock-partner-${p.id}`,
        name: p.name, partner_type: p.type, description: p.desc, website_url: undefined, logo: { id: 0, documentId: '', url: '' }, is_featured: true, order: p.id, is_active: true
    } as any));

    const grouped = STATIC_PARTNERS.reduce<Record<string, typeof STATIC_PARTNERS>>((acc, p) => {
        if (!acc[p.type]) acc[p.type] = [];
        acc[p.type].push(p);
        return acc;
    }, {});

    return (
        <>
            <style>{`
        /* Hero with Image - consistent with other pages */
        .partners-hero {
          position: relative;
          min-height: 420px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .partners-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .partners-hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0, 82, 73, 0.92) 0%, rgba(6, 78, 59, 0.88) 100%);
          z-index: 1;
        }
        .partners-hero-content {
          position: relative;
          z-index: 2;
          padding: 5rem 0 4rem;
        }
        .partners-hero h1 {
          color: #fff;
          max-width: 720px;
          margin-bottom: 1rem;
        }
        .partners-hero p {
          color: rgba(255,255,255,0.95);
          max-width: 720px;
          font-size: 1.15rem;
          line-height: 1.7;
        }
        .partners-hero .breadcrumb {
          margin-bottom: 2rem;
        }
        .partners-hero .breadcrumb a,
        .partners-hero .breadcrumb span {
          color: rgba(255,255,255,0.7);
        }
        .partners-hero .breadcrumb a:hover {
          color: #fff;
        }

        /* Quick stats */
        .partner-stats { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: #fff; }
        .partner-stat { padding: 1.75rem 1rem; text-align: center; border-right: 1px solid var(--border); }
        .partner-stat:last-child { border-right: none; }
        .partner-stat-num { font-size: 2.25rem; font-weight: 900; color: var(--wfp-blue); letter-spacing: -0.04em; line-height: 1; }
        .partner-stat-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-muted); font-weight: 600; margin-top: 0.3rem; }

        /* Partner type section */
        .partner-group { margin-bottom: 3rem; }
        .partner-group-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 2px solid var(--border); }
        .partner-type-badge { padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; }
        .partner-group-count { font-size: 0.82rem; color: var(--text-muted); font-weight: 500; }

        /* Partner cards */
        .partner-card { background: #fff; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.75rem; display: flex; gap: 1.25rem; align-items: flex-start; transition: all .25s var(--ease-out); }
        .partner-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .partner-logo { width: 64px; height: 64px; border-radius: 8px; background: transparent; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; flex-shrink: 0; position: relative; overflow: hidden; }
        .partner-info { flex: 1; }
        .partner-name { font-size: 1rem; font-weight: 700; margin-bottom: 0.35rem; }
        .partner-desc { font-size: 0.83rem; color: var(--text-muted); line-height: 1.65; }

        /* Become a partner */
        .become-section { background: var(--wfp-blue); padding: 5rem 0; }
        .become-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
        .become-section h2 { color: #fff; }
        .become-section p { color: rgba(255,255,255,.75); font-size: 1rem; line-height: 1.75; margin-top: 0.75rem; }
        .become-items { display: flex; flex-direction: column; gap: 1rem; }
        .become-item { display: flex; align-items: flex-start; gap: 1rem; color: rgba(255,255,255,.8); font-size: 0.9rem; }
        .become-item-icon { font-size: 1.25rem; flex-shrink: 0; margin-top: 0.1rem; }

        @media (max-width: 900px) {
          .partners-hero {
            height: 60vh;
            min-height: 500px;
          }
          .partners-hero h1 {
            font-size: 2rem;
          }
          .partners-hero p {
            font-size: 1rem;
          }
          .partner-stats { grid-template-columns: repeat(2, 1fr); }
          .become-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .partner-stats { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

            {/* ── Hero ── */}
            <div className="partners-hero">
                <div className="partners-hero-bg">
                    <Image src="/about-hero.png" alt="Partnership meeting" fill style={{ objectFit: 'cover' }} priority />
                </div>
                <div className="container partners-hero-content">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span>Partners</span>
                    </div>
                    <h1>Our Partners</h1>
                    <p>Government agencies, UN bodies, private sector, and donors — united by a single mission to eliminate micronutrient malnutrition in Nigeria.</p>
                </div>
            </div>

            {/* ── Quick stats ── */}
            <div className="partner-stats">
                {IMPACT_QUICK.map((s) => (
                    <div key={s.label} className="partner-stat">
                        <div className="partner-stat-num">{s.num}</div>
                        <div className="partner-stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Partner Groups ── */}
            <section className="section">
                <div className="container">
                    {Object.entries(grouped).map(([type, group]) => {
                        const meta = PARTNER_TYPES[type] ?? { label: type, color: '#4a5568', bg: '#f1f5f9' };
                        return (
                            <div key={type} className="partner-group">
                                <div className="partner-group-header">
                                    <span className="partner-type-badge" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
                                    <span className="partner-group-count">{group.length} organization{group.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="grid-2" style={{ gap: '1rem' }}>
                                    {group.map((p) => (
                                        <div key={p.id} className="partner-card">
                                            <div className="partner-logo">
                                                {p.logo.startsWith('/') ? (
                                                    <Image src={p.logo} alt={p.name} fill style={{ objectFit: 'contain' }} />
                                                ) : (
                                                    <Icon name={p.logo as any} size={32} />
                                                )}
                                            </div>
                                            <div className="partner-info">
                                                <div className="partner-name">{p.name}</div>
                                                <div className="partner-desc">{p.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── Become a Partner ── */}
            <div className="become-section">
                <div className="container">
                    <div className="become-grid">
                        <div>
                            <p className="section-eyebrow" style={{ color: 'var(--wfp-gold)' }}>Join the Alliance</p>
                            <h2>Become a Partner</h2>
                            <p>NFA welcomes new partners who share our commitment to eliminating malnutrition in Nigeria. We work with organizations across sectors to expand reach and deepen impact.</p>
                            <div style={{ marginTop: '1.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <Link href="/contact" className="btn btn-white btn-lg">Express Interest →</Link>
                                <Link href="/guidelines" className="btn btn-outline-white btn-lg">View Partnership Guide</Link>
                            </div>
                        </div>
                        <div className="become-items">
                            {[
                                { icon: 'factory', text: 'Food processors can receive technical support, premix sourcing guidance, and NAFDAC certification assistance.' },
                                { icon: 'landmark', text: 'Donors and foundations can co-fund fortification programs with defined impact metrics and reporting.' },
                                { icon: 'microscope', text: 'Research institutions can partner on coverage surveys, impact evaluations, and knowledge dissemination.' },
                                { icon: 'handshake', text: 'NGOs and civil society can lead demand creation campaigns and community-level nutrition education.' },
                            ].map((item, i) => (
                                <div key={i} className="become-item">
                                    <span className="become-item-icon" style={{ display: 'flex' }}><Icon name={item.icon as any} size={28} /></span>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
