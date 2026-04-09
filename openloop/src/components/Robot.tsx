import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { lerp, normalize } from '../utils/math';

interface RobotProps {
  scrollVal: number;
  robotProgressRef: React.MutableRefObject<number>;
  themeProgressRef: React.MutableRefObject<number>;
  mouseX: number;
}

export const Robot: React.FC<RobotProps> = ({ scrollVal, robotProgressRef, themeProgressRef, mouseX }) => {
  const groupRef = useRef<THREE.Group>(null);
  const spineLightRef = useRef<THREE.PointLight>(null);
  
  // Geometries and materials optimization
  const materials = useMemo(() => ({
    skull: new THREE.MeshStandardMaterial({ color: '#6d0f1f', metalness: 0.9, roughness: 0.18, emissive: '#23070e' }),
    forehead: new THREE.MeshStandardMaterial({ color: '#c8a45a', metalness: 0.94, roughness: 0.12, emissive: '#2b220e' }),
    cheek: new THREE.MeshStandardMaterial({ color: '#b89046', metalness: 0.92, roughness: 0.14, emissive: '#241c0b' }),
    jaw: new THREE.MeshStandardMaterial({ color: '#8e0c1d', metalness: 0.95, roughness: 0.08, emissive: '#22060c' }),
    socket: new THREE.MeshStandardMaterial({ color: '#0e0e14', metalness: 0.5, roughness: 0.8 }),
    eyeGlow: new THREE.MeshBasicMaterial({ color: '#dff7ff', transparent: true, opacity: 0.95 }),
    seam: new THREE.MeshBasicMaterial({ color: '#00f0ff', transparent: true, opacity: 0.6 }),
  }), []);

  const geos = useMemo(() => ({
    head: new THREE.SphereGeometry(1.05, 48, 48),
    plate: new THREE.PlaneGeometry(1.6, 0.9),
    eyeSlot: new THREE.PlaneGeometry(0.44, 0.1),
    seam: new THREE.PlaneGeometry(0.55, 0.02),
    sidePanel: new THREE.PlaneGeometry(0.18, 0.62),
    socket: new THREE.PlaneGeometry(1.6, 0.4),
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const appearProg = normalize(scrollVal, 0, 0.15);
    const p = robotProgressRef.current;
    const themeP = themeProgressRef.current;

    let targetY = 0;
    if (p < 0.25) {
      targetY = 0;
    } else if (p < 0.28) {
      targetY = lerp(0, Math.PI / 2, (p - 0.25) / 0.03);
    } else if (p < 0.5) {
      targetY = Math.PI / 2;
    } else if (p < 0.53) {
      targetY = lerp(Math.PI / 2, Math.PI, (p - 0.5) / 0.03);
    } else if (p < 0.75) {
      targetY = Math.PI;
    } else if (p < 0.78) {
      targetY = lerp(Math.PI, (Math.PI * 3) / 2, (p - 0.75) / 0.03);
    } else {
      targetY = (Math.PI * 3) / 2;
    }

    // Robot stays front-facing during the theme section sequence
    if (themeP > 0) {
      targetY = 0;
    }

    if (scrollVal >= 0.85) {
      groupRef.current.visible = false;
      return;
    } else {
      groupRef.current.visible = true;
    }

    const baseOpacity = lerp(0.65, 1, Math.min(1, appearProg * 2));

    // Theme phase C drives robot exit upward
    const themeExit = themeP > 0.78 ? Math.max(0, Math.min(1, (themeP - 0.78) / 0.22)) : 0;
    const robotExit = themeExit > 0.3 ? (themeExit - 0.3) / 0.7 : 0;

    const targetYPos = lerp(-0.1, 14, robotExit * robotExit * robotExit);
    const targetZ = lerp(0, -2, themeExit);
    const targetScale = lerp(1.4, 1.1, themeExit);

    materials.eyeGlow.opacity = baseOpacity;
    materials.seam.opacity = baseOpacity * 0.7;

    // Eye color transitions by section
    const eyePhaseColors = [
      new THREE.Color('#00f0ff'),
      new THREE.Color('#0088ff'),
      new THREE.Color('#ff9500'),
      new THREE.Color('#ffd700'),
    ];
    const eyeBand = Math.min(3, Math.floor(p * 4));
    materials.eyeGlow.color.lerp(eyePhaseColors[eyeBand], 0.08);
    materials.seam.color.lerp(eyePhaseColors[eyeBand], 0.05);

    groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, targetY + mouseX * 0.08 - 0.26, 0.08);
    const targetRotX = Math.sin(p * Math.PI) * 0.08;
    groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    groupRef.current.position.z = lerp(groupRef.current.position.z, targetZ, 0.08);
    groupRef.current.position.y = lerp(groupRef.current.position.y, targetYPos, 0.08);

    // As rotation approaches 180 degrees, back reactor intensity rises toward 4.
    if (spineLightRef.current) {
      const distanceToPi = Math.abs(groupRef.current.rotation.y - Math.PI);
      const withinBand = Math.max(0, 1 - distanceToPi / 0.2);
      spineLightRef.current.intensity = lerp(spineLightRef.current.intensity, withinBand * 4, 0.1);
    }

    // Breathing at 1 +/- 0.004
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.004;
    groupRef.current.scale.setScalar(lerp(groupRef.current.scale.x, targetScale * breathe, 0.08));
  });

  return (
    <group ref={groupRef} position={[-0.26, -0.08, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* Head */}
      <mesh geometry={geos.head} material={materials.skull} />

      {/* Forehead and face plates */}
      <mesh geometry={geos.plate} material={materials.forehead} position={[0, 0.22, 0.96]} rotation={[-0.06, 0, 0]} scale={[0.86, 1.05, 1]} />
      <mesh geometry={geos.plate} material={materials.jaw} position={[0, -0.48, 0.9]} rotation={[-0.2, 0, 0]} scale={[0.74, 0.34, 1]} />
      <mesh geometry={geos.socket} material={materials.socket} position={[0, 0.08, 0.99]} rotation={[0, 0, 0]} scale={[0.74, 0.36, 1]} />
      <mesh geometry={geos.plate} material={materials.cheek} position={[-0.44, -0.06, 0.92]} rotation={[0, 0.2, -0.08]} scale={[0.24, 0.58, 1]} />
      <mesh geometry={geos.plate} material={materials.cheek} position={[0.44, -0.06, 0.92]} rotation={[0, -0.2, 0.08]} scale={[0.24, 0.58, 1]} />

      {/* Eye slots */}
      <mesh geometry={geos.eyeSlot} material={materials.eyeGlow} position={[-0.32, 0.12, 1.04]} rotation={[0, 0.08, -0.12]} scale={[1.05, 1, 1]} />
      <mesh geometry={geos.eyeSlot} material={materials.eyeGlow} position={[0.32, 0.12, 1.04]} rotation={[0, -0.08, 0.12]} scale={[1.05, 1, 1]} />
      <mesh geometry={geos.seam} material={materials.forehead} position={[-0.3, 0.2, 1.02]} rotation={[0, 0.04, -0.4]} scale={[0.62, 1.2, 1]} />
      <mesh geometry={geos.seam} material={materials.forehead} position={[0.3, 0.2, 1.02]} rotation={[0, -0.04, 0.4]} scale={[0.62, 1.2, 1]} />

      {/* Seam lines */}
      <mesh geometry={geos.seam} material={materials.seam} position={[0, 0.38, 1.01]} scale={[0.48, 1, 1]} />
      <mesh geometry={geos.seam} material={materials.seam} position={[0, -0.12, 1.02]} scale={[0.58, 1, 1]} />
      <mesh geometry={geos.seam} material={materials.seam} position={[0, -0.34, 0.96]} scale={[0.52, 1, 1]} />
      <mesh geometry={geos.sidePanel} material={materials.seam} position={[0.72, 0.02, 0.8]} rotation={[0, -0.88, 0]} scale={[0.65, 0.58, 1]} />
      <mesh geometry={geos.sidePanel} material={materials.seam} position={[-0.72, 0.02, 0.8]} rotation={[0, 0.88, 0]} scale={[0.65, 0.58, 1]} />

      {/* Back panel reactor for section 3 emphasis */}
      <pointLight
        ref={spineLightRef}
        color="#ff9500"
        intensity={0}
        distance={4}
        position={[0, 0, -1.2]}
      />
    </group>
  );
};
