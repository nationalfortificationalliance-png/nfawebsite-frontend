import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';
import NewsCard from '@/components/NewsCard';
import NewsCarousel from '@/components/NewsCarousel';
import { getCarousels, getFeaturedNews, getFeaturedQuote, getStats, getStrapiMediaUrl, getAllNews, getGlobalSettings, type NewsEvent } from '@/lib/api';
import { MOCK_NEWS } from '@/lib/mockData';
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

const STAT_CATEGORY_ICONS: Record<string, IconName> = {
  Programme: 'calendar',
  Compliance: 'shield-check',
  'Health Impact': 'heart-pulse',
  General: 'bar-chart',
};

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

export default async function HomePage() {
  const [carousels, featuredNews, quoteData, statsData, allEvents, globalSettings] = await Promise.all([
    getCarousels(), getFeaturedNews(), getFeaturedQuote(), getStats(), getAllNews(1, 50), getGlobalSettings(),
  ]);

  const statsSource = globalSettings?.stats_source
    || 'Source: Nigeria Demographic and Health Survey (NDHS) 2024; National Food Consumption and Micronutrient Survey (NFCMS) 2021; UNICEF Nigeria, Situation Analysis of Children and Adolescents in Nigeria (2024).';

  // Filter upcoming events (events with future dates)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = allEvents.data
    .filter((item: NewsEvent) => item.category === 'event')
    .filter((item: NewsEvent) => new Date(item.date) >= today)
    .sort((a: NewsEvent, b: NewsEvent) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Debug logging
  console.log('=== NEWS DEBUG ===');
  console.log('Featured news count:', featuredNews.length);
  console.log('Featured news data:', JSON.stringify(featuredNews.map(n => ({
    title: n.title,
    hasImage: !!n.image,
    category: n.category,
    is_featured: n.is_featured
  })), null, 2));
  console.log('Using backend data:', featuredNews.length > 0);

  // Fallback images for news items
  const NEWS_FALLBACK_IMAGES = ['/about-hero.jpg', '/news_hero.jpg', '/factory.jpg'];

  // ALWAYS try to use backend data first, even if images are missing
  // Fallback to mock data only if API returns nothing
  const rawDisplayNews = featuredNews.length > 0 ? featuredNews : MOCK_NEWS;
  console.log('Raw display news count:', rawDisplayNews.length);
  console.log('Using MOCK_NEWS:', featuredNews.length === 0);
  const displayNews = rawDisplayNews.map((item, index) => {
    // If news item has no image or empty image URL, add fallback
    if (!item.image || !item.image.url || item.image.url.trim().length === 0) {
      return {
        ...item,
        image: {
          id: 0,
          documentId: '',
          url: NEWS_FALLBACK_IMAGES[index % NEWS_FALLBACK_IMAGES.length],
          alternativeText: item.title
        }
      };
    }
    return item;
  });

  // Fallback quote data
  const quote = quoteData || {
    text: 'Fortification is not charity — it is a cost-effective investment in Nigeria\'s human capital. Every naira spent on fortification returns exponential value in child development, workforce productivity, and national health savings.',
    author_name: 'David Stevenson',
    author_title: 'WFP Nigeria Country Director',
    author_organization: 'World Food Programme Nigeria',
    author_image: { id: 0, documentId: '', url: '/team-1.png' }
  };

  // Fallback stats data
  const displayStats = statsData.length > 0
    ? statsData.map(s => ({ number: s.value?.trim() || '—', label: s.label, icon: STAT_CATEGORY_ICONS[s.category] || 'bar-chart' }))
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

        /* ── Upcoming Events Marquee ── */
        .events-marquee-strip { background: linear-gradient(135deg, var(--wfp-blue) 0%, #0369a1 100%); padding: 1.25rem 0; overflow: hidden; border-bottom: 3px solid var(--wfp-gold); }
        .events-marquee-container { display: flex; align-items: center; gap: 1.5rem; max-width: 100%; }
        .events-marquee-label { flex-shrink: 0; display: flex; align-items: center; gap: 0.5rem; padding: 0 2rem; color: var(--wfp-gold); font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1.5; }
        .events-marquee-scroll { flex: 1; overflow: hidden; }
        .events-marquee-content { display: flex; gap: 3rem; animation: marquee-events 40s linear infinite; }
        .events-marquee-content:hover { animation-play-state: paused; }
        .events-marquee-item { display: flex; align-items: center; gap: 0.75rem; color: #fff; text-decoration: none; white-space: nowrap; padding: 0.5rem 1rem; border-radius: 8px; transition: background 0.2s ease; line-height: 1.5; }
        .events-marquee-item:hover { background: rgba(255, 255, 255, 0.1); }
        .event-marquee-date { font-weight: 600; font-size: 0.85rem; color: var(--wfp-gold); }
        .event-marquee-separator { color: rgba(255, 255, 255, 0.4); }
        .event-marquee-title { font-weight: 500; font-size: 0.9rem; }
        @keyframes marquee-events { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

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

        /* ── Upcoming Events ── Enhanced Professional Design */
        .upcoming-events-section {
          background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f0f9ff 100%);
          padding: 5rem 0;
          position: relative;
          overflow: hidden;
        }
        .upcoming-events-section::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 112, 188, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .upcoming-events-section .section-eyebrow {
          color: var(--wfp-blue);
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
        .upcoming-events-section .section-title {
          background: linear-gradient(135deg, var(--wfp-blue) 0%, #0369a1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
          position: relative;
          z-index: 1;
        }
        .event-card {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 112, 188, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 2px solid transparent;
          position: relative;
        }
        .event-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, var(--wfp-blue) 0%, var(--wfp-gold) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .event-card:hover {
          box-shadow: 0 20px 48px rgba(0, 112, 188, 0.15), 0 8px 16px rgba(0, 0, 0, 0.08);
          transform: translateY(-12px) scale(1.02);
          border-color: rgba(0, 112, 188, 0.2);
        }
        .event-card:hover::before { opacity: 1; }
        .event-date-badge {
          background: linear-gradient(135deg, var(--wfp-blue) 0%, #0369a1 100%);
          color: #fff;
          padding: 1.5rem 1.25rem;
          text-align: center;
          font-weight: 700;
          position: relative;
          overflow: hidden;
        }
        .event-date-badge::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .event-date-badge .day {
          font-size: 2.5rem;
          display: block;
          line-height: 1;
          margin-bottom: 0.25rem;
          font-weight: 800;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .event-date-badge .month {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          opacity: 0.95;
          font-weight: 600;
        }
        .event-content {
          padding: 2rem 1.75rem;
          background: linear-gradient(to bottom, #fff 0%, #fafafa 100%);
        }
        .event-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .event-excerpt {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.65;
          margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .event-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--wfp-blue);
          font-weight: 600;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

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
          .events-marquee-label { padding: 0 1rem; font-size: 0.75rem; }
          .involved-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .programs-grid { grid-template-columns: 1fr; }
          .how-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Hero ── */}
      <HeroCarousel slides={carousels} />

      {/* ── Upcoming Events Marquee ── */}
      {upcomingEvents.length > 0 && (
        <div className="events-marquee-strip">
          <div className="events-marquee-container">
            <div className="events-marquee-label">
              <Icon name="calendar" size={18} />
              <span>Upcoming Events</span>
            </div>
            <div className="events-marquee-scroll">
              <div className="events-marquee-content">
                {[...upcomingEvents, ...upcomingEvents].map((event, index) => {
                  const eventDate = new Date(event.date);
                  const formattedDate = eventDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });
                  return (
                    <Link
                      key={`marquee-event-${event.id}-${index}`}
                      href={`/news/${event.slug}`}
                      className="events-marquee-item"
                    >
                      <Icon name="calendar" size={16} />
                      <span className="event-marquee-date">{formattedDate}</span>
                      <span className="event-marquee-separator">•</span>
                      <span className="event-marquee-title">{event.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

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
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', textAlign: 'center', maxWidth: '800px', margin: '2rem auto 0', lineHeight: 1.6 }}>{statsSource}</p>
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
                <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>{quote.author_name}</span>
                <span style={{ display: 'block', marginTop: '0.25rem' }}>{quote.author_title}</span>
                {quote.author_organization && <span style={{ display: 'block', fontSize: '0.85rem', opacity: 0.8 }}>{quote.author_organization}</span>}
              </div>
            </div>
            <div style={{ flexShrink: 0, minWidth: '240px', width: '240px', height: '240px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--wfp-gold)', boxShadow: '0 10px 32px rgba(0,0,0,0.18)', position: 'relative' }}>
              <Image
                src={quote.author_image?.url ? getStrapiMediaUrl(quote.author_image.url) : '/team-1.png'}
                alt={quote.author_name}
                fill
                sizes="240px"
                style={{ objectFit: 'cover' }}
              />
            </div>
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

      {/* ── Upcoming Events ── */}
      {upcomingEvents.length > 0 && (
        <section className="upcoming-events-section">
          <div className="container">
            <AnimatedSectionWrapper animation="fade-up" delay={0}>
              <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
                <p className="section-eyebrow" style={{ marginBottom: '1rem' }}>WHAT&apos;S COMING</p>
                <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem', fontWeight: 800, lineHeight: '1.2' }}>
                  Upcoming Events
                </h2>
                <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: '1.75', marginBottom: '1.5rem' }}>
                  Join us at these important gatherings shaping the future of food fortification in Nigeria
                </p>
                <Link href="/news" className="btn btn-outline btn-sm" style={{ background: 'var(--wfp-blue)', color: '#fff', border: 'none', padding: '0.75rem 2rem' }}>
                  View All Events →
                </Link>
              </div>
            </AnimatedSectionWrapper>

            <div className="events-grid">
              {upcomingEvents.map((event) => {
                const eventDate = new Date(event.date);
                const day = eventDate.getDate();
                const month = eventDate.toLocaleString('en-US', { month: 'short' });
                const year = eventDate.getFullYear();

                return (
                  <AnimatedSectionWrapper key={event.id} animation="fade-up-scale" delay={100}>
                    <Link href={`/news/${event.slug}`} className="event-card" style={{ textDecoration: 'none' }}>
                      <div className="event-date-badge">
                        <span className="day">{day}</span>
                        <span className="month">{month} {year}</span>
                      </div>
                      <div className="event-content">
                        <h3 className="event-title">{event.title}</h3>
                        {event.excerpt && (
                          <p className="event-excerpt">
                            {event.excerpt}
                          </p>
                        )}
                        <div className="event-meta">
                          <Icon name="calendar" size={16} />
                          <span>{eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </Link>
                  </AnimatedSectionWrapper>
                );
              })}
            </div>
          </div>
        </section>
      )}


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
