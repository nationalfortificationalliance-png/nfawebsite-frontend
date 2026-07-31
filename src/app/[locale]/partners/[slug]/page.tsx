import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Icon, { IconName } from '@/components/Icon';
import { getPartnerBySlug, getAllPartnerSlugs, getStrapiMediaUrl } from '@/lib/api';
import { generateSEOMetadata } from '@/components/SEO';
import { locales } from '@/i18n';
import { CATEGORY_META } from '@/components/PartnersDirectory';

// Mirrors PartnersDirectory.WEBSITE_LINKS_ENABLED — the NFA secretariat asked for
// partner website links to be hidden site-wide (July 2026). Flip both together.
const WEBSITE_LINKS_ENABLED = false;

interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const partner = await getPartnerBySlug(slug);
    if (!partner) return { title: 'Partner Not Found' };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nfawebsite-frontend.vercel.app';
    const canonicalUrl = locale === 'en'
        ? `${siteUrl}/partners/${slug}`
        : `${siteUrl}/${locale}/partners/${slug}`;

    return generateSEOMetadata({
        title: `${partner.name} | National Fortification Alliance`,
        description: partner.description || partner.role_in_alliance || `${partner.name} — a partner of the National Fortification Alliance.`,
        keywords: [partner.name, 'food fortification partner', 'nutrition Nigeria'],
        canonical: canonicalUrl,
        ogImage: getStrapiMediaUrl(partner.logo?.url),
        locale,
        alternateLocales: locales.map((loc) => ({
            locale: loc,
            url: loc === 'en'
                ? `${siteUrl}/partners/${slug}`
                : `${siteUrl}/${loc}/partners/${slug}`,
        })),
    });
}

export async function generateStaticParams() {
    const slugs = await getAllPartnerSlugs();
    return slugs.map((slug) => ({ slug }));
}

export const revalidate = 60;

export default async function PartnerProfilePage({ params }: Props) {
    const { slug } = await params;
    const partner = await getPartnerBySlug(slug);
    if (!partner) notFound();

    const meta = CATEGORY_META[partner.partner_type];
    const logoUrl = partner.logo?.url?.trim();
    const resolvedLogo = logoUrl
        ? (logoUrl.startsWith('http') ? logoUrl : getStrapiMediaUrl(logoUrl))
        : null;
    const members = partner.member_organizations || [];
    const canVisitWebsite = WEBSITE_LINKS_ENABLED && !!partner.website_url;

    return (
        <>
            <style>{`
                .partner-profile-hero {
                    background: linear-gradient(135deg, var(--wfp-blue, #0070bc) 0%, var(--wfp-navy, #064e3b) 100%);
                    padding: 3rem 0 4rem;
                    color: white;
                }
                .partner-profile-hero h1 { color: white; max-width: 780px; margin-top: 1rem; }
                .partner-profile-badge {
                    display: inline-flex; align-items: center; gap: 0.35rem;
                    padding: 0.3rem 0.9rem; border-radius: 100px;
                    font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
                }
                .partner-profile-card {
                    position: relative;
                    background: #fff; border-radius: 16px; box-shadow: var(--shadow-xl);
                    margin-top: -3rem; padding: 2.5rem;
                    display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap;
                }
                .partner-profile-logo {
                    width: 96px; height: 96px; border-radius: 12px; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    position: relative; overflow: hidden; background: var(--bg-off);
                }
                .partner-profile-body { flex: 1; min-width: 240px; }
                .partner-profile-role { font-size: 1rem; font-weight: 700; color: var(--wfp-blue); margin-bottom: 0.75rem; }
                .partner-profile-desc { color: var(--text-secondary); line-height: 1.75; font-size: 1rem; }
                .partner-profile-contact-row {
                    display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 1.5rem;
                    padding-top: 1.5rem; border-top: 1px solid var(--border-light);
                }
                .partner-profile-contact-item {
                    display: inline-flex; align-items: center; gap: 0.5rem;
                    font-size: 0.9rem; color: var(--text-secondary);
                }
                .partner-profile-contact-item a { color: var(--wfp-blue); font-weight: 600; }
                .partner-profile-section { max-width: 780px; margin: 0 auto; padding: 3rem 0 4rem; }
                .partner-profile-section h2 {
                    font-size: 1.3rem; font-weight: 800; color: var(--color-navy); margin-bottom: 1rem;
                }
                .partner-focus-tags { display: flex; flex-wrap: wrap; gap: 0.6rem; }
                .partner-focus-tag {
                    padding: 0.4rem 0.9rem; border-radius: 100px; font-size: 0.85rem; font-weight: 600;
                    background: var(--bg-off); color: var(--text-primary); border: 1px solid var(--border-light);
                }
                .partner-member-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
                .partner-member-item {
                    display: flex; align-items: center; gap: 0.6rem;
                    padding: 0.85rem 1rem; background: var(--bg-off); border-radius: var(--radius-md);
                    font-size: 0.9rem; font-weight: 600; color: var(--text-primary);
                }
                .partner-profile-back {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    color: var(--wfp-blue, #0070bc); font-weight: 600; transition: gap 0.2s;
                }
                .partner-profile-back:hover { gap: 0.65rem; }
                @media (max-width: 640px) {
                    .partner-profile-card { padding: 1.5rem; margin-top: -2rem; }
                    .partner-member-list { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="partner-profile-hero">
                <div className="container">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <Link href="/partners">Partners</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span style={{ color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{partner.name}</span>
                    </div>
                    {meta && (
                        <span className="partner-profile-badge" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
                    )}
                    <h1>{partner.name}</h1>
                </div>
            </div>

            <div className="container">
                <div className="partner-profile-card">
                    <div className="partner-profile-logo">
                        {resolvedLogo ? (
                            <Image src={resolvedLogo} alt={partner.name} fill sizes="96px" style={{ objectFit: 'contain' }} />
                        ) : (
                            <Icon name="building-2" size={40} />
                        )}
                    </div>
                    <div className="partner-profile-body">
                        {partner.role_in_alliance && <p className="partner-profile-role">{partner.role_in_alliance}</p>}
                        {partner.description && <p className="partner-profile-desc">{partner.description}</p>}
                        {(partner.contact_email || partner.contact_phone || canVisitWebsite) && (
                            <div className="partner-profile-contact-row">
                                {partner.contact_email && (
                                    <span className="partner-profile-contact-item">
                                        <Icon name={'mail' as IconName} size={16} />
                                        <a href={`mailto:${partner.contact_email}`}>{partner.contact_email}</a>
                                    </span>
                                )}
                                {partner.contact_phone && (
                                    <span className="partner-profile-contact-item">
                                        <Icon name={'phone' as IconName} size={16} />
                                        <a href={`tel:${partner.contact_phone}`}>{partner.contact_phone}</a>
                                    </span>
                                )}
                                {canVisitWebsite && (
                                    <span className="partner-profile-contact-item">
                                        <Icon name="external-link" size={16} />
                                        <a href={partner.website_url} target="_blank" rel="noopener noreferrer">Visit website</a>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="partner-profile-section">
                    <Link href="/partners" className="partner-profile-back">← Back to Partners</Link>

                    {partner.focus_areas && (
                        <div style={{ marginTop: '2rem' }}>
                            <h2>Focus Areas</h2>
                            <div className="partner-focus-tags">
                                {partner.focus_areas.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                                    <span key={tag} className="partner-focus-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {members.length > 0 && (
                        <div style={{ marginTop: '2.5rem' }}>
                            <h2>Member Organizations ({members.length})</h2>
                            <ul className="partner-member-list">
                                {members.map((m) => (
                                    <li key={m.id} className="partner-member-item">
                                        <Icon name="building-2" size={16} />
                                        {WEBSITE_LINKS_ENABLED && m.website_url ? (
                                            <a href={m.website_url} target="_blank" rel="noopener noreferrer">{m.name}</a>
                                        ) : (
                                            <span>{m.name}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
