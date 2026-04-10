import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Background: React.FC<{ scrollVal: number }> = ({ scrollVal }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const gridRef = useRef<THREE.Group>(null);
  const streaksRef = useRef<THREE.Group>(null);
  
  const particlesCount = 2500;
  
  // Particles with individual colors and flicker offsets
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const cols = new Float32Array(particlesCount * 3);
    
    const palette = [
      new THREE.Color('#00ccff'), // Cyan
      new THREE.Color('#0066ff'), // Blue
      new THREE.Color('#00ffbb'), // Slight Green
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
  }, []);

  // Cyber Streaks (diagonal light lines)
  const streaks = useMemo(() => {
    return Array.from({ length: 12 }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 15
      ),
      speed: Math.random() * 0.05 + 0.02,
      length: Math.random() * 5 + 3,
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = scrollVal; // Depth layers shift based on s

    // 1. Particle Motion & Glitter (Slightly slower parallax)
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.003 + s * 0.05;
      pointsRef.current.position.y = s * 2.0; // Slower background float
      
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.2 + Math.sin(t * 0.4) * 0.05;
    }

    // 2. Grid Movement (Mid-speed parallax)
    if (gridRef.current) {
      gridRef.current.position.z = ((t * 0.4) % 4);
      gridRef.current.position.y = -6.5 + s * 4.0; 
    }

    // 3. Streaks Movement (Faster parallax)
    if (streaksRef.current) {
      streaksRef.current.position.y = s * 6.0;
      streaksRef.current.children.forEach((streak, i) => {
        const data = streaks[i];
        streak.position.y -= data.speed * 1.5;
        streak.position.x += data.speed * 0.8;
        
        const streakMat = (streak as THREE.Mesh).material as THREE.MeshBasicMaterial;
        streakMat.opacity = 0.1 + Math.random() * 0.1;

        if (streak.position.y < -25) {
          streak.position.y = 25;
          streak.position.x = (Math.random() - 0.5) * 50;
        }
      });
    }
  });

  return (
    <group>
      <fog attach="fog" args={['#020205', 5, 35]} />
      
      {/* 1. Particle System */}
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

      {/* 2. Moving Digital Grid */}
      <group ref={gridRef}>
        <gridHelper 
          args={[120, 40, '#00ccff', '#001122']} 
          rotation={[0, 0, 0]} 
          position={[0, -6, 0]} 
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6.01, 0]}>
          <planeGeometry args={[120, 120]} />
          <meshBasicMaterial 
            color="#001122" 
            transparent 
            opacity={0.04} 
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 3. Cyber Streaks */}
      <group ref={streaksRef}>
        {streaks.map((s, i) => (
          <mesh key={i} position={s.position} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.02, s.length]} />
            <meshBasicMaterial 
              color="#00f0ff" 
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
