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

interface DashboardPageProps {
  onGoToLanding: () => void;
}

export const DashboardPage = ({ onGoToLanding }: DashboardPageProps) => {
  const [isAIOpen, setIsAIOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen w-full bg-white text-[#000000] font-sans selection:bg-black selection:text-white">
      {/* Dashboard Top Sticky Navbar */}
      <DashboardNavbar
        onOpenAI={() => setIsAIOpen(true)}
        onGoToLanding={onGoToLanding}
        onNavigateSection={scrollToSection}
      />

      {/* 4. Dashboard Hero Greeting */}
      <DashboardHero
        onPlanNew={() => scrollToSection('create-journey')}
        onExplore={() => scrollToSection('discovery')}
      />

      {/* 6 & 7. Current Journey Cinematic Card + Minimal Trip Status */}
      <CurrentJourneyCard
        onContinueJourney={() => scrollToSection('itinerary')}
      />

      {/* 8. My Journeys Editorial Collection */}
      <MyJourneysSection />

      {/* 9. Create Journey Section ("Dream somewhere new") */}
      <CreateJourneySection />

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

      {/* 15. Floating AI Travel Assistant */}
      <AIAssistantDrawer
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onOpen={() => setIsAIOpen(true)}
      />

      {/* Editorial Footer */}
      <DashboardFooter
        onBackToTop={handleBackToTop}
        onGoToLanding={onGoToLanding}
      />
    </div>
  );
};
