import React from 'react';
import './ThemesSection.css';
import { lerp, clamp } from '../utils/math';

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const CARDS_DATA = [
  { id: 1, title: 'Learning and developer productivity' },
  { id: 2, title: 'Healthcare and Medtech' },
  { id: 3, title: 'FineTech & Banking' },
  { id: 4, title: 'Open Innovation' }
];

export const ThemesSection: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const p = scrollProgress;
  // Local Range: 0.30 -> 0.55 — GSAP controls outer opacity, we only drive card animations
  const lp = clamp((p - 0.30) / (0.55 - 0.30), 0, 1);
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
        pointerEvents: 'none'
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
          <h2 className="themes-main-title">THEMES</h2>
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
                    {index === 0 && "Architecting high-fidelity tools for ultra-efficient development cycles and autonomous learning loops."}
                    {index === 1 && "Leveraging predictive intelligence to redefine patient care and medical response systems."}
                    {index === 2 && "Synchronizing secure digital assets with near-zero latency for the future of global exchange."}
                    {index === 3 && "Unlocking cross-system synergy through unrestricted ideation and collaborative fusion."}
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
