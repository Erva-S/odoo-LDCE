import { useState, useEffect } from 'react';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { JourneyPlanner } from './components/dashboard/JourneyPlanner';
import { JourneyDetail } from './components/dashboard/JourneyDetail';
import { CinematicHeroSection } from './components/cinematic/CinematicHeroSection';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('dashboard');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to parse /journey/:id route
  const getJourneyIdFromPath = (path: string): string | null => {
    const match = path.match(/^\/journey\/([a-zA-Z0-9-]+)/);
    return match ? match[1] : null;
  };

  const journeyId = getJourneyIdFromPath(currentPath);

  // Render correct view based on path
  const renderPathView = () => {
    if (currentPath === '/wander' || currentView === 'landing') {
      return (
        <div className="animate-fade-rise">
          <CinematicHeroSection
            onStartPlanning={() => {
              setCurrentView('dashboard');
              navigate('/');
            }}
            onNavigateTab={(tab) => {
              if (tab === 'plan') {
                setCurrentView('dashboard');
                navigate('/planner/new');
              } else {
                setCurrentView('dashboard');
                navigate('/');
              }
            }}
          />
        </div>
      );
    }

    if (currentPath === '/planner/new') {
      return (
        <div className="animate-fade-rise">
          <JourneyPlanner onNavigate={navigate} />
        </div>
      );
    }
    
    if (journeyId) {
      return (
        <div className="animate-fade-rise">
          <JourneyDetail journeyId={journeyId} onNavigate={navigate} />
        </div>
      );
    }

    // Default to main dashboard home page
    return (
      <div className="animate-fade-rise">
        <DashboardPage 
          onGoToLanding={() => setCurrentView('landing')} 
          onNavigate={navigate}
        />
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen font-sans bg-white">
      {renderPathView()}
    </div>
  );
}

export default App;
