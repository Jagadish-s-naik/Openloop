import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const particlesCount = 2500;

// Helper functions outside component to satisfy purity rules
const generateParticleData = () => {
    const pos = new Float32Array(particlesCount * 3);
    const cols = new Float32Array(particlesCount * 3);
    
    const palette = [
      new THREE.Color('#C6FF00'), // Neon Green
      new THREE.Color('#AFFF00'), // Neon Yellow-Green
      new THREE.Color('#8ab800'), // Darker Neon
    ];

    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
      
      const col = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }
    return { positions: pos, colors: cols };
};

const generateStreaksData = () => {
    return Array.from({ length: 12 }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 15
      ),
      speed: Math.random() * 0.05 + 0.02,
      length: Math.random() * 5 + 3,
    }));
};

export const Background: React.FC<{ scrollVal: number }> = ({ scrollVal }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const gridRef = useRef<THREE.Group>(null);
  const streaksRef = useRef<THREE.Group>(null);
  
  // Static data generated once using pure initializers
  const { positions, colors } = useMemo(() => generateParticleData(), []);
  const streaks = useMemo(() => generateStreaksData(), []);


  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = scrollVal; // Depth layers shift based on s

    // 1. Particle Motion & Glitter
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.003 + s * 0.05;
      pointsRef.current.position.y = s * 2.0;
      
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.4 + Math.sin(t * 0.4) * 0.1;
    }

    // 2. Grid Movement
    if (gridRef.current) {
      gridRef.current.position.z = ((t * 0.4) % 4);
      gridRef.current.position.y = -6.5 + s * 4.0; 
    }

    // 3. Streaks Movement
    if (streaksRef.current) {
      streaksRef.current.position.y = s * 6.0;
      streaksRef.current.children.forEach((streak, i) => {
        const data = streaks[i];
        if (!data) return;
        
        // We use a pseudo-random approach based on time or i to avoid Math.random in useFrame
        const flicker = 0.1 + (Math.sin(t * 10 + i) * 0.05 + 0.05); // deterministic sparkle
        
        streak.position.y -= data.speed * 1.5;
        streak.position.x += data.speed * 0.8;
        
        const streakMat = (streak as THREE.Mesh).material as THREE.MeshBasicMaterial;
        streakMat.opacity = flicker;

        if (streak.position.y < -25) {
          streak.position.y = 25;
          // Instead of Math.random, we use a deterministic offset based on i
          streak.position.x = ((i * 137.5) % 50) - 25; 
        }
      });
    }
  });

  return (
    <group>
      <fog attach="fog" args={['#000000', 5, 60]} />
      
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.06} 
          vertexColors
          transparent 
          opacity={0.3} 
          sizeAttenuation 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <group ref={gridRef}>
        <gridHelper 
          args={[300, 60, '#2a3a00', '#1a2a00']} 
          rotation={[0, 0, 0]} 
          position={[0, -6, 0]} 
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6.01, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshBasicMaterial 
            color="#000000" 
            transparent 
            opacity={0.35} 
            depthWrite={false}
          />
        </mesh>
      </group>

      <group ref={streaksRef}>
        {streaks.map((s, i) => (
          <mesh key={i} position={s.position} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.02, s.length]} />
            <meshBasicMaterial 
              color="#C6FF00" 
              transparent 
              opacity={0.15} 
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
