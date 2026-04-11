import React from 'react';

interface HeroOverlayProps {
  scrollProgress: number;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({ scrollProgress }) => {
  const p = scrollProgress;

  // Navigation targets based on DesktopLayout ranges
  const NAV_ITEMS = [
    { label: 'Core', target: 0.06 },
    { label: 'About', target: 0.215 },
    { label: 'Themes', target: 0.425 },
    { label: 'Timeline', target: 0.72 },
    { label: 'Sponsors', target: 0.94 },
    { label: 'Contact', target: 0.98 },
  ];

  const handleNavClick = (targetProgress: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: targetProgress * maxScroll,
      behavior: 'smooth'
    });
  };

  // Active state helpers
  const isHeroActive = p >= 0.00 && p < 0.15;
  const isAboutActive = p >= 0.15 && p < 0.30;
  const isContactActive = p >= 0.90 && p < 0.97;

  return (
    <>
      <nav>
        <div className="nav-brand hud-label">
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
        </div>
        <button className="cta-outline" type="button">Register Now</button>
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
              <div className="body-text-safe">
                {isHeroActive && (
                  <div className="reveal-text-fast">
                    Enter. Build. Evolve.
                  </div>
                )}
              </div>
              <button className="cta-button" type="button">Enter Loop</button>
            </div>

            
          </section>
        </div>

        {/* PHASE 2: ABOUT (ROBOT LEFT / TEXT RIGHT) */}
        <div id="s2-about" className="section-overlay">
          <div className="composition-grid">
            <div className="content-right">
              <div className="timeline-label">// 002 - ABOUT</div>
              <h2 className="section-heading">OpenLoop Hack</h2>
              <div className="body-text-safe">
                {isAboutActive && (
                  <div className="reveal-text-fast">
                    OpenLoop is a National Level Hackathon organized by the Yenepoya Technological Club in Yenenpoya School of Engineering and Technology. It is a 24-hour hackathon where teams of 2-4 can participate and showcase their technical skills.
                  </div>
                )}
              </div>
              <div className="hud-label" style={{ marginTop: '2rem', color: '#C6FF00' }}>STATUS: PROFILE_LOCK_ACTIVE</div>
            </div>
          </div>
        </div>

        {/* PHASE 4: TIMELINE (3D Immersive - Content removed here to show canvas) */}
        <section id="s4-timeline" className="section-overlay">
          {/* 2D Content removed - 3D Timeline takes over the viewport */}
        </section>

        {/* PHASE 6: CONTACT */}
        <div id="contact-section" className="section-overlay contact-fullscreen">
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
                { name: 'Radhesh Pai',     role: 'Lead Organizer',       phone: '+91 89513 49166', initials: 'RP' },
                { name: 'Mohammed',         role: 'Secretary',             phone: '+91 6282 679 146', initials: 'MO' },
                { name: 'Jagadhish Naik',  role: 'Web Development Head',  phone: '+91 80732 36744', initials: 'JN' },
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

            <div className="contact-footer-row">
              <div className="hud-line" style={{ width: '60px' }} />
              <span className="hud-label">AVAILABILITY: 24/7_SYNC</span>
              <div className="hud-line" style={{ width: '60px' }} />
            </div>
          </div>
        </div>

      </section>
    </>
  );
};
