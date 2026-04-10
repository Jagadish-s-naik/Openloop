import React from 'react';
import { Typewriter } from './common/Typewriter';
import './SponsorsSection.css';

interface Sponsor {
  name: string;
  tier: 'Title' | 'Gold' | 'Silver' | 'Community';
  logoImg?: string; // Add your logo image paths here
}

const SPONSORS: Sponsor[] = [
  { name: "UnStop", tier: "Title", logoImg: "" },
  { name: "DK24", tier: "Gold", logoImg: "" },
  { name: "OSCORP", tier: "Gold", logoImg: "" },
  { name: "WEYLAND-YUTANI", tier: "Gold", logoImg: "" },
  { name: "TYRELL CORP", tier: "Silver", logoImg: "" },
];

export const SponsorsSection: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const p = scrollProgress;
  const isSponsorsActive = p >= 0.75 && p < 0.88;

  return (
    <div id="sponsors-section" className="section-overlay">
      <div className="composition-grid">
        <div className="content-right">
          <div className="timeline-label">// 005 - PARTNERS</div>
          <h2 className="section-heading">SPONSORS</h2>
          <p className="body-text-safe" style={{ marginBottom: '2rem' }}>
            <Typewriter 
              active={isSponsorsActive} 
              text="Our partners fueling the 2026 synergy loop. Grid layout optimized for high-fidelity logo rendering." 
            />
          </p>

          <div className="sponsors-grid-new">
            {SPONSORS.map((s, i) => (
              <div key={i} className={`sponsor-box tier-${s.tier.toLowerCase()}`}>
                {s.logoImg ? (
                  <img src={s.logoImg} alt={s.name} className="sponsor-logo-img" />
                ) : (
                  <div className="sponsor-placeholder">
                    <span className="hud-label">{s.name}</span>
                  </div>
                )}
                <div className="box-decoration" />
              </div>
            ))}
          </div>

          <div className="hud-label" style={{ marginTop: '2rem' }}>
            Interested in partnering? CONTACT@OPENLOOP.IO
          </div>
        </div>
      </div>
    </div>
  );
};
