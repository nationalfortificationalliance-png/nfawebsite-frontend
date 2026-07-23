'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Carousel } from '@/lib/api';
import { getStrapiMediaUrl } from '@/lib/api';

// Each image is matched to its slide's narrative:
// Slide 1 — "Combating Hidden Hunger in Nigeria"      → about-hero.jpg (stakeholder meeting)
// Slide 2 — "Strengthening National Food Systems"     → factory.jpg (food processing facility)
// Slide 3 — "Partnerships Driving Nutrition Impact"   → news_hero.jpg (partnerships)
// Slide 4 — "Advancing Regulatory Compliance"         → about-hero.jpg (laboratory/quality control)
// Slide 5 — "Innovation and Research"                 → news_hero.jpg (research/innovation)
const HERO_IMAGES = [
  { src: '/about-hero.jpg', credit: 'WFP Nigeria — food fortification' },
  { src: '/factory.jpg', credit: 'WFP Nigeria — food processing' },
  { src: '/news_hero.jpg', credit: 'WFP Nigeria — partnerships' },
  { src: '/about-hero.jpg', credit: 'WFP Nigeria — quality assurance' },
  { src: '/news_hero.jpg', credit: 'WFP Nigeria — innovation' },
];

interface HeroCarouselProps {
  slides: Carousel[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  const displaySlides = slides.length > 0 ? slides : [
    {
      id: 1,
      documentId: 'fallback-1',
      title: 'Combating Hidden Hunger in Nigeria Through Food Fortification',
      subtitle: 'The National Fortification Alliance (NFA) is driving coordinated national efforts to improve nutrition outcomes through the production, regulation, monitoring, and promotion of adequately fortified foods across Nigeria.',
      link_url: '/about',
      link_text: 'Learn More',
      order: 1, is_active: true, image: { id: 0, documentId: '', url: '' },
    },
    {
      id: 2,
      documentId: 'fallback-2',
      title: 'Strengthening National Food Systems for Better Nutrition',
      subtitle: 'The NFA works with government agencies, industries, development partners, academia, and civil society to improve compliance, quality assurance, and accessibility of fortified foods nationwide.',
      link_url: '/initiatives',
      link_text: 'Our Work',
      order: 2, is_active: true, image: { id: 0, documentId: '', url: '' },
    },
    {
      id: 3,
      documentId: 'fallback-3',
      title: 'Partnerships Driving Sustainable Nutrition Impact',
      subtitle: 'Through strategic collaboration, innovation, and evidence-based interventions, the NFA supports Nigeria\'s efforts to reduce micronutrient deficiencies and improve public health outcomes.',
      link_url: '/partners',
      link_text: 'Partners',
      order: 3, is_active: true, image: { id: 0, documentId: '', url: '' },
    },
    {
      id: 4,
      documentId: 'fallback-4',
      title: 'Advancing Regulatory Compliance and Food Quality',
      subtitle: 'The Alliance supports coordinated monitoring, standards enforcement, laboratory strengthening, and digital compliance systems for fortified foods in Nigeria.',
      link_url: '/guidelines',
      link_text: 'Regulatory Framework',
      order: 4, is_active: true, image: { id: 0, documentId: '', url: '' },
    },
    {
      id: 5,
      documentId: 'fallback-5',
      title: 'Innovation and Research for Nutrition Improvement',
      subtitle: 'The NFA supports emerging initiatives including bouillon fortification, rice fortification, digital traceability systems, laboratory strengthening, and micronutrient innovation projects.',
      link_url: '/initiatives',
      link_text: 'Projects & Initiatives',
      order: 5, is_active: true, image: { id: 0, documentId: '', url: '' },
    },
  ] as Carousel[];

  const count = displaySlides.length;
  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count]);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="hero-carousel" aria-label="Featured fortification highlights">
      <style>{`
        .hero-carousel {
          position: relative;
          width: 100%;
          min-height: 620px;
          height: 75vh;
          max-height: 820px;
          overflow: hidden;
          background: var(--wfp-navy);
        }
        .hero-carousel-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          z-index: 0;
          transition: opacity 1000ms ease;
          pointer-events: none;
        }
        .hero-carousel-slide.active {
          opacity: 1;
          z-index: 1;
          pointer-events: auto;
        }
        .hero-carousel-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          max-width: none;
          object-fit: cover;
          transform: scale(1.08);
          transition: transform 8000ms ease;
        }
        .hero-carousel-slide.active .hero-carousel-image {
          transform: scale(1);
        }
        .hero-carousel-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(0,0,0,0.64) 0%, rgba(0,0,0,0.42) 46%, rgba(0,0,0,0.24) 100%),
            linear-gradient(0deg, rgba(6,78,59,0.5) 0%, rgba(6,78,59,0) 48%);
          z-index: 1;
        }
        .hero-carousel-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(52px);
          opacity: 0.45;
          z-index: 1;
          pointer-events: none;
        }
        .hero-carousel-glow.green {
          top: 5rem;
          right: 7%;
          width: 9rem;
          height: 9rem;
          background: rgba(0, 135, 81, 0.45);
          animation: heroPulse 8s ease-in-out infinite;
        }
        .hero-carousel-glow.gold {
          bottom: 7rem;
          left: 8%;
          width: 11rem;
          height: 11rem;
          background: rgba(245, 158, 11, 0.34);
          animation: heroPulse 10s ease-in-out 1.5s infinite;
        }
        .hero-carousel-content {
          position: relative;
          z-index: 2;
          min-height: 560px;
          height: 70vh;
          max-height: 760px;
          display: flex;
          align-items: center;
          padding: 4rem clamp(1.5rem, 6vw, 5rem) 4rem;
        }
        .hero-carousel-copy {
          max-width: 860px;
          color: #fff;
        }
        .hero-carousel-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          color: var(--wfp-gold);
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .hero-carousel-eyebrow::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--wfp-gold);
          box-shadow: 0 0 18px rgba(245,158,11,0.8);
        }
        .hero-carousel-title {
          color: #fff;
          font-size: clamp(1.75rem, 3.5vw, 3rem);
          line-height: 1.15;
          letter-spacing: 0;
          font-weight: 800;
          max-width: 900px;
          margin: 0 0 1rem;
          text-shadow: 0 18px 50px rgba(0,0,0,0.45);
        }
        .hero-carousel-subtitle {
          max-width: 650px;
          color: rgba(255,255,255,0.9);
          font-size: clamp(0.95rem, 1.4vw, 1.1rem);
          line-height: 1.6;
          margin: 0 0 1.75rem;
          text-shadow: 0 8px 24px rgba(0,0,0,0.34);
        }
        .hero-carousel-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .hero-carousel-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 150px;
          min-height: 50px;
          padding: 0.85rem 1.5rem;
          border-radius: 8px;
          font-size: 0.92rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          line-height: 1;
          transition: transform 250ms ease, background 250ms ease, border-color 250ms ease, box-shadow 250ms ease;
        }
        .hero-carousel-button.primary {
          color: var(--wfp-navy);
          background: var(--wfp-gold);
          box-shadow: 0 16px 40px rgba(0,0,0,0.25);
        }
        .hero-carousel-button.secondary {
          color: #fff;
          border: 2px solid rgba(255,255,255,0.82);
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .hero-carousel-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.28);
        }
        .hero-carousel-dots {
          position: absolute;
          right: clamp(1.25rem, 5vw, 4rem);
          bottom: 2rem;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }
        .hero-carousel-dot {
          width: 12px;
          height: 12px;
          border: 0;
          border-radius: 999px;
          background: rgba(255,255,255,0.46);
          padding: 0;
          transition: width 250ms ease, background 250ms ease;
        }
        .hero-carousel-dot.active {
          width: 34px;
          background: #fff;
        }
        .hero-carousel-arrows {
          position: absolute;
          left: clamp(1.25rem, 5vw, 4rem);
          bottom: 1.45rem;
          z-index: 3;
          display: flex;
          gap: 0.75rem;
        }
        .hero-carousel-arrow {
          width: 48px;
          height: 48px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.12);
          color: #fff;
          font-size: 1.25rem;
          line-height: 1;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: background 250ms ease, color 250ms ease, transform 250ms ease;
        }
        .hero-carousel-arrow:hover {
          background: #fff;
          color: var(--wfp-navy);
          transform: translateY(-2px);
        }
        .hero-carousel-progress {
          position: absolute;
          left: 0;
          bottom: 0;
          z-index: 3;
          height: 3px;
          background: linear-gradient(90deg, var(--wfp-gold), var(--wfp-green));
          animation: heroProgress 6000ms linear infinite;
        }
        @keyframes heroProgress {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes heroPulse {
          0%, 100% { transform: scale(0.92); opacity: 0.35; }
          50% { transform: scale(1.12); opacity: 0.55; }
        }
        @media (max-width: 900px) {
          .hero-carousel {
            min-height: 660px;
            height: 86vh;
          }
          .hero-carousel-content {
            min-height: 660px;
            height: 86vh;
            padding-top: 6.5rem;
            padding-bottom: 6.5rem;
          }
          .hero-carousel-subtitle {
            margin-bottom: 2rem;
          }
          .hero-carousel-arrows {
            display: none;
          }
          .hero-carousel-dots {
            left: 1.5rem;
            right: auto;
            bottom: 1.75rem;
          }
        }
        @media (max-width: 560px) {
          .hero-carousel {
            min-height: 600px;
            height: 82vh;
          }
          .hero-carousel-content {
            min-height: 600px;
            height: 82vh;
            padding: 6rem 1.25rem 6.25rem;
          }
          .hero-carousel-title {
            font-size: clamp(1.75rem, 8.2vw, 2.4rem);
          }
          .hero-carousel-button {
            width: 100%;
          }
        }
      `}</style>

      {/* Slides */}
      {displaySlides.map((slide, i) => {
        const slideData = slide;
        const strapiImg = getStrapiMediaUrl(slideData.image?.url);
        const hasStrapi = !!slideData.image?.url;
        const heroImg = HERO_IMAGES[i % HERO_IMAGES.length];

        return (
          <div
            key={slide.id}
            className={`hero-carousel-slide ${i === current ? 'active' : ''}`}
            aria-hidden={i !== current}
          >
            {/* Background Image */}
            <Image
              src={hasStrapi ? strapiImg : heroImg.src}
              className="hero-carousel-image"
              alt={slideData.title}
              fill
              priority={i === 0}
              sizes="100vw"
            />

            <div className="hero-carousel-overlay" />
            <div className="hero-carousel-glow green" />
            <div className="hero-carousel-glow gold" />

            {/* Content */}
            <div className="hero-carousel-content">
              <div className="hero-carousel-copy">
                <p className="hero-carousel-eyebrow">National Fortification Alliance</p>
                <h1 className="hero-carousel-title">{slideData.title}</h1>
                {slideData.subtitle && <p className="hero-carousel-subtitle">{slideData.subtitle}</p>}
                <div className="hero-carousel-actions">
                  {slideData.link_url && (
                    <Link
                      href={slideData.link_url}
                      className="hero-carousel-button primary"
                    >
                      {slideData.link_text?.toUpperCase() || 'LEARN MORE'}
                    </Link>
                  )}
                  <Link
                    href="/guidelines"
                    className="hero-carousel-button secondary"
                  >
                    GUIDELINES
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="hero-carousel-arrows">
        <button className="hero-carousel-arrow" type="button" onClick={prev} aria-label="Previous slide">‹</button>
        <button className="hero-carousel-arrow" type="button" onClick={next} aria-label="Next slide">›</button>
      </div>

      {/* Carousel Navigation Dots */}
      <div className="hero-carousel-dots">
        {displaySlides.map((_, i) => (
          <button
            key={`dot-${i}`}
            type="button"
            onClick={() => setCurrent(i)}
            className={`hero-carousel-dot ${i === current ? 'active' : ''}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
      <div className="hero-carousel-progress" key={`progress-${current}`} />
    </section>
  );
}
