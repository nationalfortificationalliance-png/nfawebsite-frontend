import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/Icon';

export const metadata: Metadata = {
    title: 'Initiatives & Priority Areas | National Fortification Alliance',
    description: 'Explore the current projects and strategic priority areas of the National Fortification Alliance Nigeria.',
};

const PRIORITY_AREAS = [
    'Strengthening Vitamin A fortification compliance',
    'Expanding rice fortification programmes',
    'Assessing feasibility of bouillon fortification',
    'Improving laboratory capacity for micronutrient analysis',
    'Strengthening digital compliance systems through DFQT+',
    'Supporting local premix production',
    'Strengthening household-level monitoring',
    'Supporting regulatory harmonization',
    'Enhancing public awareness and behavioural change communication',
    'Improving shelf-life studies and packaging systems',
    'Addressing fortification challenges at MSME and retail levels'
];

export default function InitiativesPage() {
    return (
        <main className="initiatives-page">
            <style>{`
                .initiatives-hero {
                    position: relative;
                    background: var(--wfp-navy);
                    color: #fff;
                    padding: 6rem 0 4rem;
                    text-align: center;
                }
                .hero-title {
                    font-size: 2.8rem;
                    font-weight: 900;
                    margin-bottom: 1rem;
                }
                .hero-subtitle {
                    font-size: 1.15rem;
                    color: rgba(255,255,255,0.7);
                    max-width: 700px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 2rem;
                    margin-top: 3rem;
                }

                .project-card {
                    background: #fff;
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-lg);
                    padding: 2.5rem;
                    box-shadow: var(--shadow-sm);
                    transition: transform 0.3s;
                }
                .project-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-md);
                }

                .project-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 60px;
                    height: 60px;
                    background: var(--wfp-blue-light);
                    color: var(--wfp-blue);
                    border-radius: var(--radius-md);
                    margin-bottom: 1.5rem;
                }

                .project-card h3 {
                    font-size: 1.4rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    color: var(--text-primary);
                }

                .project-card p {
                    color: var(--text-secondary);
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                }

                .project-card ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .project-card li {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    margin-bottom: 0.75rem;
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }

                .project-card li::before {
                    content: "→";
                    color: var(--wfp-blue);
                    font-weight: bold;
                }

                .priorities-list {
                    column-count: 2;
                    column-gap: 3rem;
                    margin-top: 2rem;
                }
                
                @media (max-width: 768px) {
                    .priorities-list {
                        column-count: 1;
                    }
                }

                .priority-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #fff;
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-md);
                    margin-bottom: 1rem;
                    break-inside: avoid;
                }
            `}</style>

            <div className="initiatives-hero">
                <div className="container">
                    <div className="breadcrumb" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
                        <Link href="/" style={{ color: 'rgba(255,255,255,0.6)' }}>Home</Link>
                        <span className="breadcrumb-sep" style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
                        <span style={{ color: '#fff' }}>Initiatives</span>
                    </div>
                    <h1 className="hero-title">NFA Projects & Initiatives</h1>
                    <p className="hero-subtitle">
                        Driving national impact through targeted programs, technological innovation, and strategic priority areas designed to eliminate hidden hunger.
                    </p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <p className="section-eyebrow">Key Programs</p>
                    <h2 className="section-title">Major Initiatives</h2>
                    
                    <div className="projects-grid">
                        {/* Rice Fortification Programme */}
                        <div className="project-card">
                            <div className="project-icon">
                                <Icon name="trending-up" size={28} />
                            </div>
                            <h3>Rice Fortification Programme</h3>
                            <p>
                                Supporting the scale-up of fortified rice production and accessibility through collaboration with rice millers, regulators, development partners, and policymakers.
                            </p>
                            <ul>
                                <li>Improve access to fortified rice</li>
                                <li>Strengthen regulatory systems</li>
                                <li>Support awareness creation</li>
                                <li>Facilitate approval of Fortified Rice Kernel standards</li>
                                <li>Support market introduction of fortified rice products</li>
                            </ul>
                        </div>

                        {/* Bouillon Fortification Initiative */}
                        <div className="project-card">
                            <div className="project-icon">
                                <Icon name="search" size={28} />
                            </div>
                            <h3>Bouillon Fortification Initiative</h3>
                            <p>
                                Assessing bouillon cubes as a potential vehicle for food fortification in Nigeria, balancing nutrition benefits with public health considerations like sodium reduction.
                            </p>
                            <ul>
                                <li>Conducting formative studies</li>
                                <li>Sodium and iodine assessments</li>
                                <li>Nutrient profiling</li>
                                <li>Consumer behavior analysis</li>
                                <li>Development of standards and codes of practice</li>
                            </ul>
                        </div>

                        {/* DFQT+ Programme */}
                        <div className="project-card">
                            <div className="project-icon">
                                <Icon name="activity" size={28} />
                            </div>
                            <h3>DFQT+ Programme</h3>
                            <p>
                                The Digital Fortification Quality & Traceability Plus (DFQT+) programme supports real-time digital monitoring and traceability of fortification activities.
                            </p>
                            <ul>
                                <li>Digital compliance systems</li>
                                <li>Streamlined industry reporting</li>
                                <li>Product and premix traceability</li>
                                <li>Enhanced regulatory monitoring</li>
                                <li>Overall governance strengthening</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" style={{ background: 'var(--bg-off)' }}>
                <div className="container">
                    <p className="section-eyebrow" style={{ color: 'var(--wfp-gold)' }}>Strategic Focus</p>
                    <h2 className="section-title">Current Priority Areas</h2>
                    <p className="section-lead">The National Fortification Alliance is currently focusing resources and coordination efforts on the following critical objectives:</p>
                    
                    <div className="priorities-list">
                        {PRIORITY_AREAS.map((priority, idx) => (
                            <div key={idx} className="priority-item">
                                <Icon name="check-circle" size={20} style={{ color: 'var(--wfp-green)', flexShrink: 0 }} />
                                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{priority}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
