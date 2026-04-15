import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { lerp, clamp } from '../utils/math';

interface InteractiveSphereProps {
  scrollVal: number;
}

type State = 'IDLE' | 'EXPANDING' | 'WAITING' | 'IMPLODING';

export const InteractiveSphere: React.FC<InteractiveSphereProps> = ({ scrollVal }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [state, setState] = useState<State>('IDLE');
  const [hovered, setHovered] = useState(false);
  const stateRef = useRef<{ progress: number; timer: number }>({ progress: 0, timer: 0 });

  // Exclusivity: Only active in footer range
  // Lowered threshold to 0.96 for reliability, but keep opacity 0 until 0.98
  const isEnabled = scrollVal >= 0.96;
  const opacity = clamp((scrollVal - 0.98) / 0.015, 0, 1);

  const particleCount = 8000; // Increased for a denser "perfect" look
  
  // Generate random points on a sphere
  const [positions, targetPositions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const targets = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        // Spherical coordinates
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        
        const r = 1.5;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        // "Black Hole" dispersal targets (larger, flatter ring)
        const angle = Math.random() * Math.PI * 2;
        const dist = 5 + Math.random() * 3;
        targets[i * 3] = Math.cos(angle) * dist;
        targets[i * 3 + 1] = Math.sin(angle) * dist;
        targets[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return [pos, targets];
  }, []);

  const handleClick = () => {
    if (state === 'IDLE') {
      setState('EXPANDING');
      stateRef.current.timer = 0;
    }
  };

  useFrame((sceneState, delta) => {
    if (!pointsRef.current) return;
    const t = sceneState.clock.elapsedTime;

    // State Machine logic
    if (state === 'EXPANDING') {
      stateRef.current.progress = Math.min(1, stateRef.current.progress + delta * 1.5);
      if (stateRef.current.progress >= 1) {
        setState('WAITING');
        stateRef.current.timer = 0;
      }
    } else if (state === 'WAITING') {
      stateRef.current.timer += delta;
      if (stateRef.current.timer >= 4) { // Stay for 4 seconds
        setState('IMPLODING');
      }
    } else if (state === 'IMPLODING') {
      stateRef.current.progress = Math.max(0, stateRef.current.progress - delta * 1.5);
      if (stateRef.current.progress <= 0) {
        setState('IDLE');
      }
    }

    const p = stateRef.current.progress;
    const posAttr = pointsRef.current.geometry.attributes.position;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Idle animation (swirling)
      const angle = t * 0.2 + i * 0.001;
      const swirlX = Math.cos(angle) * 0.05;
      const swirlY = Math.sin(angle) * 0.05;

      // Lerp between sphere and black hole
      posAttr.array[i3] = lerp(positions[i3] + swirlX, targetPositions[i3], p);
      posAttr.array[i3 + 1] = lerp(positions[i3 + 1] + swirlY, targetPositions[i3 + 1], p);
      posAttr.array[i3 + 2] = lerp(positions[i3 + 2], targetPositions[i3 + 2], p);
    }
    posAttr.needsUpdate = true;

    // Rotation & Parallax
    pointsRef.current.rotation.y = t * 0.1 + sceneState.mouse.x * 0.3 * (1 - p);
    pointsRef.current.rotation.x = sceneState.mouse.y * 0.2 * (1 - p);
    
    // Scale pulse
    const scale = isEnabled ? lerp(1, 15, p) : 0;
    groupRef.current.scale.setScalar(scale);
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    
    // Enable/Disable pointer events on the canvas based on activity
    const canvas = document.getElementById('webgl');
    if (canvas) {
      // Allow pointer events as soon as it starts fading in
      const shouldBeInteractive = (isEnabled && opacity > 0.05) || state !== 'IDLE';
      canvas.style.pointerEvents = shouldBeInteractive ? 'auto' : 'none';
      canvas.style.zIndex = shouldBeInteractive ? '100' : '1';
    }
  }, [hovered, isEnabled, opacity, state]);

  const groupRef = useRef<THREE.Group>(null);

  // Always render but control visibility via Three.js 'visible' prop
  // This avoids mounting/unmounting issues during fast scrolls
  return (
    <group ref={groupRef} visible={isEnabled && opacity > 0}>
      {/* Invisible Click Target — much easier to hit than individual points */}
      <mesh
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1.6, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          color="#C6FF00"
          size={0.045}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={opacity}
        />
      </points>

      {(state === 'WAITING' || (state === 'EXPANDING' && stateRef.current.progress > 0.5)) && (
        <Html center>
          <div 
            style={{
              opacity: state === 'WAITING' ? 1 : (stateRef.current.progress - 0.5) * 2,
              transition: 'opacity 0.5s ease',
              textAlign: 'center',
              pointerEvents: 'auto',
              cursor: 'pointer',
              background: 'rgba(0,0,0,0.6)',
              padding: '20px 40px',
              borderRadius: '50px',
              border: '1px solid #C6FF00',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 30px rgba(198, 255, 0, 0.3)',
              userSelect: 'none'
            }}
            onClick={() => window.open('https://unstop.com/college-fests/openloop-26-yenepoya-school-of-engineering-and-technology-458231', '_blank')}
          >
            <h2 style={{
              fontFamily: 'Audiowide, sans-serif',
              color: '#C6FF00',
              margin: 0,
              fontSize: '24px',
              letterSpacing: '4px',
              textShadow: '0 0 10px rgba(198, 255, 0, 0.5)'
            }}>JOIN THE LOOP</h2>
            <p style={{
              fontFamily: 'Share Tech Mono, monospace',
              color: 'white',
              fontSize: '12px',
              marginTop: '10px',
              opacity: 0.7,
              letterSpacing: '2px'
            }}>SYSTEM_LINK: ESTABLISHED</p>
          </div>
        </Html>
      )}
    </group>
  );
};
