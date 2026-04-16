import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, PerspectiveCamera, Float } from '@react-three/drei';
import * as THREE from 'three';
import { lerp } from '../utils/math';

interface LoaderSceneProps {
  progress: number;
  phase: 'loader' | 'intro' | 'main';
}

const count = 3000;
const generateParticleData = () => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color('#C6FF00');

    for (let i = 0; i < count; i++) {
        const radius = 5 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
};

export const LoaderScene: React.FC<LoaderSceneProps> = ({ progress, phase }) => {
  const { mouse } = useThree();
  const particleRef = useRef<THREE.Points>(null);
  const portalRef = useRef<THREE.Group>(null);
  const portalMeshRef = useRef<THREE.Mesh>(null);
  const introTimerRef = useRef<number | null>(null);
  const textGroupRef = useRef<THREE.Group>(null);

  // Purely generate data once
  const particleData = useMemo(() => generateParticleData(), []);


  const portalMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#C6FF00',
    transparent: true,
    opacity: 0,
    side: THREE.BackSide
  }), []);

  useFrame((state) => {
    const { clock, camera } = state;
    const time = clock.getElapsedTime();

    // 1. Particle Swarm Interaction
    if (particleRef.current) {
        particleRef.current.rotation.y = time * 0.05;
        particleRef.current.rotation.x = time * 0.02;

        const targetX = mouse.x * 2;
        const targetY = mouse.y * 2;
        particleRef.current.position.x = lerp(particleRef.current.position.x, targetX, 0.05);
        particleRef.current.position.y = lerp(particleRef.current.position.y, targetY, 0.05);

        const intensity = 1.0 - Math.min(progress, 1.0);
        particleRef.current.scale.setScalar(lerp(0.5, 2.0, intensity));
    }

    // 2. Text Branding
    if (textGroupRef.current) {
        textGroupRef.current.position.z = lerp(0, 2, progress);
        textGroupRef.current.scale.setScalar(lerp(0.8, 1.2, progress));
    }

    // 3. Cinematic Intro Sequence (Zoom Through)
    if (phase === 'intro') {
        if (introTimerRef.current === null) introTimerRef.current = clock.elapsedTime;
        const elapsed = clock.elapsedTime - introTimerRef.current;
        const introDuration = 3.5;
        const t = Math.min(elapsed / introDuration, 1);

        // Zoom camera high speed
        const zoomP = Math.pow(t, 4); 
        camera.position.z = lerp(8.0, -10.0, zoomP);

        if (camera instanceof THREE.PerspectiveCamera) {
          camera.fov = lerp(45, 120, zoomP);
          camera.updateProjectionMatrix();
        }

        if (portalRef.current && portalMeshRef.current) {
            portalRef.current.scale.setScalar(lerp(0, 50, zoomP));
            const mat = portalMeshRef.current.material as THREE.MeshBasicMaterial;
            mat.opacity = lerp(0, 1, Math.min(t * 1.5, 1));
        }

        if (textGroupRef.current) {
            textGroupRef.current.visible = zoomP < 0.4;
        }
    } else {
        camera.position.z = 8.0;
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.fov = 45;
          camera.updateProjectionMatrix();
        }
    }
  });

  return (
    <group>
      <PerspectiveCamera makeDefault position={[0, 0, 8.0]} />
      
      <points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleData.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation={true}
        />
      </points>

      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group ref={textGroupRef}>
            <Text
                fontSize={0.6}
                font="https://fonts.gstatic.com/s/audiowide/v13/6KLYT6O9mt7_v_18T8RRAoV_.woff"
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.2}
            >
                OPENLOOP
                <meshStandardMaterial emissive="#C6FF00" emissiveIntensity={progress * 2} />
            </Text>
            <Text
                fontSize={0.12}
                font="https://fonts.gstatic.com/s/sharetechmono/v15/J7aUxT8p0S5pcS_8S__P7S_R6-W_6A.woff"
                color="#C6FF00"
                anchorX="center"
                anchorY="middle"
                position={[0, -0.6, 0]}
                letterSpacing={0.5}
            >
                INITIALIZING CORE SYSTEMS...
                <meshStandardMaterial transparent opacity={0.6} />
            </Text>
        </group>
      </Float>

      <group ref={portalRef} rotation={[Math.PI / 2, 0, 0]}>
        <mesh ref={portalMeshRef} material={portalMaterial}>
          <cylinderGeometry args={[1, 1, 50, 32, 1, true]} />
        </mesh>
      </group>

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#C6FF00" />
    </group>
  );
};
