import { useState } from 'react';
import { ArrowUpRight, Calendar, Users2, Plus } from 'lucide-react';
import { StoredJourney, UserProfile } from '../../types/collaboration';

interface MyJourneysSectionProps {
  journeys: StoredJourney[];
  currentUser: UserProfile;
  onSelectJourney: (journey: StoredJourney) => void;
  onOpenShareModal?: (journey: StoredJourney) => void;
  onPlanNew: () => void;
}

export const MyJourneysSection = ({
  journeys,
  currentUser,
  onSelectJourney,
  onPlanNew,
}: MyJourneysSectionProps) => {
  const [filter, setFilter] = useState<'All' | 'My Trips' | 'Shared With Me' | 'Upcoming' | 'Planning'>('All');

  // Filter journeys based on active tab and current user
  const myTrips = journeys.filter((j) => j.ownerId === currentUser.id);
  const sharedWithMe = journeys.filter(
    (j) => j.ownerId !== currentUser.id && j.collaborators.some((c) => c.userId === currentUser.id)
  );

  let displayedJourneys: StoredJourney[] = [];
  if (filter === 'All') {
    displayedJourneys = journeys;
  } else if (filter === 'My Trips') {
    displayedJourneys = myTrips;
  } else if (filter === 'Shared With Me') {
    displayedJourneys = sharedWithMe;
  } else {
    displayedJourneys = journeys.filter((j) => j.status === filter);
  }

  return (
    <section id="journeys" className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 py-16 border-t border-[#E7E5E2]">
      {/* Header with Title and View Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#6F6F6F] block mb-2">
            COLLECTION & ARCHIVE
          </span>
          <h2 className="font-instrument text-4xl sm:text-5xl md:text-6xl text-[#000000] tracking-headline">
            Your Journeys
          </h2>
          <p className="font-inter text-sm sm:text-base text-[#6F6F6F] max-w-xl mt-3">
            Distinguish between journeys you own and collaborative journeys shared with you.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick filter tabs */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-full text-xs text-[#6F6F6F] overflow-x-auto max-w-full">
            {(['All', 'My Trips', 'Shared With Me', 'Upcoming', 'Planning'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  filter === tab
                    ? 'bg-white text-[#000000] shadow-xs font-medium'
                    : 'hover:text-[#000000]'
                }`}
              >
                {tab}
                {tab === 'My Trips' && ` (${myTrips.length})`}
                {tab === 'Shared With Me' && ` (${sharedWithMe.length})`}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onPlanNew}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-all hover:scale-[1.02] cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Plan New</span>
          </button>
        </div>
      </div>

      {/* Grid of Editorial Magazine Cards */}
      {displayedJourneys.length === 0 ? (
        <div className="bg-[#FAF8F5] border border-[#E7E5E2] rounded-3xl p-12 text-center space-y-3">
          <Users2 className="w-8 h-8 text-neutral-400 mx-auto" />
          <h3 className="font-instrument text-3xl text-black">No journeys in this category</h3>
          <p className="text-xs sm:text-sm text-[#6F6F6F] font-inter max-w-md mx-auto">
            {filter === 'Shared With Me'
              ? 'No trips have been shared with you yet. Invite friends or accept a shareable invite link to collaborate.'
              : 'Create your first journey or explore destination collections to get started.'}
          </p>
          <button
            type="button"
            onClick={onPlanNew}
            className="rounded-full px-6 py-2.5 bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            + Create a Journey
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedJourneys.map((journey) => {
            const isOwner = journey.ownerId === currentUser.id;
            const userRole = isOwner
              ? 'Owner'
              : journey.collaborators.find((c) => c.userId === currentUser.id)?.role || 'Viewer';

            return (
              <div
                key={journey.id}
                onClick={() => onSelectJourney(journey)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-[#E7E5E2] card-hover-effect flex flex-col justify-between cursor-pointer"
              >
                {/* Image Container with Editorial Aspect Ratio */}
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                  <img
                    src={journey.image}
                    alt={journey.destination}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {/* Soft Gradient Overlay for Typography */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Top Badges: Status + Shared / Owner Indicator */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#000000] px-2.5 py-1 rounded-full shadow-xs">
                      {journey.status}
                    </span>

                    {/* Shared With Me Badge */}
                    {!isOwner ? (
                      <span className="text-[10px] font-mono uppercase tracking-wider bg-neutral-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-xs">
                        <Users2 className="w-2.5 h-2.5" />
                        <span>Shared ({userRole})</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono uppercase tracking-wider bg-neutral-900/60 backdrop-blur-md text-white/90 px-2 py-0.5 rounded-full">
                        Owner: You
                      </span>
                    )}
                  </div>

                  {/* Editorial Magazine Typography Over Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300">
                        {isOwner ? 'YOUR TRIP' : `SHARED BY ${journey.ownerName.toUpperCase()}`}
                      </span>
                      {/* Mini Collaborator avatars */}
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {journey.collaborators.slice(0, 3).map((c, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full bg-neutral-800 border border-black text-[9px] text-white flex items-center justify-center font-serif"
                            title={`${c.name} (${c.role})`}
                          >
                            {c.initials}
                          </div>
                        ))}
                        {journey.collaborators.length > 3 && (
                          <div className="w-5 h-5 rounded-full bg-neutral-700 border border-black text-[8px] text-white flex items-center justify-center font-mono">
                            +{journey.collaborators.length - 3}
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="font-instrument text-2xl sm:text-3xl text-white tracking-wide leading-none mb-1.5">
                      {journey.title || journey.destination}
                    </h3>
                    <p className="text-[11px] text-neutral-300 line-clamp-2 font-inter leading-snug">
                      {journey.tagline || `${journey.style} journey with ₹${journey.budget.toLocaleString()} target`}
                    </p>
                  </div>
                </div>

                {/* Bottom Metadata bar */}
                <div className="p-3.5 bg-[#FAF8F5]/80 border-t border-[#E7E5E2] flex items-center justify-between text-xs text-[#6F6F6F]">
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    <span>{journey.dates}</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-mono text-[11px]">
                    <span className="flex items-center gap-1 text-black font-medium group-hover:text-neutral-600 transition-colors">
                      <span>Open</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
