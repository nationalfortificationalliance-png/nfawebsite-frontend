'use client';

import { useMemo, useState } from 'react';
import Icon, { IconName } from '@/components/Icon';
import type { Laboratory, IndustryChallenge, GuidelineDocument, MemberOrganization } from '@/lib/api';
import LabsMap from '@/components/LabsMap';
import OrganizationResourceCards from '@/components/OrganizationResourceCards';

interface ResourceCentreProps {
    labs: Laboratory[];
    challenges: IndustryChallenge[];
    documents: GuidelineDocument[];
    organizations: MemberOrganization[];
}

const CHALLENGE_CATEGORY_ORDER = ['Supply Chain', 'Technical & Equipment', 'Quality & Compliance', 'Regulatory & Customs'];
const CHALLENGE_CATEGORY_ICONS: Record<string, IconName> = {
    'Supply Chain': 'truck',
    'Technical & Equipment': 'settings',
    'Quality & Compliance': 'microscope',
    'Regulatory & Customs': 'landmark',
};

function splitTags(value?: string): string[] {
    if (!value) return [];
    return value.split(',').map((v) => v.trim()).filter(Boolean);
}

function uniqueSorted(values: string[]): string[] {
    return Array.from(new Set(values)).sort();
}

function matches(query: string, haystacks: (string | undefined | null)[]): boolean {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return haystacks.some((h) => h?.toLowerCase().includes(q));
}

export default function ResourceCentre({ labs, challenges, documents, organizations }: ResourceCentreProps) {
    const [query, setQuery] = useState('');
    const [docType, setDocType] = useState('all');
    const [foodVehicle, setFoodVehicle] = useState('all');
    const [year, setYear] = useState('all');
    const [agency, setAgency] = useState('all');
    const [status, setStatus] = useState('all');

    const docTypes = useMemo(() => uniqueSorted(documents.map((d) => d.document_type).filter(Boolean) as string[]), [documents]);
    const foodVehicles = useMemo(() => uniqueSorted(documents.flatMap((d) => splitTags(d.food_vehicles))), [documents]);
    const years = useMemo(
        () => uniqueSorted(documents.filter((d) => d.published_date).map((d) => d.published_date!.slice(0, 4))).reverse(),
        [documents]
    );
    const agencies = useMemo(() => uniqueSorted(documents.map((d) => d.agency).filter(Boolean) as string[]), [documents]);

    const filteredLabs = labs.filter((lab) => matches(query, [lab.name, lab.location]));

    const filteredChallenges = challenges.filter((c) => matches(query, [c.text, c.category]));

    const filteredDocuments = documents.filter((d) => {
        if (docType !== 'all' && d.document_type !== docType) return false;
        if (foodVehicle !== 'all' && !splitTags(d.food_vehicles).includes(foodVehicle)) return false;
        if (year !== 'all' && d.published_date?.slice(0, 4) !== year) return false;
        if (agency !== 'all' && d.agency !== agency) return false;
        if (status !== 'all' && d.status !== status) return false;
        if (!matches(query, [d.title, d.description, d.food_vehicles, d.document_type, d.agency])) return false;
        return true;
    });

    const hasDocFilters = docType !== 'all' || foodVehicle !== 'all' || year !== 'all' || agency !== 'all' || status !== 'all';

    const resetDocFilters = () => {
        setDocType('all');
        setFoodVehicle('all');
        setYear('all');
        setAgency('all');
        setStatus('all');
    };

    const isSearching = query.trim() !== '';

    return (
        <>
            <style>{`
                .rc-search-wrap { padding: 0 1.5rem; }
                .rc-search-bar {
                    max-width: 640px;
                    margin: 2rem auto 0;
                    position: relative;
                }
                .rc-search-bar svg.rc-search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
                .rc-search-bar input {
                    width: 100%;
                    padding: 0.85rem 2.75rem 0.85rem 2.75rem;
                    border-radius: 999px;
                    border: 1px solid var(--border-light);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
                    font-size: 0.95rem;
                    -webkit-appearance: none;
                    appearance: none;
                }
                .rc-search-bar input:focus { outline: none; border-color: var(--wfp-blue); }
                .rc-search-clear {
                    position: absolute;
                    right: 0.6rem;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    background: transparent;
                }
                .rc-search-clear:hover { background: var(--bg-off, #f1f5f9); color: var(--text-primary); }
                .rc-search-hint { text-align: center; font-size: 0.78rem; color: var(--text-muted); margin-top: 0.6rem; }
                @media (max-width: 600px) {
                    .rc-search-wrap { padding: 0 1rem; }
                    .rc-search-bar input { padding: 0.75rem 2.5rem 0.75rem 2.5rem; font-size: 0.9rem; }
                }

                .doc-filters-bar {
                    background: var(--bg-off, #f8fafc);
                    border: 1px solid var(--border-light);
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-top: 2rem;
                }
                .doc-filters-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-bottom: 1.25rem;
                }
                @media (max-width: 600px) {
                    .doc-filters-bar { padding: 1.25rem; border-radius: 14px; }
                    .doc-filters { grid-template-columns: 1fr 1fr; gap: 1rem; }
                }
                @media (max-width: 400px) {
                    .doc-filters { grid-template-columns: 1fr; }
                }
                .doc-filters-title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .doc-filters-title svg { color: var(--wfp-blue); }
                .doc-filters {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    gap: 1.25rem;
                }
                .doc-filter-field {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .doc-filter-field span {
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .doc-filters select {
                    width: 100%;
                    min-height: 44px;
                    padding: 0.7rem 2.25rem 0.7rem 0.9rem;
                    border: 1.5px solid var(--border-light);
                    border-radius: 10px;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    background: #fff;
                    transition: border-color 0.15s ease;
                }
                .doc-filters select:focus { outline: none; border-color: var(--wfp-blue); }
                .doc-filters select.doc-filter-active {
                    border-color: var(--wfp-blue);
                    color: var(--wfp-blue);
                    font-weight: 600;
                    background: var(--wfp-blue-light);
                }
                .doc-filters-reset {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--wfp-blue);
                    background: #fff;
                    border: 1px solid var(--wfp-blue-light);
                    border-radius: 999px;
                    padding: 0.4rem 0.85rem;
                    flex-shrink: 0;
                }
                .doc-filters-reset:hover { background: var(--wfp-blue-light); }
                .rc-results-count {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    margin: 1.25rem 0 0;
                }
                .doc-status-badge {
                    display: inline-block;
                    font-size: 0.68rem;
                    font-weight: 700;
                    padding: 0.15rem 0.55rem;
                    border-radius: 999px;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                }
                .doc-status-current { background: #dcfce7; color: #15803d; }
                .doc-status-revised { background: #fef3c7; color: #b45309; }
                .doc-status-archived { background: #f1f5f9; color: #64748b; }
                .doc-type-badge {
                    display: inline-block;
                    background: var(--wfp-blue-light);
                    color: var(--wfp-blue);
                    font-size: 0.72rem;
                    font-weight: 700;
                    padding: 0.2rem 0.65rem;
                    border-radius: 999px;
                }
                .doc-vehicle-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.4rem; }
                .doc-vehicle-tag {
                    font-size: 0.68rem;
                    color: var(--text-muted);
                    background: var(--bg-off);
                    padding: 0.12rem 0.5rem;
                    border-radius: 999px;
                }
                .rc-section-empty {
                    text-align: center;
                    padding: 2rem;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }
                .doc-featured-badge {
                    display: inline-block;
                    background: var(--wfp-gold-light, #fef3c7);
                    color: var(--wfp-gold, #b45309);
                    font-size: 0.68rem;
                    font-weight: 700;
                    padding: 0.15rem 0.55rem;
                    border-radius: 999px;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                }
                .doc-new-badge {
                    display: inline-block;
                    background: var(--wfp-green-light, #e6f4ee);
                    color: var(--wfp-green, #008751);
                    font-size: 0.68rem;
                    font-weight: 700;
                    padding: 0.15rem 0.55rem;
                    border-radius: 999px;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                }
            `}</style>

            <div className="rc-search-wrap">
                <div className="rc-search-bar">
                    <Icon name="search" size={16} className="rc-search-icon" />
                    <input
                        type="text"
                        inputMode="search"
                        autoComplete="off"
                        placeholder="Search laboratories, guideline documents, and challenges..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {isSearching && (
                        <button
                            type="button"
                            className="rc-search-clear"
                            aria-label="Clear search"
                            onClick={() => setQuery('')}
                        >
                            <Icon name="x" size={15} />
                        </button>
                    )}
                </div>
                {isSearching && (
                    <p className="rc-search-hint">
                        {filteredLabs.length + filteredChallenges.length + filteredDocuments.length} result(s) for &quot;{query}&quot;
                    </p>
                )}
            </div>

            {/* Approved Labs */}
            <section className="section" id="laboratories" style={{ scrollMarginTop: '100px' }}>
                <div className="container">
                    <p className="section-eyebrow">Quality Assurance</p>
                    <h2 className="section-title">Approved Micronutrient Laboratories</h2>
                    <p className="section-lead">
                        The NFA, in collaboration with the Institute of Public Analysts of Nigeria (IPAN), recognizes accredited laboratories supporting micronutrient analysis and compliance monitoring.
                    </p>

                    {filteredLabs.length === 0 ? (
                        <p className="rc-section-empty">No laboratories match &quot;{query}&quot;.</p>
                    ) : (
                        <LabsMap labs={filteredLabs} />
                    )}
                </div>
            </section>

            {/* Industry Challenges */}
            <section className="section" style={{ background: 'var(--bg-off)' }}>
                <div className="container">
                    <p className="section-eyebrow" style={{ color: 'var(--wfp-red, #dc2626)' }}>Transparency</p>
                    <h2 className="section-title">Industry Challenges</h2>
                    <p className="section-lead">
                        Identifying and addressing operational hurdles is critical. The NFA actively works to mitigate the following identified industry challenges:
                    </p>
                    {filteredChallenges.length === 0 ? (
                        <p className="rc-section-empty">No challenges match &quot;{query}&quot;.</p>
                    ) : (
                        <div className="challenges-groups">
                            {CHALLENGE_CATEGORY_ORDER
                                .map((category) => ({ category, items: filteredChallenges.filter((c) => c.category === category) }))
                                .filter((group) => group.items.length > 0)
                                .map((group) => (
                                    <div key={group.category} className="challenge-group">
                                        <h4 className="challenge-group-title">
                                            <Icon name={CHALLENGE_CATEGORY_ICONS[group.category] || 'settings'} size={18} />
                                            {group.category}
                                        </h4>
                                        <div className="challenges-grid">
                                            {group.items.map((challenge) => (
                                                <div key={challenge.id} className="challenge-item">
                                                    <span>{challenge.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Guideline Documents */}
            <section className="section" id="guidelines" style={{ scrollMarginTop: '100px' }}>
                <div className="container">
                    <p className="section-eyebrow">Resource Library</p>
                    <h2 className="section-title">Guideline Documents</h2>
                    <p className="section-lead">
                        Regulatory guidelines, technical reports, and reference documents for fortification stakeholders.
                    </p>

                    {documents.length > 0 && (
                        <div className="doc-filters-bar">
                            <div className="doc-filters-head">
                                <span className="doc-filters-title">
                                    <Icon name="filter" size={15} /> Filter Documents
                                </span>
                                {hasDocFilters && (
                                    <button type="button" className="doc-filters-reset" onClick={resetDocFilters}>
                                        <Icon name="x" size={14} /> Clear filters
                                    </button>
                                )}
                            </div>
                            <div className="doc-filters">
                                <label className="doc-filter-field">
                                    <span>Document Type</span>
                                    <select className={docType !== 'all' ? 'doc-filter-active' : ''} value={docType} onChange={(e) => setDocType(e.target.value)}>
                                        <option value="all">All Document Types</option>
                                        {docTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </label>
                                <label className="doc-filter-field">
                                    <span>Food Vehicle</span>
                                    <select className={foodVehicle !== 'all' ? 'doc-filter-active' : ''} value={foodVehicle} onChange={(e) => setFoodVehicle(e.target.value)}>
                                        <option value="all">All Food Vehicles</option>
                                        {foodVehicles.map((v) => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </label>
                                <label className="doc-filter-field">
                                    <span>Year</span>
                                    <select className={year !== 'all' ? 'doc-filter-active' : ''} value={year} onChange={(e) => setYear(e.target.value)}>
                                        <option value="all">All Years</option>
                                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </label>
                                <label className="doc-filter-field">
                                    <span>Agency</span>
                                    <select className={agency !== 'all' ? 'doc-filter-active' : ''} value={agency} onChange={(e) => setAgency(e.target.value)}>
                                        <option value="all">All Agencies</option>
                                        {agencies.map((a) => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </label>
                                <label className="doc-filter-field">
                                    <span>Status</span>
                                    <select className={status !== 'all' ? 'doc-filter-active' : ''} value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="all">All Statuses</option>
                                        <option value="Current">Current</option>
                                        <option value="Revised">Revised</option>
                                        <option value="Archived">Archived</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                    )}

                    {documents.length > 0 && filteredDocuments.length > 0 && (
                        <p className="rc-results-count">Showing {filteredDocuments.length} of {documents.length} documents</p>
                    )}

                    {documents.length === 0 ? (
                        <p className="res-empty">Guideline documents will be published here shortly.</p>
                    ) : filteredDocuments.length === 0 ? (
                        <p className="rc-section-empty">No documents match your search and filters.</p>
                    ) : (
                        <OrganizationResourceCards documents={filteredDocuments} organizations={organizations} />
                    )}
                </div>
            </section>
        </>
    );
}
