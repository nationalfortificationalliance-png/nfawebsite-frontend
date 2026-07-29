'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import LanguageSwitcher from './LanguageSwitcher';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
    dropdown: [
      { label: 'Overview', href: '/about' },
      { label: 'Governance', href: '/about/governance' },
      { label: 'Secretariat', href: '/about/secretariat' },
    ]
  },
  { label: 'Initiatives', href: '/initiatives' },
  { label: 'News & Events', href: '/news' },
  { label: 'Resources', href: '/resources' },
  { label: 'Partners', href: '/partners' },
  { label: 'FAQ', href: '/faq' },
];

const HOME_LOCALES = new Set(['en', 'ha', 'ig', 'yo']);

function isActivePath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/' || pathname === '';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header({ siteName }: { siteName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname() || '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const pathSegments = pathname.split('/').filter(Boolean);
  const isHome = pathSegments.length === 0 || (pathSegments.length === 1 && HOME_LOCALES.has(pathSegments[0]));

  return (
    <>
      <style>{`
        /* ── Modern Navigation — Clean, approachable, responsive ── */
        .site-header {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          width: 100%;
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }

        .site-header.scrolled .header-glass {
          background: rgba(255, 255, 255, 0.94);
          border-bottom-color: rgba(148, 163, 184, 0.18);
          box-shadow: var(--shadow-sm);
        }

        .site-header.scrolled .header-bar {
          min-height: 76px;
        }

        .header-wrap {
          position: relative;
          width: 100%;
        }

        .header-glass {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(36px);
          -webkit-backdrop-filter: blur(36px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 14px 40px rgba(15, 23, 42, 0.06);
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .header-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 60%);
          pointer-events: none;
        }

        .header-bar {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.7rem clamp(1rem, 6vw, 4rem);
          margin: 0 auto;
          max-width: var(--container);
          min-height: 84px;
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .header-bar {
            min-height: 78px;
            gap: 1rem;
          }
        }

        @media (max-width: 800px) {
          .header-bar {
            min-height: 64px;
            padding: 0.65rem 1rem;
          }
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 0.85rem;
          flex-shrink: 0;
          margin-right: auto;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.05;
        }

        .logo-emblem {
          width: 112px;
          height: 112px;
          border-radius: 1rem;
          background: rgba(0, 135, 81, 0.1);
          display: grid;
          place-items: center;
          overflow: hidden;
        }

        .logo-name {
          display: block;
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text-primary);
        }

        @media (max-width: 800px) {
          .logo-emblem {
            width: 70px;
            height: 70px;
          }

          .logo-name {
            font-size: 0.95rem;
          }
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .nav-item {
          position: relative;
        }

        .nav-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.72rem 1rem;
          border-radius: 999px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
          white-space: nowrap;
          position: relative;
        }

        .nav-link:hover {
          transform: translateY(-1px);
          color: var(--wfp-green-dark);
          background: rgba(0, 135, 81, 0.08);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 14%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 3px;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--wfp-green), var(--wfp-gold));
          transition: width 0.25s ease;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 2.2rem;
        }

        .nav-link.active {
          color: var(--wfp-green-dark);
          font-weight: 700;
          background: rgba(0, 135, 81, 0.12);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.06);
        }

        .dropdown-arrow {
          margin-left: 0.4rem;
          font-size: 0.85rem;
          opacity: 1;
          transition: transform 0.25s ease;
        }

        .nav-item:hover .dropdown-arrow {
          transform: rotate(180deg);
        }

        .dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          min-width: 210px;
          background: #ffffff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 0.5rem 0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-12px);
          transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
          z-index: 50;
        }

        .nav-item:hover .dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown a {
          display: block;
          padding: 0.85rem 1.25rem;
          font-size: 0.93rem;
          font-weight: 500;
          color: var(--text-primary);
          transition: background 0.2s ease, color 0.2s ease;
          border-bottom: 1px solid var(--border-light);
        }

        .dropdown a:last-child {
          border-bottom: none;
        }

        .dropdown a:hover {
          background: var(--wfp-blue-light);
          color: var(--wfp-green-dark);
        }

        .dropdown a.active {
          color: var(--wfp-green-dark);
          font-weight: 700;
        }

        .header-cta {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }

        .btn-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.85rem 1.5rem;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--wfp-gold), #d09900);
          color: var(--wfp-navy);
          font-weight: 700;
          font-size: 0.92rem;
          letter-spacing: 0.01em;
          box-shadow: 0 12px 28px rgba(245, 158, 11, 0.18);
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }

        .btn-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 32px rgba(245, 158, 11, 0.22);
          background: linear-gradient(90deg, #f59e0b, #d07e00);
        }

        .hamburger {
          display: none;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: rgba(255, 255, 255, 0.86);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 1rem;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0.75rem;
          transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }

        .hamburger:hover {
          background: rgba(255, 255, 255, 0.98);
          transform: translateY(-1px);
        }

        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          border-radius: 999px;
          background: var(--text-primary);
          transition: transform 0.25s ease, opacity 0.25s ease;
        }

        .hamburger.active span:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }

        .mobile-menu {
          position: absolute;
          top: calc(100% + 0.75rem);
          left: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 1.25rem;
          box-shadow: var(--shadow-xl);
          overflow: hidden;
          z-index: 40;
        }

        .mobile-menu-inner {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.75rem 0;
        }

        .mobile-menu a {
          display: block;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          transition: background 0.2s ease, color 0.2s ease;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        }

        .mobile-menu a:hover {
          background: rgba(0, 135, 81, 0.08);
          color: var(--wfp-green-dark);
        }

        .mobile-menu a.active {
          color: var(--wfp-green-dark);
        }

        .mobile-submenu {
          padding-left: 1rem;
          border-left: 1px solid rgba(226, 232, 240, 0.9);
        }

        .mobile-submenu a {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-secondary);
          padding: 0.85rem 1.5rem;
          background: rgba(247, 250, 252, 0.8);
        }

        .mobile-submenu a:hover {
          color: var(--wfp-green-dark);
        }

        .mobile-cta {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 0.75rem 1rem 1rem;
        }

        .mobile-cta .btn-cta {
          width: 100%;
          padding: 1rem;
          justify-content: center;
        }

        @media (max-width: 800px) {
          .nav-links {
            display: none;
          }

          .header-cta .btn-cta {
            display: none;
          }

          .hamburger {
            display: inline-flex;
          }
        }
      `}</style>

      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="header-wrap">
          {/* Glassmorphism Background */}
          <div className="header-glass"></div>

          {/* Subtle Gradient Overlay */}
          <div className="header-gradient"></div>

          <div className="header-bar">
            {/* Logo */}
            <Link href="/" className="logo">
              <div className="logo-emblem" style={{ background: 'transparent' }}>
                <Image src="/logo.png" alt="NFA Logo" width={118} height={118} style={{ objectFit: 'contain' }} priority />
              </div>
              {/* <div className="logo-text">
                <span className="logo-name">National Fortification Alliance</span>
              </div> */}
            </Link>

            {/* Desktop nav */}
            <nav className="nav-links">
              {NAV_LINKS.map((item) => (
                <div key={item.href} className="nav-item">
                  <Link
                    href={item.href}
                    className={`nav-link ${isActivePath(pathname, item.href) ? 'active' : ''}`}
                    aria-current={isActivePath(pathname, item.href) ? 'page' : undefined}
                  >
                    {item.label}
                    {'dropdown' in item && <span className="dropdown-arrow">▼</span>}
                  </Link>
                  {'dropdown' in item && item.dropdown && (
                    <div className="dropdown">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={isActivePath(pathname, subItem.href) ? 'active' : ''}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA - Asedo Style */}
            <div className="header-cta">
              {/* <LanguageSwitcher /> */}
              <Link
                href="/contact"
                className="btn btn-primary btn-sm btn-cta"
              >
                CONTACT US
              </Link>
            </div>

            {/* Hamburger */}
            <button
              className={`hamburger${menuOpen ? ' active' : ''}`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-inner">
              {NAV_LINKS.map((item) => (
                <div key={item.href}>
                  <Link href={item.href} className={isActivePath(pathname, item.href) ? 'active' : ''}>
                    {item.label}
                  </Link>
                  {'dropdown' in item && item.dropdown && (
                    <div className="mobile-submenu">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={isActivePath(pathname, subItem.href) ? 'active' : ''}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mobile-cta">
                <div style={{ padding: '0 1.5rem' }}>
                  {/* <LanguageSwitcher /> */}
                </div>
                <Link
                  href="/contact"
                  className="btn btn-cta"
                >
                  CONTACT US
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
