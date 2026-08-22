import { useState } from 'react';
import { DashboardNavbar } from './DashboardNavbar';
import { DashboardHero } from './DashboardHero';
import { CurrentJourneyCard } from './CurrentJourneyCard';
import { MyJourneysSection } from './MyJourneysSection';
import { CreateJourneySection } from './CreateJourneySection';
import { AIPlannerSection } from './AIPlannerSection';
import { UpcomingItinerary } from './UpcomingItinerary';
import { TravelBudget } from './TravelBudget';
import { JourneyMap } from './JourneyMap';
import { TravelTogether } from './TravelTogether';
import { DestinationDiscovery } from './DestinationDiscovery';
import { AIAssistantDrawer } from './AIAssistantDrawer';
import { DashboardFooter } from './DashboardFooter';

// Live Journey Mode Components
import { LiveJourneyHero } from '../live/LiveJourneyHero';
import { LiveLocationMap } from '../live/LiveLocationMap';
import { QuickAssistanceGrid, ServiceCategory } from '../live/QuickAssistanceGrid';
import { TodayLiveItinerary } from '../live/TodayLiveItinerary';
import { SmartTravelSuggestions } from '../live/SmartTravelSuggestions';
import { GroupLocationSharing } from '../live/GroupLocationSharing';
import { ServiceModals } from '../live/ServiceModals';
import { LiveTravelCompanionDrawer } from '../live/LiveTravelCompanionDrawer';

// Create Journey Flow Components
import { CreateJourneyModal } from '../planner/CreateJourneyModal';
import { NationalJourney } from '../planner/NationalJourney';
import { InternationalJourney } from '../planner/InternationalJourney';

interface DashboardPageProps {
  onGoToLanding: () => void;
  onNavigate: (path: string) => void;
}

export const DashboardPage = ({ onGoToLanding }: DashboardPageProps) => {
  // Mode state: 'planning' (before trip) or 'live' (active in-destination companion)
  const [tripMode, setTripMode] = useState<'planning' | 'live'>('planning');
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [activeServiceCategory, setActiveServiceCategory] = useState<ServiceCategory | null>(null);

  // Create Journey Flow states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [activePlanningJourney, setActivePlanningJourney] = useState<'national' | 'international' | null>(null);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestRide = (_destination?: string) => {
    setActiveServiceCategory('rides');
  };

  // If user is currently in a fullscreen National or International journey planning flow:
  if (activePlanningJourney === 'national') {
    return (
      <NationalJourney
        onBackToDashboard={() => setActivePlanningJourney(null)}
        onCompleteJourney={() => {
          setActivePlanningJourney(null);
          setTripMode('live');
        }}
      />
    );
  }

  if (activePlanningJourney === 'international') {
    return (
      <InternationalJourney
        onBackToDashboard={() => setActivePlanningJourney(null)}
        onCompleteJourney={() => {
          setActivePlanningJourney(null);
          setTripMode('live');
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-white text-[#000000] font-sans selection:bg-black selection:text-white">
      {/* Top Navbar with Mode Toggle */}
      <DashboardNavbar
        onOpenAI={() => setIsAIOpen(true)}
        onGoToLanding={onGoToLanding}
        onNavigateSection={scrollToSection}
        tripMode={tripMode}
        onToggleTripMode={(mode) => setTripMode(mode)}
      />

      {/* =========================================================================
          LIVE JOURNEY MODE (Active in Goa, Day 4)
      ========================================================================= */}
      {tripMode === 'live' ? (
        <div className="animate-fade-rise">
          {/* Live Hero with Weather & Checkpoint */}
          <LiveJourneyHero
            onOpenMap={() => scrollToSection('live-map')}
            onOpenAI={() => setIsAIOpen(true)}
          />

          {/* Proactive Smart Travel Suggestions */}
          <SmartTravelSuggestions
            onActionClick={(type) => {
              if (type === 'request_ride') setActiveServiceCategory('rides');
            }}
          />

          {/* Large Live Location Map & Waypoint Route */}
          <LiveLocationMap
            onSelectDestination={() => {
              setActiveServiceCategory('rides');
            }}
          />

          {/* Quick Assistance & "I'm Not Feeling Well" Grid */}
          <QuickAssistanceGrid
            onSelectCategory={(category) => setActiveServiceCategory(category)}
          />

          {/* Today's Chronological Live Itinerary */}
          <TodayLiveItinerary
            onNavigate={() => scrollToSection('live-map')}
            onGetRide={() => setActiveServiceCategory('rides')}
          />

          {/* Proximity & Companion Location Sharing */}
          <GroupLocationSharing />

          {/* Live Budget & Expenditure Monitor */}
          <TravelBudget />

          {/* Floating AI Travel Companion (Live context) */}
          <LiveTravelCompanionDrawer
            isOpen={isAIOpen}
            onClose={() => setIsAIOpen(false)}
            onOpen={() => setIsAIOpen(true)}
            onRequestRide={handleRequestRide}
            onOpenCategory={(cat) => setActiveServiceCategory(cat)}
          />
        </div>
      ) : (
        /* =========================================================================
            PLANNING MODE (Trip Studio & Future Explorations)
        ========================================================================= */
        <div className="animate-fade-rise">
          {/* 4. Dashboard Hero Greeting with Train Hover Animation and Modal Trigger */}
          <DashboardHero
            onPlanNew={() => setIsCreateModalOpen(true)}
            onExplore={() => scrollToSection('discovery')}
          />

          {/* 6 & 7. Current Journey Cinematic Card + Minimal Trip Status */}
          <CurrentJourneyCard
            onContinueJourney={() => setTripMode('live')}
          />

          {/* 8. My Journeys Editorial Collection */}
          <MyJourneysSection />

          {/* 9. Create Journey Section ("Dream somewhere new") */}
          <CreateJourneySection
            onCreateTrip={() => setIsCreateModalOpen(true)}
          />

          {/* 10. AI Planner ("Let AI plan the details") */}
          <AIPlannerSection />

          {/* 11. Upcoming Itinerary */}
          <UpcomingItinerary />

          {/* 12. Travel Budget (Monochrome & Editorial) */}
          <TravelBudget />

          {/* 13. Interactive Journey Map */}
          <JourneyMap />

          {/* 14. Travel Together Collaboration */}
          <TravelTogether />

          {/* 16. Destination Discovery Magazine Showcase */}
          <DestinationDiscovery />

          {/* Floating Planning AI Assistant */}
          <AIAssistantDrawer
            isOpen={isAIOpen}
            onClose={() => setIsAIOpen(false)}
            onOpen={() => setIsAIOpen(true)}
          />
        </div>
      )}

      {/* Create New Journey Modal (National vs International) */}
      <CreateJourneyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSelectType={(type) => {
          setIsCreateModalOpen(false);
          setActivePlanningJourney(type);
        }}
      />

      {/* Service Modals (Hospitals, Rides, Pharmacies, Emergency SOS, etc.) */}
      <ServiceModals
        activeCategory={activeServiceCategory}
        onClose={() => setActiveServiceCategory(null)}
        onRequestRide={handleRequestRide}
      />

      {/* Editorial Footer */}
      <DashboardFooter
        onBackToTop={handleBackToTop}
        onGoToLanding={onGoToLanding}
      />
    </div>
  );
};
