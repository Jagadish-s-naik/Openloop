import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VideoSection } from './VideoSection';
import { WinnersSection } from './WinnersSection';
import { clamp } from '../utils/math';

interface HeroOverlayProps {
  scrollProgress: number;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({ scrollProgress }) => {
  const p = scrollProgress;
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const strength = 15;
    const x = (e.clientX - centerX) / strength;
    const y = (e.clientY - centerY) / strength;
    setMagneticPos({ x, y });
  };

  const handleMouseLeave = () => setMagneticPos({ x: 0, y: 0 });

  const [hoveredBadge, setHoveredBadge] = useState(false);
{/*
  const glassCardBase: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '90px',
    minHeight: '90px',
    padding: '30px 100px',
    background: 'rgba(20, 25, 15, 0.45)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1.5px solid rgba(198, 255, 0, 0.25)',
    borderRadius: '14px',
    boxShadow: `
      0 8px 30px rgba(0, 0, 0, 0.6),
      0 0 20px rgba(198, 255, 0, 0.12),
      inset 0 0 12px rgba(198, 255, 0, 0.05)
    `,
    fontFamily: 'Share Tech Mono, monospace',
    fontWeight: 700,
    fontSize: 'clamp(32px, 3.5vw, 50px)',
    color: '#C6FF00',
    letterSpacing: '0.1em',
    margin: '0 6px',
    position: 'relative',
    zIndex: 2,
    transition: 'all 0.3s ease',
  };

  const glassCardHover: React.CSSProperties = {
    transform: 'translateY(-6px) scale(1.05)',
    border: '1.5px solid rgba(198, 255, 0, 0.6)',
    boxShadow: `
      0 12px 40px rgba(0, 0, 0, 0.8),
      0 0 30px rgba(198, 255, 0, 0.3),
      inset 0 0 16px rgba(198, 255, 0, 0.1)
    `,
  };

*/}

  const NAV_ITEMS = [
    { label: 'Core', target: 0.06 },
    { label: 'About', target: 0.18 },
    { label: 'Video', target: 0.32 },
    { label: 'Winners', target: 0.47 },
    { label: 'Themes', target: 0.62 },
    { label: 'Timeline', target: 0.77 },
    { label: 'Sponsors', target: 0.89 },
    { label: 'Get in Touch', target: 0.95 },
  ];

  const handleNavClick = (targetProgress: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: targetProgress * maxScroll,
      behavior: 'smooth'
    });
  };

  // Active state helpers matching DesktopLayout ranges
  const isAboutActive = p >= 0.12 && p <= 0.25;
  const isContactActive = p >= 0.93 && p <= 0.97;

  // Fade the permanent hero title out once the user scrolls past the hero phase
  useEffect(() => {
    const titleEl = document.getElementById('hero-title-fixed');
    if (!titleEl) return;
    // Start fading at p=0.06, fully gone by p=0.12
    const fade = 1 - Math.min(1, Math.max(0, (p - 0.06) / 0.06));
    titleEl.style.opacity = String(fade);
  }, [p]);

  return (
    <>
      {/* PERMANENT HERO TITLE — always visible, unaffected by scroll system */}
      <div id="hero-title-fixed">
        {/* Institution Logo — top center */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '12px',
          marginTop: '0px',
        }}>
          <div style={{
            background: 'transparent',
            borderRadius: '12px',
            padding: '8px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <img
              src="/yset.svg"
              alt="Yenepoya School of Engineering & Technology"
              style={{
                height: 'auto',
                width: 'min(100%, 20rem)',
                maxWidth: 'min(80vw, 320px)',
                objectFit: 'contain',
                display: 'block',
                
              }}
            />
            <p className="hero-subtitle" style={{ fontSize: 'clamp(10px, 1.2vw, 12px)', color: 'white', opacity: 0.8, marginTop: '8px',marginBottom:'30px'}}>
              Constituent unit of Yenepoya Deemed to be University
            </p>
          </div>
        </div>

        <h1 className="hero-main-title" style={{ position: 'relative', zIndex: 2, marginBottom: '0px', }}>
          <span className="title-word" style={{ color: '#ffffff' }}>OPEN</span>
          <span className="title-spacer" />
          <span className="title-word" style={{
            color: '#C6FF00',
            textShadow: '0 0 20px rgba(198, 255, 0, 0.4)'
            
          }}>LOOP</span>
        </h1>
        
        {/* MISSION ACCOMPLISHED BANNER */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '20px',
          position: 'relative',
          zIndex: 2,
        }}>
          <div style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 'clamp(12px, 1.5vw, 18px)',
            letterSpacing: '0.4em',
            color: '#C6FF00',
            marginBottom: '4rem',
            opacity: 0.8,
            textShadow: '0 0 10px rgba(198, 255, 0, 0.5)',
          }}>
            // HACKATHON_STATUS: CONCLUDED
          </div>
          
          <div 
            onMouseEnter={() => setHoveredBadge(true)}
            onMouseLeave={() => setHoveredBadge(false)}
            style={{
              padding: '24px 60px',
              background: 'rgba(20, 25, 15, 0.45)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${hoveredBadge ? '#C6FF00' : 'rgba(198, 255, 0, 0.3)'}`,
              borderRadius: '2px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: hoveredBadge ? 'scale(1.02)' : 'scale(1)',
              boxShadow: hoveredBadge ? '0 0 40px rgba(198, 255, 0, 0.15)' : 'none',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection:'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Animated background line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: hoveredBadge ? '100%' : '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(198, 255, 0, 0.1), transparent)',
              transition: 'left 0.8s ease-in-out'
            }} />

            <div style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: 'clamp(24px, 3vw, 42px)',
              color: '#fff',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textAlign: 'center'
            }}>
              MISSION <span style={{ color: '#C6FF00' }}>SUCCESSFUL</span>
            </div>
            
            <div style={{
              marginTop: '8px',
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.15em'
            }}>
              25 - 26 APRIL 2026 • THANK YOU FOR BUILDING
            </div>

            {/* Corner Accents */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '10px', borderTop: '2px solid #C6FF00', borderLeft: '2px solid #C6FF00' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderBottom: '2px solid #C6FF00', borderRight: '2px solid #C6FF00' }} />
          </div>
        </div>
      </div>

      <nav>
        <div className="nav-brand hud-label" style={{ cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span style={{ backgroundImage: "linear-gradient(to bottom, #C6FF00, #FFFFFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>OPEN LOOP</span>
        </div>
        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={`#${item.label.toLowerCase()}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.target);
              }}
              style={{
                color: (p >= item.target - 0.05 && p <= item.target + 0.05) ? '#C6FF00' : undefined,
                textShadow: (p >= item.target - 0.05 && p <= item.target + 0.05) ? '0 0 10px #C6FF00' : undefined
              }}
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/crew"
            style={{
              textDecoration: 'none',
              marginLeft: '20px',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '14px',
              letterSpacing: '0.25em',
              color: 'rgba(255, 255, 255, 0.7)',
              textTransform: 'uppercase',
              transition: 'color 0.2s ease, text-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#C6FF00';
              e.currentTarget.style.textShadow = '0 0 8px #C6FF00';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              e.currentTarget.style.textShadow = 'none';
            }}
          >
            Crew
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <a href="https://drive.google.com/file/d/1gjljz8WOTlMNwnejjiFDjYIKInKaKb1i/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="cta-button" style={{ textDecoration: 'none', padding: '8px 20px', fontSize: '11px' }}>Brochure</a>
          <a href="https://unstop.com/college-fests/openloop-26-yenepoya-school-of-engineering-and-technology-458231" target="_blank" rel="noopener noreferrer" className="cta-outline" style={{ textDecoration: 'none' }}>Register Closed</a>
        </div>
      </nav>

      {/* Top Right Desktop Button Container */}
      <div 
        style={{ 
          position: 'fixed', 
          right: '30px', 
          top: '120px', 
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
          pointerEvents: 'none'
        }}
      >
        <span style={{ 
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '16px',
          color: '#C6FF00',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: 0.8,
          textShadow: '0 0 10px rgba(198, 255, 0, 0.5)',
          marginRight: '4px'
        }}>
          // SEE THE SELECTED TEAMS
        </span>
        <Link 
          to="/top-25" 
          className="top-25-glow-button"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            textDecoration: 'none',
            transform: `translate3d(${magneticPos.x}px, ${magneticPos.y}px, 0)`,
            pointerEvents: 'auto'
          }}
        >
          <span className="button-glitch-layer">ShortListed TEAMS</span>
          <span className="button-main-layer">Short Listed Teams</span>
          <style>{`
            .top-25-glow-button {
              background: linear-gradient(135deg, #f5f4f4 0%, #d9ff6e 45%, #c6ff00 100%);
              color: #000;
              font-family: 'Share Tech Mono', monospace;
              font-weight: 900;
              font-size: 15px;
              padding: 20px 35px;
              border-radius: 999px;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              box-shadow: 0 0 22px rgba(198, 255, 0, 0.45), inset 0 -2px 8px rgba(0, 0, 0, 0.18);
              transition: transform 0.12s ease-out, box-shadow 0.2s ease, filter 0.2s ease;
              position: relative;
              overflow: hidden;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border: 1px solid rgba(233, 255, 160, 0.95);
              filter: saturate(1.05);
              animation: static-pulsate 2.6s infinite ease-in-out;
            }

            .button-main-layer {
              position: relative;
              z-index: 2;
              transition: letter-spacing 0.2s ease, transform 0.2s ease;
            }

            .top-25-glow-button::after {
              content: '';
              position: absolute;
              inset: -2px;
              border-radius: 999px;
              border: 1px solid rgba(198, 255, 0, 0.45);
              pointer-events: none;
              animation: ring-breathe 2.6s infinite ease-in-out;
            }

            @keyframes static-pulsate {
              0% { box-shadow: 0 0 16px rgba(198, 255, 0, 0.38), inset 0 -2px 8px rgba(0, 0, 0, 0.16); transform: scale(1); }
              50% { box-shadow: 0 0 34px rgba(198, 255, 0, 0.72), inset 0 -2px 10px rgba(0, 0, 0, 0.22); transform: scale(1.02); }
              100% { box-shadow: 0 0 16px rgba(198, 255, 0, 0.38), inset 0 -2px 8px rgba(0, 0, 0, 0.16); transform: scale(1); }
            }

            @keyframes ring-breathe {
              0% { opacity: 0.5; }
              50% { opacity: 0.9; }
              100% { opacity: 0.5; }
            }

            .top-25-glow-button:hover {
              box-shadow: 0 0 18px rgba(255, 255, 255, 0.45), 0 0 60px rgba(198, 255, 0, 0.92) !important;
              background: linear-gradient(135deg, #ffffff 0%, #e7ff9f 48%, #c6ff00 100%) !important;
              color: #000 !important;
              transform: scale(1.08) translateY(-2px) !important;
              border-color: #f3ffd0;
            }

            .top-25-glow-button:hover .button-main-layer {
              letter-spacing: 0.16em;
              transform: translateY(-1px);
            }

            .top-25-glow-button::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.72),
                transparent
              );
              transition: 0.5s;
              animation: light-sweep 2.8s infinite linear;
            }

            .top-25-glow-button:hover::before {
              animation-duration: 1.4s;
            }

            @keyframes light-sweep {
              0% { left: -100%; }
              20% { left: 100%; }
              100% { left: 100%; }
            }

            .button-glitch-layer {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0;
              transition: 0.2s;
            }

            .top-25-glow-button:hover .button-glitch-layer {
              opacity: 0.22;
              background: radial-gradient(circle at 15% 50%, rgba(255, 255, 255, 0.9), rgba(198, 255, 0, 0.15) 60%, transparent 90%);
              animation: glow-drift 1.2s ease-in-out infinite alternate;
            }

            @keyframes glow-drift {
              0% { transform: translateX(-6%) scale(1); opacity: 0.16; }
              100% { transform: translateX(8%) scale(1.05); opacity: 0.28; }
            }
          `}</style>
        </Link>
      </div>
            
           

          
      

      <section id="robot-sections">
        {/* PHASE 1: HERO — bottom content only, title is in #hero-title-fixed above */}
        <div id="s1-hero" className="section-overlay">
          <section id="hero">
            {/* No title here — it lives in the permanent layer */}
          </section>
        </div>
            
        {/* PHASE 2: ABOUT (ROBOT LEFT / TEXT RIGHT) */}
        <div id="s2-about" className="section-overlay" style={{ opacity: 0 }}>
          <div className="composition-grid">
            <div className="content-right">
              <div className="timeline-label">// 002 - ABOUT</div>
              <h2 className="section-heading">OpenLoop Hack</h2>
              <div className="body-text-safe" style={{ paddingLeft: '1.5rem' }}>
                {isAboutActive && (
                  <div className="reveal-text-fast">
                    OpenLoop is a 24-hour national-level hackathon organized by the YenTech at Yenepoya School of Engineering and Technology, where teams of 2–4 members collaborate to build innovative solutions.</div>
                )}
              </div>
              <div className="hud-label" style={{ marginTop: '2rem', color: '#C6FF00' }}>STATUS: PROFILE_LOCK_ACTIVE</div>
            </div>
          </div>
        </div>

        {/* PHASE 3: VIDEO SHOWCASE */}
        <div id="video-section" className="section-overlay" style={{ opacity: 0, padding: '10vh 5vw' }}>
          <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
            <VideoSection scrollProgress={clamp((p - 0.25) / (0.40 - 0.25), 0, 1)} />
          </div>
        </div>

        {/* PHASE 4: WINNERS SECTION */}
        <div id="winners-section" className="section-overlay" style={{ opacity: 0 }}>
          <div style={{ width: '100%', pointerEvents: 'auto' }}>
             <WinnersSection scrollProgress={clamp((p - 0.40) / (0.55 - 0.40), 0, 1)} />
          </div>
        </div>

        {/* PHASE 4: TIMELINE (3D Immersive) */}
        <section id="s4-timeline" className="section-overlay" style={{ opacity: 0, alignItems: 'flex-start', justifyContent: 'flex-start', paddingTop: '16vh' }}>
          <div style={{ textAlign: 'left', pointerEvents: 'auto', maxWidth: '500px' }}>
            <div className="timeline-label" style={{ marginBottom: '12px' }}>// 004 - SEQUENCE</div>
            <h2 className="section-heading" style={{ color: '#ffffff', textShadow: '0 0 20px rgba(198, 255, 0, 0.4)' }}>
              TIMELINE FOR <span style={{ color: '#C6FF00' }}>OPENLOOP</span>
            </h2>
          </div>
        </section>

        {/* PHASE 6: CONTACT */}
        <div id="contact-section" className="section-overlay contact-fullscreen" style={{ opacity: 0 }}>
          <div className="contact-inner">
            <div className="contact-header">
              <span className="timeline-label">// 006 — CONTACT</span>
              <h2 className="section-heading contact-title">GET IN TOUCH</h2>
              <p className="contact-subtitle">
                {isContactActive && (
                  <span className="reveal-text-fast">
                    System link established. Reach any of our team leads directly.
                  </span>
                )}
              </p>
            </div>

            <div className="contact-cards-grid">
              {[
                { name: 'Radhesh Pai', role: 'Lead Organizer', phone: '+91 89513 49166', initials: 'RP' },
                { name: 'Mohammed Shameer', role: 'Vice President`', phone: '+91 6282 679 146', initials: 'MO' },
                { name: 'Jagadish Naik', role: 'Web Development Head', phone: '+91 80732 36744', initials: 'JN' },
              ].map((person, i) => (
                <div key={i} className="contact-card" style={{ animationDelay: `${i * 0.12}s` }}>
                  <div className="contact-card-glow" />
                  <div className="contact-avatar">
                    <span className="contact-initials">{person.initials}</span>
                    <div className="contact-avatar-ring" />
                  </div>
                  <div className="contact-card-info">
                    <h3 className="contact-name">{person.name}</h3>
                    <span className="contact-role">{person.role}</span>
                    <div className="contact-divider" />
                    <div className="contact-link">
                      <span className="contact-link-icon">#</span>
                      {person.phone}
                    </div>
                  </div>
                  <div className="contact-card-corner" />
                </div>
              ))}
            </div>

            <div className="contact-footer-row" style={{ flexDirection: 'column', gap: '2rem' }}>
              <Link
                to="/crew"
                className="cta-button"
                style={{
                  textDecoration: 'none',
                  pointerEvents: 'auto',
                  background: 'transparent',
                  border: '1px solid #C6FF00',
                  color: '#C6FF00',
                  padding: '12px 40px'
                }}
              >
                MEET THE CREW
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'center' }}>
                <div className="hud-line" style={{ width: '60px' }} />
                <span className="hud-label">AVAILABILITY: 24/7_SYNC</span>
                <div className="hud-line" style={{ width: '60px' }} />
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
};
