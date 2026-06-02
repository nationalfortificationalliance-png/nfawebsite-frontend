import React from 'react';
import Link from 'next/link';

type CardVariant = 'elevated' | 'filled' | 'outlined';

interface MaterialCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  href?: string;
  className?: string;
  onClick?: () => void;
  elevation?: 1 | 2 | 3 | 4 | 5;
}

export default function MaterialCard({
  children,
  variant = 'elevated',
  href,
  className = '',
  onClick,
  elevation,
}: MaterialCardProps) {
  const baseClass = 'md-card';
  const variantClass = variant !== 'elevated' ? `md-card-${variant}` : '';
  const elevationClass = elevation ? `md-elevation-${elevation}` : '';

  const cardClass = `${baseClass} ${variantClass} ${elevationClass} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div className={`${cardClass} cursor-pointer md-ripple`} onClick={onClick} role="button" tabIndex={0}>
        {children}
      </div>
    );
  }

  return <div className={cardClass}>{children}</div>;
}

// Subcomponents for card structure
export function MaterialCardMedia({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`md-card-media ${className}`}>{children}</div>;
}

export function MaterialCardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`md-card-content ${className}`} style={{ padding: 'var(--md-sys-spacing-4)' }}>
      {children}
    </div>
  );
}

export function MaterialCardActions({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`md-card-actions ${className}`}
      style={{
        padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)',
        display: 'flex',
        gap: 'var(--md-sys-spacing-2)',
      }}
    >
      {children}
    </div>
  );
}
