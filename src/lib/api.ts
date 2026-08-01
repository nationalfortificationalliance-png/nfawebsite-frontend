import { MOCK_NEWS } from './mockData';
import { FALLBACK_FAQS } from './faq-data';

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
    size?: number;
    mime?: string;
    ext?: string;
}

export function formatFileSize(sizeInKb: number | null | undefined): string | null {
    if (!sizeInKb) return null;
    if (sizeInKb < 1024) return `${Math.round(sizeInKb)} KB`;
    return `${(sizeInKb / 1024).toFixed(1)} MB`;
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

export interface PartnerMemberOrganization {
    id: number;
    name: string;
    website_url?: string;
}

export interface Partner {
    id: number;
    documentId: string;
    name: string;
    slug?: string;
    logo: StrapiImage;
    website_url?: string;
    description?: string;
    role_in_alliance?: string;
    focus_areas?: string;
    contact_email?: string;
    contact_phone?: string;
    member_organizations?: PartnerMemberOrganization[];
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

    return latest?.data?.length ? latest.data : MOCK_NEWS;
}

export async function getNewsBySlug(slug: string): Promise<NewsEvent | null> {
    const res = await fetchAPI<{ data: NewsEvent[] }>('/news-events', {
        'filters[slug][$eq]': slug,
        'populate[0]': 'image',
        'populate[1]': 'gallery',
        'populate[2]': 'file',
    });
    return res?.data?.[0] || MOCK_NEWS.find((a) => a.slug === slug) || null;
}

export async function getPartners(): Promise<Partner[]> {
    const res = await fetchAPI<{ data: Partner[] }>('/partners', {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:asc',
        'populate[0]': 'logo',
        'populate[1]': 'member_organizations',
        'pagination[pageSize]': '100',
    });
    return res?.data || [];
}

export async function getPartnerBySlug(slug: string): Promise<Partner | null> {
    const res = await fetchAPI<{ data: Partner[] }>('/partners', {
        'filters[slug][$eq]': slug,
        'populate[0]': 'logo',
        'populate[1]': 'member_organizations',
    });
    return res?.data?.[0] || null;
}

export async function getAllPartnerSlugs(): Promise<string[]> {
    const res = await fetchAPI<{ data: Partner[] }>('/partners', {
        'filters[is_active][$eq]': 'true',
        'pagination[pageSize]': '100',
    });
    return (res?.data || []).map((p) => p.slug).filter((s): s is string => !!s);
}

// Fallback data with the generated images — used only when the Secretariat
// category is requested and the CMS has no team members configured yet.
export const SECRETARIAT_FALLBACK: TeamMember[] = [
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
        role: 'Assistant Chief Regulatory Officer/Program Officer',
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
        role: 'Assistant Chief Regulatory Officer/Program Officer',
        organization: 'NAFDAC',
        category: 'Secretariat',
        image: { id: 0, documentId: '', url: '/team-3.png' },
        phone: '08065217543',
        email: 'wandoo.haanya@nafdac.gov.ng',
        order: 3
    }
];

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
    if (res?.data?.length) return res.data;
    return category === 'Secretariat' ? SECRETARIAT_FALLBACK : [];
}

const TIMELINE_FALLBACK: AboutTimelineItem[] = [
    { id: 1, year: '2004', event: 'Nigeria enacts the Food, Drugs and Related Products (Fortification) Regulation, making fortification mandatory for key staple foods.' },
    { id: 2, year: '2011', event: 'WFP Nigeria launches the National Fortification Alliance with NAFDAC to strengthen enforcement and processor capacity across 6 key food vehicles.' },
    { id: 3, year: '2016', event: 'Coverage of Vitamin A-fortified vegetable oil reaches 70% of households. NFA introduces the national quality mark seal for certified products.' },
    { id: 4, year: '2020', event: 'NFA expands to include Maize Flour and Wheat Flour in NAFDAC\'s mass fortification mandate. Premix fund established for small processors.' },
    { id: 5, year: '2024', event: 'Over 200 processors certified across 36 states, reaching 12M+ consumers. NFA achieves 68% household coverage of fortified staple foods.' },
];

export async function getAboutPage(): Promise<AboutPage | null> {
    const res = await fetchAPI<{ data: AboutPage }>('/about-page', {
        'populate[hero_image][populate]': '*',
        'populate[timeline_items][populate]': '*',
    });
    const about = res?.data || null;
    if (about && !about.timeline_items?.length) {
        about.timeline_items = TIMELINE_FALLBACK;
    }
    return about;
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
    if (res?.data?.length) return res.data;
    return category ? [] : FALLBACK_FAQS;
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
    latitude?: number;
    longitude?: number;
}

const LABS_FALLBACK: Laboratory[] = [
    { id: 1, documentId: '1', name: 'Saag Chemicals', location: 'Lagos', contact: '08025589200', order: 1, latitude: 6.5244, longitude: 3.3792 },
    { id: 2, documentId: '2', name: 'Remaben Scientific Services Ltd', location: 'Ikeja', contact: '08023037743', order: 2, latitude: 6.6018, longitude: 3.3515 },
    { id: 3, documentId: '3', name: 'Bato Chemical Labs Ltd', location: 'Ogun State', contact: '08091972222', order: 3, latitude: 7.1475, longitude: 3.3619 },
    { id: 4, documentId: '4', name: 'Jawura Environmental Services Ltd', location: 'Lagos', contact: '09058592802', order: 4, latitude: 6.5300, longitude: 3.3850 },
    { id: 5, documentId: '5', name: 'LS Scientific Limited', location: 'Ikeja', contact: '08094709004', order: 5, latitude: 6.6080, longitude: 3.3570 },
    { id: 6, documentId: '6', name: 'Alfa Laboratories', location: 'Lagos', contact: '08023093103', order: 6, latitude: 6.5180, longitude: 3.3700 },
    { id: 7, documentId: '7', name: 'Katchey Laboratory', location: 'Ikeja', contact: '08036209410', order: 7, latitude: 6.5960, longitude: 3.3460 },
    { id: 8, documentId: '8', name: 'Bureau Veritas Nigeria Ltd', location: 'Ogun State', contact: '08095559245', order: 8, latitude: 7.1530, longitude: 3.3700 },
];

export async function getLaboratories(): Promise<Laboratory[]> {
    const res = await fetchAPI<{ data: Laboratory[] }>('/laboratories', {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:asc',
        'pagination[pageSize]': '50',
    });
    return res?.data?.length ? res.data : LABS_FALLBACK;
}

export interface MeetingSchedule {
    id: number;
    documentId: string;
    year: string;
    june_host: string;
    december_host: string;
    order: number;
}

const MEETINGS_FALLBACK: MeetingSchedule[] = [
    { id: 1, documentId: '1', year: '2026', june_host: 'NAFDAC', december_host: 'Industry', order: 1 },
    { id: 2, documentId: '2', year: '2027', june_host: 'SON', december_host: 'FCCPC', order: 2 },
    { id: 3, documentId: '3', year: '2028', june_host: 'FMoHSW', december_host: 'NAFDAC', order: 3 },
];

export async function getMeetingSchedule(): Promise<MeetingSchedule[]> {
    const res = await fetchAPI<{ data: MeetingSchedule[] }>('/meeting-schedules', {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:asc',
        'pagination[pageSize]': '50',
    });
    return res?.data?.length ? res.data : MEETINGS_FALLBACK;
}

export interface ComplianceReport {
    id: number;
    documentId: string;
    year: string;
    national_compliance: string;
    salt_compliance?: string;
    veg_oil_compliance?: string;
    flour_compliance?: string;
    sugar_compliance?: string;
    rice_compliance?: string;
    bouillon_compliance?: string;
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

export type ReportAgency = 'NAFDAC' | 'SON' | 'FCCPC' | 'FMoH&SW' | 'NFA Secretariat' | 'Development Partners';
export type ReportType =
    | 'Annual Report'
    | 'Quarterly Report'
    | 'Compliance Report'
    | 'Surveillance Report'
    | 'Laboratory Report'
    | 'Evaluation Report'
    | 'Policy Brief';

export interface Report {
    id: number;
    documentId: string;
    title: string;
    description?: string;
    file?: StrapiImage;
    year: string;
    agency: ReportAgency;
    report_type: ReportType;
    food_vehicles?: string;
    topics?: string;
    published_date?: string;
    file_size?: string;
    is_featured: boolean;
    download_count: number;
    order: number;
}

export async function getReports(): Promise<Report[]> {
    const res = await fetchAPI<{ data: Report[] }>('/reports', {
        'sort': 'published_date:desc',
        'populate': 'file',
        'pagination[pageSize]': '200',
    });
    return res?.data || [];
}

export interface Initiative {
    id: number;
    documentId: string;
    title: string;
    slug?: string;
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

const INITIATIVES_FALLBACK: Initiative[] = [
    {
        id: 1, documentId: 'fallback-1', title: 'Rice Fortification', icon: 'trending-up',
        description: 'Partnering with millers, regulators and distributors to make fortified rice more available, affordable and trusted across Nigeria.',
        highlights: [
            { id: 1, text: 'Scale fortified rice production and distribution' },
            { id: 2, text: 'Strengthen regulatory compliance and lab checks' },
            { id: 3, text: 'Support premix market development' },
            { id: 4, text: 'Build industry and laboratory capacity' },
            { id: 5, text: 'Raise consumer awareness and demand' },
        ],
        category: 'General', status: 'Active', order: 1, updatedAt: '',
    },
    {
        id: 2, documentId: 'fallback-2', title: 'Bouillon Fortification', icon: 'search',
        description: 'Evaluating bouillon cubes as a strategic fortification vehicle while balancing nutrition benefit and sodium reduction priorities.',
        highlights: [
            { id: 1, text: 'Conduct nutrient profiling and taste studies' },
            { id: 2, text: 'Assess iodine and sodium impacts' },
            { id: 3, text: 'Analyze consumer behavior' },
            { id: 4, text: 'Develop draft standards and codes of practice' },
            { id: 5, text: 'Coordinate industry engagement' },
        ],
        category: 'General', status: 'Active', order: 2, updatedAt: '',
    },
    {
        id: 3, documentId: 'fallback-3', title: 'DFQT+ Digital Monitoring', icon: 'activity',
        description: 'Deploying digital traceability and quality monitoring systems that help regulators and producers track fortified products in near real time.',
        highlights: [
            { id: 1, text: 'Support digital compliance workflows' },
            { id: 2, text: 'Chart premix and product traceability' },
            { id: 3, text: 'Improve audit efficiency' },
            { id: 4, text: 'Drive informed enforcement' },
            { id: 5, text: 'Strengthen governance and transparency' },
        ],
        category: 'General', status: 'Active', order: 3, updatedAt: '',
    },
];

export async function getInitiatives(): Promise<Initiative[]> {
    const res = await fetchAPI<{ data: Initiative[] }>('/projects', {
        'filters[$or][0][is_active][$eq]': 'true',
        'filters[$or][1][is_active][$null]': 'true',
        'sort': 'order:asc',
        'populate[0]': 'highlights',
        'populate[1]': 'image',
        'pagination[pageSize]': '50',
    });
    return res?.data?.length ? res.data : INITIATIVES_FALLBACK;
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

const CHALLENGES_FALLBACK: IndustryChallenge[] = [
    { text: 'Scarcity of Vitamin A Palmitate', category: 'Supply Chain' },
    { text: 'Foreign exchange constraints affecting premix supply', category: 'Supply Chain' },
    { text: 'Technical limitations in fortification equipment', category: 'Technical & Equipment' },
    { text: 'Challenges with shelf-life stability studies', category: 'Technical & Equipment' },
    { text: 'Technical capacity gaps in micronutrient testing', category: 'Technical & Equipment' },
    { text: 'Inconsistencies in laboratory analytical results', category: 'Quality & Compliance' },
    { text: 'Packaging and storage limitations', category: 'Quality & Compliance' },
    { text: 'Informal retail packaging challenges', category: 'Quality & Compliance' },
    { text: 'Inconsistent customs tariff implementation', category: 'Regulatory & Customs' },
    { text: 'Inadequate monitoring of imported products', category: 'Regulatory & Customs' },
].map((c, i) => ({ id: i + 1, documentId: String(i + 1), text: c.text, category: c.category, order: i + 1 }));

export async function getIndustryChallenges(): Promise<IndustryChallenge[]> {
    const res = await fetchAPI<{ data: IndustryChallenge[] }>('/industry-challenges', {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:asc',
        'pagination[pageSize]': '50',
    });
    return res?.data?.length ? res.data : CHALLENGES_FALLBACK;
}

export type GuidelineDocumentCategory = 'General' | 'Logistics' | 'Nutrition' | 'Reports' | 'Other';
export type GuidelineDocumentType = 'Guideline' | 'Standard' | 'Regulation' | 'Manual' | 'SOP' | 'Technical Note' | 'Policy Document';
export type GuidelineDocumentStatus = 'Current' | 'Revised' | 'Archived';

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
    document_type?: GuidelineDocumentType;
    food_vehicles?: string;
    agency?: ReportAgency;
    status?: GuidelineDocumentStatus;
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

const MEMBER_LOGO_FALLBACK: Record<string, string> = {
    'Standards Organisation of Nigeria (SON)': '/son_png.png',
    'National Agency for Food and Drug Administration and Control (NAFDAC)': '/NAFDAC_emblem.png',
    'Federal Competition and Consumer Protection Commission (FCCPC)': '/fccpc_logo.png',
    'Federal Ministry of Health and Social Welfare (FMoHSW) — Nutrition Department': '/Nigeria_Federal_Ministry_of_Health_Logo.png',
};

const MEMBERS_FALLBACK: MemberOrganization[] = [
    { name: 'Standards Organisation of Nigeria (SON)', category: 'Core Members' },
    { name: 'National Agency for Food and Drug Administration and Control (NAFDAC)', category: 'Core Members' },
    { name: 'Federal Ministry of Education (FME)', category: 'Core Members' },
    { name: 'Federal Competition and Consumer Protection Commission (FCCPC)', category: 'Core Members' },
    { name: 'Federal Ministry of Health and Social Welfare (FMoHSW) — Nutrition Department', category: 'Core Members' },
    { name: 'Federal Ministry of Agriculture and Food Security (FMAFS)', category: 'Core Members' },
    { name: 'Federal Ministry of Budget and Economic Planning (FMBEP)', category: 'Core Members' },
    { name: 'Institute of Public Analysts of Nigeria (IPAN)', category: 'Core Members' },
    { name: 'Federal Ministry of Information and National Orientation (FMINO)', category: 'Core Members' },
    { name: 'Industry', category: 'Core Members' },
    { name: 'Development Partners (GAIN, HKI, TechnoServe, WFP, UNICEF, etc.)', category: 'Stakeholders' },
    { name: 'Academia', category: 'Stakeholders' },
    { name: 'Professional Associations (e.g., NIFST, NSN)', category: 'Stakeholders' },
    { name: 'Civil Society Organisations (CSOs) / Non-Governmental Organisations (NGOs)', category: 'Stakeholders' },
    { name: 'Media', category: 'Stakeholders' },
].map((m, i) => ({
    id: i + 1,
    documentId: String(i + 1),
    order: i + 1,
    ...m,
    ...(MEMBER_LOGO_FALLBACK[m.name] ? { logo: { id: 0, documentId: '', url: MEMBER_LOGO_FALLBACK[m.name] } } : {}),
}));

export async function getMemberOrganizations(): Promise<MemberOrganization[]> {
    const res = await fetchAPI<{ data: MemberOrganization[] }>('/member-organizations', {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:asc',
        'populate': 'logo',
        'pagination[pageSize]': '50',
    });
    return res?.data?.length ? res.data : MEMBERS_FALLBACK;
}
