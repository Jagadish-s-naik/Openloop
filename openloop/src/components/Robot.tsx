import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { lerp, clamp } from '../utils/math';

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface RobotProps {
  scrollVal: number;
  robotProgressRef: React.MutableRefObject<number>;
  themeProgressRef: React.MutableRefObject<number>;
  mouseX: number;
  phase: string;
  isVisible: boolean;
}

export const Robot: React.FC<RobotProps> = ({
  scrollVal: _scrollVal,
  robotProgressRef,
  themeProgressRef: _themeProgressRef,
  mouseX,
  phase,
  isVisible,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headLightRef = useRef<THREE.PointLight>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  
  const { scene, materials } = useGLTF('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb') as any;

  const stateRef = useRef({
    posX: 0,
    posY: -2,
    posZ: 0,
    rotY: 0,
    rotX: 0,
    scale: 2.0,
    opacity: 0,
    greenIntensity: 0,
    beamOpacity: 0,
  });

  useMemo(() => {
    const material = materials['Material_MR'];
    if (material) {
      material.metalness = 1.0;
      material.roughness = 0.15;
      material.emissive = new THREE.Color('#C6FF00');
      material.emissiveIntensity = 0;
      material.transparent = true;
    }
  }, [materials]);

  useFrame((state) => {
    if (!groupRef.current || phase !== 'main') return;

    const p = robotProgressRef.current;
    
    // Continuous Target State
    let targetX = 0;
    let targetY = 0; 
    let targetZ = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let targetScale = 2.0;
    let targetOpacity = 0; 
    let targetGreen = 0;
    let targetBeam = 0;

    // 1. HERO (0.00 -> 0.18) - Entrance
    if (p < 0.18) {
      const lp = p / 0.18;
      targetOpacity = 1;
      targetX = 0;
      targetY = lerp(-1, 0, lp);
      targetRotY = 0;
    }
    // 2. ABOUT (0.18 -> 0.36) - Profile + Beam
    else if (p < 0.36) {
      const lp = (p - 0.18) / 0.18;
      targetOpacity = 1;
      targetX = lerp(0, -3.5, easeInOut(lp));
      targetScale = lerp(2.0, 1.7, easeInOut(lp));
      targetRotY = lerp(0, Math.PI / 2, easeInOut(lp));
      targetBeam = lp > 0.5 ? (lp - 0.5) * 2 : 0;
      targetGreen = 2 + targetBeam * 3;
    }
    // 3. THEMES & 4. TIMELINE (0.36 -> 0.75) - HIDDEN
    else if (p < 0.75) {
      const lp = (p - 0.36) / 0.10; // Rapid exit
      targetOpacity = clamp(1 - lp, 0, 1);
      targetZ = -4; // Sink into depth
      targetX = -2.4;
      targetRotY = Math.PI / 2;
    }
    // 5. SPONSORS, 6. CONTACT, 7. FOOTER (0.75 -> 1.00) - RE-ENTRY
    else {
      const entryP = clamp((p - 0.75) / 0.03, 0, 1); // Much faster entry
      const exitP = clamp((1.00 - p) / 0.08, 0, 1);
      targetOpacity = Math.min(entryP, exitP);
      targetX = -2.4;
      targetZ = 0;
      targetRotY = Math.PI / 2;
      targetGreen = 1.5;
    }

    // Add mouse parallax
    targetX += mouseX * 0.45;
    targetRotY += mouseX * 0.15;

    const factor = 0.08;
    stateRef.current.posX += (targetX - stateRef.current.posX) * factor;
    stateRef.current.posY += (targetY - stateRef.current.posY) * factor;
    stateRef.current.posZ += (targetZ - stateRef.current.posZ) * factor;
    stateRef.current.rotY += (targetRotY - stateRef.current.rotY) * factor;
    stateRef.current.rotX += (targetRotX - stateRef.current.rotX) * factor;
    stateRef.current.scale += (targetScale - stateRef.current.scale) * factor;
    stateRef.current.opacity += (targetOpacity - stateRef.current.opacity) * factor;
    stateRef.current.greenIntensity += (targetGreen - stateRef.current.greenIntensity) * factor;
    stateRef.current.beamOpacity += (targetBeam - stateRef.current.beamOpacity) * factor;

    groupRef.current.position.set(
      stateRef.current.posX,
      stateRef.current.posY + Math.sin(state.clock.elapsedTime * 1.5) * 0.05,
      stateRef.current.posZ
    );
    groupRef.current.rotation.set(stateRef.current.rotX, stateRef.current.rotY, 0);
    groupRef.current.scale.setScalar(stateRef.current.scale);
    
    // Smooth visibility blend
    const finalOpacity = stateRef.current.opacity * (isVisible ? 1 : 0);
    groupRef.current.visible = finalOpacity > 0.001;

    const material = materials['Material_MR'];
    if (material) {
      material.emissiveIntensity = stateRef.current.greenIntensity;
      material.opacity = finalOpacity;
    }

    if (beamRef.current) {
      (beamRef.current.material as THREE.MeshBasicMaterial).opacity = stateRef.current.beamOpacity * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      {/* Volumetric Beam - Soft Cylinder */}
      <mesh ref={beamRef} rotation={[0, 0, Math.PI / 2]} position={[2.5, 0, 0.4]}>
        <cylinderGeometry args={[0.05, 0.8, 5, 32, 1, true]} />
        <meshBasicMaterial color="#C6FF00" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      <pointLight ref={headLightRef} color="#C6FF00" intensity={0} distance={5} position={[0, 0, 1]} />
    </group>
  );
};

useGLTF.preload('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb');
