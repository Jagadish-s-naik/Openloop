import { Environment, Text, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Robot } from './Robot';
import { Background } from './Background';
import { useMousePosition } from '../hooks/useMousePosition';
import { lerp } from '../utils/math';

const CameraRig = ({ robotProgressRef }: { robotProgressRef: React.MutableRefObject<number> }) => {
  const mouse = useMousePosition();
  
  useFrame((state) => {
    const p = robotProgressRef.current;
    
    // 1. Mouse Parallax (Controlled shift)
    const targetX = mouse.x * 0.45;
    const targetY = mouse.y * 0.45;
    
    // 2. Camera Push / Inside System Feel
    let targetZ = 3.8;
    if (p > 0.75) {
      const pushP = Math.min(1, (p - 0.75) * 5);
      targetZ = lerp(3.8, 2.0, pushP);
    }

    state.camera.position.x = lerp(state.camera.position.x, targetX, 0.08);
    state.camera.position.y = lerp(state.camera.position.y, targetY, 0.08);
    state.camera.position.z = lerp(state.camera.position.z, targetZ, 0.08);
    
    state.camera.lookAt(0, 0, 0); 
  });
  return null;
};

const SceneLights = () => {
  return (
    <>
      <directionalLight color="#ffffff" intensity={2.0} position={[0, 2, -4]} />
      <directionalLight color="#C6FF00" intensity={0.5} position={[-5, 1, -2]} />
      <directionalLight color="#AFFF00" intensity={0.5} position={[5, 0, -1]} />
      <directionalLight color="#0a1200" intensity={0.4} position={[0, 0, 5]} />
      <ambientLight color="#000000" intensity={0.2} />
      <pointLight color="#C6FF00" intensity={1.2} distance={8} position={[0, -3, 0]} />
    </>
  );
};

interface SceneContainerProps {
  scrollVal: number;
  robotProgressRef: React.MutableRefObject<number>;
  themeProgressRef: React.MutableRefObject<number>;
  mouseX: number;
  phase: string;
  isVisible: boolean;
}

export const SceneContainer: React.FC<SceneContainerProps> = ({
  scrollVal,
  robotProgressRef,
  themeProgressRef,
  mouseX,
  phase,
  isVisible,
}) => {
  return (
    <>
      <CameraRig robotProgressRef={robotProgressRef} />
      <SceneLights />
      <Environment preset="city" />
      
      <Background scrollVal={scrollVal} />
      <Robot
        scrollVal={scrollVal}
        robotProgressRef={robotProgressRef}
        themeProgressRef={themeProgressRef}
        mouseX={mouseX}
        phase={phase}
        isVisible={isVisible}
      />
    </>
  );
};
