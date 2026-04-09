export const HeroOverlay = () => {
  return (
    <>
      <nav>
        <div className="nav-brand hud-label">OPENLOOP</div>
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
            <h1 className="heading-primary hero-title">OPENLOOP</h1>

            <div className="hero-bottom-left">
              <p className="body-text-safe">
                Cinematic autonomous intelligence rendered in real time. Scroll to transition through systems, themes, and final state.
              </p>
              <button className="cta-button" type="button">Enter Loop</button>
            </div>

            <aside className="hero-bottom-right secondary-card">
              <span className="card-tag">UNIT PROFILE</span>
              <div className="card-image">
                <span className="hud-label">NOVA-7</span>
              </div>
              <h3>NOVA-7</h3>
              <p>
                Secondary synthetic entity synchronized with OPENLOOP phase telemetry and motion diagnostics.
              </p>
            </aside>
          </section>
        </div>

        <div id="s2-about" className="section-overlay">
          <div className="overlay-content panel-block">
            <div className="timeline-label">// 002 - ABOUT</div>
            <h2 className="section-heading">ABOUT CORE</h2>
            <p className="body-text-safe">
              Section two rotates to profile view and reveals operational metrics, thermal balancing, and adaptive response telemetry.
            </p>
          </div>
        </div>

        <div id="s3-features" className="section-overlay">
          <div className="overlay-content panel-block">
            <div className="timeline-label">// 003 - FEATURES</div>
            <h2 className="section-heading">BACK SYSTEMS</h2>
            <div className="feature-grid">
              <article className="feature-card"><h3>SPINE REACTOR</h3><p>Back panel energy system spikes during 180-degree lock.</p></article>
              <article className="feature-card"><h3>FUSED ALLOY</h3><p>Low-roughness armor maintains high-contrast rim highlights.</p></article>
              <article className="feature-card"><h3>TEMPLE ARRAY</h3><p>Profile-side amber seam detail appears in section transitions.</p></article>
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
                <div className="t-event t-left">
                  <div className="t-dot" />
                  <div className="t-card">
                    <span className="t-date">2023</span>
                    <h3>Core Prototype</h3>
                    <p>Initial face rig and lighting studies established the visual baseline.</p>
                  </div>
                </div>
                <div className="t-event t-right">
                  <div className="t-dot" />
                  <div className="t-card">
                    <span className="t-date">2024</span>
                    <h3>Reactive Scroll Engine</h3>
                    <p>Deterministic progress mapping introduced section-coupled motion control.</p>
                  </div>
                </div>
                <div className="t-event t-left">
                  <div className="t-dot" />
                  <div className="t-card">
                    <span className="t-date">2025</span>
                    <h3>Rim-Lit Identity</h3>
                    <p>High contrast silhouette and cinematic halos defined the final direction.</p>
                  </div>
                </div>
                <div className="t-event t-right">
                  <div className="t-dot" />
                  <div className="t-card">
                    <span className="t-date">2026</span>
                    <h3>OPENLOOP Launch</h3>
                    <p>Unified timeline, theme sequence, and footer handoff in one continuous flow.</p>
                  </div>
                </div>
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
