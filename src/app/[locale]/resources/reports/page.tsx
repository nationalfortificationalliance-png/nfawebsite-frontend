import type { Metadata } from 'next';
import Link from 'next/link';
import { getReports, getComplianceReports } from '@/lib/api';
import ReportsRepository from '@/components/ReportsRepository';
import ComplianceDashboard from '@/components/ComplianceDashboard';

export const metadata: Metadata = {
    title: 'Reports & Data | National Fortification Alliance',
    description: 'Searchable repository of compliance, surveillance, and evaluation reports, plus the national fortification compliance dashboard.',
};

export const revalidate = 60;

export default async function ReportsDataPage() {
    const [reports, complianceReports] = await Promise.all([
        getReports(),
        getComplianceReports(),
    ]);

    return (
        <main className="reports-data-page">
            <style>{`
                .rd-hero {
                    position: relative;
                    min-height: 300px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    background: linear-gradient(135deg, rgba(0, 82, 73, 0.94) 0%, rgba(6, 78, 59, 0.9) 100%);
                }
                .rd-hero-content { position: relative; z-index: 2; padding: 3.5rem 0 2.75rem; }
                .rd-hero .breadcrumb { justify-content: flex-start; margin-bottom: 1.5rem; }
                .rd-hero .breadcrumb a, .rd-hero .breadcrumb span { color: rgba(255,255,255,0.8); }
                .rd-hero .breadcrumb a:hover { color: #fff; }
                .rd-hero h1 { color: #fff; max-width: 720px; margin-bottom: 1rem; }
                .rd-hero p { color: rgba(255,255,255,0.95); max-width: 720px; font-size: 1.1rem; line-height: 1.7; }
            `}</style>

            <div className="rd-hero">
                <div className="container rd-hero-content">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <Link href="/resources">Resources</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span>Reports &amp; Data</span>
                    </div>
                    <h1>Reports &amp; Data</h1>
                    <p>
                        National fortification compliance figures and a searchable repository of compliance, surveillance, and evaluation reports from NAFDAC, SON, FCCPC, and partners.
                    </p>
                </div>
            </div>

            <section className="section" id="dashboard" style={{ scrollMarginTop: '100px' }}>
                <div className="container">
                    <p className="section-eyebrow">Compliance Dashboard</p>
                    <h2 className="section-title">National Fortification Compliance</h2>
                    <p className="section-lead">
                        Annual compliance figures for mandatory fortification vehicles across Nigeria, tracked year by year.
                    </p>
                    <ComplianceDashboard reports={complianceReports} />
                </div>
            </section>

            <section className="section" id="repository" style={{ background: 'var(--bg-off)', scrollMarginTop: '100px' }}>
                <div className="container">
                    <p className="section-eyebrow">Downloads</p>
                    <h2 className="section-title">Reports Repository</h2>
                    <p className="section-lead">
                        Search and filter compliance, surveillance, laboratory, and evaluation reports by year, agency, report type, food vehicle, or topic.
                    </p>
                    <ReportsRepository reports={reports} />
                </div>
            </section>
        </main>
    );
}
