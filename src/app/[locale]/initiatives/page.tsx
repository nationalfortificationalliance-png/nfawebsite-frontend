import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Icon, { IconName } from '@/components/Icon';
import { getInitiatives } from '@/lib/api';

export const metadata: Metadata = {
    title: 'Initiatives & Priority Areas | National Fortification Alliance',
    description: 'Explore the current projects and strategic priority areas of the National Fortification Alliance Nigeria.',
};

export const revalidate = 60;

const INITIATIVES_FALLBACK: {
    title: string;
    icon: IconName;
    description: string;
    bullets: string[];
}[] = [
    {
        title: 'Rice Fortification',
        icon: 'trending-up',
        description: 'Partnering with millers, regulators and distributors to make fortified rice more available, affordable and trusted across Nigeria.',
        bullets: [
            'Scale fortified rice production and distribution',
            'Strengthen regulatory compliance and lab checks',
            'Support premix market development',
            'Build industry and laboratory capacity',
            'Raise consumer awareness and demand',
        ],
    },
    {
        title: 'Bouillon Fortification',
        icon: 'search',
        description: 'Evaluating bouillon cubes as a strategic fortification vehicle while balancing nutrition benefit and sodium reduction priorities.',
        bullets: [
            'Conduct nutrient profiling and taste studies',
            'Assess iodine and sodium impacts',
            'Analyze consumer behavior',
            'Develop draft standards and codes of practice',
            'Coordinate industry engagement',
        ],
    },
    {
        title: 'DFQT+ Digital Monitoring',
        icon: 'activity',
        description: 'Deploying digital traceability and quality monitoring systems that help regulators and producers track fortified products in near real time.',
        bullets: [
            'Support digital compliance workflows',
            'Chart premix and product traceability',
            'Improve audit efficiency',
            'Drive informed enforcement',
            'Strengthen governance and transparency',
        ],
    },
];

const PRIORITY_AREAS = [
    'Strengthening Vitamin A fortification compliance',
    'Expanding rice fortification programmes',
    'Assessing feasibility of bouillon fortification',
    'Improving laboratory capacity for micronutrient analysis',
    'Strengthening digital compliance systems through DFQT+',
    'Supporting local premix production',
    'Strengthening household-level monitoring',
    'Supporting regulatory harmonization',
    'Enhancing public awareness and behaviour change communication',
    'Improving shelf-life studies and packaging systems',
    'Addressing fortification challenges at MSME and retail levels',
];

const HOW_IT_WORKS = [
    {
        title: 'Mobilise stakeholders',
        description: 'Create shared direction by convening government, industry, regulators and civil society around fortified food policy and practice.',
    },
    {
        title: 'Accelerate implementation',
        description: 'Enable practical adoption of fortification standards, premix markets, production support and quality assurance systems.',
    },
    {
        title: 'Measure progress',
        description: 'Use digital tools, audits and lab data to track progress, spot gaps and continuously improve delivery across the food value chain.',
    },
];

export default async function InitiativesPage() {
    const initiatives = await getInitiatives();
    const displayInitiatives = initiatives.length > 0
        ? initiatives.map((initiative) => ({
            title: initiative.title,
            icon: (initiative.icon || 'trending-up') as IconName,
            description: initiative.description,
            bullets: (initiative.highlights || []).map((h) => h.text),
        }))
        : INITIATIVES_FALLBACK;

    return (
        <main className="initiatives-page">
            <style>{`
                /* Hero with Image - consistent with other pages */
                .initiatives-hero {
                    position: relative;
                    min-height: 340px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }
                .initiatives-hero-bg {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                }
                .initiatives-hero-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(0, 82, 73, 0.92) 0%, rgba(6, 78, 59, 0.88) 100%);
                    z-index: 1;
                }
                .initiatives-hero-content {
                    position: relative;
                    z-index: 2;
                    padding: 3.5rem 0 2.75rem;
                }
                .initiatives-hero h1 {
                    color: #fff;
                    max-width: 720px;
                    margin-bottom: 1rem;
                }
                .initiatives-hero p {
                    color: rgba(255,255,255,0.95);
                    max-width: 720px;
                    font-size: 1.15rem;
                    line-height: 1.7;
                }
                .initiatives-hero .breadcrumb {
                    margin-bottom: 2rem;
                }
                .initiatives-hero .breadcrumb a,
                .initiatives-hero .breadcrumb span {
                    color: rgba(255,255,255,0.8);
                }
                .initiatives-hero .breadcrumb a:hover {
                    color: #fff;
                }

                .focus-grid,
                .projects-grid,
                .work-grid,
                .priority-grid {
                    display: grid;
                    gap: 1.5rem;
                }

                .focus-grid,
                .work-grid {
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                }

                .projects-grid {
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                }

                .priority-grid {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }

                .project-card,
                .focus-card,
                .work-card,
                .priority-pill {
                    border-radius: 24px;
                }

                .project-card,
                .focus-card,
                .work-card,
                .priority-pill {
                    background: #fff;
                    border: 1px solid rgba(15, 23, 42, 0.08);
                }

                .project-card,
                .focus-card,
                .work-card {
                    padding: 2rem;
                    box-shadow: 0 18px 36px rgba(15, 23, 42, 0.06);
                    transition: transform 0.28s ease, box-shadow 0.28s ease;
                }
                .project-card:hover,
                .focus-card:hover,
                .work-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 22px 48px rgba(15, 23, 42, 0.12);
                }

                .project-icon,
                .focus-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 18px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 135, 81, 0.1);
                    color: var(--wfp-blue);
                    margin-bottom: 1.3rem;
                }

                .project-card h3,
                .focus-card h3,
                .work-card h3 {
                    margin-bottom: 1rem;
                    font-size: 1.35rem;
                    color: var(--text-primary);
                    line-height: 1.2;
                }

                .project-card p,
                .focus-card p,
                .work-card p {
                    color: var(--text-secondary);
                    line-height: 1.75;
                    margin: 0;
                }

                .project-card ul {
                    list-style: none;
                    margin: 1.4rem 0 0;
                    padding: 0;
                }
                .project-card li {
                    display: flex;
                    gap: 0.75rem;
                    margin-bottom: 0.9rem;
                    color: var(--text-secondary);
                    line-height: 1.6;
                }
                .project-card li::before {
                    content: '→';
                    color: var(--wfp-blue);
                    font-weight: 800;
                    line-height: 1;
                    margin-top: 0.2rem;
                }

                .priority-pill {
                    padding: 1.1rem 1rem;
                    align-items: flex-start;
                    box-shadow: 0 14px 28px rgba(15, 23, 42, 0.05);
                }
                .priority-pill span {
                    color: var(--wfp-blue);
                    margin-top: 0.2rem;
                }
                .priority-pill strong {
                    display: block;
                    color: var(--text-primary);
                    font-weight: 700;
                    line-height: 1.5;
                }

                .cta-panel {
                    padding: 2.8rem 2.4rem;
                    background: linear-gradient(135deg, rgba(0, 135, 81, 0.08), rgba(245, 158, 11, 0.08));
                    border: 1px solid rgba(245, 158, 11, 0.14);
                    box-shadow: 0 18px 38px rgba(15, 23, 42, 0.06);
                    display: grid;
                    gap: 1.4rem;
                }
                .cta-panel h2 {
                    margin: 0;
                    font-size: clamp(2rem, 3vw, 2.4rem);
                    line-height: 1.05;
                    color: var(--text-primary);
                }
                .cta-panel p {
                    margin: 0;
                    color: var(--text-secondary);
                    line-height: 1.8;
                    max-width: 760px;
                }
                .cta-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                @media (max-width: 760px) {
                    .priority-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="initiatives-hero">
                <div className="initiatives-hero-bg">
                    <Image
                        src="/factory.jpg"
                        alt="Food fortification facility"
                        fill
                        sizes="100vw"
                        style={{ objectFit: "cover" }}
                        priority
                    />
                </div>
                <div className="container initiatives-hero-content">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span>Initiatives</span>
                    </div>
                    <h1>NFA Projects & Initiatives</h1>
                    <p>
                        Driving national impact through targeted programs, technological innovation, and strategic priority areas designed to eliminate hidden hunger.
                    </p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <p className="section-eyebrow">Strategic approach</p>
                    <h2 className="section-title">How NFA turns policy into sustained impact</h2>
                    <div className="focus-grid" style={{ marginTop: '2rem' }}>
                        <div className="focus-card">
                            <div className="focus-icon"><Icon name="microscope" size={24} /></div>
                            <h3>Evidence-led programming</h3>
                            <p>We use research, audits and field assessment to design fortification programmes that are technically sound and aligned with national nutrition priorities.</p>
                        </div>
                        <div className="focus-card">
                            <div className="focus-icon"><Icon name="handshake" size={24} /></div>
                            <h3>Strong partnerships</h3>
                            <p>Government, industry, regulators and development partners work together to scale fortification, strengthen markets, and protect consumer health.</p>
                        </div>
                        <div className="focus-card">
                            <div className="focus-icon"><Icon name="scale" size={24} /></div>
                            <h3>Digital compliance & quality</h3>
                            <p>Modern tools like DFQT+ and laboratory strengthening make monitoring more transparent, reliable and actionable at national scale.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section bg-off">
                <div className="container">
                    <p className="section-eyebrow">Key programs</p>
                    <h2 className="section-title">Major initiatives</h2>
                    <p className="section-lead">These initiatives illustrate how NFA is delivering measurable improvements across production, regulation, quality assurance and consumer protection.</p>
                    <div className="projects-grid" style={{ marginTop: '2rem' }}>
                        {displayInitiatives.map((initiative) => (
                            <div key={initiative.title} className="project-card">
                                <div className="project-icon"><Icon name={initiative.icon} size={28} /></div>
                                <h3>{initiative.title}</h3>
                                <p>{initiative.description}</p>
                                <ul>
                                    {initiative.bullets.map((bullet) => (
                                        <li key={bullet}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <p className="section-eyebrow" style={{ color: 'var(--wfp-gold)' }}>Priority areas</p>
                    <h2 className="section-title">Current focus areas</h2>
                    <div className="priority-grid" style={{ marginTop: '2rem' }}>
                        {PRIORITY_AREAS.map((priority) => (
                            <div key={priority} className="priority-pill">
                                <span><Icon name="check-circle" size={20} /></span>
                                <strong>{priority}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section bg-off">
                <div className="container">
                    <p className="section-eyebrow">Getting results</p>
                    <h2 className="section-title">How NFA builds momentum</h2>
                    <div className="work-grid" style={{ marginTop: '2rem' }}>
                        {HOW_IT_WORKS.map((item) => (
                            <div key={item.title} className="work-card">
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section initiatives-cta">
                <div className="container">
                    <div className="cta-panel">
                        <h2>Ready to collaborate on fortified food access?</h2>
                        <p>Whether you are a processor, regulator, funder or technical partner, NFA offers pathways for joint action that strengthen nutrition outcomes and supply chain integrity.</p>
                        <div className="cta-actions">
                            <Link href="/contact" className="btn btn-primary btn-lg">Contact NFA</Link>
                            <a href="https://nafdac.gov.ng/regulatory-resources/guidelines/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">Explore Guidelines</a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
