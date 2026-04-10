import React from 'react';
import './ThemesSection.css';

const CARDS_DATA = [
  { id: 1, title: 'SYNTHESIS' },
  { id: 2, title: 'INTEGRATION' },
  { id: 3, title: 'EXPANSION' },
  { id: 4, title: 'AUTONOMY' }
];

export const ThemesSection: React.FC<{ scrollProgress: number }> = () => {
  return (
    <div id="theme-section" className="section-overlay">
      <div className="theme-label">THEMES</div>
      <div className="themes-relative-wrapper">
        {CARDS_DATA.map((card, index) => (
          <div
            key={card.id}
            id={`card-${index + 1}`}
            className="theme-card"
          >
            <div className="card-top-accent" />
            <div className="card-content-wrap">
              <span className="card-index">0{index + 1}</span>
              <h3 className="card-title">{card.title}</h3>
              <div className="card-divider" />
              <p className="card-description">
                Cyber-Synthesis of high-level protocols and hackathon execution environments.
              </p>
            </div>
            <div className="card-border-glow" />
          </div>
        ))}
      </div>
    </div>
  );
};
