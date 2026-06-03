import type { GuidelineDocument } from '@/lib/api';
import { getStrapiMediaUrl } from '@/lib/api';
import Icon, { IconName } from '@/components/Icon';

const CATEGORY_COLORS: Record<string, string> = {
    regulatory: 'badge-regulatory',
    technical: 'badge-technical',
    operational: 'badge-operational',
    training: 'badge-training',
    report: 'badge-report',
    policy: 'badge-announcement',
};

const CATEGORY_ICONS: Record<string, IconName> = {
    regulatory: 'scale',
    technical: 'microscope',
    operational: 'settings',
    training: 'graduation-cap',
    report: 'bar-chart',
    policy: 'clipboard',
};

interface DocumentCardProps {
    doc: GuidelineDocument;
}

export default function DocumentCard({ doc }: DocumentCardProps) {
    const { title, description, file, category, published_date, is_featured } = doc;
    const fileUrl = getStrapiMediaUrl(file?.url);
    const hasFile = !!file?.url;

    const formattedDate = published_date
        ? new Date(published_date).toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric',
        })
        : null;

    return (
        <div className="card card-padded doc-card">
            <style>{`
        .doc-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .doc-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .doc-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
          line-height: 1;
          opacity: 0.7;
        }
        .doc-card-body { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .doc-card h4 {
          color: var(--text-primary);
          line-height: 1.4;
          font-size: 1.1rem;
        }
        .doc-card p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .doc-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .doc-date { font-size: 0.8rem; color: var(--text-muted); }
        .doc-no-file {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
        }
      `}</style>

            <div className="doc-card-header">
                <span className={`badge ${CATEGORY_COLORS[category] || 'badge-report'}`}>
                    {category}
                </span>
                <span className="doc-icon" style={{ color: 'var(--wfp-blue)', display: 'flex' }}>
                    <Icon name={CATEGORY_ICONS[category] || 'file'} size={24} />
                </span>
            </div>

            <div className="doc-card-body">
                <h4>{title}</h4>
                {description && <p>{description}</p>}
            </div>

            <div className="doc-card-footer">
                {formattedDate && <span className="doc-date">{formattedDate}</span>}
                {hasFile ? (
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        download
                    >
                        Download
                    </a>
                ) : (
                    <span className="doc-no-file">Coming Soon</span>
                )}
            </div>
        </div>
    );
}
