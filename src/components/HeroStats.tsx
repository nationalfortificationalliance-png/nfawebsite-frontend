'use client';

interface HeroStat {
    value: string | number;
    label: string;
    small?: boolean;
}

export default function HeroStats({ items }: { items: HeroStat[] }) {
    return (
        <div className="hero-stats">
            {items.map((item, index) => (
                <div className="hero-stat" key={index}>
                    <div className="hero-stat-num" style={item.small ? { fontSize: '1.1rem' } : undefined}>{item.value}</div>
                    <div className="hero-stat-label">{item.label}</div>
                </div>
            ))}

            <style jsx>{`
                .hero-stats {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1.75rem;
                    margin-top: 1.75rem;
                }
                .hero-stat { color: #fff; }
                .hero-stat-num { font-size: 1.6rem; font-weight: 800; line-height: 1; }
                .hero-stat-label { font-size: 0.78rem; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.3rem; }
            `}</style>
        </div>
    );
}
