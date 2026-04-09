import { Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useScrollProgress } from './hooks/useScrollProgress';

// Components
import { LoaderScene } from './components/LoaderScene';
import { HeroScene } from './components/HeroScene';
import { Background } from './components/Background';
import { TimelineSection } from './components/TimelineSection';
import { ThemesSection } from './components/ThemesSection';
import { FooterSection } from './components/FooterSection';
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

// 3D wrapper that connects R3F scroll state
const SceneContainer = ({ scrollVal }: { scrollVal: number }) => {
  return (
    <>
      <CameraRig />
      {/* Lighting realistic */}
      <ambientLight intensity={0.5} color="#4455aa" />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, -2, 2]} intensity={2.0} color="#00ccff" distance={20} />

      <Background />
      <LoaderScene scrollVal={scrollVal} />
      <HeroScene scrollVal={scrollVal} />
    </>
  );
};

// Synchronizer between React HTML and ThreeJS loops
function App() {
  const rawScroll = useScrollProgress();
  const [lerpedScroll, setLerpedScroll] = useState(0);

  // Unified lerp for deterministic HTML and WebGL rendering sync
  useEffect(() => {
    let frameId: number;
    let currentScroll = 0;
    
    // requestAnimationFrame custom loop
    const loop = () => {
      // Lerp on the main thread for both HTML and R3F
      currentScroll = lerp(currentScroll, rawScroll, 0.08); // Factor 0.08 requested
      
      setLerpedScroll(currentScroll);
      
      frameId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(frameId);
  }, [rawScroll]);

  return (
    <div className="app-container">
      {/* 3D Underlay */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <SceneContainer scrollVal={lerpedScroll} />
          </Suspense>
        </Canvas>
      </div>

      {/* HTML Overlay wrapper establishing scroll layout */}
      <div style={{ height: '800vh', pointerEvents: 'none' }}>
        <TimelineSection scrollVal={lerpedScroll} />
        <ThemesSection scrollVal={lerpedScroll} />
        <FooterSection scrollVal={lerpedScroll} />
      </div>
    </div>
  );
}

export default App;
