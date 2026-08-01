'use client';

import { useRef, useState } from 'react';
import Icon from '@/components/Icon';

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

export default function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', orgType: 'Food Processor / Manufacturer', topic: 'NAFDAC Certification', message: ''
    });
    const [attachments, setAttachments] = useState<File[]>([]);
    const [fileError, setFileError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError('');
        const selected = Array.from(e.target.files || []);
        const accepted: File[] = [...attachments];
        for (const file of selected) {
            const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
            if (!ALLOWED_EXTENSIONS.includes(ext)) {
                setFileError(`"${file.name}" is not allowed — only PDF, DOC, and DOCX files can be attached.`);
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                setFileError(`"${file.name}" is too large — each file must be 5MB or smaller.`);
                continue;
            }
            if (accepted.length >= MAX_FILES) {
                setFileError(`You can attach up to ${MAX_FILES} files.`);
                break;
            }
            if (!accepted.some(f => f.name === file.name && f.size === file.size)) {
                accepted.push(file);
            }
        }
        setAttachments(accepted);
        // Reset the input so re-selecting the same file fires onChange again
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
        setFileError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const data = {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                subject: `${formData.orgType} - ${formData.topic}`,
                message: formData.message
            };

            let res: Response;
            if (attachments.length > 0) {
                const body = new FormData();
                body.append('data', JSON.stringify(data));
                attachments.forEach(file => body.append('files.attachments', file, file.name));
                res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/contact-messages`, {
                    method: 'POST',
                    body
                });
            } else {
                res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/contact-messages`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data })
                });
            }
            if (!res.ok) throw new Error('Failed to submit');

            // Email notification with attachments (fire and forget — the
            // message is already saved in the backend if this fails)
            const emailBody = new FormData();
            emailBody.append('name', data.name);
            emailBody.append('email', data.email);
            emailBody.append('subject', data.subject);
            emailBody.append('message', data.message);
            attachments.forEach(file => emailBody.append('attachments', file, file.name));
            fetch('/api/send-contact-email', { method: 'POST', body: emailBody }).catch(() => {});

            setStatus('success');
            setFormData({ firstName: '', lastName: '', email: '', orgType: 'Food Processor / Manufacturer', topic: 'NAFDAC Certification', message: '' });
            setAttachments([]);
            setFileError('');
        } catch {
            setStatus('error');
        }
    };

    return (
        <form className="contact-form" onSubmit={handleSubmit}>
            {status === 'success' && (
                <div className="form-alert form-alert-success">
                    <Icon name="check-circle" size={18} />
                    Message sent successfully! We will get back to you shortly.
                </div>
            )}
            {status === 'error' && (
                <div className="form-alert form-alert-error">
                    <Icon name="zap" size={18} />
                    Failed to send message. Please try again later.
                </div>
            )}

            <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input type="text" className="form-control" placeholder="Jane" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input type="text" className="form-control" placeholder="Doe" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
            </div>

            <div className="form-grid full" style={{ marginBottom: '1.5rem' }}>
                <div className="form-group">
                    <label className="form-label">Work Email *</label>
                    <input type="email" className="form-control" placeholder="jane@company.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
            </div>

            <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="form-group">
                    <label className="form-label">Organization Type</label>
                    <select className="form-control" value={formData.orgType} onChange={e => setFormData({...formData, orgType: e.target.value})}>
                        <option>Food Processor / Manufacturer</option>
                        <option>Government / Regulatory</option>
                        <option>NGO / Civil Society</option>
                        <option>Research / Academia</option>
                        <option>Media</option>
                        <option>Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Inquiry Topic</label>
                    <select className="form-control" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})}>
                        <option>NAFDAC Certification</option>
                        <option>Premix Supply</option>
                        <option>Partnership Inquiry</option>
                        <option>Data & Research</option>
                        <option>General Support</option>
                    </select>
                </div>
            </div>

            <div className="form-grid full" style={{ marginBottom: '2rem' }}>
                <div className="form-group">
                    <label className="form-label">Your Message *</label>
                    <textarea className="form-control" placeholder="Tell us how we can assist you..." required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                </div>
            </div>

            <div className="form-grid full" style={{ marginBottom: '2rem' }}>
                <div className="form-group">
                    <label className="form-label">Supporting Documents (optional)</label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="form-control"
                        accept=".pdf,.doc,.docx"
                        multiple
                        onChange={handleFileSelect}
                        style={{ padding: '0.6rem' }}
                    />
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.4rem' }}>
                        PDF, DOC, or DOCX — up to {MAX_FILES} files, max 5MB each.
                    </p>
                    {fileError && <p style={{ fontSize: '0.85rem', color: '#991b1b', marginTop: '0.4rem', fontWeight: 600 }}>{fileError}</p>}
                    {attachments.length > 0 && (
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0.6rem 0 0' }}>
                            {attachments.map((file, i) => (
                                <li key={`${file.name}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.4rem 0.6rem', background: '#f3f4f6', borderRadius: '4px', marginBottom: '0.35rem' }}>
                                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                                    <span style={{ color: '#6b7280' }}>{(file.size / 1024 / 1024).toFixed(1)}MB</span>
                                    <button type="button" onClick={() => removeAttachment(i)} aria-label={`Remove ${file.name}`} style={{ border: 'none', background: 'none', color: '#991b1b', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}>×</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', opacity: status === 'loading' ? 0.7 : 1 }} disabled={status === 'loading'}>
                 {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
}
