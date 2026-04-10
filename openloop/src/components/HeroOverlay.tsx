import React from 'react';
import { Typewriter } from './common/Typewriter';
import { lerp, clamp } from '../utils/math';

interface HeroOverlayProps {
  scrollProgress: number;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({ scrollProgress }) => {
  const p = scrollProgress;
  
  // High-precision visibility ranges
  let opacity = 0;
  let scale = 0.95;
  let translateY = 0;

  if (p <= 0.1) {
    // Fade IN: 0 -> 0.1
    const t = clamp(p / 0.1, 0, 1);
    opacity = t;
    scale = lerp(0.95, 1.0, t);
  } else if (p <= 0.18) {
    // FULL: 0.1 -> 0.18
    opacity = 1;
    scale = 1.0;
  } else if (p <= 0.25) {
    // Fade OUT: 0.18 -> 0.25
    const t = clamp((p - 0.18) / 0.07, 0, 1);
    opacity = 1 - t;
    scale = 1.0;
    translateY = t * -40; // Slight upward movement
  }

  const isVisible = opacity > 0;

  return (
    <>
      <nav>
        <div className="nav-brand hud-label">
          <span style={{ color: '#fff' }}>OPEN</span>
          <span style={{ color: '#C6FF00' }}>LOOP</span>
        </div>
        <div className="nav-links">
          <a href="#robot-sections">Core</a>
          <a href="#s4-timeline">Timeline</a>
          <a href="#theme-section">Themes</a>
        </div>
        <button className="cta-outline" type="button">Try Now</button>
      </nav>

      <section id="robot-sections">
        <div id="s1-hero" className="section-overlay">
          <section id="hero">
            <div 
              className="hero-centered-container"
              style={{ 
                opacity: opacity,
                transform: `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale})`,
                visibility: isVisible ? 'visible' : 'hidden',
                pointerEvents: opacity > 0.5 ? 'auto' : 'none'
              }}
            >
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
                <Typewriter text="Cinematic autonomous intelligence rendered in real time. Scroll to transition through systems, themes, and final state." />
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
                <Typewriter text="  A National Level Hackathon organized by the Computer Science and Engineering Association (CSEA) of NIT Trichy, where teams from across the country come together to innovate and compete." />
              </p>
            </aside>
          </section>
        </div>

        <div id="s2-about" className="section-overlay">
          <div className="overlay-content panel-block align-right">
            <div className="timeline-label text-reveal">// 002 - ABOUT</div>
            <h2 className="section-heading text-reveal">ABOUT CORE</h2>
            <p className="body-text-safe text-reveal">
              <Typewriter text="Synthetic profiles transition to profile view, revealing operational metrics and green-spectrum response telemetry." />
            </p>
          </div>
        </div>

        <div id="s3-features" className="section-overlay">
          <div className="overlay-content panel-block align-left">
            <div className="timeline-label text-reveal">// 003 - FEATURES</div>
            <h2 className="section-heading text-reveal">BACK SYSTEMS</h2>
            <div className="feature-grid">
              <article className="feature-card text-reveal">
                <h3>SPINE REACTOR</h3>
                <p><Typewriter text="Back panel energy system spikes during 180-degree lock." /></p>
              </article>
              <article className="feature-card text-reveal">
                <h3>FUSED ALLOY</h3>
                <p><Typewriter text="Low-roughness armor maintains high-contrast rim highlights." /></p>
              </article>
              <article className="feature-card text-reveal">
                <h3>TEMPLE ARRAY</h3>
                <p><Typewriter text="Profile-side amber seam detail appears in section transitions." /></p>
              </article>
            </div>
          </div>
        </div>

        <section id="s4-timeline" className="section-overlay">
          <div className="overlay-content">
            <div className="timeline-label">// 004 - TIMELINE</div>
            <h2 className="section-heading">OUR JOURNEY</h2>
            <div className="timeline-track">
              <div className="timeline-line" />
              <div className="timeline-events">
                {[
                  { date: '2023', title: 'Core Prototype', desc: 'Initial face rig and lighting studies established the visual baseline.', type: 't-left', range: [0.65, 0.72] },
                  { date: '2024', title: 'Reactive Scroll Engine', desc: 'Deterministic progress mapping introduced section-coupled motion control.', type: 't-right', range: [0.72, 0.79] },
                  { date: '2025', title: 'Rim-Lit Identity', desc: 'High contrast silhouette and cinematic halos defined the final direction.', type: 't-left', range: [0.79, 0.86] },
                  { date: '2026', title: 'OPENLOOP Launch', desc: 'Unified timeline, theme sequence, and footer handoff in one continuous flow.', type: 't-right', range: [0.86, 0.93] },
                ].map((event, i) => {
                  const eventP = Math.min(Math.max((scrollProgress - event.range[0]) / (event.range[1] - event.range[0]), 0), 1);
                  const isVisible = eventP > 0;
                  
                  return (
                    <div 
                      key={i} 
                      className={`t-event ${event.type}`}
                      style={{
                        opacity: eventP,
                        transform: `translateY(${lerp(30, 0, eventP)}px) translateZ(${lerp(-100, 0, eventP)}px) scale(${lerp(0.9, 1, eventP)})`,
                        visibility: isVisible ? 'visible' : 'hidden',
                        transition: 'none' // GSAP/Logic controlled
                      }}
                    >
                      <div className="t-dot" style={{ boxShadow: `0 0 ${lerp(0, 20, eventP)}px #C6FF00` }} />
                      <div className="t-card">
                        <span className="t-date">{event.date}</span>
                        <h3>{event.title}</h3>
                        <p>{event.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </section>

      <section id="theme-section">
        <div className="theme-label">// THEMES</div>

        <article id="card-1" className="theme-card">
          <div className="card-icon">I</div>
          <span className="card-number">001</span>
          <h3>SYNERGY</h3>
          <p>Control systems unify perception, targeting, and stabilization as one smooth loop.</p>
        </article>

        <article id="card-2" className="theme-card">
          <div className="card-icon">II</div>
          <span className="card-number">002</span>
          <h3>VELOCITY</h3>
          <p>Motion responds with deterministic interpolation for cinematic but reliable behavior.</p>
        </article>

        <article id="card-3" className="theme-card">
          <div className="card-icon">III</div>
          <span className="card-number">003</span>
          <h3>ASCENT</h3>
          <p>Final phase transitions cards outward while the robot exits upward toward the footer handoff.</p>
        </article>

        <div id="card-row" className="theme-card-row" />
      </section>

      <footer id="footer-section">
        <h2>CONTACT OPENLOOP</h2>
        <p>Systems ready. Continue into the next robot phase with focused profile refinements.</p>
      </footer>
    </>
  );
};
