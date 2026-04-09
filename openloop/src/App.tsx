import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollProgress } from './hooks/useScrollProgress';

// Components
import { HeroScene } from './components/HeroScene';
import { Background } from './components/Background';
import { HeroOverlay } from './components/HeroOverlay';
import { useMousePosition } from './hooks/useMousePosition';
import { lerp } from './utils/math';

import './App.css';

const CameraRig = () => {
  const mouse = useMousePosition();
  
  useFrame((state) => {
    // Parallax logic
    state.camera.position.x = lerp(state.camera.position.x, mouse.x * 0.5, 0.05);
    state.camera.position.y = lerp(state.camera.position.y, mouse.y * 0.5, 0.05);
    state.camera.lookAt(0, 0, 0); // Strict focal point
  });
  return null;
};

const SceneLights = ({ robotProgressRef }: { robotProgressRef: React.MutableRefObject<number> }) => {
  const eyeLeftRef = useRef<THREE.PointLight>(null);
  const eyeRightRef = useRef<THREE.PointLight>(null);
  const leftRimRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    const pulse = Math.sin(state.clock.elapsedTime * 1.8) * 0.8 + 3.2;
    const p = robotProgressRef.current;
    const rightProfileProgress = Math.max(0, Math.min(1, (p - 0.75) / 0.03));

    if (eyeLeftRef.current) {
      eyeLeftRef.current.intensity = pulse;
    }
    if (eyeRightRef.current) {
      eyeRightRef.current.intensity = pulse;
    }
    if (leftRimRef.current) {
      leftRimRef.current.intensity = lerp(0.9, 2.4, rightProfileProgress);
    }
  });

  return (
    <>
      <directionalLight color="#ffffff" intensity={3.5} position={[0, 2, -4]} />
      <directionalLight ref={leftRimRef} color="#00c8ff" intensity={0.9} position={[-5, 1, -2]} />
      <directionalLight color="#004488" intensity={0.9} position={[5, 0, -1]} />
      <directionalLight color="#112233" intensity={0.65} position={[0, 0, 5]} />
      <ambientLight color="#050510" intensity={0.3} />
      <pointLight color="#00f0ff" intensity={2.5} distance={6} position={[0, -2, 1]} />
      <pointLight ref={eyeLeftRef} color="#00f0ff" intensity={4} distance={3} position={[-0.65, 0.28, 1.2]} />
      <pointLight ref={eyeRightRef} color="#00f0ff" intensity={4} distance={3} position={[0.65, 0.28, 1.2]} />
    </>
  );
};

// 3D wrapper that connects R3F scroll state
const SceneContainer = ({
  scrollVal,
  robotProgressRef,
  themeProgressRef,
  mouseX,
}: {
  scrollVal: number;
  robotProgressRef: React.MutableRefObject<number>;
  themeProgressRef: React.MutableRefObject<number>;
  mouseX: number;
}) => {
  return (
    <>
      <CameraRig />
      <SceneLights robotProgressRef={robotProgressRef} />

      <Background />
      <HeroScene
        scrollVal={scrollVal}
        robotProgressRef={robotProgressRef}
        themeProgressRef={themeProgressRef}
        mouseX={mouseX}
      />
    </>
  );
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Synchronizer between React HTML and ThreeJS loops
function App() {
  const rawScroll = useScrollProgress();
  const mouse = useMousePosition();
  const robotProgressRef = useRef(0);
  const themeProgressRef = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let contextCleanup = () => {};

    const frame = requestAnimationFrame(() => {
      const sections = ['#s1-hero', '#s2-about', '#s3-features', '#s4-timeline'];
      const cards = ['#card-1', '#card-2', '#card-3']
        .map((id) => document.querySelector<HTMLElement>(id))
        .filter((el): el is HTMLElement => Boolean(el));
      const footer = document.querySelector<HTMLElement>('#footer-section');

      if (!document.querySelector('#robot-sections') || !document.querySelector('#theme-section')) {
        return;
      }

      const context = gsap.context(() => {
        sections.forEach((selector, index) => {
          const el = document.querySelector<HTMLElement>(selector);
          if (el) {
            const active = index === 0;
            el.style.opacity = active ? '1' : '0';
            el.style.display = active ? 'block' : 'none';
            el.style.visibility = active ? 'visible' : 'hidden';
            el.style.pointerEvents = active ? 'auto' : 'none';
          }
        });

        ScrollTrigger.create({
          trigger: '#robot-sections',
          pin: true,
          start: 'top top',
          end: '+=400%',
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            robotProgressRef.current = p;

            const idx = Math.floor(p * 4);
            sections.forEach((selector, i) => {
              const el = document.querySelector<HTMLElement>(selector);
              if (!el) return;
              const active = i === Math.min(idx, 3);
              el.style.opacity = active ? '1' : '0';
              el.style.display = active ? 'block' : 'none';
              el.style.visibility = active ? 'visible' : 'hidden';
              el.style.pointerEvents = active ? 'auto' : 'none';
            });
          },
        });

        document.querySelectorAll<HTMLElement>('.t-event').forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          });
        });

        if (document.querySelector('.timeline-line') && document.querySelector('.timeline-track')) {
          gsap.to('.timeline-line', {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: '.timeline-track',
              start: 'top 60%',
              end: 'bottom 40%',
              scrub: true,
            },
          });
        }

        ScrollTrigger.create({
          trigger: '#theme-section',
          pin: true,
          start: 'top top',
          end: '+=500%',
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            themeProgressRef.current = p;

            if (cards.length !== 3) return;

            const updateCard = (card: HTMLElement, x: number, opacity: number, scale = 1) => {
              card.style.top = '50%';
              card.style.left = '50%';
              card.style.transform = `translateX(calc(${x}vw - 50%)) translateY(-50%) scale(${scale})`;
              card.style.opacity = String(opacity);
            };

            if (p < 0.18) {
              const cp = p / 0.18;
              const x = lerp(-110, 0, easeOut(cp));
              updateCard(cards[0], x, Math.min(cp * 3, 1));
            }

            if (p >= 0.2 && p < 0.38) {
              const cp = (p - 0.2) / 0.18;
              const x = lerp(-110, 0, easeOut(cp));
              updateCard(cards[1], x, Math.min(cp * 3, 1));
              updateCard(cards[0], -5, 0.6, 0.96);
            }

            if (p >= 0.4 && p < 0.58) {
              const cp = (p - 0.4) / 0.18;
              const x = lerp(-110, 0, easeOut(cp));
              updateCard(cards[2], x, Math.min(cp * 3, 1));
              updateCard(cards[1], -5, 0.6, 0.96);
              updateCard(cards[0], -10, 0.4, 0.92);
            }

            if (p >= 0.58 && p < 0.78) {
              const cp = (p - 0.58) / 0.2;
              const finalPositions = [-35, 0, 35];
              cards.forEach((card, i) => {
                const fromX = i === 0 ? -10 : i === 1 ? -5 : 0;
                const fromOpacity = i === 0 ? 0.4 : i === 1 ? 0.6 : 1;
                const fromScale = i === 0 ? 0.92 : i === 1 ? 0.96 : 1;
                const x = lerp(fromX, finalPositions[i], easeInOut(cp));
                const opacity = lerp(fromOpacity, 1, cp);
                const scale = lerp(fromScale, 1, cp);
                updateCard(card, x, opacity, scale);
              });
            }

            if (p >= 0.78) {
              const cp = (p - 0.78) / 0.22;
              cards.forEach((card, i) => {
                const assembledX = i === 0 ? -35 : i === 1 ? 0 : 35;
                const exitX = assembledX + lerp(0, 140, easeIn(cp));
                updateCard(card, exitX, Math.max(0, 1 - cp * 0.8));
              });

              if (footer) {
                footer.style.opacity = String(Math.max(0, cp - 0.5) * 2);
              }
            }
          },
        });
      });

      contextCleanup = () => {
        context.revert();
      };

      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(frame);
      contextCleanup();
    };
  }, []);

  return (
    <div className="app-root">
      <div className="canvas-container">
        <Canvas
          id="webgl"
          camera={{ position: [0, 0, 3.8], fov: 45 }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x080808, 1);
            gl.domElement.style.pointerEvents = 'none';
          }}
        >
          <Suspense fallback={null}>
            <SceneContainer
              scrollVal={rawScroll}
              robotProgressRef={robotProgressRef}
              themeProgressRef={themeProgressRef}
              mouseX={mouse.x}
            />
          </Suspense>
        </Canvas>
      </div>

      <div id="hud-overlay" />

      <div id="site-content">
        <HeroOverlay />
      </div>
    </div>
  );
}

export default App;
