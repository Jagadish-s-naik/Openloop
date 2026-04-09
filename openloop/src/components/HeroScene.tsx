import React from 'react';
import { Robot } from './Robot';

interface HeroSceneProps {
  scrollVal: number;
}

export const HeroScene: React.FC<HeroSceneProps> = ({ scrollVal }) => {
  return (
    <>
      <Robot scrollVal={scrollVal} />
    </>
  );
};
