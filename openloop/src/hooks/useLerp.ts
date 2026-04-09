import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { lerp } from '../utils/math';

export const useLerp = (targetValue: number, factor = 0.08) => {
  const currentRef = useRef(targetValue);
  
  // Only register frame updates when actually needed to save performance
  useFrame(() => {
    currentRef.current = lerp(currentRef.current, targetValue, factor);
  });

  return currentRef;
};
