import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import 'gsap/ScrollTrigger';

const titleSponsors = [
  { name: 'UNSTOP', logo: '/sponsors/unstop logo without background.png', url: 'https://unstop.com' },
];

const goldSponsors = [
  { name: 'DK24', logo: '/sponsors/dk24.enc.jpeg', url: '#' },
  { name: 'NXT WAVE', logo: '/sponsors/NxtWave-Logo.webp', url: '#' },
];

const silverSponsors = [
  { name: 'Kalvium', logo: '/sponsors/kalvium.webp', url: '#' },
  { name: 'XYZ', logo: '/sponsors/xyz.webp', url: '#' },
];

export const MobileSponsors: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);
  const silverRef = useRef<HTMLDivElement>(null);
  const bronzeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main section transitions
      gsap.fromTo('.section-label',
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.5,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }
        }
      );

      gsap.fromTo('.section-heading .word',
        { y: '100%', opacity: 0 },
        {
          y: '0%', opacity: 1, stagger: 0.25, duration: 1.5,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );

      gsap.fromTo('.sponsor-card',
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.sponsor-grid',
            start: 'top 85%',
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="sponsors" ref={sectionRef} className="mobile-section" style={{ paddingTop: '120px' }}>
      <div className="section-divider" />
      <div className="section-label">// 003 — SPONSORS</div>
      <h2 className="section-heading">
        <span className="word">BACKED</span>{' '}
        <span className="word">BY</span>{' '}
        <span className="word">THE</span>{' '}
        <span className="word">BEST</span>
      </h2>

      <div ref={goldRef} className="sponsor-tier section-body">
        <span className="tier-label">TITLE SPONSORS</span>
        <div className="tier-line" />
      </div>

      <div className="sponsor-grid sponsor-tier-title section-body">
        {titleSponsors.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
             className="sponsor-card sponsor-card--large">
            <div className="sponsor-logo-wrap">
              <img src={s.logo} alt={s.name} className="sponsor-img" />
            </div>
            <span className="sponsor-name">{s.name}</span>
            <span className="sponsor-link">↗ Visit Website</span>
          </a>
        ))}
      </div>

      <div ref={silverRef} className="sponsor-tier section-body">
        <span className="tier-label">GOLD SPONSORS</span>
        <div className="tier-line" />
      </div>

      <div className="sponsor-grid sponsor-tier-gold section-body">
        {goldSponsors.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
             className="sponsor-card">
            <div className="sponsor-logo-wrap">
              <img src={s.logo} alt={s.name} className="sponsor-img" />
            </div>
            <span className="sponsor-name">{s.name}</span>
          </a>
        ))}
      </div>

      <div ref={bronzeRef} className="sponsor-tier section-body">
        <span className="tier-label">SILVER SPONSORS</span>
        <div className="tier-line" />
      </div>

      <div className="sponsor-grid sponsor-tier-silver section-body">
        {silverSponsors.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
             className="sponsor-card sponsor-card--small">
            <div className="sponsor-logo-wrap">
              <img src={s.logo} alt={s.name} className="sponsor-img" />
            </div>
            <span className="sponsor-name">{s.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
};
