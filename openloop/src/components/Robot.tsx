import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { lerp, clamp } from '../utils/math';

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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
    if (!groupRef.current) return;
    
    // Fail-safe: if not main phase, keep default but hidden/offset
    if (phase !== 'main') {
      stateRef.current.posY = -3;
      stateRef.current.opacity = 0;
      groupRef.current.visible = false;
      return;
    }

    const pRaw = robotProgressRef.current;
    // Fail-safe for invalid progress
    const p = (isNaN(pRaw) || pRaw === undefined) ? 0 : clamp(pRaw, 0, 1);
    
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

    // --- Deterministic State Machine (Scroll Controlled ONLY) ---
    
    // HERO (0.00 -> 0.15): Rise from Bottom (Delayed fade-in)
    if (p < 0.15) {
      const hp = clamp(p / 0.15, 0, 1);
      // Robot starts coming in immediately on first scroll (p > 0)
      targetOpacity = hp; 
      targetY = lerp(-3, 0, easeOut(hp)); 
      targetX = 0;
      targetRotY = 0;
      targetScale = 2.0;
      targetGreen = 0;
    }
    // ABOUT (0.15 -> 0.30): Shift Left + Profile
    else if (p < 0.30) {
      const ap = clamp((p - 0.15) / 0.15, 0, 1);
      targetOpacity = 1;
      targetX = lerp(0, -3.5, easeInOut(ap));
      targetY = 0;
      targetRotY = lerp(0, Math.PI / 2, easeInOut(ap));
      targetScale = lerp(2.0, 1.7, easeInOut(ap));
      targetBeam = ap > 0.5 ? (ap - 0.5) * 2 : 0;
      targetGreen = 2 + targetBeam * 3;
    }
    // THEMES & TIMELINE (0.30 -> 0.55): Fade Out & Push Back (HIDDEN)
    else if (p < 0.55) {
      const tp = clamp((p - 0.30) / 0.10, 0, 1);
      targetOpacity = 1 - tp;
      targetZ = lerp(0, -6, tp);
      targetX = -3.5;
      targetRotY = Math.PI / 2;
      targetScale = 1.7;
      targetGreen = 0;
    }
    // TIMELINE & SPONSORS (0.55 -> 0.90): Hidden for Focus
    else if (p < 0.90) {
      targetOpacity = 0;
    }
    // CONTACT (0.90 -> 0.97): Stable Left
    else if (p < 0.97) {
      targetOpacity = 1;
      targetX = -3.5;
      targetRotY = Math.PI / 2;
      targetZ = 0;
      targetScale = 1.7;
      targetGreen = 2;
    }
    // FOOTER (0.97 -> 1.00): Exit & Push Back (HIDDEN)
    else {
      const fp = clamp((p - 0.97) / 0.03, 0, 1);
      targetOpacity = 1 - fp;
      targetZ = lerp(0, -10, fp);
      targetX = -3.5;
      targetRotY = Math.PI / 2;
      targetScale = 1.7;
      targetGreen = 0;
    }

    // Add mouse parallax
    targetX += mouseX * 0.45;
    targetRotY += mouseX * 0.15;

    // Smooth lerp for state
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
    groupRef.current.visible = stateRef.current.opacity > 0.001;

    const material = materials['Material_MR'];
    if (material) {
      material.emissiveIntensity = stateRef.current.greenIntensity;
      material.opacity = stateRef.current.opacity;
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
