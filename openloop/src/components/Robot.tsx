import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
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

  const targetMaterials = useMemo(() => {
    const mats: THREE.MeshStandardMaterial[] = [];
    scene.traverse((node: any) => {
      if (node.isMesh && node.material) {
        const mat = node.material as THREE.MeshStandardMaterial;
        mats.push(mat);
        mat.metalness = 1.0;
        mat.roughness = 0.15;
        mat.emissive = new THREE.Color('#C6FF00');
        mat.emissiveIntensity = 0;
        mat.transparent = true;
      }
    });
    return mats;
  }, [scene]);

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

    // --- Deterministic State Machine (aligned with zero-gap section ranges) ---

    // HERO (0.00 -> 0.16): Rise from BELOW viewport — opacity always 1, only Y animates
    if (p < 0.16) {
      const hp = clamp(p / 0.16, 0, 1);
      targetOpacity = 1; // Always visible — Y controls when it appears on screen
      targetY = lerp(-2.8, 0, easeOut(hp));
      targetX = 0;
      targetRotY = 0;
      targetScale = 2.0;
      targetGreen = 0;
    }
    // ABOUT (0.08 -> 0.36): Shift Left + Profile
    else if (p < 0.36) {
      const ap = clamp((p - 0.08) / 0.28, 0, 1);
      targetOpacity = 1;
      targetX = lerp(0, -3.5, easeInOut(ap));
      targetY = 0;
      targetRotY = lerp(0, Math.PI / 2, easeInOut(ap));
      targetScale = lerp(2.0, 1.7, easeInOut(ap));
      targetBeam = ap > 0.5 ? (ap - 0.5) * 2 : 0;
      targetGreen = 2 + targetBeam * 3;
    }
    // THEMES transition (0.36 -> 0.54): Fade Out — sections are overlapping so no black gap
    else if (p < 0.54) {
      const tp = clamp((p - 0.36) / 0.10, 0, 1);
      targetOpacity = 1 - tp; // fade out quickly
      targetZ = lerp(0, -6, tp);
      targetX = -3.5;
      targetRotY = Math.PI / 2;
      targetScale = 1.7;
      targetGreen = 0;
    }
    // TIMELINE (0.54 -> 0.86): Hidden for 3D Timeline Focus
    else if (p < 0.86) {
      targetOpacity = 0;
    }
    // SPONSORS transition (0.84 -> 0.94): Fade In — left profile again
    else if (p < 0.94) {
      const sp = clamp((p - 0.84) / 0.10, 0, 1);
      targetOpacity = sp;
      targetX = -3.5;
      targetRotY = Math.PI / 2;
      targetZ = 0;
      targetScale = 1.7;
      targetGreen = 2;
    }
    // CONTACT (0.94 -> 0.97): Stable Left
    else if (p < 0.97) {
      targetOpacity = 1;
      targetX = -3.5;
      targetRotY = Math.PI / 2;
      targetZ = 0;
      targetScale = 1.7;
      targetGreen = 2;
    }
    // FOOTER (0.97 -> 1.00): Immersive Center Scene (Silver/White Edition)
    else {
      const fp = clamp((p - 0.97) / 0.03, 0, 1);
      
      // PERFECT SMOOTH TRANSITION FROM CONTACT (-3.5, 0, 0) TO CENTER (0, 0.15, 0.5)
      targetX = lerp(-3.5, 0, easeInOut(fp));
      targetY = lerp(0, 0.15, easeInOut(fp)); 
      targetZ = lerp(0, 0.5, easeInOut(fp)); 
      targetRotY = lerp(Math.PI / 2, mouseX * 0.45, easeInOut(fp)); 
      targetRotX = 0;
      
      // Organic 'breathing' scale pulse for 'Perfect' feel
      const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      targetScale = lerp(1.7, 1.1, easeInOut(fp)) + breathe; 
      
      targetOpacity = 1; 
      
      // Pure White/Silver Glow in footer - Enhanced base intensity for 'Perfection'
      targetGreen = 3.0 + Math.sin(state.clock.elapsedTime * 2) * 2.0; 
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

    targetMaterials.forEach(material => {
      material.emissiveIntensity = stateRef.current.greenIntensity;
      material.opacity = stateRef.current.opacity;
      
      // COLOR SHIFT: Neon Green -> Silver/White in Footer
      const colorProgress = clamp((pRaw - 0.94) / 0.06, 0, 1);
      material.emissive.lerpColors(new THREE.Color('#C6FF00'), new THREE.Color('#33b023ff'), colorProgress);
    });

    if (beamRef.current) {
      (beamRef.current.material as THREE.MeshBasicMaterial).opacity = stateRef.current.beamOpacity * 0.15;
    }
  });

  const isFooter = phase === 'main' && robotProgressRef.current > 0.97;

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => isFooter && (document.body.style.cursor = 'pointer')}
      onPointerOut={() => isFooter && (document.body.style.cursor = 'auto')}
      onClick={() => {
        if (isFooter) {
          window.open('https://unstop.com/college-fests/openloop-26-yenepoya-school-of-engineering-and-technology-458231', '_blank');
        }
      }}
    >
      <primitive object={scene} />
      
      {/* Volumetric Beam - Soft Cylinder */}
      <mesh ref={beamRef} rotation={[0, 0, Math.PI / 2]} position={[2.5, 0, 0.4]}>
        <cylinderGeometry args={[0.05, 0.8, 5, 32, 1, true]} />
        <meshBasicMaterial color="#C6FF00" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      <pointLight ref={headLightRef} color="#ffffff" intensity={0} distance={5} position={[0, 0, 1]} />
      
      
      
    </group>
  );
};

useGLTF.preload('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb');
