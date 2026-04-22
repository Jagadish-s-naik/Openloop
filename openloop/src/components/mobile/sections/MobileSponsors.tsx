import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import 'gsap/ScrollTrigger';

interface Sponsor {
  name: string;
  tier: 'Title' | 'Gold' | 'Silver' | 'Community';
  logoImg: string;
}

const SPONSORS: Sponsor[] = [
  { name: "UnStop", tier: "Gold", logoImg: "/sponsors/image.png" },
  { name: "DK24", tier: "Gold", logoImg: "/sponsors/dk_24.png" },
  { name: "NXT WAVE", tier: "Gold", logoImg: "/sponsors/nxt_wave.png" },
  { name: "XYZ", tier: "Gold", logoImg: "/sponsors/xyz.webp" }, 
  { name: "Kalvium", tier: "Gold", logoImg: "/sponsors/kalvium.webp" },
];

export const MobileSponsors: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

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
      <div className="section-label">// 005 — PARTNERS</div>
      <h2 className="section-heading">
        <span className="word">SPONSORS</span>
      </h2>

      <div className="sponsor-grid section-body">
        {SPONSORS.map((s, i) => (
          <div 
            key={i} 
            className={`sponsor-card tier-${s.tier.toLowerCase()}`}
            style={{ 
              animationDelay: `${i * 0.1}s`,
              gridColumn: SPONSORS.length % 2 !== 0 && i === SPONSORS.length - 1 ? 'span 2' : 'auto'
            }}
          >
            <div className="sponsor-logo-wrap">
              <img src={s.logoImg} alt={s.name} className="sponsor-img" />
            </div>
            <span className="sponsor-name">{s.name}</span>
            <div className="card-hud-label top-left">TIER: {s.tier.toUpperCase()}</div>
            <div className="card-hud-label top-right">0x{i}F4</div>
            <div className="card-corner-top" />
            <div className="card-corner-bottom" />
          </div>
        ))}
      </div>
    </section>
  );
};
