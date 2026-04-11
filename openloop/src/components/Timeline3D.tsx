import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { lerp, clamp } from '../utils/math';

interface TimelineEvent {
  title: string;
  date: string;
  desc: string;
  range: [number, number];
}

const TIMELINE_DATA: TimelineEvent[] = [
  { title: 'Registration Opens', date: 'TBA', desc: 'Secure your spot and start forming your team.', range: [0.550, 0.574] },
  { title: 'Kickoff & Opening', date: 'TBA', desc: 'Get briefed, meet participants, and dive into the challenge.', range: [0.574, 0.598] },
  { title: 'Hacking Begins', date: 'TBA', desc: 'The clock starts. Build, break, and iterate.', range: [0.598, 0.622] },
  { title: 'Mentorship & Checkpoints', date: 'TBA', desc: 'Refine your idea with expert feedback and stay on track.', range: [0.622, 0.646] },
  { title: 'Project Submission', date: 'TBA', desc: 'Submit your final build and prepare to showcase.', range: [0.646, 0.670] },
  { title: 'Final Presentations', date: 'TBA', desc: 'Pitch your project to judges and the community.', range: [0.670, 0.694] },
  { title: 'Winners Announced', date: 'TBA', desc: 'Celebrating the best builds, bold ideas, and standout teams.', range: [0.694, 0.720] },
];

export const Timeline3D: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const p = scrollProgress;
  // Deterministic Kill-Switch: If not in range, don't even render.
  if (p < 0.50 || p >= 0.80) return null;

  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  // We'll spread nodes along the X axis - Tightened for multiple visibility
  const spacing = 2.2;
  const startX = -((TIMELINE_DATA.length - 1) * spacing) / 2;
  const totalWidth = (TIMELINE_DATA.length - 1) * spacing;

  useFrame((state) => {
    if (!groupRef.current) return;

    const p = scrollProgress;
    
    // 1. Core Timeline Movement (0.55 -> 0.72)
    // We clamp the driver so it stops at 0.72
    const timelineP = clamp((p - 0.55) / 0.17, 0, 1);
    
    // Move horizontally centered around nodes
    const targetXOffset = -startX - (timelineP * totalWidth);
    groupRef.current.position.x = lerp(groupRef.current.position.x, targetXOffset, 0.1);

    // 2. Traveling Light Pulse
    if (pulseRef.current) {
      const pulseX = startX + (timelineP * (TIMELINE_DATA.length - 1) * spacing);
      pulseRef.current.position.x = pulseX;
      pulseRef.current.position.y = 0;
      pulseRef.current.visible = timelineP > 0 && timelineP < 1;
      
      const material = pulseRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 10) * 1;
    }

    // 3. Cinematic Exit Transition (0.65 -> 0.72)
    let opacity = 0;
    let offsetY = 0.5; // Default y baseline

    if (p >= 0.50 && p < 0.75) {
      // Entry Fade (0.50 -> 0.55)
      if (p < 0.55) {
        opacity = (p - 0.50) / 0.05;
      } 
      // Main Body (0.55 -> 0.65)
      else if (p < 0.65) {
        opacity = 1;
      }
      // Cinematic Exit (0.65 -> 0.72)
      else if (p < 0.72) {
        const exitP = (p - 0.65) / 0.07;
        opacity = 1 - exitP;
        offsetY = 0.5 + (exitP * 0.5); // Rise upwards
      }
      // Dead Zone / Buffer (0.72 -> 0.75)
      else {
        opacity = 0;
      }
    }

    groupRef.current.position.y = lerp(groupRef.current.position.y, offsetY, 0.1);
    groupRef.current.visible = p >= 0.50 && p < 0.72 && opacity > 0;
  });

  return (
    <group ref={groupRef} position={[0, 0.5, -2]}>
      {/* Main Track Line */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 30, 8]} />
        <meshStandardMaterial color="#C6FF00" emissive="#C6FF00" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>

      {/* Traveling Data Pulse */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#C6FF00" emissiveIntensity={3} />
        <pointLight color="#C6FF00" intensity={1} distance={2} />
      </mesh>

      {/* Nodes */}
      {TIMELINE_DATA.map((event, i) => {
        const xPos = startX + i * spacing;
        const isLeft = i % 2 !== 0; // Alternating

        return (
          <Node 
            key={i} 
            event={event} 
            xPos={xPos} 
            isLeft={isLeft} 
            scrollProgress={scrollProgress} 
          />
        );
      })}
    </group>
  );
};

interface NodeProps {
  event: TimelineEvent;
  xPos: number;
  isLeft: boolean;
  scrollProgress: number;
}

const Node: React.FC<NodeProps> = ({ event, xPos, isLeft, scrollProgress }) => {
  const meshRef = useRef<THREE.Group>(null);
  const p = scrollProgress;
  
  // Calculate state
  const isActive = p >= event.range[0] && p < event.range[1];
  const isCompleted = p >= event.range[1];
  const isPending = p < event.range[0];

  useFrame((state) => {
    if (!meshRef.current) return;

    // Pulse animation for active node
    if (isActive) {
      const scale = 1.2 + Math.sin(state.clock.elapsedTime * 6) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    } else if (isCompleted) {
      meshRef.current.scale.set(1, 1, 1);
    } else {
      meshRef.current.scale.set(0.8, 0.8, 0.8);
    }
  });

  const nodeColor = isActive ? "#C6FF00" : (isCompleted ? "#88aa00" : "#222222");
  const glowIntensity = isActive ? 2 : (isCompleted ? 0.5 : 0.1);

  return (
    <group position={[xPos, 0, 0]} ref={meshRef}>
      {/* Node Geometry */}
      <mesh>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial 
          color={nodeColor} 
          emissive={nodeColor} 
          emissiveIntensity={glowIntensity} 
          transparent 
          opacity={isPending ? 0.4 : 1}
        />
      </mesh>

      {/* Label Panel */}
      <Html
        position={[0, isLeft ? -1.2 : 1.2, 0]}
        center
        distanceFactor={10}
        style={{
          transition: 'all 0.5s ease',
          opacity: isActive ? 1 : (isCompleted ? 0.5 : 0),
          transform: `translateY(${isActive ? 0 : (isLeft ? 20 : -20)}px)`,
          pointerEvents: 'none'
        }}
      >
        <div className="t3d-panel" style={{
          background: 'rgba(0,0,0,0.85)',
          borderLeft: `3px solid ${nodeColor}`,
          padding: '12px',
          width: '200px',
          borderRadius: '2px',
          boxShadow: `0 0 20px rgba(0,0,0,0.4), inset 0 0 10px ${isActive ? 'rgba(198,255,0,0.1)' : 'transparent'}`,
          backdropFilter: 'blur(10px)',
          color: 'white',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{ fontSize: '10px', color: '#C6FF00', fontWeight: 'bold', marginBottom: '4px', letterSpacing: '2px' }}>
            {event.date}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {event.title}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
            {event.desc}
          </div>
        </div>
      </Html>
    </group>
  );
};
