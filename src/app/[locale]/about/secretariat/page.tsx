import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTeamMembers, getStrapiMediaUrl, type TeamMember } from '@/lib/api';

export const metadata: Metadata = {
    title: 'NFA Secretariat | National Fortification Alliance Nigeria',
    description: 'Meet the dedicated team at the NFA Secretariat coordinating the National Fortification Project across Nigeria.',
};

export const revalidate = 60;

// Local fallback data with the generated images
const FALLBACK_SECRETARIAT = [
    
    {
        id: 'f1',
        name: 'Mr. Abubakar Tanimu Umar',
        role: 'Programme Officer',
        organization: 'NFA Secretariat',
        image: '/team-1.png',
        bio: 'Mr. Umar coordinates field activities and stakeholder engagement for the National Fortification Project.'
    },
    {
        id: 'f2',
        name: 'Mrs. Joy Haanya',
        role: 'Programme Officer',
        organization: 'NFA Secretariat',
        image: '/team-2.png',
        bio: 'Mrs. Haanya supports programme implementation and administrative coordination within the NFA Secretariat.'
    }
];

export default async function SecretariatPage() {
    // Fetch members specifically from the Secretariat category
    const secretariatMembers = await getTeamMembers('Secretariat');

    // Always use fallback data until Strapi is properly configured
    const displayMembers = FALLBACK_SECRETARIAT;
    const useFallback = true;

    return (
        <main className="secretariat-page">
            <style>{`
                .secretariat-hero {
                    position: relative;
                    background: var(--wfp-navy);
                    color: #fff;
                    padding: 6rem 0 4rem;
                    text-align: center;
                    overflow: hidden;
                }
                .secretariat-hero::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -10%;
                    width: 120%;
                    height: 200%;
                    background: radial-gradient(circle at 20% 30%, rgba(0, 123, 181, 0.15) 0%, transparent 50%);
                    pointer-events: none;
                }
                .hero-tag {
                    display: inline-block;
                    background: var(--wfp-blue);
                    color: #fff;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    padding: 0.4rem 1rem;
                    border-radius: 100px;
                    margin-bottom: 1.5rem;
                }
                .hero-title {
                    font-size: 2.8rem;
                    font-weight: 900;
                    margin-bottom: 1rem;
                    letter-spacing: -0.02em;
                }
                .hero-subtitle {
                    font-size: 1.15rem;
                    color: rgba(255,255,255,0.7);
                    max-width: 700px;
                    margin: 0 auto;
                    line-height: 1.6;
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
                    margin-bottom: 1.25rem;
                }

                .member-bio {
                    font-size: 0.875rem;
                    line-height: 1.6;
                    color: var(--text-muted);
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
                <div className="container">
                    <div className="breadcrumb" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
                        <Link href="/" style={{ color: 'rgba(255,255,255,0.6)' }}>Home</Link>
                        <span className="breadcrumb-sep" style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
                        <Link href="/about" style={{ color: 'rgba(255,255,255,0.6)' }}>About</Link>
                        <span className="breadcrumb-sep" style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
                        <span style={{ color: '#fff' }}>Secretariat</span>
                    </div>
                    <span className="hero-tag">The Driving Force</span>
                    <h1 className="hero-title">NFA Secretariat</h1>
                    <p className="hero-subtitle">
                        A dedicated multidisciplinary team coordinating the National Fortification Project, 
                        bridging the gap between policy, industry, and impact across all 36 states of Nigeria.
                    </p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    {useFallback && (
                        <div className="admin-note">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span><strong>Note to Administrator:</strong> To manage this team, update the &quot;Team Member&quot; collection in Strapi and set the category to &quot;Secretariat&quot;. Showing demonstration data below.</span>
                        </div>
                    )}

                    <div className="members-grid">
                        {(useFallback ? FALLBACK_SECRETARIAT : displayMembers).map((m) => {
                            const imageUrl = useFallback
                                ? (m as typeof FALLBACK_SECRETARIAT[0]).image
                                : getStrapiMediaUrl((m as TeamMember).image?.url);
                            return (
                            <div key={m.id} className="member-card">
                                <div className="member-image-wrap">
                                    <Image
                                        src={imageUrl}
                                        alt={m.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        unoptimized={useFallback}
                                    />
                                </div>
                                <div className="member-info">
                                    <div className="member-org">{m.organization || 'National Fortification Alliance'}</div>
                                    <h3 className="member-name">{m.name}</h3>
                                    <div className="member-role">{m.role}</div>
                                    {m.bio && <p className="member-bio">{m.bio}</p>}
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Support section */}
            <div style={{ background: 'var(--bg-off)', padding: '5rem 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Our Mission</h2>
                    <p style={{ maxWidth: '800px', margin: '0 auto 2.5rem', color: 'var(--text-secondary)' }}>
                        The Secretariat provides technical, administrative, and strategic support to the National Fortification Alliance, 
                        ensuring that every decision translates into measurable improved nutrition for the Nigerian people.
                    </p>
                    <Link href="/contact" className="btn btn-primary">Work With Us</Link>
                </div>
            </div>
        </main>
    );
}
