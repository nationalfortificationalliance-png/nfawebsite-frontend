'use client';
import { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up' | 'fade-up-scale';
  delay?: number;
  threshold?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1,
  className = ''
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              element.classList.add('reveal-visible');
            }, delay);
            observer.unobserve(element);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div ref={ref} className={`scroll-reveal reveal-${animation} ${className}`}>
      {children}
    </div>
  );
}
