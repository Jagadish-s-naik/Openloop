import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Robot } from './Robot';

interface HeroSceneProps {
  scrollVal: number;
  robotProgressRef: React.MutableRefObject<number>;
  themeProgressRef: React.MutableRefObject<number>;
  mouseX: number;
}

export const HeroScene: React.FC<HeroSceneProps> = ({
  scrollVal,
  robotProgressRef,
  themeProgressRef,
  mouseX,
}) => {
  const glowRef = useRef<THREE.Mesh>(null);

  const glowTexture = useMemo(() => {
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 512;
    glowCanvas.height = 512;
    const ctx = glowCanvas.getContext('2d');
    if (!ctx) {
      return new THREE.CanvasTexture(glowCanvas);
    }

    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    grad.addColorStop(0, 'rgba(255,255,255,0.18)');
    grad.addColorStop(0.3, 'rgba(200,220,255,0.10)');
    grad.addColorStop(0.6, 'rgba(0,200,255,0.04)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    return new THREE.CanvasTexture(glowCanvas);
  }, []);

  useFrame((state) => {
    if (!glowRef.current) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.4) * 0.04;
    glowRef.current.scale.set(pulse, pulse, 1);
  });

  return (
    <>
      <mesh ref={glowRef} position={[0, 0.1, -0.5]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial
          map={glowTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <Robot
        scrollVal={scrollVal}
        robotProgressRef={robotProgressRef}
        themeProgressRef={themeProgressRef}
        mouseX={mouseX}
      />
    </>
  );
};
