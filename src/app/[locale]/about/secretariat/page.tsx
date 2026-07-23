import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { getTeamMembers, getStrapiMediaUrl, type TeamMember } from '@/lib/api';

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
        role: 'Assistant Chief Regulatory Officer FSAN',
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
        role: 'Assistant Chief Regulatory Officer FSAN',
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
                    min-height: 420px;
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
                    background: linear-gradient(135deg, rgba(0, 82, 73, 0.92) 0%, rgba(6, 78, 59, 0.88) 100%);
                    z-index: 1;
                }
                .secretariat-hero-content {
                    position: relative;
                    z-index: 2;
                    padding: 5rem 0 4rem;
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

                .member-bio {
                    font-size: 0.875rem;
                    line-height: 1.6;
                    color: var(--text-muted);
                    margin-top: 1rem;
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
                        src="/news_hero.jpg"
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
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="member-info">
                                    <div className="member-org">{m.organization || 'National Fortification Alliance'}</div>
                                    <h3 className="member-name">{m.name}</h3>
                                    <div className="member-role">{m.role}</div>
                                    {m.phone && (
                                        <div className="member-contact">
                                            <Icon name="phone" size={14} />
                                            <a href={`tel:${m.phone}`}>{m.phone}</a>
                                        </div>
                                    )}
                                    {m.email && (
                                        <div className="member-contact">
                                            <Icon name="mail" size={14} />
                                            <a href={`mailto:${m.email}`}>{m.email}</a>
                                        </div>
                                    )}
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
