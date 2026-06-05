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
        if (!res.ok) return null;
        const json = await res.json();
        return json;
    } catch {
        return null;
    }
}

export function getStrapiMediaUrl(url: string | null | undefined): string {
    if (!url) return '/placeholder.jpg';
    if (url.startsWith('http')) return url;
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
    category: 'news' | 'event' | 'announcement' | 'report';
    is_featured: boolean;
    tags?: string;
    publishedAt: string;
}

export interface GuidelineDocument {
    id: number;
    documentId: string;
    title: string;
    description?: string;
    file: StrapiImage;
    category: string;
    published_date?: string;
    is_featured: boolean;
}

export interface Partner {
    id: number;
    documentId: string;
    name: string;
    logo: StrapiImage;
    website_url?: string;
    description?: string;
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
    number: string;
    label: string;
    icon: string;
    order: number;
    is_active: boolean;
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
}

export interface FAQ {
    id: number;
    documentId: string;
    question: string;
    answer: string;
    category?: string;
    order: number;
    is_active: boolean;
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
        'populate': 'image,gallery',
        'pagination[page]': String(page),
        'pagination[pageSize]': String(pageSize),
    });
    return { data: res?.data || [], total: res?.meta?.pagination?.total || 0 };
}

export async function getFeaturedNews(): Promise<NewsEvent[]> {
    const featured = await fetchAPI<{ data: NewsEvent[] }>('/news-events', {
        'filters[is_featured][$eq]': 'true',
        'sort': 'date:desc',
        'populate': 'image,gallery',
        'pagination[pageSize]': '6',
    });

    if (featured?.data?.length) {
        return featured.data;
    }

    const latest = await fetchAPI<{ data: NewsEvent[] }>('/news-events', {
        'sort': 'date:desc',
        'populate': 'image,gallery',
        'pagination[pageSize]': '6',
    });

    return latest?.data || [];
}

export async function getNewsBySlug(slug: string): Promise<NewsEvent | null> {
    const res = await fetchAPI<{ data: NewsEvent[] }>('/news-events', {
        'filters[slug][$eq]': slug,
        'populate': 'image,gallery',
    });
    return res?.data?.[0] || null;
}

export async function getGuidelines(): Promise<GuidelineDocument[]> {
    const res = await fetchAPI<{ data: GuidelineDocument[] }>('/guideline-documents', {
        'sort': 'published_date:desc',
        'populate': 'file',
        'pagination[pageSize]': '50',
    });
    return res?.data || [];
}

export async function getPartners(): Promise<Partner[]> {
    const res = await fetchAPI<{ data: Partner[] }>('/partners', {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:asc',
        'populate': 'logo',
        'pagination[pageSize]': '20',
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
        'populate': 'hero_image',
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

export async function getFeaturedQuote(): Promise<Quote | null> {
    const res = await fetchAPI<{ data: Quote[] }>('/quotes', {
        'filters[is_active][$eq]': 'true',
        'populate': 'author_image',
        'pagination[pageSize]': '1',
    });
    return res?.data?.[0] || null;
}

export async function getStats(): Promise<Stat[]> {
    const res = await fetchAPI<{ data: Stat[] }>('/stats', {
        'filters[is_active][$eq]': 'true',
        'sort': 'order:asc',
        'pagination[pageSize]': '10',
    });
    return res?.data || [];
}

export interface PageSetting {
    id: number;
    documentId: string;
    page_key: string;
    hero_image?: StrapiImage;
    hero_title?: string;
    hero_description?: string;
}

export async function getPageSetting(pageKey: string): Promise<PageSetting | null> {
    const res = await fetchAPI<{ data: PageSetting[] }>('/page-settings', {
        'filters[page_key][$eq]': pageKey,
        'populate': 'hero_image',
    });
    return res?.data?.[0] || null;
}
