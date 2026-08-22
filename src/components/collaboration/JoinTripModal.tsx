import { useState } from 'react';
import { Calendar, Users, MapPin, X, Shield, ArrowRight } from 'lucide-react';
import { CollaboratorRole, StoredJourney, UserProfile } from '../../types/collaboration';
import { DEMO_USERS } from '../../services/travelStorage';

interface JoinTripModalProps {
  isOpen: boolean;
  trip: StoredJourney;
  inviterName?: string;
  role?: CollaboratorRole;
  currentUser: UserProfile;
  onAccept: (user: UserProfile) => void;
  onDecline: () => void;
  onClose: () => void;
}

export const JoinTripModal = ({
  isOpen,
  trip,
  inviterName = 'Aravind S.',
  role = 'Editor',
  currentUser,
  onAccept,
  onDecline,
  onClose,
}: JoinTripModalProps) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile>(currentUser);
  const [isAccepting, setIsAccepting] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    setIsAccepting(true);
    setTimeout(() => {
      setIsAccepting(false);
      onAccept(selectedUser);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-rise">
      <div
        className="relative w-full max-w-lg bg-white border border-[#E7E5E2] rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cinematic Cover Header */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-neutral-900">
          <img
            src={trip.image}
            alt={trip.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Overlaid Title */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 block mb-1">
              SHARED INVITATION
            </span>
            <h3 className="font-instrument text-3xl sm:text-4xl text-white leading-none">
              {trip.title || trip.destination}
            </h3>
            <p className="text-xs text-neutral-300 font-inter mt-1">
              Curated by <strong className="text-white font-medium">{inviterName}</strong>
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Invitation Prompt */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-[#E7E5E2] text-xs font-mono uppercase text-[#000000]">
              <Shield className="w-3 h-3 text-neutral-800" />
              <span>Role: {role} Access</span>
            </span>
            <h2 className="font-instrument text-3xl text-black">
              You're invited to collaborate.
            </h2>
            <p className="text-xs sm:text-sm text-[#6F6F6F] font-inter max-w-md mx-auto leading-relaxed">
              Join this journey to collaborate in real-time, organize daily stops, review split
              estimates, and build the itinerary together.
            </p>
          </div>

          {/* Trip Summary Card */}
          <div className="bg-[#FAF8F5] border border-[#E7E5E2] rounded-2xl p-4 sm:p-5 flex items-center justify-between text-xs font-mono">
            <div className="space-y-1">
              <span className="text-[#6F6F6F] uppercase text-[10px] block">DESTINATION</span>
              <span className="text-sm font-instrument text-black flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {trip.destination}
              </span>
            </div>

            <div className="space-y-1 border-x border-[#E7E5E2] px-4">
              <span className="text-[#6F6F6F] uppercase text-[10px] block">DURATION</span>
              <span className="text-sm font-instrument text-black flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {trip.daysCount} Days
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[#6F6F6F] uppercase text-[10px] block">TRAVELERS</span>
              <span className="text-sm font-instrument text-black flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {trip.travelers} Travelers
              </span>
            </div>
          </div>

          {/* Accepting As Account Switcher */}
          <div className="space-y-2 pt-1 border-t border-neutral-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[#6F6F6F] uppercase tracking-wider">
                Accepting as:
              </span>
              <span className="text-[11px] text-neutral-400 font-inter">
                Choose persona for test
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEMO_USERS.map((user) => {
                const isSelected = selectedUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'bg-white text-black border-[#E7E5E2] hover:bg-neutral-50'
                    }`}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-neutral-700 text-white flex items-center justify-center text-[10px]">
                        {user.initials}
                      </div>
                    )}
                    <span className="text-xs font-medium truncate w-full text-center">
                      {user.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onDecline}
              className="w-full sm:w-1/3 rounded-full py-3.5 px-6 bg-white border border-[#E7E5E2] text-black text-xs font-medium hover:bg-neutral-100 transition-colors cursor-pointer text-center"
            >
              Decline
            </button>

            <button
              type="button"
              onClick={handleAccept}
              disabled={isAccepting}
              className="w-full sm:w-2/3 flex items-center justify-center gap-2 rounded-full py-3.5 px-6 bg-black text-white text-xs sm:text-sm font-medium hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer disabled:opacity-50 text-center"
            >
              {isAccepting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Joining Journey...</span>
                </>
              ) : (
                <>
                  <span>Accept Invitation</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
