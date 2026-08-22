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
import { StoredJourney, travelStorage, parseBudget } from '../../services/travelStorage';

interface DashboardPageProps {
  onGoToLanding: () => void;
}

export const DashboardPage = ({ onGoToLanding }: DashboardPageProps) => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [createdJourneys, setCreatedJourneys] = useState<StoredJourney[]>(() => travelStorage.getJourneys());

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateTrip = (tripDetails: { destination: string; budget: string; travelers: string; style: string }) => {
    const journey: StoredJourney = {
      id: crypto.randomUUID(),
      destination: tripDetails.destination.trim().toUpperCase(),
      budget: parseBudget(tripDetails.budget),
      travelers: Number(tripDetails.travelers),
      style: tripDetails.style,
      createdAt: new Date().toISOString(),
      status: 'Planning',
    };
    travelStorage.saveJourney(journey);
    setCreatedJourneys((current) => [journey, ...current]);
  };

  const journeyCards = createdJourneys.map((journey) => ({
    id: journey.id,
    destination: journey.destination,
    dates: 'DATES TO CONFIRM',
    citiesCount: journey.destination.split(',').filter(Boolean).length,
    travelersCount: journey.travelers,
    status: journey.status,
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=800&auto=format&fit=crop',
    tagline: `${journey.style} journey with a ₹${journey.budget.toLocaleString()} target`,
  }));

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
      <MyJourneysSection additionalJourneys={journeyCards} />

      {/* 9. Create Journey Section ("Dream somewhere new") */}
      <CreateJourneySection onCreateTrip={handleCreateTrip} />

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
