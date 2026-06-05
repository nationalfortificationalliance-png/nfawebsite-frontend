import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';
import NewsCard from '@/components/NewsCard';
import NewsCarousel from '@/components/NewsCarousel';
import { getCarousels, getFeaturedNews, getFeaturedQuote, getStats, getStrapiMediaUrl, getPartners, type Partner } from '@/lib/api';
import {
  AnimatedStats,
  AnimatedCoreFunctions,
  AnimatedAchievements,
  AnimatedSectionWrapper,
  AnimatedNewsGrid
} from '@/components/HomePageClient';

export const metadata: Metadata = {
  title: 'National Fortification Alliance – Nourishing Nigeria',
  description: 'NFA coordinates food fortification in Nigeria to eliminate micronutrient malnutrition.',
};
export const revalidate = 60;

import Icon, { IconName } from '@/components/Icon';

const STATS: { number: string; label: string; icon: IconName }[] = [
  { number: '37%', label: 'Child Stunting Rate', icon: 'shield' },
  { number: '30%', label: 'Vitamin A Deficiency in Children', icon: 'heart-handshake' },
  { number: '60-70%', label: 'Anaemia in Women of Reproductive Age', icon: 'activity' },
  { number: '95%', label: 'Calcium Inadequacy in Non-Pregnant Women', icon: 'trending-up' },
];

const CORE_FUNCTIONS: { icon: IconName; title: string; desc: string }[] = [
  { icon: 'handshake', title: 'Coordination', desc: 'Serving as the primary forum for government, industry, and partners to align on nutrition goals.' },
  { icon: 'scale', title: 'Regulatory Advocacy', desc: 'Pushing for enforcement of mandatory fortification for wheat flour, oil, sugar, and salt.' },
  { icon: 'microscope', title: 'Capacity Building', desc: 'Strengthening national laboratory capacity for accurate and harmonised micronutrient testing.' },
  { icon: 'search', title: 'Monitoring', desc: 'Overseeing adoption of digital tools like DFQT+ to track fortification compliance in real-time.' },
];

const ACHIEVEMENTS: { num: string; title: string; desc: string }[] = [
  { num: '01', title: 'Digital Transformation', desc: 'Launched the DFQT+ pilot for edible oils in April 2024 replacing manual reporting with real-time data.' },
  { num: '02', title: 'Recognition Excellence', desc: 'Held the 4th Micronutrient Fortification Index Awards honoring high-performing processors.' },
  { num: '03', title: 'Policy Advancement', desc: 'Initiated the expansion of mandatory fortification to rice and bouillon cubes for rural reach.' },
  { num: '04', title: 'Lab Audit', desc: 'Commissioned IPAN to conduct a full audit of all eight approved micronutrient laboratories.' },
];

const ECONOMIC_CASE: { icon: IconName; title: string; desc: string; link: string; cta: string }[] = [
  { icon: 'bar-chart', title: 'Productivity', desc: 'Malnutrition costs Nigeria approximately $1.5 billion annually in lost GDP due to poor health and cognitive development.', link: '/about', cta: 'Read the Report →' },
  { icon: 'gem', title: 'Efficiency', desc: 'Fortification is one of the most cost-effective health interventions, with an estimated cost of only $0.01–$0.25 per person per year.', link: '/about', cta: 'Learn About Impact →' },
];

const PARTNER_LOGOS = [
  { name: 'WFP Nigeria', src: '/wfp-logo-standard-blue-en.svg', width: 340, height: 150 },
  { name: 'NAFDAC', src: '/NAFDAC_emblem.png', width: 220, height: 180 },
  { name: 'UNICEF Nigeria', src: '/UNICEF_Logo.png', width: 310, height: 130 },
  { name: 'Federal Ministry of Health', src: '/Nigeria_Federal_Ministry_of_Health_Logo.png', width: 340, height: 180 },
  { name: 'Standards Organisation of Nigeria (SON)', src: '/son_png.png', width: 260, height: 120 },
  { name: 'GAIN', src: '/GAIN_logo_RVB.webp', width: 300, height: 140 },
  { name: 'FCCPC', src: '/fccpc_logo.png', width: 260, height: 120 },
];

const HOMEPAGE_FALLBACK_LOGOS = [
  { src: '/son_png.png', width: 260, height: 120 },
  { src: '/UNICEF_Logo.png', width: 310, height: 130 },
  { src: '/NAFDAC_emblem.png', width: 220, height: 180 },
  { src: '/Nigeria_Federal_Ministry_of_Health_Logo.png', width: 340, height: 180 },
  { src: '/GAIN_logo_RVB.webp', width: 300, height: 140 },
  { src: '/fccpc_logo.png', width: 260, height: 120 },
];

const LOCAL_PARTNER_LOGO_MAP = new Map(PARTNER_LOGOS.map((partner) => [partner.name.toLowerCase(), partner]));

function resolvePartnerLogo(partner: Partner) {
  const logoUrl = partner.logo?.url?.trim();
  if (logoUrl) {
    if (logoUrl.startsWith('http')) {
      return { src: logoUrl, width: partner.logo.width || 220, height: partner.logo.height || 120 };
    }
    if (logoUrl.startsWith('/uploads')) {
      return { src: getStrapiMediaUrl(logoUrl), width: partner.logo.width || 220, height: partner.logo.height || 120 };
    }
    return { src: logoUrl, width: partner.logo.width || 220, height: partner.logo.height || 120 };
  }

  const fallback = LOCAL_PARTNER_LOGO_MAP.get(partner.name.toLowerCase());
  if (fallback) {
    return { src: fallback.src, width: fallback.width, height: fallback.height };
  }

  return { src: '/wfp-logo-standard-blue-en.svg', width: 280, height: 120 };
}

const HOMEPAGE_FALLBACK_PARTNERS: Partner[] = HOMEPAGE_FALLBACK_LOGOS.map((logo, index) => ({
  id: index + 1,
  documentId: `homepage-fallback-partner-${index + 1}`,
  name: `Homepage Fallback ${index + 1}`,
  logo: {
    id: 0,
    documentId: '',
    url: logo.src,
    width: logo.width,
    height: logo.height,
  },
  order: index,
  is_active: true,
  partner_type: 'partner',
}));

// Fallback mock news data - using actual local images
const MOCK_NEWS = [
  {
    id: 1,
    documentId: 'mock-1',
    title: 'NFA Launches Digital Monitoring System for Food Fortification',
    excerpt: 'Revolutionary DFQT+ platform goes live to track fortification compliance across Nigeria in real-time.',
    slug: 'nfa-launches-digital-monitoring',
    publishedAt: new Date().toISOString(),
    date: new Date().toISOString(),
    image: {
      id: 1,
      documentId: 'img-1',
      url: 'http://localhost:3000/hero-1.png', // Full URL to bypass Strapi prepending
      alternativeText: 'Digital Monitoring System'
    },
    category: 'Technology',
    is_featured: true,
  },
  {
    id: 2,
    documentId: 'mock-2',
    title: 'Nigeria Records 40% Increase in Fortified Food Production',
    excerpt: 'New report shows significant progress in national food fortification program with over 200 certified processors.',
    slug: 'nigeria-fortified-food-increase',
    publishedAt: new Date().toISOString(),
    date: new Date().toISOString(),
    image: {
      id: 2,
      documentId: 'img-2',
      url: 'http://localhost:3000/factory.png',
      alternativeText: 'Food Processing Factory'
    },
    category: 'Impact',
    is_featured: true,
  },
  {
    id: 3,
    documentId: 'mock-3',
    title: 'WFP and NAFDAC Partner for Enhanced Laboratory Capacity',
    excerpt: 'Strategic partnership aims to strengthen micronutrient testing capabilities across all 36 states.',
    slug: 'wfp-nafdac-partnership',
    publishedAt: new Date().toISOString(),
    date: new Date().toISOString(),
    image: {
      id: 3,
      documentId: 'img-3',
      url: 'http://localhost:3000/hero-3.png',
      alternativeText: 'WFP Partnership'
    },
    category: 'Partnership',
    is_featured: true,
  },
] as any[];

export default async function HomePage() {
  const [carousels, featuredNews, quoteData, statsData, partnersData] = await Promise.all([
    getCarousels(), getFeaturedNews(), getFeaturedQuote(), getStats(), getPartners(),
  ]);

  // Use mock data if no news from backend
  const displayNews = featuredNews.length > 0 ? featuredNews : MOCK_NEWS;

  // Only include partners from API that actually have logos
  const partnersWithLogos = partnersData.filter((partner) => {
    const logoUrl = partner.logo?.url?.trim();
    return logoUrl && logoUrl.length > 0;
  });

  const existingPartnerLogoUrls = new Set(
    partnersWithLogos.map((partner) => resolvePartnerLogo(partner).src.toLowerCase())
  );

  const partnerFallbacks = HOMEPAGE_FALLBACK_PARTNERS.filter((fallback) =>
    !existingPartnerLogoUrls.has(fallback.logo.url.toLowerCase())
  );

  const marqueePartners = partnersWithLogos.length > 0
    ? [...partnersWithLogos, ...partnerFallbacks]
    : HOMEPAGE_FALLBACK_PARTNERS;

  // Fallback quote data
  const quote = quoteData || {
    text: 'Fortification is not charity — it is a cost-effective investment in Nigeria\'s human capital. Every naira spent on fortification returns exponential value in child development, workforce productivity, and national health savings.',
    author_name: 'David Stevenson',
    author_title: 'WFP Nigeria Country Director',
    author_organization: 'World Food Programme Nigeria',
    author_image: { id: 0, documentId: '', url: 'http://localhost:3000/team-1.png' }
  };

  // Fallback stats data
  const displayStats = statsData.length > 0
    ? statsData.map(s => ({ number: s.number, label: s.label, icon: s.icon as IconName }))
    : STATS;

  return (
    <>
      <style>{`
        /* ── Stats ── ALIGNED TO MATERIAL DESIGN */
        .stats-strip { background: var(--md-sys-color-surface); border-bottom: 1px solid var(--md-sys-color-outline-variant); }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
        .stat-item { padding: var(--md-sys-spacing-8) var(--md-sys-spacing-6); text-align: center; border-right: 1px solid var(--md-sys-color-outline-variant); }
        .stat-item:last-child { border-right: none; }
        .stat-icon { font-size: var(--md-sys-typescale-title-large-size); margin-bottom: var(--md-sys-spacing-2); }
        .stat-number { font-size: clamp(var(--md-sys-typescale-headline-large-size), 4vw, var(--md-sys-typescale-display-small-size)); font-weight: 800; color: var(--md-sys-color-secondary); letter-spacing: -0.04em; line-height: 1; margin-bottom: var(--md-sys-spacing-1); }
        .stat-label { font-size: var(--md-sys-typescale-label-small-size); text-transform: uppercase; letter-spacing: 0.08em; color: var(--md-sys-color-on-surface-variant); font-weight: 600; }

        /* ── Latest News Carousel ── */
        .news-carousel-section { background: #fff; padding: var(--md-sys-spacing-24) 0; }
        .news-carousel-heading { display: flex; justify-content: space-between; align-items: flex-end; gap: 1.5rem; margin-bottom: var(--md-sys-spacing-12); flex-wrap: wrap; }
        .news-carousel-heading .section-eyebrow { margin-bottom: 0.25rem; }
        .news-carousel-heading p { max-width: 30rem; color: var(--text-secondary); margin: 0; }
        .news-carousel-block { width: 100%; }

        /* ── Programs ── Dark green section */
        .programs-section { background: var(--wfp-navy); padding: var(--md-sys-spacing-24) 0; }
        .programs-section .section-eyebrow { color: var(--wfp-gold); }
        .programs-section .section-title { color: #fff; }
        .programs-section .section-lead { color: rgba(255,255,255,0.85); }
        .programs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--md-sys-shape-corner-medium); overflow: hidden; margin-top: var(--md-sys-spacing-12); }
        .program-cell { background: rgba(255,255,255,0.05); padding: var(--md-sys-spacing-8) var(--md-sys-spacing-7); transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard); backdrop-filter: blur(10px); }
        .program-cell:hover { background: rgba(255,255,255,0.1); transform: translateY(-4px); }
        .program-icon { font-size: var(--md-sys-typescale-headline-small-size); margin-bottom: var(--md-sys-spacing-3); line-height: 1; color: var(--wfp-gold); }
        .program-title { font-size: var(--md-sys-typescale-body-large-size); font-weight: 700; margin-bottom: var(--md-sys-spacing-2); color: #fff; }
        .program-desc { font-size: var(--md-sys-typescale-body-small-size); color: rgba(255,255,255,0.8); line-height: 1.65; }

        /* ── Recent Achievements - Modern Cards ── */
        .how-section { background: var(--md-sys-color-surface-container); padding: var(--md-sys-spacing-24) 0; position: relative; overflow: hidden; }
        .how-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(0, 154, 68, 0.08), transparent 60%); pointer-events: none; }
        .how-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.75rem; margin-top: var(--md-sys-spacing-16); position: relative; z-index: 2; }
        .how-step {
          padding: 2.5rem 2rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.02),
            0 8px 24px rgba(0, 0, 0, 0.04);
          position: relative;
          overflow: hidden;
        }
        .how-step::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--wfp-blue), var(--wfp-gold));
          opacity: 0;
          transition: opacity 0.3s;
        }
        .how-step:hover {
          transform: translateY(-12px) scale(1.02);
          border-color: rgba(0, 135, 81, 0.3);
          box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.04),
            0 20px 48px rgba(0, 154, 68, 0.12);
        }
        .how-step:hover::before { opacity: 1; }
        .how-num {
          font-size: 4rem;
          font-weight: 900;
          background: linear-gradient(135deg, var(--wfp-blue), var(--wfp-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0.15;
          line-height: 1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.04em;
        }
        .how-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--md-sys-color-on-surface);
          margin-bottom: 0.75rem;
        }
        .how-desc {
          font-size: 0.95rem;
          color: var(--md-sys-color-on-surface-variant);
          line-height: 1.7;
        }

        /* ── About Split ── Dark green section */
        .about-split { padding: var(--md-sys-spacing-24) 0; background: var(--wfp-navy); position: relative; }
        .about-split-inner { display: grid; grid-template-columns: 5fr 6fr; gap: var(--md-sys-spacing-16); align-items: center; max-width: var(--md-sys-container-max-width); margin: 0 auto; padding: 0 var(--md-sys-spacing-6); }
        .about-image-panel { position: relative; border-radius: var(--md-sys-shape-corner-extra-large); overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); aspect-ratio: 4/5; transform: translateY(calc(-1 * var(--md-sys-spacing-8))); }
        .about-content-panel { background: transparent; color: #fff; padding: 0; display: flex; flex-direction: column; justify-content: center; }
        .about-content-panel h2 { color: #fff; margin-bottom: var(--md-sys-spacing-5); }
        .about-content-panel p { margin-bottom: var(--md-sys-spacing-5); color: rgba(255,255,255,0.9); }
        .about-content-panel .line { background: var(--wfp-gold); width: 60px; height: 4px; border-radius: var(--md-sys-shape-corner-extra-small); margin-bottom: var(--md-sys-spacing-8); }

        /* ── Quote ── Mature dark green section */
        .quote-section { background: var(--wfp-navy); padding: var(--md-sys-spacing-20) 0; }
        .quote-wrap { max-width: 800px; margin: 0 auto; text-align: center; }
        .quote-mark { font-size: var(--md-sys-typescale-display-large-size); line-height: 0.5; color: rgba(255,255,255,.2); font-family: Georgia, serif; display: block; margin-bottom: var(--md-sys-spacing-6); }
        .quote-text { font-size: clamp(var(--md-sys-typescale-title-large-size), 2.5vw, var(--md-sys-typescale-headline-small-size)); color: var(--md-sys-color-on-secondary); font-weight: 400; line-height: 1.65; margin-bottom: var(--md-sys-spacing-8); font-style: italic; }
        .quote-author { font-size: var(--md-sys-typescale-body-small-size); color: rgba(255,255,255,.7); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
        .quote-author span { display: block; color: var(--md-sys-color-secondary); margin-bottom: var(--md-sys-spacing-1); font-size: var(--md-sys-typescale-body-large-size); font-weight: 700; text-transform: none; letter-spacing: 0; font-style: normal; }

        /* ── Challenge ── ALIGNED TO MATERIAL DESIGN */
        .challenge-section { background: var(--md-sys-color-surface-container); }
        .challenge-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--md-sys-spacing-12); align-items: center; }
        .challenge-stat-row { display: flex; flex-direction: column; gap: var(--md-sys-spacing-6); margin-top: var(--md-sys-spacing-8); }
        .challenge-stat { display: flex; align-items: center; gap: var(--md-sys-spacing-5); }
        .challenge-stat-num { font-size: var(--md-sys-typescale-headline-large-size); font-weight: 900; color: var(--md-sys-color-primary); letter-spacing: -0.04em; flex-shrink: 0; min-width: 80px; }
        .challenge-stat-text { font-size: var(--md-sys-typescale-body-medium-size); color: var(--md-sys-color-on-surface-variant); line-height: 1.55; }
        .challenge-img { border-radius: var(--md-sys-shape-corner-large); overflow: hidden; aspect-ratio: 4/3; position: relative; box-shadow: var(--md-sys-shadow-level4); }

        /* ── News ── Dark green section */
        .news-section { background: var(--wfp-navy); }
        .news-section .section-eyebrow { color: var(--wfp-gold); }
        .news-section .section-title { color: #fff; }
        .news-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--md-sys-spacing-10); flex-wrap: wrap; gap: var(--md-sys-spacing-4); }

        /* ── Get Involved ── ALIGNED TO MATERIAL DESIGN */
        .involved-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--md-sys-spacing-8); margin-top: var(--md-sys-spacing-14); }
        .involved-card { background: var(--md-sys-color-surface); border: 1px solid var(--md-sys-color-outline-variant); border-radius: var(--md-sys-shape-corner-extra-large); padding: var(--md-sys-spacing-11); display: flex; flex-direction: column; gap: var(--md-sys-spacing-4); transition: all var(--md-sys-motion-duration-medium4) var(--md-sys-motion-easing-emphasized); box-shadow: var(--md-sys-shadow-level1); position: relative; overflow: hidden; }
        .involved-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: var(--md-sys-color-secondary); transform: scaleX(0); transform-origin: left; transition: transform var(--md-sys-motion-duration-medium4) var(--md-sys-motion-easing-emphasized); }
        .involved-card:hover { box-shadow: var(--md-sys-shadow-level4); transform: translateY(-8px); border-color: var(--md-sys-color-outline); }
        .involved-card:hover::before { transform: scaleX(1); }
        .involved-icon { font-size: var(--md-sys-typescale-display-small-size); color: var(--md-sys-color-secondary); transition: transform var(--md-sys-motion-duration-medium4) var(--md-sys-motion-easing-emphasized); }
        .involved-card:hover .involved-icon { transform: scale(1.1) rotate(5deg); }
        .involved-card h3 { font-size: var(--md-sys-typescale-title-large-size); font-weight: 800; }
        .involved-card p { font-size: var(--md-sys-typescale-body-medium-size); color: var(--md-sys-color-on-surface-variant); line-height: 1.75; flex: 1; }

        /* ── Guidelines preview ── ALIGNED TO MATERIAL DESIGN */
        .resources-strip { border-top: 1px solid var(--md-sys-color-outline-variant); padding: var(--md-sys-spacing-12) 0; background: var(--md-sys-color-surface); }
        .resource-tag { display: inline-flex; align-items: center; gap: var(--md-sys-spacing-2); padding: var(--md-sys-spacing-2) var(--md-sys-spacing-4); border: 1.5px solid var(--md-sys-color-outline); border-radius: var(--md-sys-shape-corner-small); font-size: var(--md-sys-typescale-label-medium-size); font-weight: 600; color: var(--md-sys-color-on-surface-variant); transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard); }
        .resource-tag:hover { border-color: var(--md-sys-color-secondary); color: var(--md-sys-color-secondary); background: var(--md-sys-color-secondary-container); }

        /* ── Partners ── White background */
        .partners-strip { border-top: 1px solid var(--md-sys-color-outline-variant); padding: 8rem 0 8rem 0; background: #fff; overflow: hidden; }
        .partners-strip .section-eyebrow { color: var(--text-muted); }
        .partners-strip .section-title { color: var(--text-primary); margin-bottom: var(--md-sys-spacing-12); }
        .partner-marquee { width: 100%; overflow: hidden; }
        .partner-grid { display: flex; align-items: center; gap: 2.5rem; margin-top: var(--md-sys-spacing-10); min-width: max-content; animation: marquee 80s linear infinite; }
        .partner-grid:hover { animation-play-state: paused; }
        .partner-card { flex: 0 0 auto; min-width: 170px; max-width: 260px; padding: 1rem 1.4rem; border-radius: 24px; border: 1px solid rgba(15,23,42,0.07); background: rgba(255,255,255,0.96); box-shadow: 0 12px 30px rgba(15,23,42,0.08); display: flex; align-items: center; justify-content: center; transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .partner-card:hover { transform: translateY(-4px); box-shadow: 0 20px 46px rgba(15,23,42,0.12); }
        .partner-card img { max-width: 220px; max-height: 72px; object-fit: contain; display: block; filter: grayscale(0.05); opacity: 0.95; }
        .partner-logo-hm { filter: grayscale(10%) opacity(0.85); transition: all var(--md-sys-motion-duration-medium4) var(--md-sys-motion-easing-standard); display: flex; align-items: center; justify-content: center; padding: var(--md-sys-spacing-4) var(--md-sys-spacing-14); position: relative; flex-shrink: 0; min-height: 110px; }
        .partner-logo-hm img { object-fit: contain; width: auto; height: 100%; max-width: 220px; max-height: 90px; }
        .partner-logo-hm:hover { filter: grayscale(0%) opacity(1); transform: scale(1.05); }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        /* ── CTA ── Dark green section */
        .cta-full { position: relative; overflow: hidden; background: var(--wfp-navy); padding: var(--md-sys-spacing-24) 0; border-top: 1px solid rgba(255,255,255,0.1); }
        .cta-full::before { content: ''; position: absolute; width: 600px; height: 600px; border-radius: 50%; background: rgba(245, 158, 11, 0.05); top: -200px; right: -150px; }
        .cta-full-inner { max-width: 600px; }
        .cta-full h2 { color: #fff; margin-bottom: var(--md-sys-spacing-4); }
        .cta-full p { color: rgba(255,255,255,0.9); font-size: var(--md-sys-typescale-body-large-size); line-height: 1.75; margin-bottom: var(--md-sys-spacing-8); }
        .cta-full-actions { display: flex; gap: var(--md-sys-spacing-4); flex-wrap: wrap; }

        /* ── RESPONSIVE (Material Design Breakpoints) ── */
        @media (max-width: 1200px) {
          .programs-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 904px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .how-grid { grid-template-columns: 1fr 1fr; gap: var(--md-sys-spacing-6); }
          .how-step { padding: var(--md-sys-spacing-8); border-radius: var(--md-sys-shape-corner-large); }
          .about-split-inner { grid-template-columns: 1fr; gap: var(--md-sys-spacing-12); }
          .about-image-panel { transform: none; aspect-ratio: 16/9; }
          .challenge-grid { grid-template-columns: 1fr; }
          .involved-grid { grid-template-columns: 1fr; }
          .partner-grid { animation: none; flex-wrap: wrap; justify-content: center; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .programs-grid { grid-template-columns: 1fr; }
          .how-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Hero ── */}
      <HeroCarousel slides={carousels} />

      {/* ── Latest News Carousel ── */}
      <section className="news-carousel-section">
        <div className="container">
          <div className="news-carousel-heading">
            <div>
              <p className="section-eyebrow">Latest News</p>
              <h2 className="section-title">Stay updated with NFA headlines</h2>
            </div>
            <p>Explore featured stories and announcements shaping food fortification progress across Nigeria.</p>
          </div>
          <div className="news-carousel-block">
            <NewsCarousel news={displayNews} />
          </div>
        </div>
      </section>

      {/* ── The Challenge - Health Statistics ── */}
      <section style={{ background: 'linear-gradient(135deg, var(--wfp-green) 0%, #064E3B 100%)', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--wfp-gold)', marginBottom: '0.75rem' }}>The Challenge</p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>Nigeria&apos;s Hidden Hunger Crisis</h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>Critical health statistics that demonstrate the urgent need for food fortification</p>
          </div>
          <AnimatedStats stats={displayStats} />
        </div>
      </section>

      {/* ── Economic Case ── */}
      <section className="section bg-off">
        <div className="container">
          <p className="section-eyebrow">The Economic Case</p>
          <h2 className="section-title">Why Fortification Matters</h2>
          <p className="section-lead">Strategic investment in human capital through nutrition directly impacts Nigeria&apos;s macroeconomic growth.</p>
          <div className="involved-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {ECONOMIC_CASE.map((c) => (
              <div key={c.title} className="involved-card">
                <div className="involved-icon"><Icon name={c.icon} size={40} /></div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <Link href={c.link} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>{c.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote ── */}
      <div className="quote-section">
        <div className="container">
          <div className="quote-wrap" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <span className="quote-mark">&quot;</span>
              <p className="quote-text">
                {quote.text}
              </p>
              <div className="quote-author">
                <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--wfp-navy)' }}>{quote.author_name}</span>
                <span style={{ display: 'block', marginTop: '0.25rem' }}>{quote.author_title}</span>
                {quote.author_organization && <span style={{ display: 'block', fontSize: '0.85rem', opacity: 0.8 }}>{quote.author_organization}</span>}
              </div>
            </div>
            {quote.author_image?.url && (
              <div style={{ flexShrink: 0, minWidth: '240px', width: '240px', height: '240px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--wfp-gold)', boxShadow: '0 10px 32px rgba(0,0,0,0.18)' }}>
                <img
                  src={getStrapiMediaUrl(quote.author_image.url)}
                  alt={quote.author_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mission & Vision ── */}
      <section className="section bg-off relative">
        <div className="container relative z-10">
          <div className="grid-2">
            <AnimatedSectionWrapper animation="fade-up-scale" delay={0}>
              <div className="card glass-panel" style={{ padding: '3.5rem 3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', color: 'var(--wfp-blue)' }}>
                <Icon name="globe" size={32} />
                <h3 style={{ margin: 0, fontSize: '1.75rem' }}>Mission</h3>
              </div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '1.05rem', lineHeight: '1.8' }}>
                To coordinate a multi-sectoral approach that ensures every Nigerian has access to essential micronutrients through the mandatory fortification of staple foods.
              </p>
            </div>
            </AnimatedSectionWrapper>
            <AnimatedSectionWrapper animation="fade-up-scale" delay={150}>
              <div className="card glass-panel" style={{ padding: '3.5rem 3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', color: 'var(--wfp-gold)' }}>
                <Icon name="sun" size={32} />
                <h3 style={{ margin: 0, fontSize: '1.75rem' }}>Vision</h3>
              </div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '1.05rem', lineHeight: '1.8' }}>
                A Nigeria free from the burden of &quot;hidden hunger&quot; and micronutrient deficiencies, achieved through sustainable public-private partnerships.
              </p>
            </div>
            </AnimatedSectionWrapper>
          </div>
        </div>
      </section>

      {/* ── Core Functions (Replacing What We Fortify) ── */}
      <section className="section programs-section">
        <div className="container">
          <AnimatedSectionWrapper animation="fade-up" delay={0}>
            <p className="section-eyebrow">Strategy</p>
            <h2 className="section-title">Core Functions of the NFA</h2>
            <p className="section-lead">Leading Nigeria&apos;s fight against hidden hunger through targeted multisectoral alignment.</p>
          </AnimatedSectionWrapper>
          <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: '3rem' }}>
            <AnimatedCoreFunctions functions={CORE_FUNCTIONS} />
          </div>
        </div>
      </section>

      {/* ── Recent Achievements ── */}
      <div className="how-section">
        <div className="container">
          <AnimatedSectionWrapper animation="fade-up" delay={0}>
            <p className="section-eyebrow">Progress</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: '1.4' }}>
              Recent Achievements
              <br />
              <span style={{ fontSize: '0.7em', opacity: 0.7, marginTop: '0.5rem', display: 'inline-block' }}>(2024–2025)</span>
            </h2>
          </AnimatedSectionWrapper>
          <AnimatedAchievements
            achievements={ACHIEVEMENTS.map(a => ({
              num: a.num,
              title: a.title,
              detail: a.desc
            }))}
          />
        </div>
      </div>





      {/* ── Partners strip ── */}
      <div className="partners-strip fade-up stagger-1">
        <div className="container" style={{ maxWidth: '1600px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <p className="section-eyebrow">Collaboration</p>
              <h2 className="section-title">Our Partners</h2>
            </div>

            <div className="partner-marquee">
              <div className="partner-grid" aria-label="Partner logos marquee">
                {[...marqueePartners, ...marqueePartners].map((partner, i) => {
                  const resolvedLogo = resolvePartnerLogo(partner);
                  return (
                    <Link key={`${partner.name}-${i}`} href="/partners" className="partner-card" aria-label={`Partner logo: ${partner.name}`}>
                      <Image
                        src={resolvedLogo.src}
                        alt={partner.name}
                        width={resolvedLogo.width}
                        height={resolvedLogo.height}
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div className="cta-full">
        <div className="container">
          <div className="cta-full-inner">
            <p className="section-eyebrow" style={{ color: 'var(--wfp-gold)' }}>Work With Us</p>
            <h2>Ready to be part of Nourishing Nigeria?</h2>
            <p>Whether you are a food processor seeking NAFDAC certification, a development partner, or a researcher — NFA has resources and pathways for you.</p>
            <div className="cta-full-actions">
              <Link href="/contact" className="btn btn-primary btn-lg">Contact NFA →</Link>
              <Link href="/guidelines" className="btn btn-outline btn-lg">📄 View Guidelines</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
