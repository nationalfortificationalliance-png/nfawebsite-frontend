import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';
import NewsCard from '@/components/NewsCard';
import MaterialCard, { MaterialCardContent, MaterialCardActions } from '@/components/MaterialCard';
import MaterialButton from '@/components/MaterialButton';
import { getCarousels, getFeaturedNews, getPartners } from '@/lib/api';
import Icon, { IconName } from '@/components/Icon';

export const metadata: Metadata = {
  title: 'National Fortification Alliance – Nourishing Nigeria',
  description: 'NFA coordinates food fortification in Nigeria to eliminate micronutrient malnutrition.',
};
export const revalidate = 60;

const STATS: { number: string; label: string; icon: IconName }[] = [
  { number: '12M+', label: 'Consumers Reached', icon: 'users' },
  { number: '200+', label: 'Certified Processors', icon: 'factory' },
  { number: '36', label: 'States Covered', icon: 'map-pin' },
  { number: '$1.5B', label: 'Annual Lost GDP', icon: 'bar-chart' },
];

const CORE_FUNCTIONS: { icon: IconName; title: string; desc: string }[] = [
  { icon: 'handshake', title: 'Coordination', desc: 'Serving as the primary forum for government, industry, and partners to align on nutrition goals.' },
  { icon: 'scale', title: 'Regulatory Advocacy', desc: 'Pushing for enforcement of mandatory fortification for wheat flour, oil, sugar, and salt.' },
  { icon: 'microscope', title: 'Capacity Building', desc: 'Strengthening national laboratory capacity for accurate and harmonised micronutrient testing.' },
  { icon: 'search', title: 'Monitoring', desc: 'Overseeing adoption of digital tools like DFQT+ to track fortification compliance in real-time.' },
];

const ACHIEVEMENTS: { num: string; title: string; desc: string }[] = [
  { num: '01', title: 'Digital Transformation', desc: 'Launched the DFQT+ pilot for edible oils in April 2024 replacing manual reporting with real-time data.' },
  { num: '02', title: 'Recognition Excellence', desc: 'Held the 4th Micronutrient Fortification Index Awards honoring high-performing processors.' },
  { num: '03', title: 'Policy Advancement', desc: 'Initiated the expansion of mandatory fortification to rice and bouillon cubes for rural reach.' },
  { num: '04', title: 'Lab Audit', desc: 'Commissioned IPAN to conduct a full audit of all eight approved micronutrient laboratories.' },
];

export default async function HomePage() {
  const [carousels, featuredNews, partners] = await Promise.all([
    getCarousels(), getFeaturedNews(), getPartners(),
  ]);

  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel slides={carousels} />

      {/* Stats Section - Material Design */}
      <section className="md-surface" style={{ padding: 'var(--md-sys-spacing-12) 0', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
        <div className="container">
          <div className="md-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--md-sys-spacing-6)' }}>
            {STATS.map((stat, i) => (
              <MaterialCard key={stat.label} variant="filled" className="text-center">
                <MaterialCardContent>
                  <div style={{ color: 'var(--md-sys-color-tertiary)', marginBottom: 'var(--md-sys-spacing-3)' }}>
                    <Icon name={stat.icon} size={40} />
                  </div>
                  <h3 className="md-display-small" style={{ color: 'var(--md-sys-color-primary)', marginBottom: 'var(--md-sys-spacing-1)' }}>
                    {stat.number}
                  </h3>
                  <p className="md-label-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {stat.label}
                  </p>
                </MaterialCardContent>
              </MaterialCard>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision - Material Design */}
      <section className="md-surface-container" style={{ padding: 'var(--md-sys-spacing-16) 0' }}>
        <div className="container">
          <div className="md-grid md-grid-2">
            <MaterialCard variant="elevated" elevation={2}>
              <MaterialCardContent style={{ padding: 'var(--md-sys-spacing-8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)', marginBottom: 'var(--md-sys-spacing-4)' }}>
                  <div style={{ color: 'var(--md-sys-color-primary)' }}>
                    <Icon name="globe" size={32} />
                  </div>
                  <h3 className="md-headline-medium">Mission</h3>
                </div>
                <p className="md-body-large" style={{ lineHeight: 1.8 }}>
                  To coordinate a multi-sectoral approach that ensures every Nigerian has access to essential micronutrients through the mandatory fortification of staple foods.
                </p>
              </MaterialCardContent>
            </MaterialCard>

            <MaterialCard variant="elevated" elevation={2}>
              <MaterialCardContent style={{ padding: 'var(--md-sys-spacing-8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)', marginBottom: 'var(--md-sys-spacing-4)' }}>
                  <div style={{ color: 'var(--md-sys-color-secondary)' }}>
                    <Icon name="sun" size={32} />
                  </div>
                  <h3 className="md-headline-medium">Vision</h3>
                </div>
                <p className="md-body-large" style={{ lineHeight: 1.8 }}>
                  A Nigeria free from the burden of "hidden hunger" and micronutrient deficiencies, achieved through sustainable public-private partnerships.
                </p>
              </MaterialCardContent>
            </MaterialCard>
          </div>
        </div>
      </section>

      {/* Core Functions - Material Design */}
      <section className="md-surface" style={{ padding: 'var(--md-sys-spacing-16) 0' }}>
        <div className="container">
          <span className="md-label-large" style={{ color: 'var(--md-sys-color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Strategy
          </span>
          <h2 className="md-display-small" style={{ marginTop: 'var(--md-sys-spacing-2)', marginBottom: 'var(--md-sys-spacing-3)' }}>
            Core Functions of the NFA
          </h2>
          <p className="md-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 'var(--md-sys-spacing-8)' }}>
            Leading Nigeria's fight against hidden hunger through targeted multisectoral alignment.
          </p>

          <div className="md-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--md-sys-spacing-4)' }}>
            {CORE_FUNCTIONS.map((func) => (
              <MaterialCard key={func.title} variant="outlined" className="md-ripple">
                <MaterialCardContent style={{ padding: 'var(--md-sys-spacing-6)' }}>
                  <div style={{ color: 'var(--md-sys-color-primary)', marginBottom: 'var(--md-sys-spacing-4)' }}>
                    <Icon name={func.icon} size={36} />
                  </div>
                  <h3 className="md-title-large" style={{ marginBottom: 'var(--md-sys-spacing-2)' }}>
                    {func.title}
                  </h3>
                  <p className="md-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {func.desc}
                  </p>
                </MaterialCardContent>
              </MaterialCard>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Achievements - Material Design with dark background */}
      <section style={{
        background: 'var(--md-sys-color-tertiary)',
        padding: 'var(--md-sys-spacing-16) 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="md-label-large" style={{ color: 'var(--md-sys-color-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Progress
          </span>
          <h2 className="md-display-small" style={{ color: 'var(--md-sys-color-on-tertiary)', marginTop: 'var(--md-sys-spacing-2)', marginBottom: 'var(--md-sys-spacing-8)' }}>
            Recent Achievements (2024–2025)
          </h2>

          <div className="md-grid md-grid-4">
            {ACHIEVEMENTS.map((achievement) => (
              <MaterialCard
                key={achievement.num}
                variant="filled"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.12)'
                }}
              >
                <MaterialCardContent style={{ padding: 'var(--md-sys-spacing-6)' }}>
                  <div className="md-display-large" style={{
                    color: 'rgba(255,255,255,0.2)',
                    marginBottom: 'var(--md-sys-spacing-4)'
                  }}>
                    {achievement.num}
                  </div>
                  <h3 className="md-title-large" style={{ color: 'white', marginBottom: 'var(--md-sys-spacing-2)' }}>
                    {achievement.title}
                  </h3>
                  <p className="md-body-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {achievement.desc}
                  </p>
                </MaterialCardContent>
              </MaterialCard>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Material Design */}
      <section className="md-surface-container" style={{ padding: 'var(--md-sys-spacing-16) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '5fr 6fr', gap: 'var(--md-sys-spacing-10)', alignItems: 'center' }}>
            <MaterialCard variant="elevated" elevation={3} style={{ overflow: 'hidden', aspectRatio: '4/5' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image src="/about-hero.png" alt="NFA partnership meeting" fill style={{ objectFit: 'cover' }} />
              </div>
            </MaterialCard>

            <div>
              <span className="md-label-large" style={{ color: 'var(--md-sys-color-primary)', textTransform: 'uppercase' }}>
                About the NFA
              </span>
              <h2 className="md-display-small" style={{ marginTop: 'var(--md-sys-spacing-3)', marginBottom: 'var(--md-sys-spacing-4)' }}>
                Built on partnership. Driven by evidence.
              </h2>
              <p className="md-body-large" style={{ marginBottom: 'var(--md-sys-spacing-4)' }}>
                The National Fortification Alliance was established in response to Nigeria's growing burden of micronutrient deficiency. Supported by the World Food Programme and enforced by NAFDAC, it unites government, UN agencies, and the private sector under one national framework.
              </p>
              <p className="md-body-large" style={{ marginBottom: 'var(--md-sys-spacing-6)' }}>
                Food fortification is among the most cost-effective public health interventions proven to reduce child stunting, anaemia, and preventable blindness — and Nigeria is building a model the continent can follow.
              </p>
              <MaterialButton variant="filled" size="large" href="/about">
                Read Our Full Story →
              </MaterialButton>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section - Material Design */}
      <section style={{ background: 'var(--md-sys-color-primary)', padding: 'var(--md-sys-spacing-16) 0' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div className="md-display-large" style={{ color: 'rgba(255,255,255,0.3)', lineHeight: 0.5, marginBottom: 'var(--md-sys-spacing-4)' }}>
              "
            </div>
            <p className="md-headline-medium" style={{
              color: 'var(--md-sys-color-on-primary)',
              fontStyle: 'italic',
              marginBottom: 'var(--md-sys-spacing-4)',
              lineHeight: 1.6
            }}>
              Fortification is not charity — it is a cost-effective investment in Nigeria's human capital. Every naira spent on fortification returns exponential value in child development, workforce productivity, and national health savings.
            </p>
            <div className="md-body-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
              <strong style={{ color: 'white', display: 'block', marginBottom: 'var(--md-sys-spacing-1)' }}>
                WFP Nigeria Country Director
              </strong>
              World Food Programme Nigeria
            </div>
          </div>
        </div>
      </section>

      {/* Latest News - Material Design */}
      {featuredNews.length > 0 && (
        <section className="md-surface" style={{ padding: 'var(--md-sys-spacing-16) 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--md-sys-spacing-6)' }}>
              <div>
                <span className="md-label-large" style={{ color: 'var(--md-sys-color-primary)', textTransform: 'uppercase' }}>
                  Latest Updates
                </span>
                <h2 className="md-display-small" style={{ marginTop: 'var(--md-sys-spacing-2)' }}>
                  News & Events
                </h2>
              </div>
              <MaterialButton variant="outlined" href="/news">
                View All →
              </MaterialButton>
            </div>
            <div className="md-grid md-grid-3">
              {featuredNews.map((article) => <NewsCard key={article.id} article={article} />)}
            </div>
          </div>
        </section>
      )}

      {/* Partners Strip - Material Design */}
      <section className="md-surface-variant" style={{ padding: 'var(--md-sys-spacing-16) 0', borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
        <div className="container">
          <h3 className="md-headline-medium" style={{ textAlign: 'center', marginBottom: 'var(--md-sys-spacing-8)' }}>
            Our Partners
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--md-sys-spacing-8)', justifyContent: 'center', alignItems: 'center' }}>
            {partners.slice(0, 8).map((partner) => (
              <div
                key={partner.id}
                style={{
                  filter: 'grayscale(100%) opacity(0.7)',
                  transition: 'all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'grayscale(0%) opacity(1)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'grayscale(100%) opacity(0.7)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {partner.logo?.url && (
                  <Image
                    src={partner.logo.url}
                    alt={partner.name}
                    width={120}
                    height={60}
                    style={{ objectFit: 'contain' }}
                  />
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--md-sys-spacing-8)' }}>
            <MaterialButton variant="text" href="/partners">
              View All Partners →
            </MaterialButton>
          </div>
        </div>
      </section>

      {/* CTA Section - Material Design */}
      <section style={{
        background: 'linear-gradient(135deg, var(--md-sys-color-tertiary) 0%, var(--md-sys-color-primary) 100%)',
        padding: 'var(--md-sys-spacing-16) 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '600px' }}>
            <h2 className="md-display-small" style={{ color: 'white', marginBottom: 'var(--md-sys-spacing-4)' }}>
              Join the Fight Against Hidden Hunger
            </h2>
            <p className="md-body-large" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 'var(--md-sys-spacing-6)' }}>
              Whether you're a food processor, development partner, or concerned citizen, there's a role for you in Nigeria's food fortification movement.
            </p>
            <div style={{ display: 'flex', gap: 'var(--md-sys-spacing-3)', flexWrap: 'wrap' }}>
              <MaterialButton variant="filled" size="large" href="/contact" style={{
                background: 'white',
                color: 'var(--md-sys-color-primary)'
              }}>
                Get Involved
              </MaterialButton>
              <MaterialButton variant="outlined" size="large" href="/about" style={{
                borderColor: 'white',
                color: 'white'
              }}>
                Learn More
              </MaterialButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
