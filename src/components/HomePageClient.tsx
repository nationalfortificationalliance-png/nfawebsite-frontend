'use client';
import { ReactNode } from 'react';
import AnimatedSection, { AnimatedGrid } from './AnimatedSection';
import Icon, { IconName } from './Icon';

// Stats section with animated counters - Original clean grid style
export function AnimatedStats({ stats }: { stats: { number: string; label: string; icon: IconName }[] }) {
  return (
    <div className="stats-grid" style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
      {stats.map((s) => (
        <div key={s.label} className="stat-item">
          <div className="stat-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--wfp-gold)' }}>
            <Icon name={s.icon} size={40} />
          </div>
          <div className="stat-number text-gradient">{s.number}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// Core functions grid with stagger animation
export function AnimatedCoreFunctions({
  functions
}: {
  functions: { icon: IconName; title: string; desc: string }[]
}) {
  return (
    <AnimatedGrid className="programs-grid" staggerDelay={100}>
      {functions.map((p) => (
        <div key={p.title} className="scroll-reveal reveal-fade-up-scale program-cell" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="program-icon animate-float">
            <Icon name={p.icon} size={32} />
          </div>
          <h3 className="program-title">{p.title}</h3>
          <p className="program-desc">{p.desc}</p>
        </div>
      ))}
    </AnimatedGrid>
  );
}

// Achievement cards with stagger
export function AnimatedAchievements({
  achievements
}: {
  achievements: { num: string; title: string; detail: string }[]
}) {
  return (
    <AnimatedGrid className="how-grid" staggerDelay={150}>
      {achievements.map((a, i) => (
        <div key={i} className="scroll-reveal reveal-fade-up how-step">
          <div className="how-num">{a.num}</div>
          <h3 className="how-title">{a.title}</h3>
          <p className="how-detail">{a.detail}</p>
        </div>
      ))}
    </AnimatedGrid>
  );
}

// Generic animated section wrapper
export function AnimatedSectionWrapper({
  children,
  animation = 'fade-up',
  delay = 0
}: {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-up-scale' | 'slide-left' | 'slide-right';
  delay?: number;
}) {
  return (
    <AnimatedSection animation={animation} delay={delay}>
      {children}
    </AnimatedSection>
  );
}

// News grid with stagger
export function AnimatedNewsGrid({ children }: { children: ReactNode }) {
  return (
    <AnimatedGrid className="grid-3" staggerDelay={120}>
      {children}
    </AnimatedGrid>
  );
}

// Challenge Stats - Asedo Modern Style with Hover Effects
export function AnimatedChallengeStats({ stats }: { stats: { number: string; label: string; icon: IconName }[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem'
    }}>
      {stats.map((s, i) => {
        const colors = ['var(--wfp-green)', 'var(--wfp-gold)', 'var(--wfp-blue)', 'var(--wfp-navy)'];
        const color = colors[i % colors.length];

        return (
          <div
            key={s.label}
            className="challenge-stat-card"
            style={{
              padding: '2.5rem 2rem',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              borderRadius: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04)';
            }}
          >
            {/* Top border accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${color}, var(--wfp-gold))`
            }}></div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              color: color
            }}>
              <Icon name={s.icon} size={48} />
            </div>
            <div style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '900',
              background: `linear-gradient(135deg, ${color}, var(--wfp-gold))`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.04em',
              lineHeight: '1',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {s.number}
            </div>
            <div style={{
              fontSize: '0.95rem',
              textTransform: 'none',
              letterSpacing: '0',
              color: 'var(--text-primary)',
              fontWeight: '600',
              lineHeight: '1.5',
              textAlign: 'center'
            }}>
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
