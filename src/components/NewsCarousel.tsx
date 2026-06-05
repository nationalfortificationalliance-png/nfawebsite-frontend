'use client';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMediaUrl, NewsEvent } from '@/lib/api';
import Icon from './Icon';

interface NewsCarouselProps {
  news: NewsEvent[];
  autoScroll?: boolean;
  scrollInterval?: number;
}

export default function NewsCarousel({
  news,
  autoScroll = true,
  scrollInterval = 4000
}: NewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const desktopItemsToShow = 2;
  const maxIndex = Math.max(0, news.length - desktopItemsToShow);

  const next = useCallback(() => {
    setCurrentIndex((prev) => {
      return prev >= maxIndex ? 0 : prev + 1;
    });
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => {
      return prev <= 0 ? maxIndex : prev - 1;
    });
  }, [maxIndex]);

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-scroll
  useEffect(() => {
    if (!autoScroll || isHovered || news.length <= 1) return;

    const timer = setInterval(next, scrollInterval);
    return () => clearInterval(timer);
  }, [autoScroll, scrollInterval, isHovered, news.length, next]);

  if (news.length === 0) return null;

  return (
    <div className="news-carousel-wrapper">
      <style>{`
        .news-carousel-wrapper {
          position: relative;
          width: 100%;
          padding: 2rem 0;
        }

        .news-carousel-container {
          position: relative;
          overflow: hidden;
          padding: 0 3rem;
        }

        .news-carousel-track {
          --news-card-gap: 2rem;
          --news-carousel-step: calc(50% + (var(--news-card-gap) / 2));
          display: flex;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          gap: var(--news-card-gap);
          padding: 0 1rem;
        }

        .news-carousel-card {
          flex: 0 0 calc(50% - (var(--news-card-gap) / 2));
          min-width: 0;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(0, 0, 0, 0.04);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          position: relative;
        }

        .news-carousel-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.12),
            0 0 0 1px rgba(0, 135, 81, 0.2);
        }

        .news-carousel-card::before {
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

        .news-carousel-card:hover::before {
          opacity: 1;
        }

        .news-card-image-wrapper {
          position: relative;
          width: 100%;
          height: 260px;
          background: var(--wfp-navy);
          overflow: hidden;
        }

        .news-card-image-wrapper::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0, 0, 0, 0.1) 100%
          );
        }

        .news-card-image-wrapper img {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .news-carousel-card:hover .news-card-image-wrapper img {
          transform: scale(1.08);
        }

        .news-card-image-empty {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.28);
          background:
            linear-gradient(135deg, rgba(0,135,81,0.3), rgba(6,78,59,0.95)),
            var(--wfp-navy);
        }

        .news-card-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          z-index: 2;
          padding: 0.4rem 0.9rem;
          background: var(--wfp-gold);
          color: var(--wfp-navy);
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border-radius: 100px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .news-card-content {
          padding: 1.75rem;
        }

        .news-card-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .news-card-title {
          font-size: 1.15rem;
          font-weight: 800;
          line-height: 1.4;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .news-card-excerpt {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .news-card-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--wfp-blue);
          transition: gap 0.3s;
        }

        .news-carousel-card:hover .news-card-link {
          gap: 0.75rem;
        }

        /* Navigation Buttons */
        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
        }

        .carousel-nav.left {
          left: -1rem;
        }

        .carousel-nav.right {
          right: -1rem;
        }

        .carousel-nav-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid var(--border);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1.25rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .carousel-nav-btn:hover {
          background: var(--wfp-blue);
          color: #fff;
          border-color: var(--wfp-blue);
          transform: scale(1.1);
        }

        .carousel-nav-btn:active {
          transform: scale(0.95);
        }

        /* Dots */
        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 0.65rem;
          margin-top: 1.75rem;
          padding: 0 0.75rem;
          width: 100%;
          box-sizing: border-box;
          overflow-x: visible;
          overflow-y: visible;
          scrollbar-width: none;
        }

        .carousel-dots::-webkit-scrollbar {
          display: none;
        }

        .carousel-dot {
          flex-shrink: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--border);
          cursor: pointer;
          transition: all 0.3s;
        }

        .carousel-dot.active {
          background: var(--wfp-gold);
          transform: scale(1.3);
        }

        .carousel-dot:hover {
          background: var(--wfp-blue);
          transform: scale(1.2);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .carousel-nav.left {
            left: 0;
          }

          .carousel-nav.right {
            right: 0;
          }
        }

        @media (max-width: 640px) {
          .news-carousel-container {
            padding: 0 1rem;
          }

          .news-carousel-track {
            --news-card-gap: 1rem;
            --news-carousel-step: calc(100% + var(--news-card-gap));
            padding: 0;
          }

          .news-carousel-card {
            flex: 0 0 100%;
          }

          .news-card-image-wrapper {
            height: 220px;
          }

          .carousel-nav {
            display: none;
          }

          .news-card-title {
            font-size: 1rem;
          }
        }
      `}</style>

      <div
        className="news-carousel-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Navigation Buttons */}
        {news.length > desktopItemsToShow && (
          <>
            <div className="carousel-nav left">
              <button
                className="carousel-nav-btn"
                type="button"
                onClick={prev}
                aria-label="Previous"
              >
                ‹
              </button>
            </div>
            <div className="carousel-nav right">
              <button
                className="carousel-nav-btn"
                type="button"
                onClick={next}
                aria-label="Next"
              >
                ›
              </button>
            </div>
          </>
        )}

        {/* Cards Track */}
        <div
          ref={containerRef}
          className="news-carousel-track"
          style={{
            '--news-current-index': currentIndex,
            transform: `translateX(calc(-1 * var(--news-current-index) * var(--news-carousel-step)))`,
          } as CSSProperties}
        >
          {news.map((item) => {
            const imageUrl = item.image?.url ? getStrapiMediaUrl(item.image.url) : null;

            return (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="news-carousel-card"
              >
                <div className="news-card-image-wrapper">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.image?.alternativeText || item.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="news-card-image-empty" aria-hidden="true">
                      <Icon name="newspaper" size={44} />
                    </div>
                  )}
                  <div className="news-card-badge">
                    {item.category}
                  </div>
                </div>

                <div className="news-card-content">
                  <div className="news-card-date">
                    <Icon name="calendar" size={14} />
                    {new Date(item.date || item.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>

                  <h3 className="news-card-title">{item.title}</h3>

                  {item.excerpt && (
                    <p className="news-card-excerpt">{item.excerpt}</p>
                  )}

                  <div className="news-card-link">
                    Read More
                    <Icon name="arrow-right" size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Dots Navigation */}
        {news.length > 1 && (
          <div className="carousel-dots">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
