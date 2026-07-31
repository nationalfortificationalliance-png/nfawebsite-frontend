import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getPartners, getStrapiMediaUrl, type Partner } from '@/lib/api';
import PartnersDirectory, { type DisplayPartner } from '@/components/PartnersDirectory';

export const metadata: Metadata = {
    title: 'Partners',
    description: 'Meet the government, UN, private sector, and civil society partners driving food fortification across Nigeria.',
};
export const revalidate = 60;

const STATIC_PARTNERS: DisplayPartner[] = [
    // Government MDAs
    { id: 2, type: 'government', name: 'Federal Ministry of Health and Social Welfare', desc: 'Government policy owner of the national nutrition strategy, ensuring fortification aligns with Nigeria\'s public health and SDG commitments.', role: '', logo: '/Nigeria_Federal_Ministry_of_Health_Logo.png' },
    { id: 3, type: 'government', name: 'NAFDAC', desc: 'National Authority for Food & Drugs Control — the regulatory body responsible for certifying processors, conducting audits, and enforcing fortification standards.', role: '', logo: '/NAFDAC_emblem.png' },
    { id: 4, type: 'government', name: 'Standards Organisation of Nigeria', desc: 'Sets and enforces product quality benchmarks for fortified foods, ensuring compliance with Nigerian and international standards.', role: '', logo: '/son_png.png' },
    { id: 5, type: 'government', name: 'FCCPC', desc: 'Federal Competition and Consumer Protection Commission — ensuring consumer rights and quality at the household level.', role: '', logo: '/fccpc_logo.png' },
    { id: 6, type: 'government', name: 'Federal Ministry of Education', desc: 'Supports school feeding programs and nutrition education initiatives.', role: '', logo: 'building-2' },
    { id: 7, type: 'government', name: 'Federal Ministry of Industry, Trade and Investment', desc: 'Oversees industrial compliance and trade policy for fortified foods.', role: '', logo: 'factory' },
    { id: 8, type: 'government', name: 'Federal Ministry of Finance, Budget and National Planning', desc: 'Provides budgetary support and economic planning for nutrition programs.', role: '', logo: 'landmark' },
    { id: 9, type: 'government', name: 'Nigerian Customs Service', desc: 'Monitors import standards for premix and fortified food ingredients.', role: '', logo: 'shield' },
    { id: 10, type: 'government', name: 'National Primary Health Care Development Agency', desc: 'Implements community-level nutrition interventions.', role: '', logo: 'heart-pulse' },
    { id: 11, type: 'government', name: 'Federal Ministry of Agriculture and Food Security', desc: 'Coordinates agricultural value chains for fortified food commodities.', role: '', logo: 'globe' },
    { id: 12, type: 'government', name: 'Federal Ministry of Information and National Orientation', desc: 'Leads public awareness campaigns on fortified foods.', role: '', logo: 'megaphone' },

    // UN Agencies & Development Partners
    { id: 20, type: 'development-partner', name: 'UNICEF Nigeria', desc: 'Supports fortification interventions targeting child nutrition outcomes, providing technical assistance and advocacy aligned with child rights.', role: '', logo: '/UNICEF_Logo.png' },
    { id: 21, type: 'development-partner', name: 'WHO Nigeria', desc: 'Technical collaborator providing global evidence and WHO-aligned premix specifications for all six fortification vehicles.', role: '', logo: 'stethoscope' },
    { id: 22, type: 'development-partner', name: 'GAIN', desc: 'Global Alliance for Improved Nutrition supports premix supply chain strengthening, market assessments, and private sector engagement in Nigeria.', role: '', logo: '/GAIN_logo_RVB.webp' },
    { id: 23, type: 'development-partner', name: 'Helen Keller International', desc: 'Provides technical support for micronutrient programs and fortification monitoring.', role: '', logo: 'globe' },
    { id: 24, type: 'development-partner', name: 'TechnoServe', desc: 'Strengthens value chains and private sector capacity for fortified foods.', role: '', logo: 'handshake' },
    { id: 25, type: 'development-partner', name: 'Particle for Humanity', desc: 'Supports innovative fortification technologies and delivery systems.', role: '', logo: 'globe' },

    // Private Sector - Industry Stakeholders
    { id: 30, type: 'private-sector', name: 'Flour Millers', desc: 'Represents wheat flour producers implementing mandatory fortification standards.', role: '', logo: 'wheat' },
    { id: 31, type: 'private-sector', name: 'Vegetable Oil Producers', desc: 'Key stakeholders in edible oil fortification with Vitamin A.', role: '', logo: 'droplet' },
    { id: 32, type: 'private-sector', name: 'Sugar Producers', desc: 'Implements fortification standards for refined sugar products.', role: '', logo: 'box' },
    { id: 33, type: 'private-sector', name: 'Salt Producers', desc: 'Mandatory iodization of table salt for thyroid health.', role: '', logo: 'box' },
    { id: 35, type: 'private-sector', name: 'Premix Manufacturers, Blenders and Suppliers', desc: 'Produces vitamin and mineral premixes for food fortification.', role: '', logo: 'factory' },
    { id: 36, type: 'private-sector', name: 'Rice Millers', desc: 'Emerging partners in rice fortification initiatives.', role: '', logo: 'wheat' },
    { id: 37, type: 'private-sector', name: 'Bouillon Producers', desc: 'Fortification of bouillon cubes and seasoning products.', role: '', logo: 'box' },

    // Professional Bodies
    { id: 40, type: 'professional-body', name: 'Nutrition Society of Nigeria', desc: 'Professional body advancing nutrition science and fortification research.', role: '', logo: 'sparkles' },
    { id: 41, type: 'professional-body', name: 'Nigerian Institute of Food Science and Technology', desc: 'Technical expertise in food processing and fortification standards.', role: '', logo: 'microscope' },
    { id: 42, type: 'professional-body', name: 'Association of Food Beverage Tobacco Employees', desc: 'Labor union representing food industry workers.', role: '', logo: 'users' },

    // Academia, Media & Civil Society
    { id: 43, type: 'civil-society', name: 'Universities and Research Institutions', desc: 'Academic partners conducting fortification research and training.', role: '', logo: 'graduation-cap' },
    { id: 44, type: 'civil-society', name: 'Media Organizations', desc: 'Communication partners for fortification awareness campaigns.', role: '', logo: 'newspaper' },
    { id: 45, type: 'civil-society', name: 'Consumer Advocacy Groups', desc: 'Represent consumer interests in fortification policy and standards.', role: '', logo: 'users' },
];

export default async function PartnersPage() {
    const rawPartners = await getPartners();

    const resolvePartnerLogo = (partner: Partner) => {
        const logoUrl = partner.logo?.url?.trim();
        if (logoUrl) {
            if (logoUrl.startsWith('http')) return logoUrl;
            if (logoUrl.startsWith('/uploads')) return getStrapiMediaUrl(logoUrl);
            if (logoUrl.startsWith('/')) return logoUrl;
        }
        const staticMatch = STATIC_PARTNERS.find((sp) => sp.name.toLowerCase() === partner.name.toLowerCase());
        return staticMatch?.logo || 'building-2';
    };

    const displayPartners: DisplayPartner[] = rawPartners.length > 0
        ? rawPartners.map((p) => ({
            id: p.id,
            slug: p.slug,
            type: p.partner_type || 'partner',
            name: p.name,
            desc: p.description || '',
            role: p.role_in_alliance || '',
            logo: resolvePartnerLogo(p),
            websiteUrl: p.website_url,
            focusAreas: p.focus_areas,
            contactEmail: p.contact_email,
            contactPhone: p.contact_phone,
            memberOrganizations: (p.member_organizations || []).map((m) => ({
                id: m.id,
                name: m.name,
                websiteUrl: m.website_url,
            })),
        }))
        : STATIC_PARTNERS;

    const totalPartners = displayPartners.length;

    return (
        <>
            <style>{`
        /* Hero with Image - consistent with other pages */
        .partners-hero {
          position: relative;
          min-height: 340px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .partners-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .partners-hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0, 82, 73, 0.72) 0%, rgba(6, 78, 59, 0.65) 100%);
          z-index: 1;
        }
        .partners-hero-content {
          position: relative;
          z-index: 2;
          padding: 3.5rem 0 2.75rem;
        }
        .partners-hero h1 {
          color: #fff;
          max-width: 720px;
          margin-bottom: 1rem;
          text-shadow: 0 2px 10px rgba(0,0,0,0.35);
        }
        .partners-hero p {
          color: rgba(255,255,255,0.97);
          max-width: 720px;
          font-size: 1.15rem;
          line-height: 1.7;
          text-shadow: 0 1px 6px rgba(0,0,0,0.3);
        }
        .partners-hero-count {
          margin-top: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.1rem;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: var(--radius-full);
          backdrop-filter: blur(4px);
          color: #fff;
          font-size: 0.92rem;
          font-weight: 600;
          max-width: 720px;
        }
        .partners-hero-count strong {
          font-size: 1.05rem;
          font-weight: 800;
        }
        .partners-hero .breadcrumb {
          margin-bottom: 2rem;
          padding: 0.4rem 0.9rem;
          background: rgba(0,0,0,0.28);
          border-radius: 100px;
          display: inline-flex;
          backdrop-filter: blur(4px);
        }
        .partners-hero .breadcrumb a,
        .partners-hero .breadcrumb span {
          color: rgba(255,255,255,0.85);
          font-weight: 600;
        }
        .partners-hero .breadcrumb a:hover {
          color: #fff;
        }

        /* Quick stats */
        .partner-stats { display: grid; grid-template-columns: repeat(6, 1fr); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: #fff; }
        .partner-stat {
          padding: 1.75rem 1rem; text-align: center; border-right: 1px solid var(--border);
          background: none; border-top: none; border-bottom: none; border-left: none; cursor: pointer;
          transition: background-color .2s;
        }
        .partner-stat:hover { background: var(--bg-off); }
        .partner-stat:focus-visible { outline: 2px solid var(--wfp-blue); outline-offset: -2px; }
        .partner-stat:last-child { border-right: none; }
        .partner-stat-total { background: var(--wfp-blue-light); }
        .partner-stat-total:hover { background: var(--wfp-blue-light); filter: brightness(0.97); }
        .partner-stat-total .partner-stat-num { color: var(--wfp-blue); }
        .partner-stat-num { font-size: 2.25rem; font-weight: 900; color: var(--wfp-blue); letter-spacing: -0.04em; line-height: 1; }
        .partner-stat-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-muted); font-weight: 600; margin-top: 0.3rem; }

        /* Toolbar */
        .partner-toolbar { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; }
        .partner-search-box { position: relative; flex: 1; min-width: 240px; }
        .partner-search-icon {
          position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%);
          color: var(--text-muted); pointer-events: none;
        }
        .partner-search-input {
          width: 100%; padding: 0.75rem 1rem 0.75rem 2.6rem; font-size: 0.95rem;
          font-family: inherit; color: var(--text-primary);
          background: #fff; border: 1.5px solid var(--border); border-radius: var(--radius-full);
          transition: border-color .2s, box-shadow .2s;
        }
        .partner-search-input:focus { outline: none; border-color: var(--wfp-blue); box-shadow: 0 0 0 4px var(--wfp-blue-light); }
        .partner-type-select {
          padding: 0.75rem 2.25rem 0.75rem 1.1rem; font-size: 0.92rem; font-weight: 600;
          font-family: inherit; color: var(--text-primary);
          background-color: #fff; border: 1.5px solid var(--border); border-radius: var(--radius-full);
          cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 0.85rem center;
        }
        .partner-type-select:focus { outline: none; border-color: var(--wfp-blue); box-shadow: 0 0 0 4px var(--wfp-blue-light); }
        .partner-result-count { font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1rem; }
        .partner-no-results { text-align: center; padding: 3rem 1rem; color: var(--text-secondary); }

        /* Partner category / accordion */
        .partner-category { margin-bottom: 1.25rem; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
        .partner-category-header {
          width: 100%; display: flex; align-items: center; gap: 0.75rem;
          padding: 1.25rem 1.5rem; background: #fff; border: none; cursor: pointer; text-align: left;
        }
        .partner-category-header:hover { background: var(--bg-off); }
        .partner-category-header:focus-visible { outline: 2px solid var(--wfp-blue); outline-offset: -2px; }
        .partner-type-badge { padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; }
        .partner-group-count { font-size: 0.82rem; color: var(--text-muted); font-weight: 500; }
        .partner-category-chevron { margin-left: auto; color: var(--text-secondary); transition: transform .25s; flex-shrink: 0; }
        .partner-category-header[aria-expanded="true"] .partner-category-chevron { transform: rotate(180deg); }
        .partner-category-blurb { padding: 0 1.5rem 1.25rem; margin: 0; color: var(--text-secondary); font-size: 0.88rem; line-height: 1.65; max-width: 720px; }
        .partner-grid { padding: 0 1.5rem 1.5rem; }

        /* Partner cards */
        .partner-card {
          background: #fff; border: 1px solid var(--border-light); border-radius: var(--radius-md);
          padding: 1.75rem; display: flex; gap: 1.25rem; align-items: flex-start;
          transition: all .25s var(--ease-out); position: relative;
        }
        .partner-card.is-clickable { cursor: pointer; }
        .partner-card.is-clickable:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: var(--wfp-blue-light); }
        .partner-card:not(.is-clickable):hover { box-shadow: var(--shadow-sm); border-color: var(--border); }
        .partner-logo { width: 64px; height: 64px; border-radius: 8px; background: transparent; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; flex-shrink: 0; position: relative; overflow: hidden; }
        .partner-info { flex: 1; min-width: 0; }
        .partner-type-tag { display: inline-block; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.15rem 0.55rem; border-radius: var(--radius-full); margin-bottom: 0.4rem; }
        .partner-name { font-size: 1rem; font-weight: 700; margin-bottom: 0.3rem; color: var(--text-primary); }
        .partner-role { font-size: 0.82rem; font-weight: 600; color: var(--wfp-blue); margin-bottom: 0.35rem; }
        .partner-desc { font-size: 0.83rem; color: var(--text-muted); line-height: 1.65; }
        .partner-visit { display: inline-flex; align-items: center; gap: 0.3rem; margin-top: 0.6rem; font-size: 0.8rem; font-weight: 600; color: var(--wfp-blue); }

        /* Become a partner */
        .become-section { background: var(--wfp-blue); padding: 3.5rem 0; }
        .become-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
        .become-section h2 { color: #fff; }
        .become-section p { color: rgba(255,255,255,.75); font-size: 1rem; line-height: 1.75; margin-top: 0.75rem; }
        .become-items { display: flex; flex-direction: column; gap: 1rem; }
        .become-item { display: flex; align-items: flex-start; gap: 1rem; color: rgba(255,255,255,.8); font-size: 0.9rem; }
        .become-item-icon { font-size: 1.25rem; flex-shrink: 0; margin-top: 0.1rem; }

        @media (max-width: 900px) {
          .partners-hero {
            height: 60vh;
            min-height: 500px;
          }
          .partners-hero h1 {
            font-size: 2rem;
          }
          .partners-hero p {
            font-size: 1rem;
          }
          .partner-stats { grid-template-columns: repeat(3, 1fr); }
          .become-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .partner-stats { grid-template-columns: repeat(2, 1fr); }
          .partner-toolbar { flex-direction: column; }
        }
      `}</style>

            {/* ── Hero ── */}
            <div className="partners-hero">
                <div className="partners-hero-bg">
                    <Image src="/about-hero.jpg" alt="Partnership meeting" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
                </div>
                <div className="container partners-hero-content">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span>Partners</span>
                    </div>
                    <h1>Our Partners</h1>
                    <p>Government agencies, UN bodies, private sector, and donors — united by a single mission to eliminate micronutrient malnutrition in Nigeria.</p>
                    <div className="partners-hero-count">
                        <strong>{totalPartners}</strong> Partner Organizations across Government, Industry, Professional Bodies, Academia, Civil Society, and Development Partners
                    </div>
                </div>
            </div>

            <PartnersDirectory partners={displayPartners} />
        </>
    );
}
