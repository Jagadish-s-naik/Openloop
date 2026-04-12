import React from 'react';
import './ThemesSection.css';
import { lerp, clamp } from '../utils/math';

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const CARDS_DATA = [
  { id: 1, title: 'Learning & developer productivity' },
  { id: 2, title: 'Healthcare & Medtech' },
  { id: 3, title: 'FinTech & Banking' },
  { id: 4, title: 'Open Innovation' }
];

export const ThemesSection: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const p = scrollProgress;
  // Local Range: 0.30 -> 0.45 — GSAP controls outer opacity
  const lp = clamp((p - 0.30) / (0.45 - 0.30), 0, 1);
  const themeP = clamp(lp / 0.7, 0, 1); // Card stagger driver

  return (
    <div 
      id="theme-section" 
      className="themes-premium-container"
      style={{ 
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        pointerEvents: 'none',
        opacity: 0 // Start hidden, managed by DesktopLayout
      }}
    >
      <div className="themes-background-decor">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="noise-overlay" />
      </div>

      <div className="themes-content-wrapper">
        <div className="themes-header">
          <span className="themes-tag">// SYSTEM_CATEGORIES</span>
          <h2 className="themes-main-title">TRACKS</h2>
          <div className="themes-header-line" />
        </div>

        <div className="themes-grid">
          {CARDS_DATA.map((card, index) => {
            // Calculate staggered entry based on themeP
            // Delay each card by 0.1
            const cardP = clamp((themeP - index * 0.1) / 0.6, 0, 1);
            const translateY = lerp(40, 0, easeOut(cardP));
            const opacity = cardP;

            return (
              <div
                key={card.id}
                className="theme-card-premium"
                style={{
                  transform: `translateY(${translateY}px)`,
                  opacity: opacity,
                  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
                }}
              >
                <div className="card-glass-glow" />
                <div className="card-top-indicator">
                  <span className="card-hex-id">0{index + 1}</span>
                  <div className="card-status-dot" />
                </div>
                
                <div className="card-main-content">
                  <h3 className="card-title-premium">{card.title}</h3>
                  <div className="card-accent-bar" />
                  <p className="card-desc-premium">
                    {index === 0 && "Build tools that help people learn faster and developers work smarter. From AI-powered learning platforms to dev tools, automation, and workflow optimization—anything that boosts efficiency and skill growth."}
                    {index === 1 && "Create impactful solutions that improve healthcare access, diagnostics, and patient care. Focus on real-world challenges using tech like AI, telemedicine, and health monitoring systems."}
                    {index === 2 && "Reimagine how people interact with money through secure, seamless, and inclusive solutions. Explore payments, finance management, fraud detection, blockchain, and financial accessibility."}
                    {index === 3 && "No limits—build anything bold, creative, or disruptive across any domain. Perfect for experimental ideas, emerging tech, social impact, or solutions that don’t fit a single category"}
                  </p>
                </div>

                <div className="card-corner-decor" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
