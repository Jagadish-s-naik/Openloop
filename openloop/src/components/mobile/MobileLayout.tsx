import { useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Styles
import '../../styles/mobile.css';

// Components
import { MobileLoader } from './MobileLoader';
import { MobileNav } from './MobileNav';
import { MobileHero } from './sections/MobileHero';
import { MobileAbout } from './sections/MobileAbout';
import { MobileThemesSection } from './sections/MobileThemesSection';
import { MobileTimeline } from './sections/MobileTimeline';
import { MobileSponsors } from './sections/MobileSponsors';
import { MobileTeam } from './sections/MobileTeam';
import { MobileFooter } from './sections/MobileFooter';

export default function MobileLayout() {
  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Refresh ScrollTrigger after fonts load
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    // Also refresh on window load to ensure all layouts are final
    window.addEventListener('load', () => ScrollTrigger.refresh());

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      window.removeEventListener('load', () => ScrollTrigger.refresh());
    };
  }, []);

  // Helper: smooth scroll to section
  function scrollToSection(id: string) {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div id="mobile-root">
      <MobileNav />
      <div id="hud-corners">
        <div className="hud-corner tl" />
        <div className="hud-corner tr" />
        <div className="hud-corner bl" />
        <div className="hud-corner br" />
      </div>
      <main>
        <MobileHero />
        <MobileAbout scrollTo={scrollToSection} />
        <MobileThemesSection />
        <MobileTimeline />
        <MobileSponsors />
        <MobileTeam />
        <MobileFooter />
      </main>
    </div>
  );
}
