import React from 'react';
import { Typewriter } from './common/Typewriter';
import { lerp, clamp } from '../utils/math';

interface HeroOverlayProps {
  scrollProgress: number;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({ scrollProgress }) => {
  const p = scrollProgress;

  // Active state helpers
  const isHeroActive = p >= 0.00 && p < 0.18;
  const isAboutActive = p >= 0.18 && p < 0.36;
  const isThemesActive = p >= 0.36 && p < 0.55;
  const isTimelineActive = p >= 0.55 && p < 0.75;
  const isSponsorsActive = p >= 0.75 && p < 0.88;
  const isContactActive = p >= 0.88 && p < 0.96;

  return (
    <>
      <nav>
        <div className="nav-brand hud-label">
          <span style={{ color: '#fff' }}>OPEN</span>
          <span style={{ color: '#C6FF00' }}>LOOP</span>
        </div>
        <div className="nav-links">
          <a href="#s1-hero">Core</a>
          <a href="#s4-timeline">Timeline</a>
          <a href="#theme-section">Themes</a>
        </div>
        <button className="cta-outline" type="button">Try Now</button>
      </nav>

      <section id="robot-sections">
        {/* PHASE 1: HERO */}
        <div id="s1-hero" className="section-overlay">
          <section id="hero">
            <div className="hero-centered-container">
              <h1 className="hero-main-title">
                <span className="title-word" style={{ color: '#ffffff' }}>OPEN</span>
                <span className="title-spacer" />
                <span className="title-word" style={{ 
                  color: '#C6FF00',
                  textShadow: '0 0 20px rgba(198, 255, 0, 0.4)'
                }}>LOOP</span>
              </h1>
              <div className="hero-sub-title">2026</div>
            </div>

            <div className="hero-bottom-left">
              <p className="body-text-safe">
                <Typewriter 
                  active={isHeroActive} 
                  text="Cinematic autonomous intelligence rendered in real time. Scroll to transition through systems, themes, and final state." 
                />
              </p>
              <button className="cta-button" type="button">Enter Loop</button>
            </div>

            <aside className="hero-bottom-right secondary-card">
              <span className="card-tag">National Level Hackathon</span>
              <div className="card-image">
                <span className="hud-label">Hackathon</span>
              </div>
              <h3>OPENLOOP</h3>
              <p>
                <Typewriter 
                  active={isHeroActive} 
                  text="A National Level Hackathon organized by the Computer Science and Engineering Association (CSEA) of NIT Trichy." 
                />
              </p>
            </aside>
          </section>
        </div>

        {/* PHASE 2: ABOUT (ROBOT LEFT / TEXT RIGHT) */}
        <div id="s2-about" className="section-overlay">
          <div className="composition-grid">
            <div className="content-right">
              <div className="timeline-label">// 002 - ABOUT</div>
              <h2 className="section-heading">OpenLoop Hack</h2>
              <p className="body-text-safe">
                <Typewriter 
                  active={isAboutActive}
                  text="OpenLoop is a National Level Hackathon organized by the Yenepoya Technological Club in Yenenpoya School of Engineering and Technology. It is a 24-hour hackathon where teams of 2-4 can participate and showcase their technical skills." 
                />
              </p>
              <div className="hud-label" style={{ marginTop: '2rem', color: '#C6FF00' }}>STATUS: PROFILE_LOCK_ACTIVE</div>
            </div>
          </div>
        </div>

        {/* PHASE 4: TIMELINE (3D Immersive - Content removed here to show canvas) */}
        <section id="s4-timeline" className="section-overlay">
          {/* 2D Content removed - 3D Timeline takes over the viewport */}
        </section>

        {/* PHASE 6: CONTACT (ROBOT LEFT / TEXT RIGHT) */}
        <div id="contact-section" className="section-overlay">
          <div className="composition-grid">
            <div className="content-right">
              <div className="timeline-label">// 006 - CONTACT</div>
              <h2 className="section-heading">GET IN TOUCH</h2>
              <p className="body-text-safe">
                <Typewriter 
                  active={isContactActive}
                  text="System link established. Our team is ready to assist with high-fidelity integration queries and partnership details." 
                />
              </p>
              <div className="contact-details" style={{ marginTop: '3rem' }}>
                <div className="hud-line" />
                <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>CONTACT@OPENLOOP.IO</h3>
                <div className="hud-label">AVAILABILITY: 24/7_SYNC</div>
              </div>
            </div>
          </div>
        </div>

        {/* PHASE 7: FOOTER */}
        <footer id="footer-section" className="section-overlay">
          <div style={{ textAlign: 'center' }}>
            <h2 className="section-heading">OPENLOOP 2026</h2>
            <p className="hud-label">TERMINAL_HANDOFF_COMPLETE</p>
            <div className="hud-line" style={{ margin: '4rem auto', width: '200px' }} />
            <p>© 2026 CSEA NIT TRICHY. ALL SYSTEMS GO.</p>
          </div>
        </footer>
      </section>
    </>
  );
};
