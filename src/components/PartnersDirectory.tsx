'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Icon, { IconName } from '@/components/Icon';
import type { Partner } from '@/lib/api';

// The NFA secretariat asked for partner website links to be hidden site-wide
// (July 2026). Link markup below is fully built — flip this to true once the
// secretariat confirms the restriction can be lifted.
const WEBSITE_LINKS_ENABLED = false;

export interface DisplayMemberOrganization {
    id: number;
    name: string;
    websiteUrl?: string;
}

export interface DisplayPartner {
    id: number;
    slug?: string;
    name: string;
    type: string;
    desc: string;
    role: string;
    logo: string; // resolved image src, or an IconName fallback
    websiteUrl?: string;
    focusAreas?: string;
    contactEmail?: string;
    contactPhone?: string;
    memberOrganizations?: DisplayMemberOrganization[];
}

interface CategoryMeta {
    label: string;
    slug: string;
    color: string;
    bg: string;
    blurb: string;
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
    government: {
        label: 'Government MDAs',
        slug: 'government-mdas',
        color: '#15803d',
        bg: '#dcfce7',
        blurb: 'Ministries, departments, and regulatory agencies that set fortification policy, certify processors, and enforce national standards.',
    },
    'private-sector': {
        label: 'Industry Stakeholders',
        slug: 'industry-stakeholders',
        color: '#b45309',
        bg: '#fef3c7',
        blurb: 'Food processors and manufacturers across the fortified-food value chain who implement fortification in day-to-day production.',
    },
    'professional-body': {
        label: 'Professional Bodies & Associations',
        slug: 'professional-bodies',
        color: '#0891b2',
        bg: '#cffafe',
        blurb: 'Technical and professional associations advancing nutrition science, food safety practice, and workforce standards.',
    },
    'development-partner': {
        label: 'Development Partners',
        slug: 'development-partners',
        color: '#0070bc',
        bg: '#e8f4fb',
        blurb: 'UN agencies, foundations, and international organizations providing funding, technical assistance, and global expertise.',
    },
    'civil-society': {
        label: 'Academia, Media & Civil Society',
        slug: 'academia-media-civil-society',
        color: '#7e22ce',
        bg: '#f3e8ff',
        blurb: 'Universities, media, and civil society groups driving research, public awareness, and consumer advocacy.',
    },
};

export const CATEGORY_ORDER = Object.keys(CATEGORY_META);

interface PartnersDirectoryProps {
    partners: DisplayPartner[];
}

export default function PartnersDirectory({ partners }: PartnersDirectoryProps) {
    const [query, setQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [openTypes, setOpenTypes] = useState<Record<string, boolean>>({});
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const presentTypes = useMemo(() => {
        const found = Array.from(new Set(partners.map((p) => p.type)));
        const ordered = CATEGORY_ORDER.filter((t) => found.includes(t));
        const extra = found.filter((t) => !CATEGORY_ORDER.includes(t));
        return [...ordered, ...extra];
    }, [partners]);

    const counts = useMemo(() => {
        return partners.reduce<Record<string, number>>((acc, p) => {
            acc[p.type] = (acc[p.type] || 0) + 1;
            return acc;
        }, {});
    }, [partners]);

    const grouped = useMemo(() => {
        const acc: Record<string, DisplayPartner[]> = {};
        for (const p of partners) {
            if (!acc[p.type]) acc[p.type] = [];
            acc[p.type].push(p);
        }
        for (const type of Object.keys(acc)) {
            acc[type].sort((a, b) => a.name.localeCompare(b.name));
        }
        return acc;
    }, [partners]);

    const normalizedQuery = query.trim().toLowerCase();
    const isFiltering = normalizedQuery.length > 0 || typeFilter !== 'all';

    const filteredFlat = useMemo(() => {
        return partners
            .filter((p) => (typeFilter === 'all' ? true : p.type === typeFilter))
            .filter((p) =>
                !normalizedQuery ||
                p.name.toLowerCase().includes(normalizedQuery) ||
                p.desc.toLowerCase().includes(normalizedQuery) ||
                p.role.toLowerCase().includes(normalizedQuery)
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [partners, typeFilter, normalizedQuery]);

    const openCategory = (type: string) => {
        setOpenTypes((prev) => ({ ...prev, [type]: true }));
        requestAnimationFrame(() => {
            sectionRefs.current[type]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    };

    const toggleCategory = (type: string) => {
        setOpenTypes((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    const renderCard = (p: DisplayPartner) => {
        const meta = CATEGORY_META[p.type];
        const hasImageLogo = p.logo.startsWith('/') || p.logo.startsWith('http');
        const memberCount = p.memberOrganizations?.length || 0;
        const clickable = !!p.slug;

        const cardContent = (
            <>
                <div className="partner-logo">
                    {hasImageLogo ? (
                        <Image src={p.logo} alt={p.name} fill sizes="(max-width: 640px) 45vw, 200px" style={{ objectFit: 'contain' }} />
                    ) : (
                        <Icon name={p.logo as IconName} size={32} />
                    )}
                </div>
                <div className="partner-info">
                    {meta && isFiltering && (
                        <span className="partner-type-tag" style={{ color: meta.color, background: meta.bg }}>{meta.label}</span>
                    )}
                    <div className="partner-name">{p.name}</div>
                    {p.role && <div className="partner-role">{p.role}</div>}
                    {p.desc && <div className="partner-desc">{p.desc}</div>}
                    {memberCount > 0 && (
                        <span className="partner-visit">
                            {memberCount} member organization{memberCount !== 1 ? 's' : ''}
                        </span>
                    )}
                    {clickable && WEBSITE_LINKS_ENABLED && p.websiteUrl && (
                        <span className="partner-visit">
                            Visit website <Icon name="external-link" size={12} />
                        </span>
                    )}
                </div>
            </>
        );

        if (clickable) {
            return (
                <Link key={p.id} href={`/partners/${p.slug}`} className="partner-card is-clickable">
                    {cardContent}
                </Link>
            );
        }

        return (
            <div key={p.id} className="partner-card">
                {cardContent}
            </div>
        );
    };

    return (
        <>
            {/* Stats */}
            <div className="partner-stats">
                <button type="button" className="partner-stat partner-stat-total" onClick={() => window.scrollTo({ top: (document.getElementById('partner-directory')?.offsetTop || 0) - 90, behavior: 'smooth' })}>
                    <div className="partner-stat-num">{partners.length}</div>
                    <div className="partner-stat-label">All Alliance Partners</div>
                </button>
                {presentTypes.map((type) => {
                    const meta = CATEGORY_META[type] ?? { label: type, slug: type, color: '#4a5568', bg: '#f1f5f9', blurb: '' };
                    return (
                        <button type="button" key={type} className="partner-stat" onClick={() => openCategory(type)}>
                            <div className="partner-stat-num">{counts[type] || 0}</div>
                            <div className="partner-stat-label">{meta.label}</div>
                        </button>
                    );
                })}
            </div>

            {/* Directory */}
            <section className="section" id="partner-directory">
                <div className="container">
                    <div className="partner-toolbar">
                        <div className="partner-search-box">
                            <Icon name="search" size={16} className="partner-search-icon" />
                            <input
                                type="text"
                                className="partner-search-input"
                                placeholder="Search partners by name..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                aria-label="Search partners"
                            />
                        </div>
                        <select
                            className="partner-type-select"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            aria-label="Filter by category"
                        >
                            <option value="all">All Categories</option>
                            {presentTypes.map((type) => (
                                <option key={type} value={type}>{CATEGORY_META[type]?.label || type}</option>
                            ))}
                        </select>
                    </div>

                    {isFiltering ? (
                        filteredFlat.length > 0 ? (
                            <>
                                <p className="partner-result-count">{filteredFlat.length} partner{filteredFlat.length !== 1 ? 's' : ''} found</p>
                                <div className="grid-2 partner-grid">
                                    {filteredFlat.map(renderCard)}
                                </div>
                            </>
                        ) : (
                            <div className="partner-no-results">
                                <Icon name="search" size={32} />
                                <p>No partners match your search.</p>
                            </div>
                        )
                    ) : (
                        presentTypes.map((type) => {
                            const meta = CATEGORY_META[type] ?? { label: type, slug: type, color: '#4a5568', bg: '#f1f5f9', blurb: '' };
                            const group = grouped[type] || [];
                            const isOpen = !!openTypes[type];
                            return (
                                <div key={type} id={`partner-cat-${meta.slug}`} ref={(el) => { sectionRefs.current[type] = el; }} className="partner-category">
                                    <button type="button" className="partner-category-header" onClick={() => toggleCategory(type)} aria-expanded={isOpen}>
                                        <span className="partner-type-badge" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
                                        <span className="partner-group-count">{group.length} organization{group.length !== 1 ? 's' : ''}</span>
                                        <Icon name="chevron-down" size={18} className="partner-category-chevron" />
                                    </button>
                                    {meta.blurb && <p className="partner-category-blurb">{meta.blurb}</p>}
                                    {isOpen && (
                                        <div className="grid-2 partner-grid">
                                            {group.map(renderCard)}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Become a Partner */}
            <div className="become-section">
                <div className="container">
                    <div className="become-grid">
                        <div>
                            <p className="section-eyebrow" style={{ color: 'var(--wfp-gold)' }}>Join the Alliance</p>
                            <h2>Become a Partner</h2>
                            <p>NFA welcomes new partners who share our commitment to eliminating malnutrition in Nigeria. We work with organizations across sectors to expand reach and deepen impact.</p>
                            <div style={{ marginTop: '1.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <Link href="/contact" className="btn btn-white btn-lg">Express Interest →</Link>
                                <Link href="/contact" className="btn btn-outline-white btn-lg">View Partnership Guide</Link>
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
                                    <span className="become-item-icon" style={{ display: 'flex' }}><Icon name={item.icon as IconName} size={28} /></span>
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
