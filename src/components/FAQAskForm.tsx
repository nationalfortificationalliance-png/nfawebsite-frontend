'use client';

import { useState } from 'react';

export default function FAQAskForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({ name: '', email: '', question: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const data = {
                name: formData.name,
                email: formData.email,
                subject: 'FAQ Question: Question not found on FAQ page',
                message: formData.question,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/contact-messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data }),
            });
            if (!res.ok) throw new Error('Failed to submit');

            const emailBody = new FormData();
            emailBody.append('name', data.name);
            emailBody.append('email', data.email);
            emailBody.append('subject', data.subject);
            emailBody.append('message', data.message);
            fetch('/api/send-contact-email', { method: 'POST', body: emailBody }).catch(() => {});

            setStatus('success');
            setFormData({ name: '', email: '', question: '' });
        } catch {
            setStatus('error');
        }
    };

    return (
        <form className="faq-ask-form" onSubmit={handleSubmit}>
            <style>{`
                .faq-ask-form { text-align: left; margin-top: 2rem; }
                .faq-ask-form .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
                @media (max-width: 640px) { .faq-ask-form .form-grid { grid-template-columns: 1fr; } }
            `}</style>
            {status === 'success' && (
                <div style={{ padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '4px', marginBottom: '1rem', fontWeight: 600 }}>
                    Thanks — your question has been sent to the Secretariat. We&apos;ll get back to you shortly.
                </div>
            )}
            {status === 'error' && (
                <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '4px', marginBottom: '1rem', fontWeight: 600 }}>
                    Failed to send your question. Please try again later.
                </div>
            )}
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input type="text" className="form-control" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="form-group">
                    <label className="form-label">Your Email *</label>
                    <input type="email" className="form-control" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Your Question *</label>
                <textarea className="form-control" required placeholder="Type the question you couldn't find an answer to..." value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={status === 'loading'} style={{ opacity: status === 'loading' ? 0.7 : 1 }}>
                {status === 'loading' ? 'Sending...' : 'Submit Question'}
            </button>
        </form>
    );
}
