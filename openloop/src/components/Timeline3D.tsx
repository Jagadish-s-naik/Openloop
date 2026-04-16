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
  { title: 'Setup & Registration', date: 'Sat 08:00', desc: 'Secure your spot and start forming your team.', range: [0.580, 0.605] },
  { title: 'Opening Ceremony', date: 'Sat 09:00', desc: 'Get briefed and meet the participants.', range: [0.605, 0.630] },
  { title: 'Hacking Begins', date: 'Sat 11:00', desc: 'The clock starts. Build and iterate.', range: [0.630, 0.655] },
  { title: 'Lunch Break', date: 'Sat 13:00', desc: 'Refuel and recharge for the next session.', range: [0.655, 0.680] },
  { title: 'Hacking + Mentors', date: 'Sat 14:00', desc: 'Refine your project with expert feedback.', range: [0.680, 0.705] },
  { title: 'Dinner', date: 'Sat 20:00', desc: 'Sync up and refuel.', range: [0.705, 0.730] },
  { title: 'Night Shift', date: 'Sat Night', desc: 'The loop continues into the night.', range: [0.730, 0.755] },
  { title: 'Breakfast', date: 'Sun 07:00', desc: 'Fresh start for the final sprint.', range: [0.755, 0.780] },
  { title: 'Hacking Ends', date: 'Sun 11:00', desc: 'Submissions closed. Finalize the pitch.', range: [0.780, 0.805] },
  { title: 'Presentations', date: 'Sun 11:45', desc: 'Showcase your build to the judges.', range: [0.805, 0.832] },
  { title: 'Closing Ceremony', date: 'Sun 13:00', desc: 'Celebrating bold ideas and standout teams.', range: [0.832, 0.860] },
];

const spacing = 2.2;
const startX = -((TIMELINE_DATA.length - 1) * spacing) / 2;
const totalWidth = (TIMELINE_DATA.length - 1) * spacing;

const TimelineContent: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const p = scrollProgress;
    const timelineP = clamp((p - 0.58) / 0.26, 0, 1);
    const targetXOffset = -startX - (timelineP * totalWidth);
    groupRef.current.position.x = lerp(groupRef.current.position.x, targetXOffset, 0.1);

    if (pulseRef.current) {
      const pulseX = startX + (timelineP * (TIMELINE_DATA.length - 1) * spacing);
      pulseRef.current.position.x = pulseX;
      pulseRef.current.position.y = 0;
      pulseRef.current.visible = timelineP > 0 && timelineP < 1;
      
      const material = pulseRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 10) * 1;
    }

    let opacity = 0;
    if (p >= 0.55 && p < 0.88) {
      if (p < 0.58) opacity = (p - 0.55) / 0.03;
      else if (p < 0.84) opacity = 1;
      else {
        const exitP = clamp((p - 0.84) / 0.02, 0, 1);
        opacity = 1 - exitP;
      }
    }

    groupRef.current.position.y = -0.4;
    groupRef.current.visible = opacity > 0;
  });

  return (
    <group ref={groupRef} position={[0, -0.4, -2]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 30, 8]} />
        <meshStandardMaterial color="#C6FF00" emissive="#C6FF00" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>

      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#C6FF00" emissiveIntensity={3} />
        <pointLight color="#C6FF00" intensity={1} distance={2} />
      </mesh>

      {TIMELINE_DATA.map((event, i) => {
        const xPos = startX + i * spacing;
        const isLeft = i % 2 !== 0;

        return (
          <Node 
            key={i} 
            event={event} 
            xPos={xPos} 
            isLeft={isLeft} 
            scrollProgress={scrollProgress}
            sectionOpacity={clamp((scrollProgress - 0.84) / 0.02, 0, 1)}
          />
        );
      })}
    </group>
  );
};

export const Timeline3D: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  if (scrollProgress < 0.55 || scrollProgress > 0.89) return null;
  return <TimelineContent scrollProgress={scrollProgress} />;
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
  
  const isActive = p >= event.range[0] && p < event.range[1];
  const isCompleted = p >= event.range[1];
  const isPending = p < event.range[0];
  const globalFade = 1 - sectionOpacity;

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.scale.set(1, 1, 1);
  });

  const nodeColor = isActive ? "#C6FF00" : (isCompleted ? "#88aa00" : "#222222");
  const glowIntensity = isActive ? 2 : (isCompleted ? 0.5 : 0.1);

  return (
    <group position={[xPos, 0, 0]} ref={meshRef}>
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

      <Html
        position={[0, isLeft ? -1.2 : 1.2, 0]}
        center
        distanceFactor={10}
        style={{
          transition: 'opacity 0.5s ease',
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
