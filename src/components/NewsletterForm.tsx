'use client';
import { useState } from 'react';

export default function NewsletterForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscribers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { email } })
            });
            if (!res.ok) throw new Error('Failed to subscribe');
            setStatus('success');
            setEmail('');
        } catch {
            setStatus('error');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '3rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', marginBottom: '0.75rem' }}>Stay Updated</h4>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,.7)', marginBottom: '1rem' }}>Get the latest fortification news and regulatory updates.</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ flex: 1, padding: '0.85rem', borderRadius: '4px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} 
                />
                <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    style={{ padding: '0.85rem 1.5rem', background: 'var(--wfp-gold)', color: 'var(--wfp-navy)', border: 'none', borderRadius: '4px', fontWeight: 800, cursor: 'pointer' }}>
                    {status === 'loading' ? '...' : 'Subscribe'}
                </button>
            </div>
            {status === 'success' && <div style={{ fontSize: '0.8rem', color: '#6ee7b7', marginTop: '0.5rem' }}>Successfully subscribed!</div>}
            {status === 'error' && <div style={{ fontSize: '0.8rem', color: '#fca5a5', marginTop: '0.5rem' }}>Failed or already subscribed.</div>}
        </form>
    );
}
