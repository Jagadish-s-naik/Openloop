import { Suspense, lazy, useState } from 'react';
import { useIsMobile } from './hooks/useIsMobile';
import { Preloader } from './components/common/Preloader';
import { CustomCursor } from './components/common/CustomCursor';

// Lazy load layouts to isolate dependencies and resolve resolution issues
const DesktopLayout = lazy(() => import('./components/desktop/DesktopLayout'));
const MobileLayout = lazy(() => import('./components/mobile/MobileLayout'));

function App() {
  const isMobile = useIsMobile();
  const [hasLoaded, setHasLoaded] = useState(false);

  return (
    <>
      {!hasLoaded && <Preloader onComplete={() => setHasLoaded(true)} />}
      
      <div style={{ visibility: hasLoaded ? 'visible' : 'hidden', height: hasLoaded ? 'auto' : '100vh', overflow: hasLoaded ? 'visible' : 'hidden' }}>
        <Suspense fallback={<div style={{ background: '#000000', height: '100vh' }} />}>
          {!isMobile && <CustomCursor />}
          {isMobile ? <MobileLayout /> : <DesktopLayout />}
        </Suspense>
      </div>
    </>
  );
}

export default App;
  