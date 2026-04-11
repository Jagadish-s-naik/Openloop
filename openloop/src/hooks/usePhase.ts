import { useState } from 'react';

export type Phase = 'loader' | 'intro' | 'main';

export const usePhase = () => {
  // Global Preloader in App.tsx now handles initial impression.
  // We initialize directly to 'main' skip secondary loaders.
  const [phase] = useState<Phase>('main');
  const [loaderProgress] = useState(1);

  return { phase, loaderProgress };
};
