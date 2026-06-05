'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isTransitioning) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, var(--wfp-blue), var(--wfp-gold))',
        zIndex: 9999,
        animation: 'slideRight 0.4s ease-out',
        transformOrigin: 'left'
      }}
    />
  );
}
