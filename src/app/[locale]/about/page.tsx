import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Icon, { IconName } from '@/components/Icon';
import { getAboutPage, getStrapiMediaUrl, AboutChallengeStat, AboutKeyStat, AboutTimelineItem } from '@/lib/api';

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

const CHALLENGE_STATS_FALLBACK: AboutChallengeStat[] = [
    { id: 1, value: '37%', label: 'Child Stunting Rate', description: '37% of children under 5 are stunted — one of the highest rates in sub-Saharan Africa.' },
    { id: 2, value: '30%', label: 'Vitamin A Deficiency', description: 'Nearly 1 in 3 children are Vitamin A deficient, risking blindness, immune weakness, and developmental impact.' },
    { id: 3, value: '72%', label: 'Women with Anaemia', description: '72% of women of reproductive age are anaemic, primarily due to iron deficiency — with serious maternal and infant health consequences.' },
];

const KEY_STATS_FALLBACK: AboutKeyStat[] = [
    {
        id: 1, value: '2002', title: 'Programme Initiation', accent_color: 'none',
        description: 'The year Nigeria\'s mandatory food fortification programme was officially launched.',
        sub_stats: [{ id: 1, label: 'NFA Established', value: '2004' }],
    },
    {
        id: 2, value: '57%', title: 'National Compliance', accent_color: 'blue',
        description: 'Average compliance across all mandatory food vehicles in Nigeria.',
        sub_stats: [
            { id: 2, label: 'Salt (Iodized)', value: '67%' },
            { id: 3, label: 'Veg Oil (Vit A)', value: '58%' },
            { id: 4, label: 'Flour (Vit A)', value: '48%' },
        ],
    },
    {
        id: 3, value: '37%', title: 'Child Stunting', accent_color: 'gold',
        description: 'Prevalence of stunting among children under five years of age.',
        sub_stats: [
            { id: 5, label: 'Vitamin A Deficiency', value: '~30%' },
            { id: 6, label: 'Anaemia (Women)', value: '60–70%' },
        ],
    },
    {
        id: 4, value: '92%', title: 'Calcium Inadequacy', accent_color: 'green',
        description: 'High prevalence of calcium deficiency across children and pregnant women.',
        sub_stats: [
            { id: 7, label: 'Non-Pregnant Women', value: '95%' },
            { id: 8, label: 'Pregnant Women', value: '92%' },
            { id: 9, label: 'Children', value: '92%' },
        ],
    },
];

const ACCENT_COLOR_MAP: Record<string, string> = {
    blue: 'var(--wfp-blue)',
    gold: 'var(--wfp-gold)',
    green: 'var(--wfp-green)',
};

const OBJECTIVES: { icon: IconName; text: string }[] = [
    { icon: 'users', text: 'Providing a platform for collaboration between government and industry.' },
    { icon: 'shield', text: 'Supporting implementation of mandatory food fortification.' },
    { icon: 'check-circle', text: 'Strengthening compliance with national fortification standards.' },
    { icon: 'bar-chart', text: 'Supporting monitoring and evaluation systems.' },
    { icon: 'handshake', text: 'Promoting stakeholder coordination.' },
    { icon: 'activity', text: 'Improving laboratory capacity.' },
    { icon: 'file-text', text: 'Supporting evidence-based nutrition interventions.' },
    { icon: 'box', text: 'Expanding fortification to additional food vehicles.' },
    { icon: 'megaphone', text: 'Promoting public awareness on fortified foods.' },
    { icon: 'monitor', text: 'Supporting innovation and digital traceability systems.' },
];

export default async function AboutPage() {
    const about = await getAboutPage();

    const challengeStats = about?.challenge_stats?.length ? about.challenge_stats : CHALLENGE_STATS_FALLBACK;
    const keyStats = about?.key_stats?.length ? about.key_stats : KEY_STATS_FALLBACK;
    const timeline = about?.timeline_items?.length ? about.timeline_items : TIMELINE_FALLBACK;

    return (
        <>
            <style>{`
        /* Image Hero - matches News & Events hero style */
        .about-hero {
          position: relative;
          min-height: 420px;
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
          padding: 5rem 0 4rem;
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

        /* Challenge stats */
        .challenge-panel { background: var(--wfp-navy); color: rgba(255,255,255,.8); padding: 4rem 0; }
        .challenge-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .challenge-item { padding: 2rem; border-left: 1px solid rgba(255,255,255,.1); }
        .challenge-item:first-child { border-left: none; }
        .challenge-big { font-size: 3rem; font-weight: 900; color: var(--wfp-gold); letter-spacing: -0.04em; line-height: 1; margin-bottom: 0.5rem; }
        .challenge-label { font-size: 0.95rem; font-weight: 600; color: #fff; margin-bottom: 0.4rem; }
        .challenge-desc { font-size: 0.83rem; color: rgba(255,255,255,.55); line-height: 1.6; }

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
          .challenge-row { grid-template-columns: 1fr; }
          .objectives-grid { grid-template-columns: 1fr; }
        }

        /* Stats Section */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
        .stats-card { background: #fff; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.75rem; display: flex; flex-direction: column; }
        .stats-val { font-size: 2.25rem; font-weight: 800; color: var(--wfp-blue); margin-bottom: 0.25rem; }
        .stats-title { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
        .stats-meta { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; }
        .stats-divider { height: 1px; background: var(--border-light); margin: 1.25rem 0; }
        .stats-sub { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; margin-bottom: 0.5rem; }
        .stats-sub-label { color: var(--text-secondary); }
        .stats-sub-val { font-weight: 700; color: var(--wfp-blue); }
        .stats-source { font-size: 0.72rem; color: var(--text-muted); margin-top: 1rem; font-style: italic; }
        .challenge-source { font-size: 0.75rem; color: rgba(255,255,255,0.65); margin-top: 0.5rem; font-style: italic; }
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

            {/* ── The Challenge ── */}
            <div className="challenge-panel">
                <div className="container">
                    <p className="section-eyebrow" style={{ color: 'var(--wfp-gold)' }}>{about?.challenge_eyebrow || 'The Scale of the Problem'}</p>
                    <h2 style={{ color: '#fff' }}>{about?.challenge_heading || 'Nigeria’s Hidden Hunger Crisis'}</h2>
                    <div className="challenge-row" style={{ marginTop: '2.5rem' }}>
                        {challengeStats.map((stat) => (
                            <div className="challenge-item" key={stat.id}>
                                <div className="challenge-big">{stat.value}</div>
                                <div className="challenge-label">{stat.label}</div>
                                {stat.description && <div className="challenge-desc">{stat.description}</div>}
                                {stat.source && <div className="challenge-source">Source: {stat.source}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Key Statistics ── */}
            <section className="section">
                <div className="container">
                    <p className="section-eyebrow">NFA by the Numbers</p>
                    <h2 className="section-title">Key Statistics & Compliance</h2>
                    <p className="section-lead">Current data on national fortification coverage, compliance levels, and the underlying nutritional challenges being addressed across Nigeria.</p>

                    <div className="stats-grid">
                        {keyStats.map((stat) => (
                            <div
                                className="stats-card"
                                key={stat.id}
                                style={stat.accent_color && stat.accent_color !== 'none' ? { borderTop: `4px solid ${ACCENT_COLOR_MAP[stat.accent_color]}` } : undefined}
                            >
                                <div className="stats-val">{stat.value}</div>
                                <div className="stats-title">{stat.title}</div>
                                {stat.description && <div className="stats-meta">{stat.description}</div>}
                                {!!stat.sub_stats?.length && (
                                    <>
                                        <div className="stats-divider" />
                                        {stat.sub_stats.map((sub) => (
                                            <div className="stats-sub" key={sub.id}>
                                                <span className="stats-sub-label">{sub.label}</span>
                                                <span className="stats-sub-val">{sub.value}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                                {stat.source && <div className="stats-source">Source: {stat.source}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Background / History ── */}
            <section className="section" style={{ background: 'var(--bg-off)' }}>
                <div className="container">
                    <p className="section-eyebrow">Our History</p>
                    <h2 className="section-title">Two Decades of Progress</h2>
                    <p className="section-lead">
                        {about?.history_intro || 'Mandatory food fortification of selected staple food vehicles—including wheat flour, maize flour, sugar, and vegetable oil—commenced in Nigeria in 2002 as a core national strategy for combating micronutrient deficiencies. In 2004, the NFA was formally established under the chairmanship of the then National Planning Commission to mobilize stakeholders for coordinated implementation.'}
                    </p>
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
                        <Link href="/about/governance" className="btn btn-outline-primary">View Full Governance &amp; Compliance Structure</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
