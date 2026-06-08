'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { NewsEvent } from '@/lib/api';
import Icon from './Icon';

interface NewsFlashCardsProps {
  news: NewsEvent[];
  autoRotate?: boolean;
  interval?: number;
}

export default function NewsFlashCards({
  news,
  autoRotate = true,
  interval = 5000
}: NewsFlashCardsProps) {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % news.length);
  }, [news.length]);

  const prev = () => {
    setCurrent((c) => (c - 1 + news.length) % news.length);
  };

  // Auto-rotate
  useEffect(() => {
    if (!autoRotate || isHovered || news.length <= 1) return;

    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoRotate, interval, isHovered, next, news.length]);

  if (news.length === 0) return null;

  const currentNews = news[current];
  const imageUrl = currentNews.image?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'https://nfawebsite-backend-production.up.railway.app'}${currentNews.image.url}`
    : '/hero-1.png';

  return (
    <div className="flashcard-container">
      <style>{`
        .flashcard-container {
          position: relative;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          perspective: 1000px;
        }

        .flashcard-main {
          position: relative;
          width: 100%;
          height: 500px;
          border-radius: 24px;
          overflow: hidden;
          background: var(--wfp-navy);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          transition: transform 0.3s ease;
        }

        .flashcard-main:hover {
          transform: translateY(-8px);
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.15);
        }

        .flashcard-image {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .flashcard-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.95) 0%,
            rgba(0, 0, 0, 0.6) 40%,
            rgba(0, 0, 0, 0.2) 70%,
            transparent 100%
          );
        }

        .flashcard-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3rem;
          color: #fff;
        }

        .flashcard-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--wfp-gold);
          color: var(--wfp-navy);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-radius: 100px;
          width: fit-content;
          margin-bottom: 1.5rem;
          animation: slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .flashcard-title {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 1rem;
          color: #fff;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }

        .flashcard-excerpt {
          font-size: 1.1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2rem;
          max-width: 600px;
          animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }

        .flashcard-meta {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
          animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }

        .flashcard-meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .flashcard-action {
          animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
        }

        .flashcard-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          color: #fff;
          font-weight: 700;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          transition: all 0.3s;
          text-decoration: none;
        }

        .flashcard-btn:hover {
          background: #fff;
          color: var(--wfp-navy);
          border-color: #fff;
          transform: translateX(4px);
        }

        /* Navigation */
        .flashcard-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          display: flex;
          gap: 1rem;
        }

        .flashcard-nav.left {
          left: 2rem;
        }

        .flashcard-nav.right {
          right: 2rem;
        }

        .flashcard-nav-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1.25rem;
        }

        .flashcard-nav-btn:hover {
          background: #fff;
          color: var(--wfp-navy);
          border-color: #fff;
          transform: scale(1.1);
        }

        .flashcard-nav-btn:active {
          transform: scale(0.95);
        }

        /* Thumbnails */
        .flashcard-thumbs {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .flashcard-thumb {
          width: 80px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.3s;
          position: relative;
          background: var(--wfp-navy);
        }

        .flashcard-thumb.active {
          border-color: var(--wfp-gold);
          transform: scale(1.1);
        }

        .flashcard-thumb:hover {
          border-color: rgba(245, 158, 11, 0.5);
          transform: scale(1.05);
        }

        .flashcard-thumb::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          transition: opacity 0.3s;
        }

        .flashcard-thumb.active::after {
          opacity: 0;
        }

        /* Animations */
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .flashcard-main {
            height: 400px;
          }

          .flashcard-content {
            padding: 2rem;
          }

          .flashcard-title {
            font-size: 1.5rem;
          }

          .flashcard-excerpt {
            font-size: 0.95rem;
          }

          .flashcard-nav {
            display: none;
          }

          .flashcard-thumbs {
            display: none;
          }
        }
      `}</style>

      <div
        className="flashcard-main"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Image */}
        <div className="flashcard-image">
          <Image
            src={imageUrl}
            alt={currentNews.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        {/* Content */}
        <div className="flashcard-content">
          <div className="flashcard-badge">
            <Icon name="zap" size={14} />
            {currentNews.category || 'News'}
          </div>

          <h2 className="flashcard-title">{currentNews.title}</h2>

          {currentNews.excerpt && (
            <p className="flashcard-excerpt">
              {currentNews.excerpt.length > 150
                ? currentNews.excerpt.substring(0, 150) + '...'
                : currentNews.excerpt
              }
            </p>
          )}

          <div className="flashcard-meta">
            <div className="flashcard-meta-item">
              <Icon name="calendar" size={16} />
              {new Date(currentNews.date || currentNews.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <div className="flashcard-meta-item">
              <Icon name="clock" size={16} />
              {Math.ceil((currentNews.body?.length || 0) / 1000)} min read
            </div>
          </div>

          <div className="flashcard-action">
            <Link href={`/${locale}/news/${currentNews.slug}`} className="flashcard-btn">
              Read Full Story
              <Icon name="arrow-right" size={18} />
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        {news.length > 1 && (
          <>
            <div className="flashcard-nav left">
              <button
                className="flashcard-nav-btn"
                onClick={prev}
                aria-label="Previous news"
              >
                ‹
              </button>
            </div>
            <div className="flashcard-nav right">
              <button
                className="flashcard-nav-btn"
                onClick={next}
                aria-label="Next news"
              >
                ›
              </button>
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {news.length > 1 && (
        <div className="flashcard-thumbs">
          {news.map((item, index) => {
            const thumbUrl = item.image?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'https://nfawebsite-backend-production.up.railway.app'}${item.image.url}`
              : '/hero-1.png';

            return (
              <div
                key={item.id}
                className={`flashcard-thumb ${index === current ? 'active' : ''}`}
                onClick={() => setCurrent(index)}
              >
                <Image
                  src={thumbUrl}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
