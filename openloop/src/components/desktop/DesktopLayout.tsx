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
import { useMousePosition } from '../../hooks/useMousePosition';
import { lerp, clamp } from '../../utils/math';
import Lenis from 'lenis';

import '../../App.css';

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;
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

    const sections = ['#s1-hero', '#s2-about', '#s3-features', '#s4-timeline'];

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
        // Main Robot Sections (Pinned for longer to ensure full separation from Themes)
        ScrollTrigger.create({
          trigger: '#robot-sections',
          pin: true,
          start: 'top top',
          end: '+=600%', // Increased for more "air" between phases
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            robotProgressRef.current = p;
            
            // Smoother section reveal logic with wider gaps
            sections.forEach((selector, i) => {
              const el = document.querySelector<HTMLElement>(selector);
              if (!el) return;
              
              const sectionRange = 1 / sections.length;
              const sectionStart = i * sectionRange;
              const sectionEnd = (i + 1) * sectionRange;
              
              let opacity = 0;
              if (p >= sectionStart && p <= sectionEnd) {
                // Sharper transitions to avoid cross-phase ghosting
                const margin = 0.08; 
                if (p < sectionStart + margin) opacity = (p - sectionStart) / margin;
                else if (p > sectionEnd - margin) opacity = (sectionEnd - p) / margin;
                else opacity = 1;
              }
              
              // Hard toggle visibility for performance and overlap prevention
              const active = opacity > 0.05;
              el.style.opacity = String(opacity);
              el.style.display = active ? 'block' : 'none';
              el.style.visibility = active ? 'visible' : 'hidden';
              el.style.pointerEvents = active ? 'auto' : 'none';

              const reveals = el.querySelectorAll('.text-reveal');
              reveals.forEach((r) => {
                if (opacity > 0.5) r.classList.add('active');
                else r.classList.remove('active');
              });
            });
          },
        });

        // Specific Timeline Animation (Sync with Scroll)
        document.querySelectorAll<HTMLElement>('.t-event').forEach((el) => {
          gsap.fromTo(el, 
            { opacity: 0, x: -30, scale: 0.95 },
            { 
              opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'top 35%',
                scrub: 1,
                toggleActions: 'play none none reverse'
              }
            }
          );
        });

        if (document.querySelector('.timeline-line') && document.querySelector('.timeline-track')) {
          gsap.to('.timeline-line', {
            height: '100%', ease: 'none',
            scrollTrigger: { 
              trigger: '#s4-timeline', 
              start: 'top 40%', 
              end: 'bottom bottom', 
              scrub: true 
            },
          });
        }

        // Theme Section (Pinned separate with clear start delay)
        ScrollTrigger.create({
          trigger: '#theme-section',
          pin: true,
          start: 'top top',
          end: '+=700%', 
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            themeProgressRef.current = p;
            if (cards.length !== 3) return;

            const updateCard = (card: HTMLElement, x: number, opacity: number, scale = 1, zIndex = 1) => {
              card.style.top = '50%';
              card.style.left = '50%';
              card.style.transform = `translateX(calc(${x}vw - 50%)) translateY(-50%) scale(${scale})`;
              card.style.opacity = String(opacity);
              card.style.zIndex = String(zIndex);
            };

            if (p < 0.6) {
              const perCard = 0.2;
              cards.forEach((card, i) => {
                const cardStart = i * perCard;
                const cardP = clamp((p - cardStart) / perCard, 0, 1);
                const x = lerp(-120, -5 * (cards.length - 1 - i), easeOut(cardP));
                const opacity = clamp(cardP * 2, 0, 1);
                const scale = lerp(1.1, 1 - i * 0.04, cardP);
                updateCard(card, x, opacity, scale, 10 + i);
              });
            } else if (p < 0.85) {
              const assembleP = clamp((p - 0.6) / 0.25, 0, 1);
              const gridPositions = [-35, 0, 35];
              cards.forEach((card, i) => {
                const fromX = -5 * (cards.length - 1 - i);
                const toX = gridPositions[i];
                const x = lerp(fromX, toX, easeInOut(assembleP));
                updateCard(card, x, 1, 1, 10 + i);
              });
            } else {
              const exitP = clamp((p - 0.85) / 0.15, 0, 1);
              cards.forEach((card, i) => {
                const gridX = i === 0 ? -35 : i === 1 ? 0 : 35;
                const x = gridX + lerp(0, 150, easeIn(exitP));
                updateCard(card, x, 1 - exitP, 1, 10 + i);
              });
              if (footer) {
                footer.style.opacity = String(exitP);
                footer.style.transform = `translateY(${lerp(50, 0, exitP)}px)`;
              }
            }
          },
        });
      });
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(setupTimeout);
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      context?.revert();
    };
  }, [phase]);

  return (
    <div className="app-root">
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
            <mesh>
              <sphereGeometry args={[1, 32, 32]} />
              <meshBasicMaterial color="#0a1a00" wireframe />
            </mesh>
          }>
            {phase === 'loader' || phase === 'intro' ? (
              <LoaderScene progress={loaderProgress} phase={phase} />
            ) : (
              <SceneContainer
                scrollVal={rawScroll}
                robotProgressRef={robotProgressRef}
                themeProgressRef={themeProgressRef}
                mouseX={mouse.x}
                phase={phase}
              />
            )}
          </Suspense>
        </Canvas>
      </div>

      <div id="hud-overlay" />

      {phase === 'main' && (
        <div id="site-content" style={{ display: scrollEnabled ? 'block' : 'none' }}>
          <HeroOverlay scrollProgress={rawScroll} />
          <SponsorsSection scrollProgress={rawScroll} />
        </div>
      )}
    </div>
  );
}
