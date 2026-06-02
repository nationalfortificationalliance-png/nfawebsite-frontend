import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'filled' | 'outlined' | 'text' | 'tonal';
type ButtonSize = 'small' | 'medium' | 'large';

interface MaterialButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconEnd?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function MaterialButton({
  children,
  variant = 'filled',
  size = 'medium',
  href,
  onClick,
  disabled = false,
  fullWidth = false,
  icon,
  iconEnd,
  className = '',
  type = 'button',
}: MaterialButtonProps) {
  const baseClass = 'md-button md-ripple';
  const variantClass = `md-button-${variant}`;

  const sizeStyles = {
    small: { padding: '6px 16px', fontSize: '13px' },
    medium: { padding: '10px 24px', fontSize: '14px' },
    large: { padding: '14px 28px', fontSize: '15px' },
  };

  const buttonClass = `${baseClass} ${variantClass} ${fullWidth ? 'w-full' : ''} ${className}`.trim();
  const buttonStyle = sizeStyles[size];

  const content = (
    <>
      {icon && <span className="md-button-icon">{icon}</span>}
      <span className="md-button-label">{children}</span>
      {iconEnd && <span className="md-button-icon">{iconEnd}</span>}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={buttonClass}
        style={buttonStyle}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClass}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
