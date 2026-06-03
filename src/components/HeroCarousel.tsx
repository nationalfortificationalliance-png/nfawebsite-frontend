'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Carousel } from '@/lib/api';
import { getStrapiMediaUrl } from '@/lib/api';

// Each image is matched to its slide's narrative:
// Slide 1 — "Combating Hidden Hunger in Nigeria"      → hero-1.png  (Nigerian market/food fortification)
// Slide 2 — "Strengthening National Food Systems"     → factory.png (food processing facility)
// Slide 3 — "Partnerships Driving Nutrition Impact"   → hero-3.png (WFP partnerships)
// Slide 4 — "Advancing Regulatory Compliance"         → hero-2.png (laboratory/quality control)
// Slide 5 — "Innovation and Research"                 → hero-1.png (research/innovation)
const HERO_IMAGES = [
  { src: '/hero-1.png', credit: 'WFP Nigeria — food fortification' },
  { src: '/factory.png', credit: 'WFP Nigeria — food processing' },
  { src: '/hero-3.png', credit: 'WFP Nigeria — partnerships' },
  { src: '/hero-2.png', credit: 'WFP Nigeria — quality assurance' },
  { src: '/hero-1.png', credit: 'WFP Nigeria — innovation' },
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
      title: 'Combating Hidden Hunger in Nigeria\nThrough Food Fortification',
      subtitle: 'The National Fortification Alliance (NFA) is driving coordinated national efforts to improve nutrition outcomes through the production, regulation, monitoring, and promotion of adequately fortified foods across Nigeria.',
      link_url: '/about',
      link_text: 'Learn More',
      order: 1, is_active: true, image: { id: 0, documentId: '', url: '' },
    },
    {
      id: 2,
      documentId: 'fallback-2',
      title: 'Strengthening National Food Systems\nfor Better Nutrition',
      subtitle: 'The NFA works with government agencies, industries, development partners, academia, and civil society to improve compliance, quality assurance, and accessibility of fortified foods nationwide.',
      link_url: '/initiatives',
      link_text: 'Our Work',
      order: 2, is_active: true, image: { id: 0, documentId: '', url: '' },
    },
    {
      id: 3,
      documentId: 'fallback-3',
      title: 'Partnerships Driving\nSustainable Nutrition Impact',
      subtitle: 'Through strategic collaboration, innovation, and evidence-based interventions, the NFA supports Nigeria\'s efforts to reduce micronutrient deficiencies and improve public health outcomes.',
      link_url: '/partners',
      link_text: 'Partners',
      order: 3, is_active: true, image: { id: 0, documentId: '', url: '' },
    },
    {
      id: 4,
      documentId: 'fallback-4',
      title: 'Advancing Regulatory Compliance\nand Food Quality',
      subtitle: 'The Alliance supports coordinated monitoring, standards enforcement, laboratory strengthening, and digital compliance systems for fortified foods in Nigeria.',
      link_url: '/guidelines',
      link_text: 'Regulatory Framework',
      order: 4, is_active: true, image: { id: 0, documentId: '', url: '' },
    },
    {
      id: 5,
      documentId: 'fallback-5',
      title: 'Innovation and Research\nfor Nutrition Improvement',
      subtitle: 'The NFA supports emerging initiatives including bouillon fortification, rice fortification, digital traceability systems, laboratory strengthening, and micronutrient innovation projects.',
      link_url: '/initiatives',
      link_text: 'Projects & Initiatives',
      order: 5, is_active: true, image: { id: 0, documentId: '', url: '' },
    },
  ] as Carousel[];

  const count = displaySlides.length;
  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);
  const prev = () => setCurrent((c) => (c - 1 + count) % count);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section style={{ position: 'relative', height: '88vh', minHeight: '750px', maxHeight: '1200px', overflow: 'hidden' }}>
      <style>{`
        .hero-slide {
          position: absolute; inset: 0;
          opacity: 0; transition: opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 5%;
          overflow: hidden;
        }
        .hero-slide.active { opacity: 1; z-index: 2; }
        
        .hero-slide img {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          transform: scale(1.15) translateY(-2%);
          transform-origin: center center;
          transition: transform 10s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 0;
        }
        .hero-slide.active img { transform: scale(1) translateY(0); }
        
        .hero-image-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to top, 
            rgba(0, 0, 0, 0.9) 0%, 
            rgba(0, 0, 0, 0.5) 40%, 
            rgba(0, 0, 0, 0.1) 100%
          );
          z-index: 1;
        }

        /* Content Panel - Completely sheer, no box */
        .hero-content-panel {
          position: relative;
          z-index: 2;
          max-width: 900px;
          text-align: center;
          padding: 4rem 2rem; /* Added vertical padding for better spacing */
          margin-top: 5rem; /* Increased margin to push away from header */
        }

        /* Text Animations inside the block */
        .hero-eyebrow, .hero-title, .hero-subtitle, .hero-actions {
          opacity: 0;
          transform: translateY(30px);
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-slide.active .hero-eyebrow { opacity: 1; transform: translateY(0); transition-delay: 0.3s; }
        .hero-slide.active .hero-title   { opacity: 1; transform: translateY(0); transition-delay: 0.4s; }
        .hero-slide.active .hero-subtitle{ opacity: 1; transform: translateY(0); transition-delay: 0.5s; }
        .hero-slide.active .hero-actions { opacity: 1; transform: translateY(0); transition-delay: 0.6s; }
        
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 0.75rem; justify-content: center;
          font-size: 0.85rem; font-weight: 800; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--wfp-gold);
          margin-bottom: 1.5rem;
        }
        .hero-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--wfp-gold); flex-shrink: 0;
          box-shadow: 0 0 12px var(--wfp-gold);
        }
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 900; color: #ffffff; line-height: 1.05;
          letter-spacing: -0.03em; white-space: pre-line;
          margin-bottom: 1.5rem;
          text-shadow: 0 12px 48px rgba(0,0,0,0.5);
        }
        .hero-subtitle {
          font-size: clamp(1.1rem, 1.5vw, 1.35rem);
          color: rgba(255, 255, 255, 0.85); line-height: 1.6;
          max-width: 720px;
          margin: 0 auto 3rem auto;
          text-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        .hero-actions {
          display: flex; gap: 1.25rem; flex-wrap: wrap; justify-content: center;
        }

        /* Premium Controls */
        .hero-controls {
          position: absolute; bottom: 0; left: 0; width: 100%;
          display: flex; align-items: center; justify-content: space-between;
          padding: 3rem 6%;
          z-index: 10;
          pointer-events: none;
        }
        .hero-controls > * { pointer-events: auto; }
        
        .hero-dots { display: flex; gap: 0.75rem; align-items: center; }
        .hero-dot {
          width: 12px; height: 12px; border-radius: 50%;
          background: transparent; border: 2px solid rgba(255,255,255,0.4); padding: 0;
          cursor: pointer; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-dot.active { background: #fff; border-color: #fff; transform: scale(1.2); box-shadow: 0 0 16px rgba(255,255,255,0.6); }
        
        .hero-arrows { display: flex; gap: 1rem; }
        .hero-arrow {
          width: 64px; height: 64px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05); /* Extremely sheer */
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          color: #fff; font-size: 1.5rem; display: flex;
          align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-arrow:hover { 
          background: rgba(255,255,255,1); 
          color: var(--wfp-navy); 
          transform: scale(1.05);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
        }

        /* Progress line */
        .hero-progress {
          position: absolute; bottom: 0; left: 0; height: 3px;
          background: linear-gradient(90deg, var(--wfp-gold), var(--wfp-green));
          animation: heroProgress 6s linear infinite;
        }
        @keyframes heroProgress { from { width: 0; } to { width: 100%; } }

        @media (max-width: 900px) {
          .hero-content-panel { padding: 0 1rem; margin-top: 2rem; }
          .hero-controls { padding: 2rem; flex-direction: column-reverse; gap: 2rem; justify-content: center; }
          .hero-arrows { display: none; } /* Hide arrows on mobile for clean UI */
        }
      `}</style>

      {/* Slides */}
      {displaySlides.map((slide, i) => {
        const slideData = slide;
        const strapiImg = getStrapiMediaUrl(slideData.image?.url);
        const hasStrapi = !!slideData.image?.url;
        const heroImg = HERO_IMAGES[i % HERO_IMAGES.length];

        return (
          <div key={slide.id} className={`hero-slide ${i === current ? 'active' : ''}`}>
            {/* Background Image */}
            <Image
              src={hasStrapi ? strapiImg : heroImg.src}
              alt={slideData.title}
              fill
              priority={i === 0}
              quality={90}
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
            <div className="hero-image-overlay" />

            <div className="hero-content-panel">
              <div className="hero-text-content">
                <p className="hero-eyebrow">
                  <span className="hero-eyebrow-dot" />
                  National Fortification Project
                </p>
                <h1 className="hero-title">{slideData.title}</h1>
                {slideData.subtitle && <p className="hero-subtitle">{slideData.subtitle}</p>}
                <div className="hero-actions">
                  {slideData.link_url && (
                    <Link href={slideData.link_url} className="btn btn-green btn-lg" style={{ minWidth: '180px' }}>
                      {slideData.link_text || 'Learn More'}
                    </Link>
                  )}
                  <Link href="/guidelines" className="btn btn-outline-white btn-lg" style={{ minWidth: '180px', background: 'rgba(255,255,255,0.08)' }}>
                    📄 Technical Guidelines
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="hero-controls">
        <div className="hero-dots">
          {displaySlides.map((_, i) => (
            <button
              key={`dot-${i}`}
              className={`hero-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="hero-arrows">
          <button className="hero-arrow" onClick={prev} aria-label="Previous slide">←</button>
          <button className="hero-arrow" onClick={next} aria-label="Next slide">→</button>
        </div>
        <div className="hero-progress" key={`progress-${current}`} />
      </div>
    </section>
  );
}
