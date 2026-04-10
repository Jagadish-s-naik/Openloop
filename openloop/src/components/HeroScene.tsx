import React from 'react';
import { Environment } from '@react-three/drei';
import { Robot } from './Robot';
import { Background } from './Background';

interface HeroSceneProps {
  scrollVal: number;
  robotProgressRef: React.MutableRefObject<number>;
  themeProgressRef: React.MutableRefObject<number>;
  mouseX: number;
  phase: string;
}

export const HeroScene: React.FC<HeroSceneProps> = ({
  scrollVal,
  robotProgressRef,
  themeProgressRef,
  mouseX,
  phase,
}) => {
  return (
    <>
      <Environment preset="city" />
      
      <Background scrollVal={scrollVal} />
      <Robot
        scrollVal={scrollVal}
        robotProgressRef={robotProgressRef}
        themeProgressRef={themeProgressRef}
        mouseX={mouseX}
        phase={phase}
      />
    </>
  );
};
