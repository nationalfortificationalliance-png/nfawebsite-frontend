import type { ComplianceReport } from '@/lib/api';

interface ComplianceDashboardProps {
    reports: ComplianceReport[];
}

const VEHICLES: { key: keyof ComplianceReport; label: string; color: string }[] = [
    { key: 'national_compliance', label: 'National', color: '#005249' },
    { key: 'salt_compliance', label: 'Salt (Iodized)', color: '#0284c7' },
    { key: 'veg_oil_compliance', label: 'Veg Oil (Vit A)', color: '#b45309' },
    { key: 'flour_compliance', label: 'Flour (Vit A)', color: '#7c3aed' },
    { key: 'sugar_compliance', label: 'Sugar (Vit A)', color: '#dc2626' },
    { key: 'rice_compliance', label: 'Rice', color: '#16a34a' },
    { key: 'bouillon_compliance', label: 'Bouillon', color: '#db2777' },
];

function parsePct(value: string | undefined | null): number | null {
    if (!value) return null;
    const n = parseFloat(value.replace('%', ''));
    return Number.isFinite(n) ? n : null;
}

export default function ComplianceDashboard({ reports }: ComplianceDashboardProps) {
    const sorted = [...reports].sort((a, b) => a.year.localeCompare(b.year));

    if (sorted.length === 0) {
        return (
            <div className="compliance-empty">
                <p>Compliance data will appear here once published.</p>
            </div>
        );
    }

    const width = 640;
    const height = 260;
    const padding = { top: 20, right: 20, bottom: 32, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const xFor = (i: number) => padding.left + (sorted.length === 1 ? chartW / 2 : (i / (sorted.length - 1)) * chartW);
    const yFor = (pct: number) => padding.top + chartH - (pct / 100) * chartH;

    const activeVehicles = VEHICLES.filter((v) => sorted.some((r) => parsePct(r[v.key] as string) !== null));

    return (
        <>
            <style>{`
                .compliance-empty { padding: 3rem 2rem; text-align: center; color: var(--text-muted); }
                .compliance-chart-wrap {
                    background: #fff;
                    border: 1px solid var(--border-light);
                    border-radius: 16px;
                    padding: 1.75rem;
                    margin-top: 2.5rem;
                    overflow-x: auto;
                }
                .compliance-chart-legend {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-bottom: 1.25rem;
                }
                .compliance-legend-item {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.78rem;
                    color: var(--text-secondary);
                    font-weight: 600;
                }
                .compliance-legend-swatch {
                    width: 10px; height: 10px; border-radius: 50%;
                }
                .compliance-table-wrap { margin-top: 2rem; overflow-x: auto; }
                .compliance-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
                .compliance-table th, .compliance-table td {
                    padding: 0.65rem 0.9rem;
                    text-align: left;
                    border-bottom: 1px solid var(--border-light);
                    white-space: nowrap;
                }
                .compliance-table th { color: var(--text-muted); font-weight: 700; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.03em; }
                .compliance-table td { color: var(--text-primary); font-weight: 600; }
                .compliance-source-note { font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem; font-style: italic; }
            `}</style>

            <div className="compliance-chart-wrap">
                <div className="compliance-chart-legend">
                    {activeVehicles.map((v) => (
                        <div key={v.key} className="compliance-legend-item">
                            <span className="compliance-legend-swatch" style={{ background: v.color }} />
                            {v.label}
                        </div>
                    ))}
                </div>
                <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label="Fortification compliance trend by year">
                    {[0, 25, 50, 75, 100].map((tick) => (
                        <g key={tick}>
                            <line
                                x1={padding.left} x2={width - padding.right}
                                y1={yFor(tick)} y2={yFor(tick)}
                                stroke="var(--border-light)" strokeWidth={1}
                            />
                            <text x={padding.left - 10} y={yFor(tick) + 4} textAnchor="end" fontSize={10} fill="var(--text-muted)">
                                {tick}%
                            </text>
                        </g>
                    ))}

                    {activeVehicles.map((v) => {
                        const points = sorted
                            .map((r, i) => {
                                const pct = parsePct(r[v.key] as string);
                                return pct === null ? null : `${xFor(i)},${yFor(pct)}`;
                            })
                            .filter(Boolean)
                            .join(' ');
                        return (
                            <polyline key={v.key} points={points} fill="none" stroke={v.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                        );
                    })}

                    {activeVehicles.map((v) =>
                        sorted.map((r, i) => {
                            const pct = parsePct(r[v.key] as string);
                            if (pct === null) return null;
                            return <circle key={`${v.key}-${r.year}`} cx={xFor(i)} cy={yFor(pct)} r={3.5} fill={v.color} />;
                        })
                    )}

                    {sorted.map((r, i) => (
                        <text key={r.year} x={xFor(i)} y={height - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--text-secondary)">
                            {r.year}
                        </text>
                    ))}
                </svg>
            </div>

            <div className="compliance-table-wrap">
                <table className="compliance-table">
                    <thead>
                        <tr>
                            <th>Year</th>
                            {activeVehicles.map((v) => <th key={v.key}>{v.label}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {[...sorted].reverse().map((r) => (
                            <tr key={r.id}>
                                <td>{r.year}</td>
                                {activeVehicles.map((v) => <td key={v.key}>{(r[v.key] as string) || '—'}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {sorted.some((r) => r.source) && (
                <p className="compliance-source-note">
                    Sources: {Array.from(new Set(sorted.map((r) => r.source).filter(Boolean))).join('; ')}
                </p>
            )}
        </>
    );
}
