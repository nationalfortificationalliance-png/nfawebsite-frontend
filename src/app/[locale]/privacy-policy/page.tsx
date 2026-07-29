import type { Metadata } from 'next';
import Link from 'next/link';
import { getPrivacyPolicy } from '@/lib/api';

export const metadata: Metadata = {
    title: 'Privacy Policy | National Fortification Alliance',
    description: 'How the National Fortification Alliance collects, uses, and protects information shared through this website.',
};

export const revalidate = 60;

export default async function PrivacyPolicyPage() {
    const policy = await getPrivacyPolicy();

    const title = policy?.title || 'Privacy Policy';
    const body = policy?.body || '<p>Our Privacy Policy is being finalised and will be published here shortly.</p>';
    const lastUpdated = policy?.last_updated
        ? new Date(policy.last_updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : null;

    return (
        <>
            <style>{`
        .legal-hero { background: var(--wfp-navy); padding: 4rem 0 2.5rem; }
        .legal-hero .breadcrumb { justify-content: flex-start; margin-bottom: 1.5rem; }
        .legal-hero .breadcrumb a, .legal-hero .breadcrumb span { color: rgba(255,255,255,0.75); }
        .legal-hero .breadcrumb a:hover { color: #fff; }
        .legal-hero h1 { color: #fff; margin-bottom: 0.5rem; }
        .legal-updated { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
        .legal-body { max-width: 760px; margin: 0 auto; padding: 3rem 0 5rem; line-height: 1.8; color: var(--text-primary); }
        .legal-body h2 { font-size: 1.35rem; font-weight: 800; margin: 2rem 0 1rem; color: var(--text-primary); }
        .legal-body h2:first-child { margin-top: 0; }
        .legal-body p { margin-bottom: 1.1rem; color: var(--text-secondary); }
      `}</style>

            <div className="legal-hero">
                <div className="container">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span>Privacy Policy</span>
                    </div>
                    <h1>{title}</h1>
                    {lastUpdated && <p className="legal-updated">Last updated: {lastUpdated}</p>}
                </div>
            </div>

            <div className="container">
                <div className="legal-body" dangerouslySetInnerHTML={{ __html: body }} />
            </div>
        </>
    );
}
