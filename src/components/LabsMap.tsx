'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
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
    const [mapCanvasHeight, setMapCanvasHeight] = useState<number>();
    const mapCanvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = mapCanvasRef.current;
        if (!canvas) return;

        const updateHeight = () => setMapCanvasHeight(Math.round(canvas.getBoundingClientRect().height));
        updateHeight();
        const observer = new ResizeObserver(updateHeight);
        observer.observe(canvas);
        return () => observer.disconnect();
    }, []);

    const pinned = labs.filter((lab) => typeof lab.latitude === 'number' && typeof lab.longitude === 'number');

    if (pinned.length === 0) return null;

    return (
        <div
            className="labs-map-wrap"
            style={{ '--labs-map-canvas-height': mapCanvasHeight ? `${mapCanvasHeight}px` : undefined } as CSSProperties}
        >
            <style>{`
                .labs-map-wrap {
                    margin-top: 2.5rem;
                    background: #fff;
                    border: 1px solid var(--border-light);
                    border-radius: 16px;
                    padding: 1.5rem;
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 300px;
                    gap: 1.5rem;
                    align-items: stretch;
                }
                @media (max-width: 768px) {
                    .labs-map-wrap { grid-template-columns: 1fr; padding: 1.25rem; gap: 1.25rem; }
                    .labs-map-side { height: auto; }
                    .labs-map-list { max-height: 320px; }
                }
                @media (max-width: 400px) {
                    .labs-map-wrap { padding: 1rem; border-radius: 14px; }
                    .labs-map-svg-box { padding: 0.5rem; }
                }
                .labs-map-svg-box {
                    width: 100%;
                    background: var(--bg-off, #f1f5f9);
                    border-radius: 12px;
                    padding: 0.75rem;
                }
                .labs-map-svg-box svg { width: 100%; height: auto; display: block; }
                .labs-map-state {
                    fill: #cbd8e6;
                    stroke: #fff;
                    stroke-width: 1.1;
                    transition: fill 0.15s ease;
                }
                .labs-map-state:hover { fill: #b7c8db; }
                .labs-map-pin {
                    cursor: pointer;
                    fill: var(--wfp-blue);
                    stroke: #fff;
                    stroke-width: 1.6;
                    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.35));
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

                .labs-map-side { display: flex; flex-direction: column; gap: 0.75rem; height: var(--labs-map-canvas-height, auto); min-height: 0; }
                .labs-map-hint {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.78rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .labs-map-hint svg { color: var(--wfp-blue); }

                .labs-map-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                    flex: 1;
                    min-height: 0;
                    max-height: none;
                    overflow-y: auto;
                    padding-right: 0.25rem;
                }
                .labs-map-card {
                    text-align: left;
                    cursor: pointer;
                    border: 1px solid var(--border-light);
                    border-radius: 12px;
                    padding: 0.75rem 0.85rem;
                    background: var(--bg-off, #f8fafc);
                    transition: all 0.15s ease;
                }
                .labs-map-card:hover {
                    border-color: var(--wfp-blue-light);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                }
                .labs-map-card.active {
                    background: var(--wfp-blue-light);
                    border-color: var(--wfp-blue);
                }
                .labs-map-card .lab-name { font-weight: 700; font-size: 0.9rem; color: var(--text-primary); margin-bottom: 0.35rem; }
                .labs-map-card .lab-location, .labs-map-card .lab-contact {
                    display: flex; align-items: center; gap: 0.4rem;
                    font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem;
                }
                .labs-map-directions {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-size: 0.78rem;
                    font-weight: 700;
                    color: var(--wfp-blue);
                    margin-top: 0.35rem;
                }
                .labs-map-directions:hover { text-decoration: underline; }
                .labs-map-tooltip { pointer-events: none; }
                .labs-map-tooltip rect { fill: #102a43; stroke: #fff; stroke-width: 1; }
                .labs-map-tooltip text { fill: #fff; font-size: 11px; font-weight: 600; }
            `}</style>

            <div>
                <div className="labs-map-svg-box" ref={mapCanvasRef}>
                    <svg viewBox={nigeriaMap.viewBox} aria-label={nigeriaMap.label}>
                        {nigeriaMap.locations.map((state) => (
                            <path key={state.id} d={state.path} className="labs-map-state" />
                        ))}
                        {pinned.map((lab) => {
                            const { x, y } = project(lab.latitude!, lab.longitude!);
                            const isActive = lab.id === activeId;
                            const tooltipX = Math.min(Math.max(x - 100, 8), VIEW_W - 208);
                            const tooltipY = Math.max(y - 64, 8);
                            return (
                                <g key={lab.id} onMouseEnter={() => setActiveId(lab.id)} onFocus={() => setActiveId(lab.id)}>
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r={isActive ? 8 : 6}
                                        tabIndex={0}
                                        className={`labs-map-pin${isActive ? ' active' : ''}`}
                                        onClick={() => setActiveId(isActive ? null : lab.id)}
                                    >
                                        <title>{lab.name} — {lab.location} — {lab.contact}</title>
                                    </circle>
                                    {isActive && (
                                        <g className="labs-map-tooltip" transform={`translate(${tooltipX} ${tooltipY})`}>
                                            <rect width="200" height="52" rx="6" />
                                            <text x="10" y="20">{lab.name}</text>
                                            <text x="10" y="38">{lab.location} · {lab.contact}</text>
                                        </g>
                                    )}
                                </g>
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
                <p className="labs-map-hint">
                    <Icon name="microscope" size={15} /> {pinned.length} Approved Laboratories
                </p>
                <div className="labs-map-list">
                    {pinned.map((lab) => {
                        const isActive = lab.id === activeId;
                        return (
                            <div
                                key={lab.id}
                                role="button"
                                tabIndex={0}
                                className={`labs-map-card${isActive ? ' active' : ''}`}
                                onClick={() => setActiveId(isActive ? null : lab.id)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') setActiveId(isActive ? null : lab.id);
                                }}
                            >
                                <div className="lab-name">{lab.name}</div>
                                <div className="lab-location"><Icon name="map-pin" size={13} />{lab.location}</div>
                                <div className="lab-contact"><Icon name="phone" size={13} />{lab.contact}</div>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${lab.latitude},${lab.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="labs-map-directions"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Icon name="external-link" size={13} /> Get Directions
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
