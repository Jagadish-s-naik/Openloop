import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { lerp } from '../utils/math';

interface LoaderSceneProps {
  progress: number;
  phase: 'loader' | 'intro' | 'main';
}

export const LoaderScene: React.FC<LoaderSceneProps> = ({ progress, phase }) => {
  const laptopGroupRef = useRef<THREE.Group>(null);
  const hingeRef = useRef<THREE.Group>(null);
  const screenMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const textMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const portalRef = useRef<THREE.Group>(null);
  
  const introTimerRef = useRef<number | null>(null);

  const materials = useMemo(() => ({
    casing: new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      metalness: 1.0,
      roughness: 0.1,
    }),
    screen: new THREE.MeshStandardMaterial({
      color: '#000000',
      metalness: 0.5,
      roughness: 0.1,
      emissive: '#C6FF00',
      emissiveIntensity: 0,
    }),
    text: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#ffffff',
      emissiveIntensity: 0,
    }),
    portal: new THREE.MeshBasicMaterial({
      color: '#C6FF00',
      transparent: true,
      opacity: 0,
    }),
  }), []);

  const geos = useMemo(() => ({
    // Ultra-thin realistic laptop base and lid
    base: new THREE.BoxGeometry(2.2, 0.04, 1.6),
    lid: new THREE.BoxGeometry(2.2, 1.55, 0.04),
    screen: new THREE.PlaneGeometry(2.1, 1.45),
    portal: new THREE.CircleGeometry(0.2, 64),
    // Progress bar geometry
    progressBg: new THREE.PlaneGeometry(1.2, 0.03),
    progressBar: new THREE.PlaneGeometry(1.2, 0.03),
  }), []);

  useFrame((state) => {
    if (!laptopGroupRef.current || !hingeRef.current) return;

    // --- 1. LOADER PHASE ---
    if (phase === 'loader') {
      const scaleBase = 0.5;
      laptopGroupRef.current.scale.setScalar(lerp(scaleBase, 4.0, Math.pow(progress, 1.5)));
      laptopGroupRef.current.rotation.y = lerp(-Math.PI / 10, 0, progress); // Slight angle
      laptopGroupRef.current.position.z = lerp(-3, 0, progress);
      laptopGroupRef.current.position.y = -0.5;
    }

    // --- 2. INTRO PHASE (Cinematic Sequence) ---
    if (phase === 'intro') {
      if (introTimerRef.current === null) introTimerRef.current = state.clock.elapsedTime;
      const elapsed = state.clock.elapsedTime - introTimerRef.current;
      const introDuration = 4.0; 
      const t = Math.min(elapsed / introDuration, 1);

      // Sequence: 0-1s (angled) -> 1-2.5s (rotate + open) -> 2.5-3.5s (glow) -> 3.5-4s (portal)

      // Stage 1 & 2: Rotate to front and Open hinge
      if (t < 0.6) {
        const p = Math.min(t / 0.6, 1);
        laptopGroupRef.current.rotation.y = lerp(0, 0, p); 
        hingeRef.current.rotation.x = lerp(0, Math.PI * 0.62, p);
      } else {
        hingeRef.current.rotation.x = Math.PI * 0.62;
      }

      // Stage 3: Glow ramp
      if (t > 0.4 && t < 0.8) {
        const p = (t - 0.4) / 0.4;
        if (screenMaterialRef.current) screenMaterialRef.current.emissiveIntensity = lerp(0.5, 4.0, p);
        if (textMaterialRef.current) textMaterialRef.current.emissiveIntensity = lerp(0, 25, p);
      }

      // Stage 4: Portal Focus on second 'O'
      if (t > 0.75) {
        const p = Math.min((t - 0.75) / 0.25, 1);
        if (portalRef.current) {
          portalRef.current.scale.setScalar(lerp(0, 160, Math.pow(p, 4)));
          materials.portal.opacity = lerp(0, 1, Math.min(p * 2, 1));
        }
        // Camera enters portal
        state.camera.position.z = lerp(6.0, -2.5, Math.pow(p, 3));
      }
    }

    const bounce = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
    laptopGroupRef.current.position.y = -0.5 + bounce;
  });

  return (
    <group>
      <PerspectiveCamera makeDefault position={[0, 0, 6.0]} />
      <Environment preset="night" />
      
      <group ref={laptopGroupRef}>
        {/* Base Mesh */}
        <mesh geometry={geos.base} material={materials.casing} position={[0, 0, 0]} />
        
        {/* Hinge Linkage */}
        <group ref={hingeRef} position={[0, 0.02, -0.8]}>
          <group position={[0, 0.775, 0]}>
            <mesh geometry={geos.lid} material={materials.casing} />
            <mesh geometry={geos.screen} position={[0, 0, 0.021]}>
              <meshStandardMaterial ref={screenMaterialRef} {...materials.screen} />
            </mesh>
            
            <group position={[0, 0, 0.03]}>
              <group>
                <Text
                  fontSize={0.22}
                  color="#ffffff"
                  anchorX="right"
                  anchorY="middle"
                  position={[0, 0, 0]}
                  letterSpacing={0.15}
                >
                  OPEN
                  <meshStandardMaterial ref={textMaterialRef} {...materials.text} />
                </Text>
                <Text
                  fontSize={0.22}
                  color="#C6FF00"
                  anchorX="left"
                  anchorY="middle"
                  position={[0, 0, 0]}
                  letterSpacing={0.15}
                >
                  LOOP
                  <meshStandardMaterial depthWrite={false} transparent opacity={0.9} color="#C6FF00" emissive="#C6FF00" emissiveIntensity={2} />
                </Text>
              </group>

              {/* Loader HUD */}
              <group position={[0, -0.3, 0.01]}>
                <mesh geometry={geos.progressBg}>
                  <meshBasicMaterial color="#111111" transparent opacity={0.5} />
                </mesh>
                <mesh 
                  geometry={geos.progressBar} 
                  scale={[progress, 1, 1]}
                  position={[-(1 - progress) * 0.6, 0, 0.01]}
                >
                  <meshBasicMaterial color="#C6FF00" />
                </mesh>
              </group>
              
              {/* Cinematic Portal Focus on second 'O' (approx x=0.25) */}
              <group ref={portalRef} position={[0.26, 0, 0.01]} scale={[0, 0, 0]}>
                <mesh geometry={geos.portal} material={materials.portal} />
              </group>
            </group>
          </group>
        </group>
      </group>
      
      <ambientLight intensity={1.5} />
      <pointLight position={[5, 10, 5]} intensity={12} />
      <pointLight position={[-5, 5, 5]} intensity={8} color="#C6FF00" />
    </group>
  );
};

