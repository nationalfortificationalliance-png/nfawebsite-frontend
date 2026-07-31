const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function fetchAPI<T>(
    path: string,
    params: Record<string, string> = {},
    locale?: string
): Promise<T | null> {
    // Add locale to params if provided
    if (locale) {
        params['locale'] = locale;
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `${STRAPI_URL}/api${path}${queryString ? `?${queryString}` : ''}`;
    try {
        const res = await fetch(url, {
            next: { revalidate: 60 },
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
            console.error(`API error: ${res.status} ${res.statusText} - ${url}`);
            return null;
        }
        const json = await res.json();
        return json;
    } catch (error) {
        console.error(`API fetch failed for ${url}:`, error);
        return null;
    }
}

export function getStrapiMediaUrl(url: string | null | undefined): string {
    if (!url) return '/placeholder.jpg';
    if (url.startsWith('http')) return url;
    // Strapi uploads paths need to be converted to full URLs
    if (url.startsWith('/uploads')) return `${STRAPI_URL}${url}`;
    // Local frontend paths (not from Strapi) can stay as-is
    if (url.startsWith('/')) return url;
    // Relative paths from Strapi
    return `${STRAPI_URL}${url}`;
}

// Types
export interface StrapiImage {
    id: number;
    documentId: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
}

export interface Carousel {
    id: number;
    documentId: string;
    title: string;
    subtitle?: string;
    image: StrapiImage;
    link_url?: string;
    link_text?: string;
    order: number;
    is_active: boolean;
}

export interface NewsEvent {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    excerpt?: string;
    body: string;
    date: string;
    image: StrapiImage;
    gallery?: StrapiImage[];
    file?: StrapiImage;
    category: 'news' | 'event' | 'communique' | 'report';
    is_featured: boolean;
    tags?: string;
    publishedAt: string;
}

export interface Partner {
    id: number;
    documentId: string;
    name: string;
    logo: StrapiImage;
    website_url?: string;
    description?: string;
    role_in_alliance?: string;
    order: number;
    is_active: boolean;
    partner_type: string;
}

export interface Quote {
    id: number;
    documentId: string;
    text: string;
    author_name: string;
    author_title: string;
    author_organization?: string;
    author_image?: StrapiImage;
    is_active: boolean;
}

export interface Stat {
    id: number;
    documentId: string;
    label: string;
    value: string;
    description?: string;
    order: number;
    category: 'General' | 'Compliance' | 'Health Impact' | 'Programme';
    is_featured: boolean;
}

export interface TeamMember {
    id: number;
    documentId: string;
    name: string;
    role: string;
    organization?: string;
    category: 'Leadership' | 'Secretariat' | 'Focal Point';
    bio?: string;
    image?: StrapiImage;
    order: number;
    phone?: string;
    email?: string;
}

export interface AboutTimelineItem {
    id: number;
    year: string;
    event: string;
}

export interface AboutPage {
    documentId: string;
    mission: string;
    vision?: string;
    hero_tagline?: string;
    hero_image: StrapiImage;
    body?: string;
    objectives?: string;
    background?: string;
    history_intro?: string;
    timeline_items?: AboutTimelineItem[];
}

export interface GlobalSetting {
    documentId: string;
    site_name: string;
    site_tagline?: string;
    contact_email?: string;
    contact_phone?: string;
    address?: string;
    twitter_url?: string;
    facebook_url?: string;
    linkedin_url?: string;
    footer_text?: string;
    stats_source?: string;
}

export interface FAQ {
    id: number;
    documentId: string;
    question: string;
    answer: string;
    category?: string;
    order: number;
    is_active: boolean;
    updatedAt?: string;
    view_count?: number;
}

// API functions
export async function getCarousels(locale?: string): Promise<Carousel[]> {
    const res = await fetchAPI<{ data: Carousel[] }>('/carousels', {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:asc',
        'populate': 'image',
        'pagination[pageSize]': '5',
    }, locale);
    return res?.data || [];
}

export async function getAllNews(page = 1, pageSize = 12): Promise<{ data: NewsEvent[]; total: number }> {
    const res = await fetchAPI<{ data: NewsEvent[]; meta: { pagination: { total: number } } }>('/news-events', {
        'sort': 'date:desc',
        'populate[0]': 'image',
        'populate[1]': 'gallery',
        'populate[2]': 'file',
        'pagination[page]': String(page),
        'pagination[pageSize]': String(pageSize),
    });
    return { data: res?.data || [], total: res?.meta?.pagination?.total || 0 };
}

export async function getFeaturedNews(): Promise<NewsEvent[]> {
    const featured = await fetchAPI<{ data: NewsEvent[] }>('/news-events', {
        'filters[is_featured][$eq]': 'true',
        'sort': 'date:desc',
        'populate[0]': 'image',
        'populate[1]': 'gallery',
        'populate[2]': 'file',
        'pagination[pageSize]': '6',
    });

    if (featured?.data?.length) {
        return featured.data;
    }

    const latest = await fetchAPI<{ data: NewsEvent[] }>('/news-events', {
        'sort': 'date:desc',
        'populate[0]': 'image',
        'populate[1]': 'gallery',
        'populate[2]': 'file',
        'pagination[pageSize]': '6',
    });

    return latest?.data || [];
}

export async function getNewsBySlug(slug: string): Promise<NewsEvent | null> {
    const res = await fetchAPI<{ data: NewsEvent[] }>('/news-events', {
        'filters[slug][$eq]': slug,
        'populate[0]': 'image',
        'populate[1]': 'gallery',
        'populate[2]': 'file',
    });
    return res?.data?.[0] || null;
}

export async function getUpcomingEvents(pageSize = 6): Promise<NewsEvent[]> {
    const res = await fetchAPI<{ data: NewsEvent[] }>('/news-events/upcoming', {
        'populate[0]': 'image',
        'populate[1]': 'gallery',
        'populate[2]': 'file',
        'pagination[pageSize]': String(pageSize),
    });
    return res?.data || [];
}

export async function getPastEvents(page = 1, pageSize = 12): Promise<{ data: NewsEvent[]; total: number }> {
    const res = await fetchAPI<{ data: NewsEvent[]; meta: { pagination: { total: number } } }>('/news-events/past', {
        'populate[0]': 'image',
        'populate[1]': 'gallery',
        'populate[2]': 'file',
        'pagination[page]': String(page),
        'pagination[pageSize]': String(pageSize),
    });
    return { data: res?.data || [], total: res?.meta?.pagination?.total || 0 };
}

export async function getNewsByCategory(category: string, page = 1, pageSize = 12): Promise<{ data: NewsEvent[]; total: number }> {
    const res = await fetchAPI<{ data: NewsEvent[]; meta: { pagination: { total: number } } }>('/news-events', {
        'filters[category][$eq]': category,
        'sort': 'date:desc',
        'populate[0]': 'image',
        'populate[1]': 'gallery',
        'populate[2]': 'file',
        'pagination[page]': String(page),
        'pagination[pageSize]': String(pageSize),
    });
    return { data: res?.data || [], total: res?.meta?.pagination?.total || 0 };
}

export async function getPartners(): Promise<Partner[]> {
    const res = await fetchAPI<{ data: Partner[] }>('/partners', {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:asc',
        'populate[0]': 'logo',
        'pagination[pageSize]': '100',
    });
    return res?.data || [];
}

export async function getTeamMembers(category?: string): Promise<TeamMember[]> {
    const params: Record<string, string> = {
        'sort': 'order:asc',
        'populate': 'image',
        'pagination[pageSize]': '50',
    };
    if (category) {
        params['filters[category][$eq]'] = category;
    }
    const res = await fetchAPI<{ data: TeamMember[] }>('/team-members', params);
    return res?.data || [];
}

export async function getAboutPage(): Promise<AboutPage | null> {
    const res = await fetchAPI<{ data: AboutPage }>('/about-page', {
        'populate[hero_image][populate]': '*',
        'populate[timeline_items][populate]': '*',
    });
    return res?.data || null;
}

export async function getGlobalSettings(): Promise<GlobalSetting | null> {
    const res = await fetchAPI<{ data: GlobalSetting }>('/global-setting', {});
    return res?.data || null;
}

export async function getFAQs(category?: string): Promise<FAQ[]> {
    const params: Record<string, string> = {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:asc',
        'pagination[pageSize]': '50',
    };
    if (category) {
        params['filters[category][$eq]'] = category;
    }
    const res = await fetchAPI<{ data: FAQ[] }>('/faqs', params);
    return res?.data || [];
}

// Fire-and-forget: increments an FAQ's view counter. Silently ignored if the
// backend hasn't been redeployed with the /faqs/:id/view route yet.
export function incrementFaqView(documentId: string): void {
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/faqs/${documentId}/view`, { method: 'POST' }).catch(() => {});
}

export async function getFeaturedQuote(): Promise<Quote | null> {
    const res = await fetchAPI<{ data: Quote[] }>('/quotes', {
        'filters[is_active][$eq]': 'true',
        'populate': 'author_image',
        'pagination[pageSize]': '1',
    });
    return res?.data?.[0] || null;
}

export async function getStats(): Promise<Stat[]> {
    const res = await fetchAPI<{ data: Stat[] }>('/statistics', {
        'filters[category][$eq]': 'Health Impact',
        'sort': 'order:asc',
        'pagination[pageSize]': '4',
    });
    return res?.data || [];
}

export interface EmailContact {
    label: string;
    email: string;
}

export interface PhoneContact {
    label: string;
    phone: string;
}

export interface ContactPage {
    id: number;
    documentId: string;
    hero_title: string;
    hero_description: string;
    hero_image?: StrapiImage;
    office_name: string;
    address_line_1: string;
    address_line_2: string;
    address_line_3: string;
    address_line_4: string;
    address_line_5: string;
    email_contacts: EmailContact[];
    phone_contacts: PhoneContact[];
    office_hours: string;
    office_hours_note: string;
}

export async function getContactPage(): Promise<ContactPage | null> {
    const res = await fetchAPI<{ data: ContactPage }>('/contact-page', {
        'populate': 'hero_image',
    });
    return res?.data || null;
}

export interface PrivacyPolicy {
    id: number;
    documentId: string;
    title: string;
    last_updated?: string;
    body: string;
}

export async function getPrivacyPolicy(): Promise<PrivacyPolicy | null> {
    const res = await fetchAPI<{ data: PrivacyPolicy }>('/privacy-policy', {});
    return res?.data || null;
}

export type GovernanceOrgKey = 'NAFDAC' | 'SON' | 'FMOHSW' | 'FCCPC' | 'Industry' | 'Development Partners';

interface RawGovernanceRepresentative {
    id: number;
    documentId: string;
    name?: string;
    title?: string;
    organization_name: string;
    organization_short_name?: string;
    organization_key: GovernanceOrgKey;
    organization_logo?: StrapiImage;
    photo?: StrapiImage;
    bio?: string;
    organization_profile?: string;
    key_contributions?: { text: string }[];
    order: number;
    is_active: boolean;
    last_updated?: string;
}

export interface GovernanceRepresentative extends Omit<RawGovernanceRepresentative, 'key_contributions'> {
    key_contributions: string[];
}

export async function getGovernanceRepresentatives(): Promise<GovernanceRepresentative[]> {
    const res = await fetchAPI<{ data: RawGovernanceRepresentative[] }>('/governance-representatives', {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:asc',
        'populate[0]': 'photo',
        'populate[1]': 'key_contributions',
        'populate[2]': 'organization_logo',
        'pagination[pageSize]': '50',
    });
    return (res?.data || []).map((rep) => ({
        ...rep,
        key_contributions: (rep.key_contributions || []).map((b) => b.text),
    }));
}

export interface Laboratory {
    id: number;
    documentId: string;
    name: string;
    location: string;
    contact: string;
    email?: string;
    address?: string;
    services?: string;
    accreditation?: string;
    order: number;
}

export async function getLaboratories(): Promise<Laboratory[]> {
    const res = await fetchAPI<{ data: Laboratory[] }>('/laboratories', {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:asc',
        'pagination[pageSize]': '50',
    });
    return res?.data || [];
}

export interface MeetingSchedule {
    id: number;
    documentId: string;
    year: string;
    june_host: string;
    december_host: string;
    order: number;
}

export async function getMeetingSchedule(): Promise<MeetingSchedule[]> {
    const res = await fetchAPI<{ data: MeetingSchedule[] }>('/meeting-schedules', {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:asc',
        'pagination[pageSize]': '50',
    });
    return res?.data || [];
}

export interface ComplianceReport {
    id: number;
    documentId: string;
    year: string;
    national_compliance: string;
    salt_compliance?: string;
    veg_oil_compliance?: string;
    flour_compliance?: string;
    source?: string;
    order: number;
}

export async function getComplianceReports(): Promise<ComplianceReport[]> {
    const res = await fetchAPI<{ data: ComplianceReport[] }>('/compliance-reports', {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:desc',
        'pagination[pageSize]': '50',
    });
    return res?.data || [];
}

export interface Initiative {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    icon: string;
    description: string;
    objectives?: string;
    highlights?: { id: number; text: string }[];
    image?: { id: number; documentId: string; url: string };
    category: string;
    status: string;
    start_date?: string | null;
    order: number;
    updatedAt: string;
}

export async function getInitiatives(): Promise<Initiative[]> {
    const res = await fetchAPI<{ data: Initiative[] }>('/projects', {
        'filters[$or][0][is_active][$eq]': 'true',
        'filters[$or][1][is_active][$null]': 'true',
        'sort': 'order:asc',
        'populate[0]': 'highlights',
        'populate[1]': 'image',
        'pagination[pageSize]': '50',
    });
    return res?.data || [];
}

export async function getInitiativeBySlug(slug: string): Promise<Initiative | null> {
    const res = await fetchAPI<{ data: Initiative[] }>('/projects', {
        'filters[slug][$eq]': slug,
        'populate[0]': 'highlights',
        'populate[1]': 'image',
    });
    return res?.data?.[0] || null;
}

export async function getAllInitiatives(): Promise<Initiative[]> {
    const res = await fetchAPI<{ data: Initiative[] }>('/projects', {
        'sort': 'order:asc',
        'pagination[pageSize]': '100',
    });
    return res?.data || [];
}

export function isRecentlyUpdated(updatedAt: string | null | undefined, withinDays: number): boolean {
    if (!updatedAt) return false;
    return (Date.now() - new Date(updatedAt).getTime()) / 86_400_000 <= withinDays;
}

export interface IndustryChallenge {
    id: number;
    documentId: string;
    text: string;
    category: string;
    order: number;
}

export async function getIndustryChallenges(): Promise<IndustryChallenge[]> {
    const res = await fetchAPI<{ data: IndustryChallenge[] }>('/industry-challenges', {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:asc',
        'pagination[pageSize]': '50',
    });
    return res?.data || [];
}

export type GuidelineDocumentCategory = 'General' | 'Logistics' | 'Nutrition' | 'Reports' | 'Other';

export interface GuidelineDocument {
    id: number;
    documentId: string;
    title: string;
    description?: string;
    file?: StrapiImage;
    category: GuidelineDocumentCategory;
    published_date?: string;
    file_size?: string;
    is_featured: boolean;
}

export async function getGuidelineDocuments(): Promise<GuidelineDocument[]> {
    const res = await fetchAPI<{ data: GuidelineDocument[] }>('/guideline-documents', {
        'sort': 'published_date:desc',
        'populate[0]': 'file',
        'pagination[pageSize]': '50',
    });
    return res?.data || [];
}

export interface MemberOrganization {
    id: number;
    documentId: string;
    name: string;
    category: string;
    logo?: StrapiImage;
    order: number;
}

export async function getMemberOrganizations(): Promise<MemberOrganization[]> {
    const res = await fetchAPI<{ data: MemberOrganization[] }>('/member-organizations', {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:asc',
        'populate': 'logo',
        'pagination[pageSize]': '50',
    });
    return res?.data || [];
}
