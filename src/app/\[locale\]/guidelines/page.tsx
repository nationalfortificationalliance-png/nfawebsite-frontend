import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Icon, { IconName } from '@/components/Icon';
import { getGuidelines } from '@/lib/api';
import GuidelinesClient from '@/components/GuidelinesClient';

export const metadata: Metadata = {
    title: 'Guidelines & Resources',
    description: 'Access NFA regulatory guidelines, technical standards, and training resources for food fortification in Nigeria.',
};
export const revalidate = 60;

const CATEGORIES = ['All', 'Regulatory', 'Technical', 'Operational', 'Training', 'Policy'];

const QUICK_GUIDES: { icon: IconName; title: string; desc: string; type: string }[] = [
    { icon: 'clipboard', title: 'NAFDAC Fortification Regulation', desc: 'The legal mandate for food fortification in Nigeria — applicable to all registered processors.', type: 'Regulatory' },
    { icon: 'microscope', title: 'Technical Standards for Vitamin Premixes', desc: 'WHO-aligned vitamin and mineral premix specifications for wheat flour, maize flour, oil, and sugar.', type: 'Technical' },
    { icon: 'settings', title: 'Food Processor Certification Handbook', desc: 'Step-by-step certification process, equipment requirements, and audit checklist for processors.', type: 'Operational' },
    { icon: 'bar-chart', title: 'Quality Assurance & Testing Protocols', desc: 'In-line and end-product QA methods, acceptable ranges, and corrective action procedures.', type: 'Technical' },
    { icon: 'graduation-cap', title: 'Staff Training Curriculum', desc: 'Fortification training modules for plant operators, quality managers, and NAFDAC inspectors.', type: 'Training' },
    { icon: 'scroll-text', title: 'National Policy on Food Fortification', desc: 'The Federal Government of Nigeria\'s policy framework and multi-sectoral action plan for fortification.', type: 'Policy' },
];

export default async function GuidelinesPage() {
    const docs = await getGuidelines();

    return (
        <>
            <style>{`
        /* Hero */
        .gl-hero { background: var(--wfp-navy); padding: 4.5rem 0 3.5rem; }
        .gl-hero h1 { color: #fff; max-width: 640px; }
        .gl-hero p { color: rgba(255,255,255,.72); font-size: 1.05rem; margin-top: 0.75rem; max-width: 520px; }

        /* Search bar */
        .search-bar { background: #fff; padding: 0 0 0; border-bottom: 1px solid var(--border); position: sticky; top: 100px; z-index: 100; }
        .search-inner { display: flex; align-items: center; gap: 1rem; padding: 1rem 0; flex-wrap: wrap; }
        .search-input-wrap { position: relative; flex: 1; min-width: 220px; }
        .search-input { width: 100%; padding: 0.8rem 1.25rem 0.8rem 3rem; border: 1px solid transparent; box-shadow: var(--shadow-sm); border-radius: var(--radius-full); font-size: 0.95rem; font-family: inherit; transition: all .2s; }
        .search-input:focus { outline: none; box-shadow: 0 0 0 2px var(--wfp-blue), var(--shadow-md); background: #fff; }
        .search-icon { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); opacity: .5; font-size: 1rem; }
        .filter-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .chip { padding: 0.4rem 1.2rem; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 500; border: 1px solid var(--border); background: #fff; color: var(--text-secondary); cursor: pointer; transition: all .2s; }
        .chip:hover, .chip.active { background: var(--wfp-blue-light); color: var(--wfp-blue); border-color: var(--wfp-blue); }

        /* Quick guides grid */
        .quick-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 2.5rem; }
        .quick-card { background: #fff; border: 1px solid transparent; box-shadow: var(--shadow-sm); border-radius: var(--radius-lg); padding: 2rem; display: flex; flex-direction: column; gap: 0.75rem; transition: all .25s var(--ease-out); }
        .quick-card:hover { box-shadow: var(--shadow-md); transform: translateY(-4px); }
        .quick-card-icon { font-size: 1.75rem; }
        .quick-type { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--wfp-blue); }
        .quick-card h3 { font-size: 0.975rem; line-height: 1.35; }
        .quick-card p { font-size: 0.83rem; color: var(--text-muted); line-height: 1.65; flex: 1; }
        .quick-card-footer { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 700; color: var(--wfp-blue); margin-top: 0.25rem; }

        /* Info bar */
        .info-bar { background: var(--wfp-blue-light); border-radius: var(--radius-md); padding: 1.25rem 1.75rem; display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .info-bar-icon { font-size: 1.5rem; flex-shrink: 0; }

        @media (max-width: 900px) { .quick-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 600px) { .quick-grid { grid-template-columns: 1fr; } }
      `}</style>

            {/* ── Hero ── */}
            <div className="gl-hero">
                <div className="container">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link><span className="breadcrumb-sep">›</span><span>Guidelines</span>
                    </div>
                    <h1>Guidelines & Resources</h1>
                    <p>Regulatory documents, technical standards, operational guides, and training materials — everything food processors and inspectors need to implement fortification correctly.</p>
                </div>
            </div>

            <GuidelinesClient docs={docs} />

            {/* ── Request doc CTA ── */}
            <div style={{ background: 'var(--wfp-navy)', padding: '3.5rem 0' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
                    <div>
                        <h3 style={{ color: '#fff', marginBottom: '0.4rem' }}>Can't find what you need?</h3>
                        <p style={{ color: 'rgba(255,255,255,.65)', margin: 0 }}>Contact the NFA Secretariat to request a specific document, translation, or technical guidance.</p>
                    </div>
                    <Link href="/contact" className="btn btn-white">Request a Document →</Link>
                </div>
            </div>
        </>
    );
}
