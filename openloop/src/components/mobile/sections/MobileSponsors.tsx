import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import 'gsap/ScrollTrigger';

const titleSponsors = [
  { name: 'UNSTOP', logo: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/03/ec/01/03ec01e9-83c9-b00f-94ca-e9b5a5b31356/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/1200x630wa.jpg', url: 'https://unstop.com' },
];

const goldSponsors = [
  { name: 'DK24', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT49X3O04FD7fH9nqaJwyA1Pc2REDenUu0_aQ&s', url: '#' },
  { name: 'NXT WAVE', logo: 'https://static.ambitionbox.com/assets/v2/images/rs:fit:1280:960:false:false/aHR0cHM6Ly9tZWRpYS5uYXVrcmkuY29tL21lZGlhL2FiY29tcGxvZ28vbnh0d2F2ZS1vcmlnaW5hbC5qcGc.png', url: '#' },
];

const silverSponsors = [
  { name: 'Kalvium', logo: 'https://pbs.twimg.com/profile_images/1773285198794313729/0S43bEQA_400x400.jpg', url: '#' },
  { name: 'XYZ', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/.xyz_logo.svg/1280px-.xyz_logo.svg.png', url: '#' },
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
