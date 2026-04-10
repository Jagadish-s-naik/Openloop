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
  const p = scrollProgress;

  // NEW window: 0.45 -> 0.65
  const isTimelineActive = p >= 0.45 && p < 0.65;

  useFrame(() => {
    if (!groupRef.current) return;
    
    const mappedP = clamp((p - 0.45) / 0.20, 0, 1);
    groupRef.current.position.z = lerp(0, 22, mappedP);
    groupRef.current.visible = p >= 0.42 && p < 0.68; // Slight buffer for entry/exit
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {MILESTONES.map((item, i) => (
        <TimelineItem key={i} data={item} index={i} totalProgress={p} />
      ))}
      
      {/* Connecting Line */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, -10]}>
        <cylinderGeometry args={[0.005, 0.005, 25, 8]} />
        <meshBasicMaterial color="#C6FF00" transparent opacity={0.15 * (isTimelineActive ? 1 : 0)} />
      </mesh>
    </group>
  );
};

const TimelineItem = ({ data, index, totalProgress }: { data: MilestoneData; index: number; totalProgress: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // NEW window: 0.45 -> 0.65
  const timelineStart = 0.45;
  const range = 0.20;
  const step = range / MILESTONES.length;
  const startAt = timelineStart + index * step;
  
  const activeP = clamp((totalProgress - startAt) / step, 0, 1);
  const opacity = clamp((totalProgress - 0.44) / 0.05, 0, 1) * clamp((0.66 - totalProgress) / 0.05, 0, 1);
  
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
        <meshBasicMaterial color="#C6FF00" transparent opacity={activeP * 0.4 * opacity} />
      </mesh>

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[0.5, 0, 0]}>
          <Text
            fontSize={0.18}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
            fillOpacity={opacity}
          >
            {data.title}
          </Text>
          <Text
            fontSize={0.07}
            color="#C6FF00"
            anchorX="left"
            anchorY="top"
            position={[0, -0.15, 0]}
            maxWidth={1.5}
            fillOpacity={opacity}
          >
            {data.desc}
          </Text>
        </group>
      </Float>
    </group>
  );
};
