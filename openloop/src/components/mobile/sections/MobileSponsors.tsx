import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import 'gsap/ScrollTrigger';

const titleSponsors = [
  { name: 'UNSTOP', logo: '', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShIUi9GBexFS90vQTB_ZWcUzK4guhSfzgWJQ&s' },
];

const goldSponsors = [
  { name: 'DK24', logo: 'https://dk24.org/logo.png', url: '#' },
  { name: 'VOID TECH', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShIUi9GBexFS90vQTB_ZWcUzK4guhSfzgWJQ&s', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShIUi9GBexFS90vQTB_ZWcUzK4guhSfzgWJQ&s' },
];

const silverSponsors = [
  { name: 'A', logo: 'https://via.placeholder.com/100x40/00f0ff/000000?text=S1', url: '#' },
  { name: 'B', logo: 'https://via.placeholder.com/100x40/00f0ff/000000?text=S2', url: '#' },
  { name: 'C', logo: 'https://via.placeholder.com/100x40/00f0ff/000000?text=S3', url: '#' },
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
          y: '0%', opacity: 1, stagger: 0.08, duration: 0.7,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );

      gsap.fromTo('.sponsor-card',
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.07,
          duration: 0.5,
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
    <section id="sponsors" ref={sectionRef} className="mobile-section">
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

      <div className="sponsor-grid sponsor-gold section-body">
        {titleSponsors.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
             className="sponsor-card sponsor-card--large">
            <div className="sponsor-logo-wrap">
              <img src={s.logo} alt={s.name} />
            </div>
            <span className="sponsor-name">{s.name}</span>
            <span className="sponsor-link">↗ Visit</span>
          </a>
        ))}
      </div>

      <div ref={silverRef} className="sponsor-tier section-body">
        <span className="tier-label">GOLD SPONSORS</span>
        <div className="tier-line" />
      </div>

      <div className="sponsor-grid sponsor-silver section-body">
        {goldSponsors.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
             className="sponsor-card">
            <div className="sponsor-logo-wrap">
              <img src={s.logo} alt={s.name} />
            </div>
            <span className="sponsor-name">{s.name}</span>
          </a>
        ))}
      </div>

      <div ref={bronzeRef} className="sponsor-tier section-body">
        <span className="tier-label">SILVER SPONSORS</span>
        <div className="tier-line" />
      </div>

      <div className="sponsor-grid sponsor-bronze section-body">
        {silverSponsors.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
             className="sponsor-card sponsor-card--small">
            <div className="sponsor-logo-wrap">
              <img src={s.logo} alt={s.name} />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
