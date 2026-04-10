import { Suspense, lazy } from 'react';
import { useIsMobile } from './hooks/useIsMobile';

// Lazy load layouts to isolate dependencies and resolve resolution issues
const DesktopLayout = lazy(() => import('./components/desktop/DesktopLayout'));
const MobileLayout = lazy(() => import('./components/mobile/MobileLayout'));

import { CustomCursor } from './components/common/CustomCursor';

function App() {
  const isMobile = useIsMobile();

  return (
    <Suspense fallback={<div style={{ background: '#000000', height: '100vh' }} />}>
      {!isMobile && <CustomCursor />}
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </Suspense>
  );
}

export default App;
