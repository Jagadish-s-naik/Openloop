import { Suspense, useEffect, useRef, useState } from 'react';
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

      // Show #s1-hero immediately (it's behind the permanent title)
      const heroEl = document.querySelector<HTMLElement>('#s1-hero');
      if (heroEl) {
        heroEl.style.opacity = '1';
        heroEl.style.visibility = 'visible';
      }

      sections.forEach((selector) => {
        if (selector === '#s1-hero') return; // hero starts visible
        const el = document.querySelector<HTMLElement>(selector);
        if (el) {
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
          el.style.display = 'block';
          el.style.transition = 'none';
        }
      });

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

            // ZERO-GAP range mapping: every section OVERLAPS the next so
            // there is NEVER a point where all sections are at opacity 0.
            // Ramp is calculated only within each section's own window.
            const ranges = [
              { name: 'HERO',     start: 0.00, end: 0.16, id: '#s1-hero' },
              { name: 'ABOUT',    start: 0.11, end: 0.36, id: '#s2-about' },
              { name: 'THEMES',   start: 0.30, end: 0.59, id: '#theme-section' },
              { name: 'TIMELINE', start: 0.54, end: 0.89, id: '#s4-timeline' },
              { name: 'SPONSORS', start: 0.86, end: 0.97, id: '#sponsors-section' },
              { name: 'CONTACT',  start: 0.95, end: 0.995, id: '#contact-section' },
              { name: 'FOOTER',   start: 0.99, end: 1.00,  id: '#footer-section' },
            ];

            // Debug HUD
            const hud = document.querySelector<HTMLElement>('#debug-hud');
            const active = ranges.find(r => p >= r.start && p < r.end) || ranges[ranges.length - 1];
            if (hud) hud.innerText = `P: ${p.toFixed(3)} | SECTION: ${active.name}`;

            ranges.forEach(range => {
              if (!range.id) return;
              const el = document.querySelector<HTMLElement>(range.id);
              if (!el) return;

              // Normalised progress within this section [0..1]
              const lp = clamp((p - range.start) / (range.end - range.start), 0, 1);
              let op = 0;

              if (range.name === 'HERO') {
                // Hold full opacity; only start fading when ABOUT is already fading in (lp > 0.65)
                op = lp <= 0.65 ? 1 : clamp((1 - lp) / 0.35, 0, 1);
              } else if (range.name === 'FOOTER') {
                // Footer rises in and stays
                const ramp = 0.5;
                op = lp < ramp ? lp / ramp : 1;
              } else {
                // Standard 15/70/15 ramp — gentler than before
                const ramp = 0.15;
                if (lp < ramp)        op = lp / ramp;
                else if (lp < 1 - ramp) op = 1;
                else                  op = (1 - lp) / ramp;
              }

              // Outside the window → fully hidden
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
    }, 1000);

    return () => {
      clearTimeout(setupTimeout);
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      context?.revert();
    };
  }, [phase]);

  return (
    <div className={`app-root ${phase === 'main' ? 'is-main' : ''}`}>
      {phase === 'main' && (
        <div id="debug-hud" style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.8)',
          color: '#C6FF00',
          padding: '8px 12px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '12px',
          zIndex: 1000,
          border: '1px solid #C6FF00'
        }}>
          P: 0.000 | SECTION: HERO
        </div>
      )}

      <div 
        className="canvas-container"
        style={{
          opacity: rawScroll > 0.94 ? lerp(1, 0, (rawScroll - 0.94) / 0.04) : 1,
          transition: 'opacity 0.3s ease-out'
        }}
      >
        <Canvas
          id="webgl"
          camera={{ position: [0, 0, 3.8], fov: 45 }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 1);
            gl.domElement.style.pointerEvents = 'none';
          }}
        >
          <Suspense fallback={null}>
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
          </Suspense>
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
