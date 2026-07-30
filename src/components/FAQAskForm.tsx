'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

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
                .faq-ask-form { text-align: left; max-width: 560px; margin: 0 auto; }
                .faq-ask-form .form-grid { margin-bottom: 1rem; }
            `}</style>
            {status === 'success' && (
                <div className="form-alert form-alert-success">
                    <Icon name="check-circle" size={18} />
                    Thanks — your question has been sent to the Secretariat. We&apos;ll get back to you shortly.
                </div>
            )}
            {status === 'error' && (
                <div className="form-alert form-alert-error">
                    <Icon name="zap" size={18} />
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
