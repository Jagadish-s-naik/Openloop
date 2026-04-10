import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { lerp, clamp } from '../utils/math';

interface MilestoneData {
  title: string;
  desc: string;
  z: number;
}

const MILESTONES: MilestoneData[] = [
  { title: "REGISTRATION", desc: "Teams finalize roster and project themes.", z: -20 },
  { title: "HACKATHON BEGINS", desc: "48 hours of uninterrupted innovation starts.", z: -16 },
  { title: "MID-POINT CHECK", desc: "Expert mentors review progress and pivot ideas.", z: -12 },
  { title: "SUBMISSION", desc: "Final code push and documentation lock.", z: -8 },
  { title: "JUDGING", desc: "Live demos for the panel of experts.", z: -4 },
  { title: "GRAND FINALE", desc: "Awards ceremony and winners announced.", z: 0 },
];

export const Timeline3D: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    
    // We want the group to move forward as we scroll
    const mappedP = clamp((scrollProgress - 0.75) / 0.25, 0, 1);
    const zOffset = lerp(0, 22, mappedP);
    
    groupRef.current.position.z = zOffset;
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {MILESTONES.map((item, i) => (
        <TimelineItem key={i} data={item} index={i} totalProgress={scrollProgress} />
      ))}
      
      {/* Connecting Line */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, -10]}>
        <cylinderGeometry args={[0.005, 0.005, 25, 8]} />
        <meshBasicMaterial color="#C6FF00" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

const TimelineItem = ({ data, index, totalProgress }: { data: MilestoneData; index: number; totalProgress: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // High-precision activation
  const timelineStart = 0.75;
  const step = 0.25 / MILESTONES.length;
  const startAt = timelineStart + index * step;
  
  const activeP = clamp((totalProgress - startAt) / step, 0, 1);
  const opacity = activeP > 0 ? 1 : 0.2;
  const scale = lerp(0.8, 1.2, activeP);

  return (
    <group position={[0, 0, data.z]} scale={[scale, scale, scale]}>
      {/* Node Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial 
          color="#C6FF00" 
          emissive="#C6FF00" 
          emissiveIntensity={lerp(0.2, 2.5, activeP)} 
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.004, 16, 100]} />
        <meshBasicMaterial color="#C6FF00" transparent opacity={opacity * 0.4} />
      </mesh>

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[0.5, 0, 0]}>
          <Text
            fontSize={0.18}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/rajdhani/v15/L0x5DF02iFML4hGCyOCzSfDV.woff"
          >
            {data.title}
            <meshStandardMaterial transparent opacity={opacity} />
          </Text>
          <Text
            fontSize={0.07}
            color="#C6FF00"
            anchorX="left"
            anchorY="top"
            position={[0, -0.15, 0]}
            maxWidth={1.5}
            font="https://fonts.gstatic.com/s/rajdhani/v15/L0x5DF02iFML4hGCyOCzSfDV.woff"
          >
            {data.desc}
            <meshStandardMaterial transparent opacity={opacity * 0.5} />
          </Text>
        </group>
      </Float>
    </group>
  );
};
