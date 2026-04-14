import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HeroOverlayProps {
  scrollProgress: number;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({ scrollProgress }) => {
  const p = scrollProgress;

  const NAV_ITEMS = [
    { label: 'Core', target: 0.08 },
    { label: 'About', target: 0.21 },
    { label: 'Themes', target: 0.46 },
    { label: 'Timeline', target: 0.59 },
    { label: 'Sponsors', target: 0.90 },
    { label: 'Contact', target: 0.95 },
  ];

  const handleNavClick = (targetProgress: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: targetProgress * maxScroll,
      behavior: 'smooth'
    });
  };

  // Active state helpers matching DesktopLayout ranges
  const isHeroActive = p >= 0.00 && p <= 0.12;
  const isAboutActive = p >= 0.14 && p <= 0.28;
  const isContactActive = p >= 0.90 && p <= 0.96;

  // Fade the permanent hero title out once the user scrolls past the hero phase
  useEffect(() => {
    const titleEl = document.getElementById('hero-title-fixed');
    if (!titleEl) return;
    // Start fading at p=0.08, fully gone by p=0.14
    const fade = 1 - Math.min(1, Math.max(0, (p - 0.08) / 0.06));
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
            <p className="hero-subtitle" style={{ fontSize: 'clamp(10px, 1.2vw, 12px)', color: 'white', opacity: 0.8, marginTop: '8px' }}>
              Affiliated to Yenepoya Deemed to be University
            </p>
          </div>
        </div>

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
          <a href="https://drive.google.com/file/d/1_IM0WD6zowoyv9nopm2RbnwW2dUYwwBE/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="cta-button" style={{ textDecoration: 'none', padding: '8px 20px', fontSize: '11px' }}>Brochure</a>
          <a href="https://unstop.com/college-fests/openloop-26-yenepoya-school-of-engineering-and-technology-458231" target="_blank" rel="noopener noreferrer" className="cta-outline" style={{ textDecoration: 'none' }}>Register Now</a>
        </div>
      </nav>

      <section id="robot-sections">
        {/* PHASE 1: HERO — bottom content only, title is in #hero-title-fixed above */}
        <div id="s1-hero" className="section-overlay">
          <section id="hero">
            {/* No title here — it lives in the permanent layer */}
            <div className="hero-bottom-left">
              <div className="body-text-safe" style={{ paddingLeft: '1.5rem' }}>
                {isHeroActive && (
                  <div className="reveal-text-fast">
                    Enter. Build. Evolve.
                    <br></br>
                    And win a Prize Pool upto Rs 1,00,000
                  </div>
                )}
              </div>
              <a
                href="https://unstop.com/college-fests/openloop-26-yenepoya-school-of-engineering-and-technology-458231"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button"
                style={{ textDecoration: 'none', pointerEvents: 'auto' }}
              >
                Enter Loop
              </a>
            </div>
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
