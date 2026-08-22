import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { VideoBackground } from './components/VideoBackground';
import { DashboardPage } from './components/dashboard/DashboardPage';

export function App() {
  // Default to dashboard so the user immediately sees the requested travel workspace, with seamless landing toggle
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('dashboard');

  return (
    <div className="w-full min-h-screen font-sans bg-white">
      {currentView === 'landing' ? (
        <main className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-white selection:bg-black selection:text-white animate-fade-rise">
          {/* Background Video Layer with Gradients */}
          <VideoBackground />

          {/* Navigation Bar */}
          <Navbar onBeginJourney={() => setCurrentView('dashboard')} />

          {/* Hero Section centered in the dashboard */}
          <HeroSection onBeginJourney={() => setCurrentView('dashboard')} />

          {/* Spacer to perfectly balance the navbar height on desktop */}
          <div className="hidden md:block h-[88px] pointer-events-none" />
        </main>
      ) : (
        <div className="animate-fade-rise">
          <DashboardPage onGoToLanding={() => setCurrentView('landing')} />
        </div>
      )}
    </div>
  );
}

export default App;
