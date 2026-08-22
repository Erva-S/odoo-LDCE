import { useState, useEffect } from 'react';
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
import { ShareTripModal } from '../collaboration/ShareTripModal';
import { JoinTripModal } from '../collaboration/JoinTripModal';
import { TripDetailModal } from './TripDetailModal';
import { Toast, ToastMessage } from '../collaboration/Toast';
import {
  Collaborator,
  CollaboratorRole,
  StoredJourney,
  StoredNotification,
  UserProfile,
  travelStorage,
  parseBudget,
  DEMO_USERS,
} from '../../services/travelStorage';

interface DashboardPageProps {
  onGoToLanding: () => void;
}

export const DashboardPage = ({ onGoToLanding }: DashboardPageProps) => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => travelStorage.getCurrentUser());
  const [journeys, setJourneys] = useState<StoredJourney[]>(() => travelStorage.getJourneys());
  const [notifications, setNotifications] = useState<StoredNotification[]>(() => travelStorage.getNotifications());

  // Modal States
  const [selectedTrip, setSelectedTrip] = useState<StoredJourney | null>(null);
  const [shareTrip, setShareTrip] = useState<StoredJourney | null>(null);
  const [joinTripInfo, setJoinTripInfo] = useState<{
    trip: StoredJourney;
    inviterName: string;
    role: CollaboratorRole;
  } | null>(null);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'info' = 'success', title?: string) => {
    const newToast: ToastMessage = {
      id: crypto.randomUUID(),
      message,
      type,
      title,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state helper
  const reloadData = () => {
    const updatedJourneys = travelStorage.getJourneys();
    setJourneys(updatedJourneys);
    setNotifications(travelStorage.getNotifications());

    if (selectedTrip) {
      const refreshed = updatedJourneys.find((j) => j.id === selectedTrip.id);
      if (refreshed) setSelectedTrip(refreshed);
    }
    if (shareTrip) {
      const refreshed = updatedJourneys.find((j) => j.id === shareTrip.id);
      if (refreshed) setShareTrip(refreshed);
    }
  };

  // Check URL query parameters for invite link e.g. `?join=trip-goa-1`
  useEffect(() => {
    const checkUrlInvite = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const joinTripId = params.get('join');
      const inviterUsername = params.get('by');

      if (joinTripId) {
        const targetTrip = journeys.find((j) => j.id === joinTripId);
        if (targetTrip) {
          const inviterUser = DEMO_USERS.find((u) => u.username === inviterUsername);
          setJoinTripInfo({
            trip: targetTrip,
            inviterName: inviterUser?.name || targetTrip.ownerName || 'A Travel Companion',
            role: 'Editor',
          });
        }
      }
    };

    checkUrlInvite();
  }, [journeys]);

  // Listen to custom cross-component storage update events
  useEffect(() => {
    const handleStorageUpdate = () => {
      reloadData();
    };
    window.addEventListener('aethera_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('aethera_storage_updated', handleStorageUpdate);
  }, [selectedTrip, shareTrip]);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectUser = (newUser: UserProfile) => {
    travelStorage.setCurrentUser(newUser);
    setCurrentUser(newUser);
    addToast(`Switched perspective to ${newUser.name}`, 'info');
  };

  const handleCreateTrip = (tripDetails: { destination: string; budget: string; travelers: string; style: string }) => {
    const newTripId = 'trip_' + Math.random().toString(36).substring(2, 9);
    const dest = tripDetails.destination.trim().toUpperCase();
    const newJourney: StoredJourney = {
      id: newTripId,
      destination: dest,
      title: `${dest} Curated Journey`,
      dates: 'DATES TO CONFIRM',
      daysCount: 7,
      citiesCount: dest.split(',').filter(Boolean).length || 1,
      budget: parseBudget(tripDetails.budget),
      travelers: Number(tripDetails.travelers) || 2,
      style: tripDetails.style,
      createdAt: new Date().toISOString(),
      status: 'Planning',
      image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=800&auto=format&fit=crop',
      tagline: `${tripDetails.style} journey with a ₹${parseBudget(tripDetails.budget).toLocaleString()} target`,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerAvatar: currentUser.avatar,
      collaborators: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: 'Owner',
          initials: currentUser.initials,
          avatar: currentUser.avatar,
          isOnline: true,
          joinedAt: new Date().toISOString(),
        },
      ],
      itinerary: {},
      activities: [
        {
          id: crypto.randomUUID(),
          tripId: newTripId,
          userId: currentUser.id,
          userName: currentUser.name,
          userInitials: currentUser.initials,
          action: 'created this new journey',
          timestamp: new Date().toISOString(),
          relativeTime: 'Just now',
        },
      ],
    };

    travelStorage.saveJourney(newJourney);
    reloadData();
    addToast(`✓ Journey created for ${dest}! Added to your archive.`, 'success');
  };

  const handleAcceptInvitation = (acceptingUser: UserProfile) => {
    if (!joinTripInfo) return;

    // Switch active persona to the accepting user
    handleSelectUser(acceptingUser);

    // Add accepting user as collaborator
    const newCollab: Collaborator = {
      userId: acceptingUser.id,
      name: acceptingUser.name,
      email: acceptingUser.email,
      role: joinTripInfo.role,
      avatar: acceptingUser.avatar,
      initials: acceptingUser.initials,
      isOnline: true,
      joinedAt: new Date().toISOString(),
    };

    travelStorage.addCollaborator(joinTripInfo.trip.id, newCollab);

    // Clean URL query param
    if (typeof window !== 'undefined' && window.history) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    const updated = travelStorage.getJourneyById(joinTripInfo.trip.id);
    setJoinTripInfo(null);
    reloadData();

    if (updated) {
      setSelectedTrip(updated);
    }
    addToast(`✓ Joined ${joinTripInfo.trip.title || joinTripInfo.trip.destination}!`, 'success');
  };

  const handleDeclineInvitation = () => {
    setJoinTripInfo(null);
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    addToast('Invitation declined.', 'info');
  };

  // Primary active journey for Hero & Itinerary views (Goa Trip default)
  const activeJourney = journeys[0] || null;
  const isCurrentUserOwner = activeJourney?.ownerId === currentUser.id;
  const activeUserRole: CollaboratorRole = isCurrentUserOwner
    ? 'Owner'
    : activeJourney?.collaborators.find((c) => c.userId === currentUser.id)?.role || 'Viewer';

  return (
    <div className="relative min-h-screen w-full bg-white text-[#000000] font-sans selection:bg-black selection:text-white">
      {/* Toast Notification System */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Dashboard Top Sticky Navbar with Notifications & Persona Switcher */}
      <DashboardNavbar
        currentUser={currentUser}
        notifications={notifications}
        onOpenAI={() => setIsAIOpen(true)}
        onGoToLanding={onGoToLanding}
        onNavigateSection={scrollToSection}
        onSelectUser={handleSelectUser}
        onMarkNotificationRead={(id) => {
          travelStorage.markNotificationRead(id);
          reloadData();
        }}
        onMarkAllNotificationsRead={() => {
          travelStorage.markAllNotificationsRead();
          reloadData();
        }}
        onOpenNotificationTrip={(tripId) => {
          if (tripId) {
            const target = journeys.find((j) => j.id === tripId);
            if (target) setSelectedTrip(target);
          }
        }}
      />

      {/* 4. Dashboard Hero Greeting */}
      <DashboardHero
        onPlanNew={() => scrollToSection('create-journey')}
        onExplore={() => scrollToSection('discovery')}
      />

      {/* 6 & 7. Current Journey Cinematic Card with Share Button & Collaborators */}
      <CurrentJourneyCard
        journey={activeJourney}
        currentUser={currentUser}
        onContinueJourney={() => scrollToSection('itinerary')}
        onOpenDetails={() => setSelectedTrip(activeJourney)}
        onOpenShare={() => setShareTrip(activeJourney)}
      />

      {/* 8. My Journeys Editorial Collection (Separated into My Trips & Shared With Me) */}
      <MyJourneysSection
        journeys={journeys}
        currentUser={currentUser}
        onSelectJourney={(j) => setSelectedTrip(j)}
        onOpenShareModal={(j) => setShareTrip(j)}
        onPlanNew={() => scrollToSection('create-journey')}
      />

      {/* 9. Create Journey Section ("Dream somewhere new") */}
      <CreateJourneySection onCreateTrip={handleCreateTrip} />

      {/* 10. AI Planner ("Let AI plan the details") */}
      <AIPlannerSection />

      {/* 11. Upcoming Itinerary with Collaborator Attribution */}
      <UpcomingItinerary
        currentUser={currentUser}
        userRole={activeUserRole}
        onOpenWorkspace={() => setSelectedTrip(activeJourney)}
        onShowToast={addToast}
      />

      {/* 12. Travel Budget (Monochrome & Editorial) */}
      <TravelBudget />

      {/* 13. Interactive Journey Map */}
      <JourneyMap />

      {/* 14. Travel Together Collaboration Studio */}
      <TravelTogether
        collaborators={activeJourney?.collaborators || []}
        onOpenShare={() => setShareTrip(activeJourney)}
        onOpenWorkspace={() => setSelectedTrip(activeJourney)}
      />

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

      {/* Trip Details & Collaborative Workspace Modal */}
      {selectedTrip && (
        <TripDetailModal
          isOpen={!!selectedTrip}
          trip={selectedTrip}
          currentUser={currentUser}
          onClose={() => setSelectedTrip(null)}
          onOpenShareModal={(tripToShare) => setShareTrip(tripToShare)}
          onShowToast={addToast}
          onTripUpdated={reloadData}
        />
      )}

      {/* Share Trip Modal */}
      {shareTrip && (
        <ShareTripModal
          isOpen={!!shareTrip}
          trip={shareTrip}
          currentUser={currentUser}
          onClose={() => setShareTrip(null)}
          onShowToast={addToast}
          onCollaboratorsUpdated={reloadData}
        />
      )}

      {/* Join Trip Invitation Acceptance Modal */}
      {joinTripInfo && (
        <JoinTripModal
          isOpen={!!joinTripInfo}
          trip={joinTripInfo.trip}
          inviterName={joinTripInfo.inviterName}
          role={joinTripInfo.role}
          currentUser={currentUser}
          onAccept={handleAcceptInvitation}
          onDecline={handleDeclineInvitation}
          onClose={() => setJoinTripInfo(null)}
        />
      )}
    </div>
  );
};
