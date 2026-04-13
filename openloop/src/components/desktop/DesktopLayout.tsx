import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { usePhase } from '../../hooks/usePhase';

// Components
import { SceneContainer } from '../HeroScene';
import { HeroOverlay } from '../HeroOverlay';
import { LoaderScene } from '../LoaderScene';
import { SponsorsSection } from '../SponsorsSection';
import { ThemesSection } from '../ThemesSection';
import { FooterSection } from '../FooterSection';
import { useMousePosition } from '../../hooks/useMousePosition';
import { lerp, clamp } from '../../utils/math';
import Lenis from 'lenis';

import '../../App.css';





export default function DesktopLayout() {
  const rawScroll = useScrollProgress();
  const mouse = useMousePosition();
  const { phase, loaderProgress } = usePhase();
  const robotProgressRef = useRef(0);
  const themeProgressRef = useRef(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  useEffect(() => {
    if (phase === 'loader' || phase === 'intro') {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      setScrollEnabled(false);
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
      setScrollEnabled(true);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'main') return;

    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | null = null;
    let context: gsap.Context | null = null;
    let rafId: number;

    const sections = ['#s1-hero', '#s2-about', '#theme-section', '#s4-timeline', '#sponsors-section', '#contact-section', '#footer-section'];

    // IMMEDIATELY make hero content visible — before any timeout or GSAP setup
    // This prevents the black flash between preloader exit and scroll controller init
    const heroEl = document.querySelector<HTMLElement>('#s1-hero');
    if (heroEl) {
      heroEl.style.opacity = '1';
      heroEl.style.visibility = 'visible';
    }
    const titleEl = document.getElementById('hero-title-fixed');
    if (titleEl) {
      titleEl.style.opacity = '1';
      titleEl.style.visibility = 'visible';
    }
    // Hide all other sections initially
    sections.forEach((selector) => {
      if (selector === '#s1-hero') return;
      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        el.style.display = 'block';
        el.style.transition = 'none';
      }
    });

    // Small delay just for DOM stabilisation — not for loading
    const setupTimeout = setTimeout(() => {

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      const scrollLoop = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(scrollLoop);
      };
      rafId = requestAnimationFrame(scrollLoop);

      lenis.on('scroll', ScrollTrigger.update);

      context = gsap.context(() => {
        // Single Unified Scroll Orchestration
        ScrollTrigger.create({
          trigger: '.app-root',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
          onUpdate: (self) => {
            const p = self.progress;
            robotProgressRef.current = p;

            // NON-MERGING GAPPED RANGES
            // Sections now have clear 1-2% gaps between their ends and the next start.
            const ranges = [
              { name: 'HERO',     start: 0.00, end: 0.12, id: '#s1-hero' },
              { name: 'ABOUT',    start: 0.14, end: 0.28, id: '#s2-about' },
              { name: 'THEMES',   start: 0.30, end: 0.50, id: '#theme-section' },
              { name: 'TIMELINE', start: 0.52, end: 0.74, id: '#s4-timeline' },
              { name: 'SPONSORS', start: 0.85, end: 0.92, id: '#sponsors-section' },
              { name: 'CONTACT',  start: 0.94, end: 0.97, id: '#contact-section' },
              { name: 'FOOTER',   start: 0.98, end: 1.00, id: '#footer-section' },
            ];

            // Debug HUD
            // Removed
            ranges.forEach(range => {
              if (!range.id) return;
              const el = document.querySelector<HTMLElement>(range.id);
              if (!el) return;

              // Normalised progress within this section [0..1]
              const lp = clamp((p - range.start) / (range.end - range.start), 0, 1);
              let op = 0;

              if (range.name === 'HERO') {
                // Hold full opacity; only start fading when nearing the end
                op = lp <= 0.70 ? 1 : clamp((1 - lp) / 0.30, 0, 1);
              } else if (range.name === 'FOOTER') {
                // Footer rises in and stays
                const ramp = 0.5;
                op = lp < ramp ? lp / ramp : 1;
              } else {
                // Faster fader ramp so it hits 0 opacity fully within its own boundaries
                const ramp = 0.10;
                if (lp < ramp)        op = lp / ramp;
                else if (lp < 1 - ramp) op = 1;
                else                  op = (1 - lp) / ramp;
              }

              // Outside the window → fully hidden unconditionally
              const isPastEnd = p > range.end && range.name !== 'FOOTER';
              if (p < range.start || isPastEnd) op = 0;

              el.style.opacity = String(op);
              el.style.visibility = op > 0.001 ? 'visible' : 'hidden';
              el.style.pointerEvents = op > 0.5 ? 'auto' : 'none';
              el.style.zIndex = op > 0.05 ? '100' : '10';

              if (range.name === 'THEMES') themeProgressRef.current = lp;
              if (range.name === 'FOOTER' && op > 0) {
                el.style.transform = `translateY(${lerp(50, 0, op)}px)`;
              }
            });
          },
        });
      });
      ScrollTrigger.refresh();
    }, 50); // minimal delay — just for DOM stabilisation

    return () => {
      clearTimeout(setupTimeout);
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      context?.revert();
    };
  }, [phase]);

  return (
    <div className={`app-root ${phase === 'main' ? 'is-main' : ''}`}>
      {/* Debug HUD removed as per request */}

      <div 
        className="canvas-container"
        style={{
          opacity: rawScroll > 0.96 ? lerp(1, 0, (rawScroll - 0.96) / 0.04) : 1,
          transition: 'opacity 0.3s ease-out'
        }}
      >
        <Canvas
          id="webgl"
          camera={{ position: [0, 0, 3.8], fov: 45 }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x020600, 1);
            gl.domElement.style.pointerEvents = 'none';
          }}
        >
            {(phase === 'loader' || phase === 'intro') ? (
              <LoaderScene progress={loaderProgress} phase={phase} />
            ) : (
              <SceneContainer
                scrollVal={rawScroll}
                robotProgressRef={robotProgressRef}
                themeProgressRef={themeProgressRef}
                mouseX={mouse.x}
                phase={phase}
              />
            ) }
        </Canvas>
      </div>

      {phase === 'main' && (
        <div 
          id="site-content" 
          style={{ 
            display: scrollEnabled ? 'block' : 'none',
            zIndex: 20,
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none'
          }}
        >
          <HeroOverlay scrollProgress={rawScroll} />
          <ThemesSection scrollProgress={rawScroll} />
          <SponsorsSection scrollProgress={rawScroll} />
          <FooterSection scrollVal={rawScroll} />
        </div>
      )}
    </div>
  );
}
