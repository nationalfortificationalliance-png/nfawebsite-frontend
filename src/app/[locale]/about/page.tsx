import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Icon, { IconName } from '@/components/Icon';
import { getAboutPage, getStats, getStrapiMediaUrl, getGlobalSettings, AboutTimelineItem } from '@/lib/api';
import { AnimatedStats } from '@/components/HomePageClient';

export const metadata: Metadata = {
    title: 'About the National Fortification Alliance',
    description: 'Learn about NFA Nigeria — our mission, vision, history, and objectives for eliminating micronutrient malnutrition.',
};
export const revalidate = 60;

const TIMELINE_FALLBACK: AboutTimelineItem[] = [
    { id: 1, year: '2004', event: 'Nigeria enacts the Food, Drugs and Related Products (Fortification) Regulation, making fortification mandatory for key staple foods.' },
    { id: 2, year: '2011', event: 'WFP Nigeria launches the National Fortification Alliance with NAFDAC to strengthen enforcement and processor capacity across 6 key food vehicles.' },
    { id: 3, year: '2016', event: 'Coverage of Vitamin A-fortified vegetable oil reaches 70% of households. NFA introduces the national quality mark seal for certified products.' },
    { id: 4, year: '2020', event: 'NFA expands to include Maize Flour and Wheat Flour in NAFDAC\'s mass fortification mandate. Premix fund established for small processors.' },
    { id: 5, year: '2024', event: 'Over 200 processors certified across 36 states, reaching 12M+ consumers. NFA achieves 68% household coverage of fortified staple foods.' },
];

const STATS_FALLBACK: { number: string; label: string; icon: IconName }[] = [
    { number: '37%', label: 'Child Stunting Rate', icon: 'shield' },
    { number: '30%', label: 'Vitamin A Deficiency in Children', icon: 'heart-handshake' },
    { number: '60-70%', label: 'Anaemia in Women of Reproductive Age', icon: 'activity' },
    { number: '95%', label: 'Calcium Inadequacy in Non-Pregnant Women', icon: 'trending-up' },
];

const STAT_CATEGORY_ICONS: Record<string, IconName> = {
    Programme: 'calendar',
    Compliance: 'shield-check',
    'Health Impact': 'heart-pulse',
    General: 'bar-chart',
};

const OBJECTIVES: { icon: IconName; text: string }[] = [
    { icon: 'users', text: 'Providing a platform for collaboration between government and industry.' },
    { icon: 'shield', text: 'Supporting the implementation of mandatory food fortification.' },
    { icon: 'check-circle', text: 'Strengthening compliance with national fortification standards.' },
    { icon: 'bar-chart', text: 'Supporting monitoring and evaluation systems in food fortification.' },
    { icon: 'handshake', text: 'Promoting coordination among fortification stakeholders.' },
    { icon: 'activity', text: 'Strengthening national laboratory capacity for fortification testing.' },
    { icon: 'file-text', text: 'Supporting evidence-based nutrition interventions.' },
    { icon: 'box', text: 'Expanding fortification to additional staple food vehicles.' },
    { icon: 'megaphone', text: 'Promoting public awareness of fortified foods.' },
    { icon: 'monitor', text: 'Promoting digital innovation and traceability in food fortification.' },
];

export default async function AboutPage() {
    const [about, statsData, globalSettings] = await Promise.all([
        getAboutPage(),
        getStats(),
        getGlobalSettings(),
    ]);

    const timeline = about?.timeline_items?.length ? about.timeline_items : TIMELINE_FALLBACK;
    const displayStats = statsData.length > 0
        ? statsData.map((s) => ({ number: s.value?.trim() || '—', label: s.label, icon: STAT_CATEGORY_ICONS[s.category] || 'bar-chart' }))
        : STATS_FALLBACK;
    const statsSource = globalSettings?.stats_source
        || 'Source: Nigeria Demographic and Health Survey (NDHS) 2024; National Food Consumption and Micronutrient Survey (NFCMS) 2021; UNICEF Nigeria, Situation Analysis of Children and Adolescents in Nigeria (2024).';

    return (
        <>
            <style>{`
        /* Image Hero - matches News & Events hero style */
        .about-hero {
          position: relative;
          min-height: 340px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .about-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .about-hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(135deg, rgba(0, 82, 73, 0.92) 0%, rgba(6, 78, 59, 0.88) 100%);
        }
        .about-hero-content {
          position: relative;
          z-index: 2;
          padding: 3.5rem 0 2.75rem;
        }
        .about-hero h1 {
          color: #fff;
          max-width: 720px;
          margin-bottom: 1rem;
        }
        .about-hero p {
          color: rgba(255,255,255,0.95);
          max-width: 720px;
          font-size: 1.15rem;
          line-height: 1.7;
        }
        .about-hero .breadcrumb {
          justify-content: flex-start;
          margin-bottom: 2rem;
        }
        .about-hero .breadcrumb a,
        .about-hero .breadcrumb span {
          color: rgba(255,255,255,0.8);
        }
        .about-hero .breadcrumb a:hover {
          color: #fff;
        }

        /* Mission/Vision */
        .mv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 3rem; }
        .mv-card { border-radius: var(--radius-md); padding: 2.25rem; border: 1px solid var(--border); }
        .mv-card-mission { background: #f0f7ff; border-color: #bfdbfe; }
        .mv-card-vision  { background: #f0fdf4; border-color: #bbf7d0; }
        .mv-card-eyebrow { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
        .mv-card-mission .mv-card-eyebrow { color: var(--wfp-blue); }
        .mv-card-vision  .mv-card-eyebrow { color: var(--wfp-green); }
        .mv-card h3 { margin-bottom: 0.75rem; }
        .mv-card p  { color: var(--text-secondary); line-height: 1.75; }

        /* Timeline */
        .timeline { display: flex; flex-direction: column; gap: 0; margin-top: 3rem; }
        .timeline-item { display: grid; grid-template-columns: 80px 1fr; gap: 1.5rem; padding: 1.75rem 0; border-bottom: 1px solid var(--border); align-items: start; }
        .timeline-item:last-child { border-bottom: none; }
        .timeline-year { font-size: 1rem; font-weight: 800; color: var(--wfp-blue); padding-top: 0.15rem; }
        .timeline-event { font-size: 0.925rem; color: var(--text-secondary); line-height: 1.7; }

        /* Objectives */
        .objectives-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-top: 2.5rem; }
        .objective-item { display: flex; align-items: flex-start; gap: 1rem; padding: 1.5rem; background: #fff; border: 1px solid var(--border-light); border-radius: var(--radius-md); transition: box-shadow .2s, transform .2s; }
        .objective-item:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .objective-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 0.1rem; }
        .objective-text { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.65; }

        /* Governance */
        .governance-cta { text-align: center; max-width: 640px; margin: 2.5rem auto 0; }
        .governance-cta p { color: var(--text-secondary); margin-bottom: 1.5rem; }

        @media (max-width: 900px) {
          .mv-grid { grid-template-columns: 1fr; }
          .objectives-grid { grid-template-columns: 1fr; }
        }
      `}</style>

            {/* ── Full-width hero ── */}
            <div className="about-hero">
                <div className="about-hero-bg">
                    <Image src="/about-hero.jpg" alt="NFA meeting" fill style={{ objectFit: 'cover' }} priority />
                </div>
                <div className="about-hero-overlay" />
                <div className="container about-hero-content">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span>About</span>
                    </div>
                    <h1>About the National Fortification Alliance</h1>
                    <p>{about?.hero_tagline || 'A coordinated national effort to eliminate micronutrient malnutrition through food fortification — for every Nigerian, in every community.'}</p>
                </div>
            </div>

            {/* ── Mission & Vision ── */}
            <section className="section">
                <div className="container">
                    <p className="section-eyebrow">Who We Are</p>
                    <h2 className="section-title">The National Fortification Alliance (NFA)</h2>
                    <p className="section-lead">
                        The National Fortification Alliance is a multi-sectoral coordination platform established to strengthen the implementation of food fortification programmes in Nigeria through collaboration among government agencies, regulatory institutions, private sector stakeholders, development partners, academia, professional associations, civil society organizations, and the media.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '1.5rem', fontSize: '1.05rem' }}>
                        The Alliance provides a platform for policy dialogue, technical coordination, compliance monitoring, stakeholder engagement, advocacy, laboratory strengthening, public awareness creation, and nutrition programme implementation.
                    </p>
                    <div className="mv-grid">
                        <div className="mv-card mv-card-mission">
                            <div className="mv-card-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Icon name="globe" size={16} /> OUR MISSION
                            </div>
                            <h3>Eliminate Hidden Hunger</h3>
                            <p>{about?.mission || 'To coordinate and champion the fortification of staple foods with essential vitamins and minerals in Nigeria, ensuring every citizen has access to nutritious food — regardless of their income or location.'}</p>
                        </div>
                        <div className="mv-card mv-card-vision">
                            <div className="mv-card-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Icon name="sun" size={16} /> OUR VISION
                            </div>
                            <h3>A Nourished Nigeria</h3>
                            <p>{about?.vision || 'A Nigeria where micronutrient malnutrition is eliminated through sustainable, large-scale food fortification — where nutritious food is not a privilege but a standard.'}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Nutrition Burden Statistics (shared with homepage) ── */}
            <section style={{ background: 'linear-gradient(135deg, var(--wfp-green) 0%, #064E3B 100%)', padding: '3rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--wfp-gold)', marginBottom: '0.75rem' }}>The Challenge</p>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>Nigeria&apos;s Hidden Hunger Crisis</h2>
                        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>Critical health statistics that demonstrate the urgent need for food fortification</p>
                    </div>
                    <AnimatedStats stats={displayStats} />
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', textAlign: 'center', maxWidth: '800px', margin: '2rem auto 0', lineHeight: 1.6 }}>{statsSource}</p>
                </div>
            </section>

            {/* ── Background / History ── */}
            <section className="section" style={{ background: 'var(--bg-off)', paddingBottom: '2rem' }}>
                <div className="container">
                    <p className="section-eyebrow">Our History</p>
                    <h2 className="section-title">Two Decades of Progress</h2>
                    {about?.history_intro && (
                        <p className="section-lead">{about.history_intro}</p>
                    )}
                    <div className="timeline">
                        {timeline.map((t) => (
                            <div key={t.id} className="timeline-item">
                                <div className="timeline-year">{t.year}</div>
                                <div className="timeline-event">{t.event}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Key Objectives ── */}
            <section className="section">
                <div className="container">
                    <p className="section-eyebrow">Strategic Priorities</p>
                    <h2 className="section-title">What We Are Working Towards</h2>
                    <div className="objectives-grid">
                        {OBJECTIVES.map((o, i) => (
                            <div key={i} className="objective-item">
                                <span className="objective-icon" style={{ color: 'var(--wfp-blue)' }}><Icon name={o.icon} size={24} /></span>
                                <span className="objective-text">{o.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Governance ── */}
            <section className="section" style={{ background: 'var(--bg-off)', paddingTop: '3rem', paddingBottom: '4rem' }}>
                <div className="container">
                    <p className="section-eyebrow">Governance</p>
                    <h2 className="section-title">Who Runs the NFA</h2>
                    <div className="governance-cta">
                        <p>The NFA is led by a multi-sectoral alliance of government regulators, industry representatives, and development partners, supported by a dedicated secretariat.</p>
                        <Link href="/about/governance" className="btn btn-outline-primary">View Governance Structure</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
