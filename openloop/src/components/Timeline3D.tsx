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
  { title: 'Setup & Registration', date: 'Sat 08:00', desc: 'Secure your spot and start forming your team.', range: [0.500, 0.531] },
  { title: 'Opening Ceremony', date: 'Sat 09:00', desc: 'Get briefed and meet the participants.', range: [0.531, 0.563] },
  { title: 'Hacking Begins', date: 'Sat 11:00', desc: 'The clock starts. Build and iterate.', range: [0.563, 0.595] },
  { title: 'Lunch Break', date: 'Sat 13:00', desc: 'Refuel and recharge for the next session.', range: [0.595, 0.627] },
  { title: 'Hacking + Mentors', date: 'Sat 14:00', desc: 'Refine your project with expert feedback.', range: [0.627, 0.658] },
  { title: 'Dinner', date: 'Sat 20:00', desc: 'Sync up and refuel.', range: [0.658, 0.690] },
  { title: 'Night Shift', date: 'Sat Night', desc: 'The loop continues into the night.', range: [0.690, 0.722] },
  { title: 'Breakfast', date: 'Sun 07:00', desc: 'Fresh start for the final sprint.', range: [0.722, 0.754] },
  { title: 'Hacking Ends', date: 'Sun 11:00', desc: 'Submissions closed. Finalize the pitch.', range: [0.754, 0.785] },
  { title: 'Presentations', date: 'Sun 11:45', desc: 'Showcase your build to the judges.', range: [0.785, 0.817] },
  { title: 'Closing Ceremony', date: 'Sun 13:00', desc: 'Celebrating bold ideas and standout teams.', range: [0.817, 0.850] },
];

export const Timeline3D: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const p = scrollProgress;
  // Deterministic Kill-Switch - Synced with expanded ranges
  if (p < 0.48 || p > 0.88) return null;

  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  // We'll spread nodes along the X axis - Tightened for multiple visibility
  const spacing = 2.2;
  const startX = -((TIMELINE_DATA.length - 1) * spacing) / 2;
  const totalWidth = (TIMELINE_DATA.length - 1) * spacing;

  useFrame((state) => {
    if (!groupRef.current) return;

    const p = scrollProgress;
    
    // 1. Core Timeline Movement (0.50 -> 0.85)
    // Slower panning speed over 35% scroll span
    const timelineP = clamp((p - 0.50) / 0.35, 0, 1);
    
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

    // 3. Cinematic Intro/Exit Transition
    let opacity = 0;

    if (p >= 0.48 && p < 0.88) {
      // Entry Fade (0.48 -> 0.52)
      if (p < 0.52) {
        opacity = (p - 0.48) / 0.04;
      } 
      // Main Body (0.52 -> 0.80)
      else if (p < 0.80) {
        opacity = 1;
      }
      // Cinematic Exit (0.80 -> 0.85)
      else {
        const exitP = clamp((p - 0.80) / 0.05, 0, 1);
        opacity = 1 - exitP;
      }
    }

    groupRef.current.position.y = -0.8; // Lowered Y - Better Navbar Clearance
    groupRef.current.visible = opacity > 0;
  });

  return (
    <group ref={groupRef} position={[0, -0.8, -2]}>
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
            sectionOpacity={clamp((scrollProgress - 0.80) / 0.05, 0, 1)} // Sync with expanded exit
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
  sectionOpacity: number;
}

const Node: React.FC<NodeProps> = ({ event, xPos, isLeft, scrollProgress, sectionOpacity }) => {
  const meshRef = useRef<THREE.Group>(null);
  const p = scrollProgress;
  
  // Calculate state
  const isActive = p >= event.range[0] && p < event.range[1];
  const isCompleted = p >= event.range[1];
  const isPending = p < event.range[0];

  // Global fade factor (1 during active, fades to 0 during section exit)
  const globalFade = 1 - sectionOpacity;

  useFrame(() => {
    if (!meshRef.current) return;

    // Locked scale - No Pulse
    meshRef.current.scale.set(1, 1, 1);
  });

  const nodeColor = isActive ? "#C6FF00" : (isCompleted ? "#88aa00" : "#222222");
  const glowIntensity = isActive ? 2 : (isCompleted ? 0.5 : 0.1);

  return (
    <group position={[xPos, 0, 0]} ref={meshRef}>
      {/* Node Geometry */}
      <mesh>
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial 
          color={nodeColor} 
          emissive={nodeColor} 
          emissiveIntensity={glowIntensity} 
          transparent 
          opacity={(isPending ? 0.4 : 1) * globalFade}
        />
      </mesh>

      {/* Label Panel */}
      <Html
        position={[0, isLeft ? -1.2 : 1.2, 0]}
        center
        distanceFactor={10}
        style={{
          transition: 'opacity 0.5s ease', // Smooth opacity, removed transform bouncing
          opacity: (isActive ? 1 : (isCompleted ? 0.5 : 0)) * globalFade,
          pointerEvents: 'none'
        }}
      >
        <div className="t3d-panel" style={{
          background: 'rgba(0,0,0,0.9)',
          borderLeft: `3px solid ${nodeColor}`,
          padding: '16px',
          width: '190px',
          borderRadius: '4px',
          boxShadow: `0 0 30px rgba(0,0,0,0.6), inset 0 0 15px ${isActive ? 'rgba(198,255,0,0.15)' : 'transparent'}`,
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(198,255,0,0.1)',
          color: 'white',
          fontFamily: "'Share Tech Mono', monospace"
        }}>
          <div style={{ fontSize: '12px', color: '#C6FF00', fontWeight: 'bold', marginBottom: '6px', letterSpacing: '2px' }}>
            {event.date}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}>
            {event.title}
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>
            {event.desc}
          </div>
        </div>
      </Html>
    </group>
  );
};
