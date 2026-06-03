'use client';
import { useEffect, useRef, useState } from 'react';

interface NumberCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export default function NumberCounter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = ''
}: NumberCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const startTime = Date.now();
            const startValue = 0;

            const animate = () => {
              const currentTime = Date.now();
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Easing function for smooth animation
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              const currentCount = startValue + (end - startValue) * easeOutQuart;

              setCount(currentCount);

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(end);
              }
            };

            requestAnimationFrame(animate);
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  const displayValue = decimals > 0
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString();

  return (
    <span ref={ref} className={`counter-animate ${className}`}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
