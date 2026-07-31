'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/Icon';
import { getStrapiMediaUrl, formatFileSize } from '@/lib/api';
import type { Report } from '@/lib/api';

interface ReportsRepositoryProps {
    reports: Report[];
}

function splitTags(value?: string): string[] {
    if (!value) return [];
    return value.split(',').map((v) => v.trim()).filter(Boolean);
}

function uniqueSorted(values: string[]): string[] {
    return Array.from(new Set(values)).sort();
}

export default function ReportsRepository({ reports }: ReportsRepositoryProps) {
    const [search, setSearch] = useState('');
    const [year, setYear] = useState('all');
    const [agency, setAgency] = useState('all');
    const [reportType, setReportType] = useState('all');
    const [foodVehicle, setFoodVehicle] = useState('all');
    const [topic, setTopic] = useState('all');

    const years = useMemo(() => uniqueSorted(reports.map((r) => r.year)).reverse(), [reports]);
    const agencies = useMemo(() => uniqueSorted(reports.map((r) => r.agency)), [reports]);
    const reportTypes = useMemo(() => uniqueSorted(reports.map((r) => r.report_type)), [reports]);
    const foodVehicles = useMemo(
        () => uniqueSorted(reports.flatMap((r) => splitTags(r.food_vehicles))),
        [reports]
    );
    const topics = useMemo(
        () => uniqueSorted(reports.flatMap((r) => splitTags(r.topics))),
        [reports]
    );

    const filtered = reports.filter((r) => {
        if (year !== 'all' && r.year !== year) return false;
        if (agency !== 'all' && r.agency !== agency) return false;
        if (reportType !== 'all' && r.report_type !== reportType) return false;
        if (foodVehicle !== 'all' && !splitTags(r.food_vehicles).includes(foodVehicle)) return false;
        if (topic !== 'all' && !splitTags(r.topics).includes(topic)) return false;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            const haystack = `${r.title} ${r.description ?? ''} ${r.food_vehicles ?? ''} ${r.topics ?? ''}`.toLowerCase();
            if (!haystack.includes(q)) return false;
        }
        return true;
    });

    const hasActiveFilters = year !== 'all' || agency !== 'all' || reportType !== 'all' || foodVehicle !== 'all' || topic !== 'all' || search.trim() !== '';

    const resetFilters = () => {
        setSearch('');
        setYear('all');
        setAgency('all');
        setReportType('all');
        setFoodVehicle('all');
        setTopic('all');
    };

    return (
        <>
            <style>{`
                .reports-toolbar {
                    background: #fff;
                    border: 1px solid var(--border-light);
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-top: 2.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .reports-search {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .reports-search svg { position: absolute; left: 0.9rem; color: var(--text-muted); }
                .reports-search input {
                    width: 100%;
                    padding: 0.7rem 1rem 0.7rem 2.5rem;
                    border: 1px solid var(--border-light);
                    border-radius: 10px;
                    font-size: 0.9rem;
                }
                .reports-search input:focus { outline: none; border-color: var(--wfp-blue); }
                .reports-filters {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    gap: 0.75rem;
                }
                .reports-filters select {
                    width: 100%;
                    padding: 0.6rem 0.75rem;
                    border: 1px solid var(--border-light);
                    border-radius: 10px;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    background: #fff;
                }
                .reports-filters select:focus { outline: none; border-color: var(--wfp-blue); }
                .reports-reset {
                    align-self: flex-start;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: var(--wfp-blue);
                }
                .reports-reset:hover { text-decoration: underline; }
                .reports-count {
                    font-size: 0.875rem;
                    color: var(--color-gray-400);
                    margin: 1.5rem 0 0.5rem;
                }
                .reports-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                    margin-top: 1rem;
                }
                .report-card {
                    background: #fff;
                    border: 1px solid var(--border-light);
                    border-radius: 16px;
                    padding: 1.75rem;
                    display: flex;
                    gap: 1.25rem;
                    transition: all 0.3s ease;
                }
                .report-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
                    border-color: var(--wfp-blue-light);
                }
                .report-icon {
                    width: 48px;
                    height: 48px;
                    background: var(--wfp-blue-light);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--wfp-blue);
                    flex-shrink: 0;
                }
                .report-info { flex: 1; min-width: 0; }
                .report-title { font-weight: 700; font-size: 1.02rem; color: var(--text-primary); margin-bottom: 0.4rem; }
                .report-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.75rem; }
                .report-meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem; }
                .report-badge {
                    display: inline-block;
                    background: var(--wfp-blue-light);
                    color: var(--wfp-blue);
                    font-size: 0.72rem;
                    font-weight: 700;
                    padding: 0.2rem 0.65rem;
                    border-radius: 999px;
                }
                .report-badge.agency { background: var(--wfp-gold-light, #fef3c7); color: var(--wfp-gold, #b45309); }
                .report-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.75rem; }
                .report-tag {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    background: var(--bg-off);
                    padding: 0.15rem 0.55rem;
                    border-radius: 999px;
                }
                .report-download {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--wfp-blue);
                }
                .report-download:hover { text-decoration: underline; }
                .reports-empty {
                    text-align: center;
                    padding: 4rem 2rem;
                    color: var(--text-muted);
                }
                .reports-empty-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: var(--wfp-green-light, #e6f4ee);
                    color: var(--wfp-green, #008751);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.1rem;
                }
                .reports-empty-title { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.4rem; }
            `}</style>

            <div className="reports-toolbar">
                <div className="reports-search">
                    <Icon name="search" size={16} />
                    <input
                        type="text"
                        placeholder="Search reports by title, topic, or food vehicle..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="reports-filters">
                    <select value={year} onChange={(e) => setYear(e.target.value)}>
                        <option value="all">All Years</option>
                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select value={agency} onChange={(e) => setAgency(e.target.value)}>
                        <option value="all">All Agencies</option>
                        {agencies.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                        <option value="all">All Report Types</option>
                        {reportTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select value={foodVehicle} onChange={(e) => setFoodVehicle(e.target.value)}>
                        <option value="all">All Food Vehicles</option>
                        {foodVehicles.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                        <option value="all">All Topics</option>
                        {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                {hasActiveFilters && (
                    <button type="button" className="reports-reset" onClick={resetFilters}>
                        <Icon name="x" size={14} /> Clear filters
                    </button>
                )}
            </div>

            {reports.length > 0 && (
                <p className="reports-count">Showing {filtered.length} of {reports.length} reports</p>
            )}

            {filtered.length === 0 ? (
                <div className="reports-empty">
                    <div className="reports-empty-icon">
                        <Icon name="file-text" size={26} />
                    </div>
                    <h3 className="reports-empty-title">
                        {reports.length === 0 ? 'Reports will be published here shortly' : 'No reports match your filters'}
                    </h3>
                    <p>
                        {reports.length === 0
                            ? 'Compliance, surveillance, and evaluation reports from NAFDAC, SON, FCCPC, and partners will appear here as they are added.'
                            : 'Try adjusting or clearing your search and filters.'}
                    </p>
                    {reports.length > 0 && hasActiveFilters && (
                        <button type="button" className="reports-reset" style={{ marginTop: '1rem' }} onClick={resetFilters}>
                            <Icon name="x" size={14} /> Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="reports-grid">
                    {filtered.map((report) => {
                        const publishedDate = report.published_date
                            ? new Date(report.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                            : null;
                        const fileUrl = report.file ? getStrapiMediaUrl(report.file.url) : null;
                        const fileSizeLabel = formatFileSize(report.file?.size) || report.file_size;
                        return (
                            <div key={report.id} className="report-card">
                                <div className="report-icon">
                                    <Icon name="file-text" size={24} />
                                </div>
                                <div className="report-info">
                                    <div className="report-title">{report.title}</div>
                                    {report.description && <div className="report-desc">{report.description}</div>}
                                    <div className="report-meta">
                                        <span className="report-badge">{report.year}</span>
                                        <span className="report-badge agency">{report.agency}</span>
                                        <span>{report.report_type}</span>
                                        {publishedDate && <span>{publishedDate}</span>}
                                        {fileSizeLabel && <span>{fileSizeLabel}</span>}
                                    </div>
                                    {(report.food_vehicles || report.topics) && (
                                        <div className="report-tags">
                                            {splitTags(report.food_vehicles).map((v) => <span key={v} className="report-tag">{v}</span>)}
                                            {splitTags(report.topics).map((t) => <span key={t} className="report-tag">{t}</span>)}
                                        </div>
                                    )}
                                    {fileUrl && (
                                        <a href={fileUrl} download className="report-download">
                                            <Icon name="arrow-right" size={14} /> Download
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
