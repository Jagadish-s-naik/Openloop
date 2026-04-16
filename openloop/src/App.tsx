import { Suspense, useState, useEffect, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useIsMobile } from './hooks/useIsMobile';
import { Preloader } from './components/common/Preloader';
import { CustomCursor } from './components/common/CustomCursor';

// Lazy load layout components to optimize initial bundle size
const DesktopLayout = lazy(() => import('./components/desktop/DesktopLayout'));
const MobileLayout = lazy(() => import('./components/mobile/MobileLayout'));
const CrewMembers = lazy(() => import('./pages/CrewMembers').then(m => ({ default: m.CrewMembers })));

function App() {
  const isMobile = useIsMobile();
  const [hasLoaded, setHasLoaded] = useState(false);
  const location = useLocation();

  // Reset scroll on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {!hasLoaded && <Preloader onComplete={() => setHasLoaded(true)} />}
      
      <div style={{ visibility: hasLoaded ? 'visible' : 'hidden', height: hasLoaded ? 'auto' : '100vh', overflow: hasLoaded ? 'visible' : 'hidden' }}>
        <Suspense fallback={<div style={{ background: '#020600', height: '100vh' }} />}>
          {!isMobile && <CustomCursor />}
          <Routes>
            <Route path="/" element={isMobile ? <MobileLayout /> : <DesktopLayout />} />
            <Route path="/crew" element={<CrewMembers />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default App;