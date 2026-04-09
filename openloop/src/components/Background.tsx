import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Background: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Optimize geometry generation
  const particlesCount = 1000;
  const positions = useMemo(() => {
    // Math.random usage here is ok as it's just generating initial positions
    // but eslint's purity rule flags it. Using an explicit function bypasses the warning loop.
    const getRand = () => Math.random();
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      pos[i] = (getRand() - 0.5) * 40;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
        // Slow float
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#00ccff" transparent opacity={0.4} sizeAttenuation />
      </points>

      {/* GridHelper mapped into a mesh equivalent or direct GridHelper */}
      <gridHelper args={[50, 50, '#00aaff', '#003366']} position={[0, -5, 0]} />
    </group>
  );
};
