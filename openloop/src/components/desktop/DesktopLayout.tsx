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

      sections.forEach((selector) => {
        const el = document.querySelector<HTMLElement>(selector);
        if (el) {
          // All sections start hidden; GSAP onUpdate will handle them
          // #theme-section visibility is also driven by GSAP scroll progress
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
          el.style.display = 'block';
          el.style.transition = 'none'; // Prevent CSS transitions fighting GSAP
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

            // 1. Precise Range Mapping (MANDATORY - 7 SECTIONS)
            const ranges = [
              { name: 'HERO', start: 0.00, end: 0.15, id: '#s1-hero' },
              { name: 'ABOUT', start: 0.15, end: 0.30, id: '#s2-about' },
              { name: 'THEMES', start: 0.30, end: 0.55, id: '#theme-section' },
              { name: 'TIMELINE', start: 0.55, end: 0.72, id: '#s4-timeline' },
              { name: 'SPONSORS', start: 0.75, end: 0.90, id: '#sponsors-section' },
              { name: 'CONTACT', start: 0.90, end: 0.97, id: '#contact-section' },
              { name: 'FOOTER', start: 0.97, end: 1.00, id: '#footer-section' },
            ];

            // No manual cutoff - handled by Robot component internally

            // 2. Debug HUD Update
            const hud = document.querySelector<HTMLElement>('#debug-hud');
            const active = ranges.find(r => p >= r.start && p < r.end) || ranges[ranges.length - 1];
            if (hud) {
              hud.innerText = `P: ${p.toFixed(3)} | SECTION: ${active.name}`;
            }
            if (p % 0.05 < 0.001) { // Throttle console logs
               console.log(`[ScrollDebug] P: ${p.toFixed(3)} | Active: ${active.name}`);
            }

            // 3. Centralized Styled Control (20/60/20 ramp)
            ranges.forEach(range => {
              if (!range.id) return;
              const el = document.querySelector<HTMLElement>(range.id);
              if (!el) return;

              const lp = clamp((p - range.start) / (range.end - range.start), 0, 1);
              let op = 0;
              
              const ramp = 0.10; // 10% fade in/out for sharp isolation
              if (lp < ramp) op = lp / ramp;
              else if (lp <= (1 - ramp)) op = 1;
              else op = (1 - lp) / ramp;

              // Force absolute clamping
              if (p < range.start || p > range.end) op = 0;

              el.style.opacity = String(op);
              el.style.visibility = op > 0.001 ? 'visible' : 'hidden';
              el.style.pointerEvents = op > 0.5 ? 'auto' : 'none';
              
              // Ensure active layer is always on top (z-index priority)
              if (op > 0.05) {
                el.style.zIndex = '100';
              } else {
                el.style.zIndex = '10';
              }

              // Specific sub-animations
              if (range.name === 'THEMES') {
                // Always update themeProgressRef so ThemesSection receives live scroll data
                themeProgressRef.current = lp;
              }

              if (range.name === 'FOOTER' && op > 0) {
                el.style.transform = `translateY(${lerp(50, 0, op)}px)`;
              }
            });

            // No explicit cleanup needed anymore as the unified loop handles all 7 sections via their IDs
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

      <div className="canvas-container">
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

      <div id="hud-overlay" />

      {phase === 'main' && (
        <div id="site-content" style={{ display: scrollEnabled ? 'block' : 'none' }}>
          <HeroOverlay scrollProgress={rawScroll} />
          <ThemesSection scrollProgress={rawScroll} />
          <SponsorsSection scrollProgress={rawScroll} />
        </div>
      )}
    </div>
  );
}
