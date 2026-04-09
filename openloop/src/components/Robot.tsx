import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { lerp } from '../utils/math';

interface RobotProps {
  scrollVal: number;
  robotProgressRef: React.MutableRefObject<number>;
  themeProgressRef: React.MutableRefObject<number>;
  mouseX: number;
  phase: string;
}

export const Robot: React.FC<RobotProps> = ({
  scrollVal: _scrollVal,
  robotProgressRef,
  themeProgressRef: _themeProgressRef,
  mouseX,
  phase,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headLightRef = useRef<THREE.PointLight>(null);
  
  // Use a simple any cast for now to verify if the syntax error disappears
  const { scene, materials } = useGLTF('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb') as any;

  const stateRef = useRef({
    posX: 0,
    posY: -2,
    rotY: 0,
    rotX: 0,
    scale: 0.8,
    opacity: 0,
    greenIntensity: 0,
  });

  useMemo(() => {
    const material = materials['Material_MR'];
    if (material) {
      material.metalness = 1.0;
      material.roughness = 0.15;
      material.emissive = new THREE.Color('#00ffbb');
      material.emissiveIntensity = 0;
      material.transparent = true;
    }
  }, [materials]);

  useFrame((state) => {
    if (!groupRef.current || phase !== 'main') return;

    const p = robotProgressRef.current;
    
    let targetX = 0;
    let targetY = 0.1;
    let targetRotY = 0;
    let targetRotX = 0;
    let targetScale = 1.9;
    let targetOpacity = 1;
    let targetGreen = 0.5;

    if (p < 0.2) {
      const entryP = Math.min(1, p * 5);
      targetY = lerp(-2, 0.1, entryP);
      targetScale = lerp(1.2, 1.9, entryP);
      targetOpacity = entryP;
      targetGreen = 0.8;
    } else if (p < 0.45) {
      targetX = -2.0;
      targetRotY = Math.PI / 2.2;
      targetGreen = 4;
    } else if (p < 0.75) {
      targetX = 2.0;
      targetRotY = -Math.PI / 2.2;
      targetGreen = 2.5;
    } else {
      const exitP = Math.min(1, (p - 0.75) * 4);
      targetX = 2.0 + exitP * 12;
      targetRotY = -Math.PI / 1.5;
      targetOpacity = 1 - exitP;
      targetScale = 1.9 * (1 - exitP * 0.4);
      targetGreen = 0;
    }

    targetX += mouseX * 0.4;
    targetRotY += mouseX * 0.2;
    targetRotX += (state.mouse.y * -0.15);

    const factor = 0.08;
    stateRef.current.posX += (targetX - stateRef.current.posX) * factor;
    stateRef.current.posY += (targetY - stateRef.current.posY) * factor;
    stateRef.current.rotY += (targetRotY - stateRef.current.rotY) * factor;
    stateRef.current.rotX += (targetRotX - stateRef.current.rotX) * factor;
    stateRef.current.scale += (targetScale - stateRef.current.scale) * factor;
    stateRef.current.opacity += (targetOpacity - stateRef.current.opacity) * factor;
    stateRef.current.greenIntensity += (targetGreen - stateRef.current.greenIntensity) * factor;

    groupRef.current.position.x = stateRef.current.posX;
    groupRef.current.position.y = stateRef.current.posY + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    groupRef.current.rotation.y = stateRef.current.rotY;
    groupRef.current.rotation.x = stateRef.current.rotX;
    groupRef.current.scale.setScalar(stateRef.current.scale);
    groupRef.current.visible = stateRef.current.opacity > 0.01;

    const material = materials['Material_MR'];
    if (material) {
      material.emissiveIntensity = stateRef.current.greenIntensity * (1 + Math.sin(state.clock.elapsedTime * 3) * 0.15);
      material.opacity = stateRef.current.opacity;
    }

    if (headLightRef.current) {
      headLightRef.current.intensity = stateRef.current.greenIntensity * 3;
      headLightRef.current.position.x = p < 0.45 ? 1.5 : -1.5;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      <pointLight 
        ref={headLightRef} 
        color="#00ffbb" 
        intensity={0} 
        distance={6} 
        position={[0, 0, 1.5]} 
      />
    </group>
  );
};

useGLTF.preload('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb');
