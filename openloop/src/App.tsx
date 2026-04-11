import { Suspense, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useIsMobile } from './hooks/useIsMobile';
import { Preloader } from './components/common/Preloader';
import { CustomCursor } from './components/common/CustomCursor';

import DesktopLayout from './components/desktop/DesktopLayout';
import MobileLayout from './components/mobile/MobileLayout';
import { CrewMembers } from './pages/CrewMembers';

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
        <Suspense fallback={<div style={{ background: 'transparent', height: '100vh' }} />}>
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
  