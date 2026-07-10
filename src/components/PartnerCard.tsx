import Image from 'next/image';
import type { Partner } from '@/lib/api';
import { getStrapiMediaUrl } from '@/lib/api';

const PARTNER_COLORS: Record<string, string> = {
    lead: '#007DBC',
    government: '#003366',
    'un-agency': '#009A44',
    'civil-society': '#F2A900',
    'private-sector': '#6c757d',
    donor: '#7b1fa2',
};

const PARTNER_ICONS: Record<string, string> = {
    lead: '🌍',
    government: '🏛',
    'un-agency': '🌐',
    'civil-society': '🤝',
    'private-sector': '🏭',
    donor: '💎',
};

interface PartnerCardProps {
    partner: Partner;
}

export default function PartnerCard({ partner }: PartnerCardProps) {
    const { name, logo, description, partner_type } = partner;
    const logoUrl = getStrapiMediaUrl(logo?.url);
    const hasLogo = !!logo?.url;
    const accentColor = PARTNER_COLORS[partner_type] || '#007DBC';
    const icon = PARTNER_ICONS[partner_type] || '🤝';

    return (
        <div className="card partner-card">
            <style>{`
        .partner-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem 1.5rem;
          gap: 1rem;
        }
        .partner-logo-wrap {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--color-gray-100);
        }
        .partner-logo-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          border-radius: 14px;
        }
        .partner-type-badge {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 0.2rem 0.7rem;
          border-radius: 100px;
          border: 1.5px solid;
        }
        .partner-name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-navy);
          line-height: 1.3;
        }
        .partner-desc {
          font-size: 0.825rem;
          color: var(--color-gray-600);
          line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .partner-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--color-primary);
          font-size: 0.8rem;
          font-weight: 600;
          margin-top: auto;
          transition: gap 0.2s;
        }
        .partner-link:hover { gap: 0.6rem; }
      `}</style>

            {/* Logo */}
            <div className="partner-logo-wrap">
                {hasLogo ? (
                    <Image
                        src={logoUrl}
                        alt={`${name} logo`}
                        width={80}
                        height={80}
                        style={{ objectFit: 'contain' }}
                    />
                ) : (
                    <div
                        className="partner-logo-placeholder"
                        style={{ background: `${accentColor}18` }}
                    >
                        {icon}
                    </div>
                )}
            </div>

            {/* Type badge */}
            <span
                className="partner-type-badge"
                style={{ color: accentColor, borderColor: `${accentColor}40`, background: `${accentColor}10` }}
            >
                {partner_type?.replace('-', ' ')}
            </span>

            {/* Name */}
            <h3 className="partner-name">{name}</h3>

            {/* Description */}
            {description && <p className="partner-desc">{description}</p>}

            {/* Partner website links are temporarily disabled at the request of the NFA secretariat (July 2026). */}
        </div>
    );
}
