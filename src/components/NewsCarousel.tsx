'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NewsEvent } from '@/lib/api';
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

  const itemsToShow = {
    desktop: 3,
    tablet: 2,
    mobile: 1
  };

  const next = () => {
    setCurrentIndex((prev) => {
      // Don't go beyond the last set of visible cards
      const maxIndex = Math.max(0, news.length - itemsToShow.desktop);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prev = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, news.length - itemsToShow.desktop);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-scroll
  useEffect(() => {
    if (!autoScroll || isHovered || news.length <= 1) return;

    const timer = setInterval(next, scrollInterval);
    return () => clearInterval(timer);
  }, [autoScroll, scrollInterval, isHovered, news.length, currentIndex]);

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
          display: flex;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          gap: 2rem;
          padding: 0 1rem;
        }

        .news-carousel-card {
          flex: 0 0 calc(33.333% - 1.35rem);
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
          height: 200px;
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
          gap: 0.75rem;
          margin-top: 2rem;
        }

        .carousel-dot {
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
          .news-carousel-card {
            flex: 0 0 calc(50% - 1rem);
          }

          .carousel-nav.left {
            left: 0;
          }

          .carousel-nav.right {
            right: 0;
          }
        }

        @media (max-width: 640px) {
          .news-carousel-card {
            flex: 0 0 calc(100% - 2rem);
          }

          .news-carousel-track {
            gap: 1rem;
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
        {news.length > 3 && (
          <>
            <div className="carousel-nav left">
              <button
                className="carousel-nav-btn"
                onClick={prev}
                aria-label="Previous"
              >
                ‹
              </button>
            </div>
            <div className="carousel-nav right">
              <button
                className="carousel-nav-btn"
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
            transform: `translateX(-${currentIndex * (100 / itemsToShow.desktop)}%)`
          }}
        >
          {news.map((item) => {
            const imageUrl = item.image?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'https://nfawebsite-backend-production.up.railway.app'}${item.image.url}`
              : '/hero-1.png';

            return (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="news-carousel-card"
              >
                <div className="news-card-image-wrapper">
                  <Image
                    src={imageUrl}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
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
            {news.slice(0, Math.min(news.length, 6)).map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
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
