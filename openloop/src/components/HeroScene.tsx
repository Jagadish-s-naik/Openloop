import { Suspense } from 'react';
import { Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Robot } from './Robot';

import { Background } from './Background';

import { Timeline3D } from './Timeline3D';
import { useMousePosition } from '../hooks/useMousePosition';
import { lerp, clamp } from '../utils/math';

const CameraRig = ({ robotProgressRef }: { robotProgressRef: React.MutableRefObject<number> }) => {
  const mouse = useMousePosition();
  
  useFrame((state) => {
    const p = robotProgressRef.current;
    
    // 1. Mouse Parallax (Controlled shift)
    const targetX = mouse.x * 0.45;
    const targetY = mouse.y * 0.45;
    
    // Base position
    let targetZ = 3.8;
    
    // Smooth Timeline View & Transition
    if (p >= 0.55 && p <= 0.86) {
      if (p <= 0.82) {
        targetZ = 4.2; // Move back slightly to see the timeline spread
      } else {
        // Gently zoom in between 0.82 and 0.86 (Timeline Exit)
        // Zooming "some percentage, not that much" as requested
        const zoomP = clamp((p - 0.82) / 0.04, 0, 1);
        targetZ = lerp(4.2, 3.4, zoomP);
      }
    } else if (p > 0.86) {
      // Maintain gentle zoom after timeline ends
      targetZ = 3.4;
    }

    state.camera.position.x = lerp(state.camera.position.x, targetX, 0.08);
    state.camera.position.y = lerp(state.camera.position.y, targetY, 0.08);
    state.camera.position.z = lerp(state.camera.position.z, targetZ, 0.08);
    
    state.camera.lookAt(0, 0, 0); 
  });
  return null;
};

const SceneLights = () => {
  return (
    <>
      <directionalLight color="#ffffff" intensity={2.0} position={[0, 2, -4]} />
      <directionalLight color="#C6FF00" intensity={0.5} position={[-5, 1, -2]} />
      <directionalLight color="#AFFF00" intensity={0.5} position={[5, 0, -1]} />
      <directionalLight color="#0a1200" intensity={0.4} position={[0, 0, 5]} />
      <ambientLight color="#0d0d0d" intensity={0.2} />
      <pointLight color="#C6FF00" intensity={1.2} distance={8} position={[0, -3, 0]} />
    </>
  );
};

interface SceneContainerProps {
  scrollVal: number;
  robotProgressRef: React.MutableRefObject<number>;
  themeProgressRef: React.MutableRefObject<number>;
  mouseX: number;
  phase: string;
}

export const SceneContainer: React.FC<SceneContainerProps> = ({
  scrollVal,
  robotProgressRef,
  themeProgressRef,
  mouseX,
  phase,
}) => {
  return (
    <>
      <CameraRig robotProgressRef={robotProgressRef} />
      <SceneLights />
      <Background scrollVal={scrollVal} />
      
      <Suspense fallback={null}>
        <Environment preset="city" />
        <Robot
          scrollVal={scrollVal}
          robotProgressRef={robotProgressRef}
          themeProgressRef={themeProgressRef}
          mouseX={mouseX}
          phase={phase}
        />
        <Timeline3D scrollProgress={scrollVal} />
      </Suspense>
    </>
  );
};
