'use client';
import { useEffect, useRef, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-up-scale' | 'slide-left' | 'slide-right';
  delay?: number;
}

export default function AnimatedSection({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0
}: AnimatedSectionProps) {
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`scroll-reveal reveal-${animation} ${className}`}>
      {children}
    </div>
  );
}

// Grid animation wrapper - animates children with stagger
export function AnimatedGrid({
  children,
  className = '',
  staggerDelay = 100
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = Array.from(element.children) as HTMLElement[];
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('reveal-visible');
              }, index * staggerDelay);
            });
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [staggerDelay]);

  return <div ref={ref} className={className}>{children}</div>;
}
