import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { lerp, normalize, mapRange } from '../utils/math';

interface LoaderSceneProps {
  scrollVal: number;
}

export const LoaderScene: React.FC<LoaderSceneProps> = ({ scrollVal }) => {
  const groupRef = useRef<THREE.Group>(null);
  const laptopRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Group>(null);
  const portalRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);

  // Materials and Geometries optimization
  const materials = useMemo(() => ({
    body: new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.8 }),
    screenGlow: new THREE.MeshStandardMaterial({ 
      color: '#00ccff', 
      emissive: '#00aaff', 
      emissiveIntensity: 0,
      roughness: 0.1
    }),
    portal: new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0 }),
  }), []);

  const geos = useMemo(() => ({
    base: new THREE.BoxGeometry(4, 0.2, 3),
    screen: new THREE.BoxGeometry(4, 2.5, 0.1),
    portal: new THREE.CircleGeometry(5, 32),
  }), []);

  useFrame(() => {
    // Scroll 0 -> 0.2 animation sequence
    const loaderProgress = normalize(scrollVal, 0, 0.2); // 0 to 1

    if (laptopRef.current) {
      // 1. Laptop appears (scale 0.5 -> 1)
      const scaleProg = normalize(loaderProgress, 0, 0.2);
      const targetScale = mapRange(scaleProg, 0, 1, 0.5, 1.2);
      laptopRef.current.scale.setScalar(lerp(laptopRef.current.scale.x, targetScale, 0.1));

      // 2. Rotate Y from 90° -> 0°
      const rotYProg = normalize(loaderProgress, 0, 0.3); // Map so it rotates smoothly on start
      const targetRotY = mapRange(rotYProg, 0, 1, Math.PI / 2, 0);
      laptopRef.current.rotation.y = lerp(laptopRef.current.rotation.y, targetRotY, 0.1);
      
      // Laptop fades backwards as scroll continues
      const zPosProg = normalize(loaderProgress, 0.7, 1);
      const targetZ = mapRange(zPosProg, 0, 1, 0, -10);
      laptopRef.current.position.z = lerp(laptopRef.current.position.z, targetZ, 0.1);
    }

    if (screenRef.current) {
      // 3. Screen rotates open (hinge rotation on X axis)
      const screenProg = normalize(loaderProgress, 0.3, 0.6);
      const targetRotX = mapRange(screenProg, 0, 1, Math.PI / 2, -0.1); // Closed to Open slightly back
      screenRef.current.rotation.x = lerp(screenRef.current.rotation.x, targetRotX, 0.1);
    }

    // 4. Screen emissive intensity
    if (materials.screenGlow) {
      const glowProg = normalize(loaderProgress, 0.5, 0.8);
      const newIntensity = lerp(
        materials.screenGlow.emissiveIntensity,
        mapRange(glowProg, 0, 1, 0, 2),
        0.1
      );
      materials.screenGlow.emissiveIntensity = newIntensity;
    }

    // Text appearance
    if (textRef.current) {
      const textProg = normalize(loaderProgress, 0.6, 0.8);
      textRef.current.position.y = lerp(textRef.current.position.y, mapRange(textProg, 0, 1, -1, 0), 0.1);
      (textRef.current.material as THREE.Material).opacity = textProg;
    }

    // Portal expanding
    if (portalRef.current) {
      const portalProg = normalize(loaderProgress, 0.8, 1);
      const targetScale = lerp(0, 15, Math.pow(portalProg, 2)); // Ease in
      portalRef.current.scale.setScalar(lerp(portalRef.current.scale.x, targetScale, 0.1));
      materials.portal.opacity = lerp(materials.portal.opacity, mapRange(portalProg, 0, 1, 0, 1), 0.1);
    }
    
    // Fade out group beyond 0.2
    if (groupRef.current) {
        groupRef.current.visible = scrollVal < 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={laptopRef} position={[0, -1, 0]}>
        {/* Base */}
        <mesh geometry={geos.base} material={materials.body} position={[0, 0, 0]} />
        
        {/* Screen Hinge Group */}
        <group ref={screenRef} position={[0, 0.1, -1.4]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={geos.screen} material={materials.body} position={[0, 1.25, 0]} />
          {/* Inner Screen Glow */}
          <mesh position={[0, 1.25, 0.06]}>
            <planeGeometry args={[3.8, 2.3]} />
            <primitive object={materials.screenGlow} attach="material" />
          </mesh>
          <Text
            ref={textRef as any}
            position={[0, 1.25, 0.07]}
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            material-transparent={true}
            material-opacity={0}
          >
            OPENLOOP
          </Text>
        </group>
      </group>

      <mesh ref={portalRef} geometry={geos.portal} material={materials.portal} position={[0, 0, -2]} />
    </group>
  );
};
