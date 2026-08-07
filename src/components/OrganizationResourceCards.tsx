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

    return { key: 'other-resources', name: 'Other resources' };
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

    return (
        <article className="org-resource-row">
            <div className="org-resource-row-icon"><Icon name="file-text" size={20} /></div>
            <div className="org-resource-row-content">
                <h4>{document.title}</h4>
                {document.description && <p>{document.description}</p>}
                <div className="org-resource-row-meta">
                    {document.reference_number && <span>{document.reference_number}</span>}
                    {document.document_type && <span>{document.document_type}</span>}
                    {year && <span>{year}</span>}
                    {document.status && <span>{document.status}</span>}
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
                .organization-resource-card { border: 1px solid var(--border-light); border-radius: 16px; background: #fff; overflow: hidden; }
                .organization-resource-trigger { width: 100%; display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; background: #fff; text-align: left; color: var(--text-primary); }
                .organization-resource-trigger:hover { background: var(--bg-off, #f8fafc); }
                .organization-resource-trigger:focus-visible { outline: 3px solid var(--wfp-blue); outline-offset: -3px; }
                .organization-resource-logo { position: relative; width: 64px; height: 48px; display: flex; align-items: center; justify-content: center; flex: 0 0 64px; color: var(--wfp-blue); }
                .organization-resource-summary { display: flex; flex: 1; flex-direction: column; gap: 0.2rem; }
                .organization-resource-summary strong { font-size: 1rem; }
                .organization-resource-summary span { color: var(--text-muted); font-size: 0.82rem; }
                .organization-resource-chevron { flex: 0 0 auto; transition: transform 0.2s ease; }
                .organization-resource-chevron.expanded { transform: rotate(180deg); }
                .organization-resource-panel { border-top: 1px solid var(--border-light); padding: 1.25rem; background: var(--bg-off, #f8fafc); }
                .organization-resource-group + .organization-resource-group { margin-top: 1.5rem; }
                .organization-resource-group h3 { font-size: 0.86rem; margin: 0 0 0.65rem; color: var(--wfp-blue); text-transform: uppercase; letter-spacing: 0.05em; }
                .organization-resource-list { display: grid; gap: 0.65rem; }
                .org-resource-row { display: flex; align-items: flex-start; gap: 0.85rem; padding: 1rem; border: 1px solid var(--border-light); background: #fff; border-radius: 12px; }
                .org-resource-row-icon { color: var(--wfp-blue); padding-top: 0.1rem; }
                .org-resource-row-content { flex: 1; min-width: 0; }
                .org-resource-row-content h4 { margin: 0; font-size: 0.95rem; color: var(--text-primary); }
                .org-resource-row-content p { margin: 0.35rem 0 0; color: var(--text-secondary); font-size: 0.84rem; line-height: 1.45; }
                .org-resource-row-meta { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.55rem; }
                .org-resource-row-meta span { border-radius: 999px; background: var(--wfp-blue-light, #e6f1fb); color: var(--wfp-blue); padding: 0.15rem 0.5rem; font-size: 0.68rem; font-weight: 700; }
                .org-resource-action { align-self: center; display: inline-flex; align-items: center; gap: 0.35rem; color: var(--wfp-blue); font-weight: 700; font-size: 0.82rem; white-space: nowrap; }
                .org-resource-action:hover { text-decoration: underline; }
                @media (max-width: 640px) {
                    .organization-resource-trigger, .organization-resource-panel { padding: 1rem; }
                    .org-resource-row { flex-wrap: wrap; }
                    .org-resource-action { width: 100%; margin-left: 2.1rem; }
                }
            `}</style>
        </div>
    );
}
