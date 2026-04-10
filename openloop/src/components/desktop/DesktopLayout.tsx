import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { usePhase } from '../../hooks/usePhase';

// Components
import { HeroScene } from '../HeroScene';
import { Background } from '../Background';
import { HeroOverlay } from '../HeroOverlay';
import { LoaderScene } from '../LoaderScene';
import { Timeline3D } from '../Timeline3D';
import { SponsorsSection } from '../SponsorsSection';
import { ThemesSection } from '../ThemesSection';
import { useMousePosition } from '../../hooks/useMousePosition';
import { lerp, clamp } from '../../utils/math';
import Lenis from 'lenis';

import '../../App.css';

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const CameraRig = ({ robotProgressRef }: { robotProgressRef: React.MutableRefObject<number> }) => {
  const mouse = useMousePosition();
  
  useFrame((state) => {
    const p = robotProgressRef.current;
    
    // 1. Mouse Parallax (Controlled shift)
    const targetX = mouse.x * 0.45;
    const targetY = mouse.y * 0.45;
    
    // 2. Camera Push / Inside System Feel
    let targetZ = 3.8;
    if (p > 0.75) {
      const pushP = Math.min(1, (p - 0.75) * 5);
      targetZ = lerp(3.8, 2.0, pushP);
    }

    state.camera.position.x = lerp(state.camera.position.x, targetX, 0.08);
    state.camera.position.y = lerp(state.camera.position.y, targetY, 0.08);
    state.camera.position.z = lerp(state.camera.position.z, targetZ, 0.08);
    
    state.camera.lookAt(0, 0, 0); 
  });
  return null;
};

const SceneLights = ({ robotProgressRef: _robotProgressRef }: { robotProgressRef: React.MutableRefObject<number> }) => {
  return (
    <>
      <directionalLight color="#ffffff" intensity={2.0} position={[0, 2, -4]} />
      <directionalLight color="#C6FF00" intensity={0.5} position={[-5, 1, -2]} />
      <directionalLight color="#AFFF00" intensity={0.5} position={[5, 0, -1]} />
      <directionalLight color="#0a1200" intensity={0.4} position={[0, 0, 5]} />
      <ambientLight color="#000000" intensity={0.2} />
      <pointLight color="#C6FF00" intensity={1.2} distance={8} position={[0, -3, 0]} />
    </>
  );
};

const SceneContainer = ({
  scrollVal,
  robotProgressRef,
  themeProgressRef,
  mouseX,
  phase,
}: {
  scrollVal: number;
  robotProgressRef: React.MutableRefObject<number>;
  themeProgressRef: React.MutableRefObject<number>;
  mouseX: number;
  phase: string;
}) => {
  return (
    <>
      <CameraRig robotProgressRef={robotProgressRef} />
      <SceneLights robotProgressRef={robotProgressRef} />

      <Background scrollVal={scrollVal} />
      <Timeline3D scrollProgress={robotProgressRef.current} />
      <HeroScene
        scrollVal={scrollVal}
        robotProgressRef={robotProgressRef}
        themeProgressRef={themeProgressRef}
        mouseX={mouseX}
        phase={phase}
      />
    </>
  );
};

export default function DesktopLayout() {
  const rawScroll = useScrollProgress();
  const mouse = useMousePosition();
  const { phase, loaderProgress } = usePhase();
  const robotProgressRef = useRef(0);
  const themeProgressRef = useRef(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [showRobot, setShowRobot] = useState(true);

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
      const cards = ['#card-1', '#card-2', '#card-3']
        .map((id) => document.querySelector<HTMLElement>(id))
        .filter((el): el is HTMLElement => Boolean(el));
      const footer = document.querySelector<HTMLElement>('#footer-section');

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

      sections.forEach((selector, index) => {
        const el = document.querySelector<HTMLElement>(selector);
        if (el) {
          el.style.opacity = index === 0 ? '1' : '0';
          el.style.visibility = index === 0 ? 'visible' : 'hidden';
          el.style.display = 'block';
        }
      });

      context = gsap.context(() => {
        // Single Unified Scroll Orchestration
        ScrollTrigger.create({
          trigger: '.app-root',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            robotProgressRef.current = p;

            // 1. Precise Range Mapping (MANDATORY - 7 SECTIONS)
            const ranges = [
              { name: 'HERO', start: 0.00, end: 0.15, id: '#s1-hero' },
              { name: 'ABOUT', start: 0.15, end: 0.30, id: '#s2-about' },
              { name: 'THEMES', start: 0.30, end: 0.45, id: '#theme-section' },
              { name: 'TIMELINE', start: 0.45, end: 0.65, id: '#s4-timeline' },
              { name: 'SPONSORS', start: 0.65, end: 0.80, id: '#sponsors-section' },
              { name: 'CONTACT', start: 0.80, end: 0.92, id: '#contact-section' },
              { name: 'FOOTER', start: 0.92, end: 1.00, id: '#footer-section' },
            ];

            // Reactive cutoff for 3D visibility (Show/Hide/Show/Hide)
            const isRobotVisibleRange = (p < 0.30) || (p >= 0.65 && p < 0.92);
            if (isRobotVisibleRange && !showRobot) setShowRobot(true);
            if (!isRobotVisibleRange && showRobot) setShowRobot(false);

            // 2. Debug HUD Update
            const hud = document.querySelector<HTMLElement>('#debug-hud');
            if (hud) {
              const active = ranges.find(r => p >= r.start && p < r.end) || ranges[0];
              hud.innerText = `P: ${p.toFixed(3)} | ${active.name}`;
            }

            // 3. Centralized Styled Control (20/60/20 ramp)
            ranges.forEach(range => {
              if (!range.id) return;
              const el = document.querySelector<HTMLElement>(range.id);
              if (!el) return;

              const lp = clamp((p - range.start) / (range.end - range.start), 0, 1);
              let op = 0;
              
              if (lp < 0.2) op = lp / 0.2;
              else if (lp <= 0.8) op = 1;
              else op = (1 - lp) / 0.2;

              // Force absolute clamping
              if (p < range.start || p > range.end) op = 0;

              el.style.opacity = String(op);
              el.style.visibility = op > 0.001 ? 'visible' : 'hidden';
              el.style.pointerEvents = op > 0.9 ? 'auto' : 'none';

              // Specific sub-animations
              if (range.name === 'THEMES' && op > 0) {
                const themeP = clamp((lp - 0.2) / 0.6, 0, 1); // use middle 60% for cards
                themeProgressRef.current = themeP;
                
                cards.forEach((card, i) => {
                  const perCard = 0.2;
                  const cardStart = i * perCard * 0.5;
                  const cardP = clamp((themeP - cardStart) / 0.4, 0, 1);
                  
                  let x = 0;
                  let scale = 1;
                  let zIndex = 10 + i;
                  
                  if (themeP < 0.6) {
                    x = lerp(-120, -5 * (cards.length - 1 - i), easeOut(cardP));
                    scale = lerp(1.1, 1 - i * 0.04, cardP);
                  } else {
                    const assembleP = clamp((themeP - 0.6) / 0.4, 0, 1);
                    const gridPositions = [-35, 0, 35];
                    x = lerp(-5 * (cards.length - 1 - i), gridPositions[i], easeInOut(assembleP));
                  }
                  
                  card.style.top = '50%';
                  card.style.left = '50%';
                  card.style.transform = `translateX(calc(${x}vw - 50%)) translateY(-50%) scale(${scale})`;
                  card.style.opacity = String(clamp(op * 2, 0, 1));
                  card.style.zIndex = String(zIndex);
                });
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
          <Suspense fallback={
            showRobot ? (
              <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="#0a1a00" wireframe />
              </mesh>
            ) : null
          }>
            <SceneContainer
              scrollVal={rawScroll}
              robotProgressRef={robotProgressRef}
              themeProgressRef={themeProgressRef}
              mouseX={mouse.x}
              phase={phase}
              isVisible={showRobot}
            />
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
