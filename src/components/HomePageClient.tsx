'use client';
import { ReactNode } from 'react';
import AnimatedSection, { AnimatedGrid } from './AnimatedSection';
import NumberCounter from './NumberCounter';
import Icon, { IconName } from './Icon';

// Stats section with animated counters
export function AnimatedStats({ stats }: { stats: { number: string; label: string; icon: IconName }[] }) {
  return (
    <AnimatedSection animation="fade-up" delay={0}>
      <div className="stats-grid">
        {stats.map((s, i) => {
          // Extract number from string like "12M+" or "200+" or "36"
          const match = s.number.match(/(\d+\.?\d*)/);
          const numValue = match ? parseFloat(match[1]) : 0;
          const hasPlus = s.number.includes('+');
          const hasM = s.number.includes('M');
          const hasB = s.number.includes('B');
          const hasDollar = s.number.includes('$');

          let suffix = '';
          if (hasPlus) suffix = '+';
          if (hasM) suffix = 'M+';
          if (hasB) suffix = 'B';

          let prefix = '';
          if (hasDollar) prefix = '$';

          return (
            <div key={s.label} className="stat-item scroll-reveal reveal-fade-up-scale">
              <div className="stat-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--wfp-gold)' }}>
                <Icon name={s.icon} size={40} />
              </div>
              <div className="stat-number text-gradient">
                {prefix}
                <NumberCounter
                  end={numValue}
                  suffix={suffix}
                  duration={2000}
                />
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          );
        })}
      </div>
    </AnimatedSection>
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
