'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import Icon from '@/components/Icon';
import { getStrapiMediaUrl } from '@/lib/api';
import type { GuidelineDocument, MemberOrganization } from '@/lib/api';

interface OrganizationResourceCardsProps {
    documents: GuidelineDocument[];
    organizations: MemberOrganization[];
}

interface ResourceOrganization {
    key: string;
    name: string;
    logoUrl?: string;
    documents: GuidelineDocument[];
}

function normalizeOrganizationName(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findOrganizationByAgency(agency: string | undefined, organizations: MemberOrganization[]) {
    if (!agency) return undefined;
    const normalizedAgency = normalizeOrganizationName(agency);
    return organizations.find((organization) => {
        const normalizedName = normalizeOrganizationName(organization.name);
        return normalizedName.includes(normalizedAgency) || normalizedAgency.includes(normalizedName);
    });
}

function getOrganization(document: GuidelineDocument, organizations: MemberOrganization[]): Omit<ResourceOrganization, 'documents'> {
    const organization = document.issuing_organization;
    if (organization) {
        return {
            key: `organization-${organization.documentId}`,
            name: organization.name,
            logoUrl: organization.logo?.url ? getStrapiMediaUrl(organization.logo.url) : undefined,
        };
    }

    const agencyOrganization = findOrganizationByAgency(document.agency, organizations);
    if (agencyOrganization) {
        return {
            key: `organization-${agencyOrganization.documentId}`,
            name: agencyOrganization.name,
            logoUrl: agencyOrganization.logo?.url ? getStrapiMediaUrl(agencyOrganization.logo.url) : undefined,
        };
    }

    if (document.agency) {
        return { key: `agency-${document.agency}`, name: document.agency };
    }

    return { key: 'nfa-resources', name: 'NFA resources' };
}

function groupDocuments(documents: GuidelineDocument[]): Array<{ name: string; documents: GuidelineDocument[] }> {
    const groups = new Map<string, GuidelineDocument[]>();
    for (const document of documents) {
        const name = document.resource_group?.trim() || 'Resources';
        groups.set(name, [...(groups.get(name) || []), document]);
    }
    return Array.from(groups, ([name, groupedDocuments]) => ({ name, documents: groupedDocuments }));
}

function getAccessAction(document: GuidelineDocument) {
    if (document.access_type === 'External Link' && document.external_url) {
        return { href: document.external_url, label: 'Read on official website', external: true };
    }

    if (!document.file) return null;

    return {
        href: getStrapiMediaUrl(document.file.url),
        label: document.access_type === 'Preview' ? 'View preview' : 'Download PDF',
        external: true,
    };
}

function ResourceRow({ document }: { document: GuidelineDocument }) {
    const action = getAccessAction(document);
    const year = document.publication_year || document.published_date?.slice(0, 4);
    const showDescription = document.description && !document.description.startsWith('First-page preview of');

    return (
        <article className="org-resource-row">
            <div className="org-resource-reference">
                {document.reference_number || <Icon name="file-text" size={22} />}
            </div>
            <div className="org-resource-row-content">
                <h4>{document.title}</h4>
                {showDescription && <p>{document.description}</p>}
                <div className="org-resource-row-meta">
                    {document.document_type && <span>{document.document_type}</span>}
                    {year && <span>{year}</span>}
                </div>
            </div>
            {action && (
                <a
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="org-resource-action"
                >
                    {action.label} <Icon name={action.external ? 'external-link' : 'arrow-right'} size={14} />
                </a>
            )}
        </article>
    );
}

export default function OrganizationResourceCards({ documents, organizations }: OrganizationResourceCardsProps) {
    const resourceOrganizations = useMemo(() => {
        const grouped = new Map<string, ResourceOrganization>();
        for (const document of documents) {
            const organization = getOrganization(document, organizations);
            const existing = grouped.get(organization.key);
            grouped.set(organization.key, {
                ...organization,
                documents: [...(existing?.documents || []), document],
            });
        }
        return Array.from(grouped.values());
    }, [documents, organizations]);
    const [expandedOrganization, setExpandedOrganization] = useState<string | null>(null);

    return (
        <div className="organization-resource-cards">
            {resourceOrganizations.map((organization) => {
                const isExpanded = expandedOrganization === organization.key;
                const panelId = `${organization.key}-resources`;
                return (
                    <section className="organization-resource-card" key={organization.key}>
                        <button
                            type="button"
                            className="organization-resource-trigger"
                            aria-expanded={isExpanded}
                            aria-controls={panelId}
                            onClick={() => setExpandedOrganization(isExpanded ? null : organization.key)}
                        >
                            <span className="organization-resource-logo" aria-hidden="true">
                                {organization.logoUrl ? (
                                    <Image src={organization.logoUrl} alt="" fill sizes="64px" style={{ objectFit: 'contain' }} />
                                ) : (
                                    <Icon name="building-2" size={28} />
                                )}
                            </span>
                            <span className="organization-resource-summary">
                                <strong>{organization.name}</strong>
                                <span>{organization.documents.length} {organization.documents.length === 1 ? 'resource' : 'resources'}</span>
                            </span>
                            <Icon name="chevron-down" size={22} className={isExpanded ? 'organization-resource-chevron expanded' : 'organization-resource-chevron'} />
                        </button>
                        {isExpanded && (
                            <div id={panelId} className="organization-resource-panel">
                                {groupDocuments(organization.documents).map((group) => (
                                    <div className="organization-resource-group" key={group.name}>
                                        {group.name !== 'Resources' && <h3>{group.name}</h3>}
                                        <div className="organization-resource-list">
                                            {group.documents.map((document) => <ResourceRow document={document} key={document.id} />)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                );
            })}
            <style jsx>{`
                .organization-resource-cards { display: grid; gap: 1rem; margin-top: 1.5rem; }
                .organization-resource-card { border: 1px solid var(--border-light); border-radius: 18px; background: #fff; overflow: hidden; box-shadow: 0 3px 12px rgba(15, 23, 42, 0.04); }
                .organization-resource-trigger { width: 100%; display: flex; align-items: center; gap: 1rem; padding: 1.25rem 1.5rem; background: #fff; text-align: left; color: var(--text-primary); }
                .organization-resource-trigger:hover { background: #f8fbfd; }
                .organization-resource-trigger:focus-visible { outline: 3px solid var(--wfp-blue); outline-offset: -3px; }
                .organization-resource-logo { position: relative; width: 64px; height: 52px; display: flex; align-items: center; justify-content: center; flex: 0 0 64px; padding: 0.45rem; border-radius: 10px; background: var(--bg-off, #f8fafc); color: var(--wfp-blue); }
                .organization-resource-summary { display: flex; flex: 1; flex-direction: column; gap: 0.2rem; }
                .organization-resource-summary strong { font-size: 1rem; }
                .organization-resource-summary span { align-self: flex-start; color: var(--wfp-blue); background: var(--wfp-blue-light, #e6f1fb); border-radius: 999px; padding: 0.2rem 0.55rem; font-size: 0.72rem; font-weight: 700; }
                .organization-resource-chevron { flex: 0 0 auto; margin-left: 0.5rem; padding: 0.4rem; border-radius: 50%; background: var(--bg-off, #f8fafc); transition: transform 0.2s ease; }
                .organization-resource-chevron.expanded { transform: rotate(180deg); }
                .organization-resource-panel { border-top: 1px solid var(--border-light); padding: 1.5rem; background: #f7fafc; }
                .organization-resource-group { padding: 1.1rem; border: 1px solid #e4edf4; border-radius: 14px; background: #fff; }
                .organization-resource-group + .organization-resource-group { margin-top: 1rem; }
                .organization-resource-group h3 { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; margin: 0 0 0.85rem; color: var(--wfp-blue); text-transform: uppercase; letter-spacing: 0.06em; }
                .organization-resource-group h3::before { content: ''; width: 0.4rem; height: 0.4rem; border-radius: 50%; background: var(--wfp-gold, #eab308); }
                .organization-resource-list { display: grid; gap: 0.75rem; }
                .org-resource-row { display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 1px solid #e5edf3; border-radius: 12px; background: linear-gradient(135deg, #fff 0%, #fbfdff 100%); transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease; }
                .org-resource-row:hover { border-color: #bfd8ed; box-shadow: 0 6px 16px rgba(15, 65, 98, 0.08); transform: translateY(-1px); }
                .org-resource-reference { display: flex; align-items: center; justify-content: center; width: 78px; min-height: 48px; flex: 0 0 78px; padding: 0.35rem 0.45rem; border-radius: 9px; background: #eaf4fb; color: #075985; font-size: 0.72rem; font-weight: 800; line-height: 1.2; text-align: center; }
                .org-resource-row-content { flex: 1; min-width: 0; }
                .org-resource-row-content h4 { margin: 0; font-size: 0.96rem; color: var(--text-primary); line-height: 1.35; }
                .org-resource-row-content p { margin: 0.35rem 0 0; color: var(--text-secondary); font-size: 0.84rem; line-height: 1.45; }
                .org-resource-row-meta { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.5rem; }
                .org-resource-row-meta span { color: var(--text-muted); font-size: 0.73rem; font-weight: 650; }
                .org-resource-row-meta span + span::before { content: '•'; margin-right: 0.35rem; color: #94a3b8; }
                .org-resource-action { align-self: center; display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; min-height: 38px; padding: 0.55rem 0.75rem; border-radius: 8px; background: var(--wfp-blue, #0070bc); color: #fff; font-weight: 700; font-size: 0.78rem; white-space: nowrap; transition: background 0.15s ease, transform 0.15s ease; }
                .org-resource-action:hover { background: #005f9f; transform: translateY(-1px); }
                @media (max-width: 640px) {
                    .organization-resource-trigger, .organization-resource-panel { padding: 1.1rem; }
                    .organization-resource-group { padding: 0.85rem; }
                    .org-resource-row { align-items: flex-start; flex-wrap: wrap; }
                    .org-resource-action { width: calc(100% - 94px); margin-left: 94px; }
                }
            `}</style>
        </div>
    );
}
