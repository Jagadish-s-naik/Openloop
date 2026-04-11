import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './MobileThemesSection.css';

const THEMES = [
  {
    id: '01',
    title: 'Learning and developer productivity',
    desc: 'Cyber-Synthesis of high-level protocols and hackathon execution environments.'
  },
  {
    id: '02',
    title: 'Healthcare and Medtech',
    desc: 'Seamless merging of distributed systems and decentralized intelligence.'
  },
  {
    id: '03',
    title: 'FineTech & Banking',
    desc: 'Scaling autonomous intelligence via multi-node synchronization loops.'
  },
  {
    id: '04',
    title: 'Open Innovation',
    desc: 'Self-correcting execution environments and deterministic logic arrays.'
  }
];

export const MobileThemesSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo('.m-themes-heading .word', 
        { y: '100%', opacity: 0 },
        { 
          y: '0%', opacity: 1, 
          duration: 1.2, 
          stagger: 0.15, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.m-themes-heading',
            start: 'top 85%',
          }
        }
      );

      // Cards animation
      cardRefs.current.forEach((card) => {
        if (!card) return;
        
        gsap.fromTo(card,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none' // Play once
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="themes" ref={containerRef} className="mobile-section m-themes-section">
      <div className="section-divider" />
      <div className="section-label">// 002 — THEMES</div>

      <h2 className="m-themes-heading section-heading">
        <span className="word">HACK</span>{' '}
        <span className="word">CORE</span>{' '}
        <span className="word">
          <span className="neon-text">TRACKS</span>
        </span>
      </h2>

      <div className="m-themes-grid">
        {THEMES.map((theme, i) => (
          <div 
            key={theme.id} 
            ref={el => { cardRefs.current[i] = el; }}
            className="m-theme-card"
          >
            <div className="m-card-glow" />
            <div className="m-card-accent" />
            <div className="m-card-content">
              <span className="m-card-id">{theme.id}</span>
              <h3 className="m-card-title">{theme.title}</h3>
              <p className="m-card-desc">{theme.desc}</p>
            </div>
            <div className="m-card-footer">
              <div className="m-footer-line" />
              <span className="m-footer-label">ACTIVE_PROTOCOL</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
