'use client';

import { useState } from 'react';
import nigeriaMapData from '@svg-maps/nigeria';
import Icon from '@/components/Icon';
import type { Laboratory } from '@/lib/api';

interface SvgMapLocation {
    id: string;
    name: string;
    path: string;
}

const nigeriaMap = nigeriaMapData as unknown as { viewBox: string; label: string; locations: SvgMapLocation[] };

interface LabsMapProps {
    labs: Laboratory[];
}

// Nigeria's real-world geographic extent (approx.), which the @svg-maps/nigeria
// viewBox is a direct equirectangular projection of.
const LON_MIN = 2.668;
const LON_MAX = 14.678;
const LAT_MIN = 4.270;
const LAT_MAX = 13.892;
const [VIEW_W, VIEW_H] = nigeriaMap.viewBox.split(' ').slice(2).map(Number);

function project(lat: number, lng: number): { x: number; y: number } {
    const x = ((lng - LON_MIN) / (LON_MAX - LON_MIN)) * VIEW_W;
    const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * VIEW_H;
    return { x, y };
}

export default function LabsMap({ labs }: LabsMapProps) {
    const [activeId, setActiveId] = useState<number | null>(null);

    const pinned = labs.filter((lab) => typeof lab.latitude === 'number' && typeof lab.longitude === 'number');

    if (pinned.length === 0) return null;

    const activeLab = pinned.find((lab) => lab.id === activeId) ?? null;

    return (
        <div className="labs-map-wrap">
            <style>{`
                .labs-map-wrap {
                    margin-top: 2.5rem;
                    background: #fff;
                    border: 1px solid var(--border-light);
                    border-radius: 16px;
                    padding: 1.5rem;
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 260px;
                    gap: 1.5rem;
                    align-items: start;
                }
                @media (max-width: 720px) {
                    .labs-map-wrap { grid-template-columns: 1fr; }
                }
                .labs-map-svg-box { width: 100%; }
                .labs-map-svg-box svg { width: 100%; height: auto; display: block; }
                .labs-map-state {
                    fill: var(--bg-off, #f1f5f9);
                    stroke: #fff;
                    stroke-width: 0.6;
                }
                .labs-map-pin {
                    cursor: pointer;
                    fill: var(--wfp-blue);
                    stroke: #fff;
                    stroke-width: 1.4;
                    transition: r 0.15s ease, fill 0.15s ease;
                }
                .labs-map-pin:hover, .labs-map-pin.active {
                    fill: var(--wfp-red, #dc2626);
                }
                .labs-map-attribution {
                    font-size: 0.68rem;
                    color: var(--text-muted);
                    margin-top: 0.5rem;
                    text-align: right;
                }
                .labs-map-attribution a { color: inherit; }
                .labs-map-side { display: flex; flex-direction: column; gap: 0.5rem; }
                .labs-map-hint { font-size: 0.8rem; color: var(--text-muted); }
                .labs-map-detail {
                    border: 1px solid var(--border-light);
                    border-radius: 12px;
                    padding: 1rem;
                    background: var(--bg-off, #f8fafc);
                }
                .labs-map-detail .lab-name { font-weight: 700; font-size: 0.98rem; color: var(--text-primary); margin-bottom: 0.5rem; }
                .labs-map-detail .lab-location, .labs-map-detail .lab-contact {
                    display: flex; align-items: center; gap: 0.4rem;
                    font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.35rem;
                }
                .labs-map-directions {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--wfp-blue);
                    margin-top: 0.4rem;
                }
                .labs-map-directions:hover { text-decoration: underline; }
                .labs-map-list { display: flex; flex-direction: column; gap: 0.3rem; max-height: 220px; overflow-y: auto; }
                .labs-map-list-item {
                    text-align: left;
                    font-size: 0.82rem;
                    padding: 0.4rem 0.6rem;
                    border-radius: 8px;
                    border: 1px solid transparent;
                    color: var(--text-secondary);
                }
                .labs-map-list-item:hover { background: var(--bg-off, #f1f5f9); }
                .labs-map-list-item.active {
                    background: var(--wfp-blue-light);
                    color: var(--wfp-blue);
                    border-color: var(--wfp-blue-light);
                    font-weight: 600;
                }
            `}</style>

            <div>
                <div className="labs-map-svg-box">
                    <svg viewBox={nigeriaMap.viewBox} aria-label={nigeriaMap.label}>
                        {nigeriaMap.locations.map((state) => (
                            <path key={state.id} d={state.path} className="labs-map-state" />
                        ))}
                        {pinned.map((lab) => {
                            const { x, y } = project(lab.latitude!, lab.longitude!);
                            const isActive = lab.id === activeId;
                            return (
                                <circle
                                    key={lab.id}
                                    cx={x}
                                    cy={y}
                                    r={isActive ? 8 : 6}
                                    className={`labs-map-pin${isActive ? ' active' : ''}`}
                                    onClick={() => setActiveId(isActive ? null : lab.id)}
                                >
                                    <title>{lab.name} — {lab.location}</title>
                                </circle>
                            );
                        })}
                    </svg>
                </div>
                <p className="labs-map-attribution">
                    Map data &copy;{' '}
                    <a href="https://github.com/VictorCazanave/svg-maps" target="_blank" rel="noopener noreferrer">svg-maps</a>
                    {' '}(CC BY 4.0). Lab pin locations are approximate.
                </p>
            </div>

            <div className="labs-map-side">
                <p className="labs-map-hint">Click a pin to see laboratory details.</p>
                {activeLab ? (
                    <div className="labs-map-detail">
                        <div className="lab-name">{activeLab.name}</div>
                        <div className="lab-location"><Icon name="map-pin" size={14} />{activeLab.location}</div>
                        <div className="lab-contact"><Icon name="phone" size={14} />{activeLab.contact}</div>
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${activeLab.latitude},${activeLab.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="labs-map-directions"
                        >
                            <Icon name="external-link" size={14} /> Get Directions
                        </a>
                    </div>
                ) : null}
                <div className="labs-map-list">
                    {pinned.map((lab) => (
                        <button
                            key={lab.id}
                            type="button"
                            className={`labs-map-list-item${lab.id === activeId ? ' active' : ''}`}
                            onClick={() => setActiveId(lab.id === activeId ? null : lab.id)}
                        >
                            {lab.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
