import { useState } from 'react';
import {
  X,
  Share2,
  Calendar,
  Users,
  MapPin,
  MoreVertical,
  Plus,
  CheckCircle,
  Clock,
  Trash2,
  Link,
  Shield,
  Edit3,
  Eye,
} from 'lucide-react';
import {
  Collaborator,
  CollaboratorRole,
  ItineraryItem,
  StoredJourney,
  UserProfile,
} from '../../types/collaboration';
import { CollaboratorsList } from '../collaboration/CollaboratorsList';
import { TripActivityFeed } from '../collaboration/TripActivityFeed';
import { RemoveCollaboratorModal } from '../collaboration/RemoveCollaboratorModal';
import { travelStorage } from '../../services/travelStorage';

interface TripDetailModalProps {
  isOpen: boolean;
  trip: StoredJourney | null;
  currentUser: UserProfile;
  onClose: () => void;
  onOpenShareModal: (trip: StoredJourney) => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
  onTripUpdated: () => void;
}

export const TripDetailModal = ({
  isOpen,
  trip,
  currentUser,
  onClose,
  onOpenShareModal,
  onShowToast,
  onTripUpdated,
}: TripDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'budget' | 'activity'>('overview');
  const [selectedDay, setSelectedDay] = useState('14 JUN');
  const [collaboratorToRemove, setCollaboratorToRemove] = useState<Collaborator | null>(null);
  const [showThreeDotMenu, setShowThreeDotMenu] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);

  // New activity form state
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityLocation, setNewActivityLocation] = useState('');
  const [newActivityTime, setNewActivityTime] = useState('14:00');
  const [newActivityCategory, setNewActivityCategory] = useState<'Dining' | 'Activity' | 'Heritage' | 'Leisure'>('Activity');
  const [newActivityNotes, setNewActivityNotes] = useState('');

  if (!isOpen || !trip) return null;

  // Determine permissions
  const isOwner = trip.ownerId === currentUser.id;
  const userCollab = trip.collaborators.find((c) => c.userId === currentUser.id);
  const userRole: CollaboratorRole = isOwner ? 'Owner' : userCollab?.role || 'Viewer';
  const canEdit = userRole === 'Owner' || userRole === 'Editor';

  const dayItinerary = trip.itinerary?.[selectedDay] || [];

  const handleUpdateRole = (userId: string, newRole: CollaboratorRole) => {
    travelStorage.updateCollaboratorRole(trip.id, userId, newRole);
    onShowToast(`Collaborator permission changed to ${newRole}`, 'info');
    onTripUpdated();
  };

  const handleConfirmRemove = (userId: string) => {
    travelStorage.removeCollaborator(trip.id, userId, currentUser.name);
    onShowToast('Collaborator removed from this journey.', 'info');
    onTripUpdated();
  };

  const handleToggleItineraryItem = (itemId: string) => {
    if (!canEdit) {
      onShowToast('Viewers have read-only access. Only editors can update items.', 'info');
      return;
    }

    travelStorage.updateJourney(trip.id, (j) => {
      const currentDayItems = j.itinerary?.[selectedDay] || [];
      const updatedItems = currentDayItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              completed: !item.completed,
              updatedBy: currentUser.name,
              updatedAt: 'Just now',
            }
          : item
      );

      const targetItem = currentDayItems.find((i) => i.id === itemId);
      const isDone = !targetItem?.completed;

      return {
        ...j,
        itinerary: {
          ...j.itinerary,
          [selectedDay]: updatedItems,
        },
        activities: [
          {
            id: crypto.randomUUID(),
            tripId: j.id,
            userId: currentUser.id,
            userName: currentUser.name,
            userInitials: currentUser.initials,
            userAvatar: currentUser.avatar,
            action: `${isDone ? 'completed' : 'uncompleted'} "${targetItem?.title}" in ${selectedDay}`,
            timestamp: new Date().toISOString(),
            relativeTime: 'Just now',
          },
          ...(j.activities || []),
        ],
      };
    });

    onTripUpdated();
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    const newItem: ItineraryItem = {
      id: 'item_' + Math.random().toString(36).substring(2, 9),
      time: newActivityTime,
      title: newActivityTitle.trim(),
      location: newActivityLocation.trim() || trip.destination,
      category: newActivityCategory,
      completed: false,
      notes: newActivityNotes.trim() || undefined,
      addedBy: currentUser.name,
      updatedAt: 'Just now',
    };

    travelStorage.updateJourney(trip.id, (j) => {
      const currentDayItems = j.itinerary?.[selectedDay] || [];
      const updatedItems = [...currentDayItems, newItem].sort((a, b) => a.time.localeCompare(b.time));

      return {
        ...j,
        itinerary: {
          ...j.itinerary,
          [selectedDay]: updatedItems,
        },
        activities: [
          {
            id: crypto.randomUUID(),
            tripId: j.id,
            userId: currentUser.id,
            userName: currentUser.name,
            userInitials: currentUser.initials,
            userAvatar: currentUser.avatar,
            action: `added "${newItem.title}" to ${selectedDay} itinerary`,
            timestamp: new Date().toISOString(),
            relativeTime: 'Just now',
          },
          ...(j.activities || []),
        ],
      };
    });

    setNewActivityTitle('');
    setNewActivityLocation('');
    setNewActivityNotes('');
    setShowAddActivityModal(false);
    onShowToast(`Added "${newItem.title}" to ${selectedDay}!`, 'success');
    onTripUpdated();
  };

  const handleDeleteTrip = () => {
    if (!isOwner) return;
    if (confirm(`Are you sure you want to delete "${trip.title || trip.destination}"?`)) {
      travelStorage.deleteJourney(trip.id);
      onShowToast('Journey deleted.', 'info');
      onTripUpdated();
      onClose();
    }
  };

  const handleCopyInviteLink = async () => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://aethera.travel';
    const link = `${currentOrigin}?join=${trip.id}&by=${currentUser.username}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(link);
      }
    } catch {}
    onShowToast('Invite link copied to clipboard!', 'success');
    setShowThreeDotMenu(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-rise">
        <div
          className="relative w-full max-w-5xl bg-white border border-[#E7E5E2] rounded-[32px] shadow-[0_30px_90px_rgba(0,0,0,0.22)] overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Hero Banner */}
          <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-neutral-900 shrink-0">
            <img
              src={trip.image}
              alt={trip.destination}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Top action controls */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
              {/* Share Trip Button (Black Pill Design) */}
              <button
                type="button"
                onClick={() => onOpenShareModal(trip)}
                className="flex items-center gap-2 rounded-full px-5 py-2.5 bg-white text-black font-medium text-xs sm:text-sm hover:bg-neutral-100 transition-all hover:scale-[1.03] active:scale-[0.98] shadow-md cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Trip</span>
              </button>

              {/* Three-dot menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowThreeDotMenu(!showThreeDotMenu)}
                  className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-colors cursor-pointer"
                  aria-label="Trip actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showThreeDotMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E7E5E2] rounded-2xl shadow-2xl p-1.5 z-30 animate-fade-rise text-xs font-inter text-black">
                    <button
                      type="button"
                      onClick={() => {
                        setShowThreeDotMenu(false);
                        onOpenShareModal(trip);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Invite collaborators</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyInviteLink}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <Link className="w-3.5 h-3.5" />
                      <span>Copy invite link</span>
                    </button>

                    {isOwner && (
                      <>
                        <div className="my-1 border-t border-neutral-100" />
                        <button
                          type="button"
                          onClick={handleDeleteTrip}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete journey</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-colors cursor-pointer ml-1"
                aria-label="Close trip details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Overlaid Title & Meta */}
            <div className="absolute bottom-6 left-6 sm:left-8 right-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest bg-white/90 text-black px-2.5 py-0.5 rounded-full backdrop-blur-md">
                  {trip.status}
                </span>
                <span className="text-xs text-neutral-300 font-mono">
                  Owner: {isOwner ? 'You' : trip.ownerName}
                </span>
              </div>
              <h2 className="font-instrument text-3xl sm:text-5xl text-white leading-none tracking-tight">
                {trip.title || trip.destination}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-200 font-inter mt-1.5 line-clamp-1">
                {trip.tagline || `${trip.style} journey across ${trip.destination}`}
              </p>
            </div>
          </div>

          {/* Role Status Bar */}
          <div className="px-6 sm:px-8 py-3 bg-[#FAF8F5] border-b border-[#E7E5E2] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-inter">
            <div className="flex items-center gap-2">
              <span className="font-mono uppercase tracking-wider text-[#6F6F6F]">
                Your Permission:
              </span>
              <span
                className={`inline-flex items-center gap-1 font-mono uppercase px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                  userRole === 'Owner'
                    ? 'bg-black text-white'
                    : userRole === 'Editor'
                    ? 'bg-neutral-200 text-black border border-neutral-300'
                    : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                }`}
              >
                {userRole === 'Owner' && <Shield className="w-3 h-3" />}
                {userRole === 'Editor' && <Edit3 className="w-3 h-3" />}
                {userRole === 'Viewer' && <Eye className="w-3 h-3" />}
                <span>{userRole}</span>
              </span>
              <span className="text-[#6F6F6F] hidden md:inline">
                {userRole === 'Owner' && '• Full control over itinerary, collaborators, and settings'}
                {userRole === 'Editor' && '• Can edit itinerary, add stops, notes, and contribute'}
                {userRole === 'Viewer' && '• Read-only view of itinerary and live details'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#6F6F6F]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {trip.dates}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {trip.collaborators.length} Collaborators
              </span>
            </div>
          </div>

          {/* Workspace Tabs Navigation */}
          <div className="px-6 sm:px-8 border-b border-[#E7E5E2] flex items-center gap-2 overflow-x-auto">
            {(
              [
                { id: 'overview', label: 'Collaborators & Overview' },
                { id: 'itinerary', label: 'Live Itinerary' },
                { id: 'budget', label: 'Shared Budget' },
                { id: 'activity', label: 'Recent Activity' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-3 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-black text-black font-semibold'
                    : 'border-transparent text-[#6F6F6F] hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panes */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8">
            {/* 1. OVERVIEW & COLLABORATORS TAB */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Collaborators Section */}
                <div className="lg:col-span-7 space-y-6">
                  <CollaboratorsList
                    collaborators={trip.collaborators}
                    currentUser={currentUser}
                    isOwner={isOwner}
                    canEdit={canEdit}
                    onInviteClick={() => onOpenShareModal(trip)}
                    onUpdateRole={handleUpdateRole}
                    onRequestRemove={(c) => setCollaboratorToRemove(c)}
                  />

                  {/* Trip Parameters Grid */}
                  <div className="pt-4 border-t border-[#E7E5E2]">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#6F6F6F] block mb-3">
                      JOURNEY SPECIFICATIONS
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-[#FAF8F5] border border-[#E7E5E2] rounded-2xl p-4">
                        <span className="text-[10px] font-mono text-[#6F6F6F] uppercase block">
                          Duration
                        </span>
                        <span className="font-instrument text-2xl text-black">
                          {trip.daysCount} Days
                        </span>
                      </div>
                      <div className="bg-[#FAF8F5] border border-[#E7E5E2] rounded-2xl p-4">
                        <span className="text-[10px] font-mono text-[#6F6F6F] uppercase block">
                          Travelers
                        </span>
                        <span className="font-instrument text-2xl text-black">
                          {trip.travelers} Guests
                        </span>
                      </div>
                      <div className="bg-[#FAF8F5] border border-[#E7E5E2] rounded-2xl p-4">
                        <span className="text-[10px] font-mono text-[#6F6F6F] uppercase block">
                          Budget Target
                        </span>
                        <span className="font-instrument text-2xl text-black">
                          ₹{trip.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-[#FAF8F5] border border-[#E7E5E2] rounded-2xl p-4">
                        <span className="text-[10px] font-mono text-[#6F6F6F] uppercase block">
                          Travel Style
                        </span>
                        <span className="font-inter text-xs font-medium text-black mt-1 block">
                          {trip.style}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Recent Activity Feed */}
                <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#E7E5E2] rounded-3xl p-6 space-y-4">
                  <TripActivityFeed activities={trip.activities || []} limit={6} />
                </div>
              </div>
            )}

            {/* 2. ITINERARY TAB */}
            {activeTab === 'itinerary' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-instrument text-3xl text-black">Day-by-Day Timeline</h3>
                    <p className="text-xs text-[#6F6F6F] font-inter">
                      Collaborative hourly moments. {canEdit ? 'Editors can add, modify, and check off stops.' : 'Viewing in read-only mode.'}
                    </p>
                  </div>

                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => setShowAddActivityModal(true)}
                      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-all hover:scale-[1.02] cursor-pointer self-start sm:self-auto shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Stop to {selectedDay}</span>
                    </button>
                  )}
                </div>

                {/* Day selector tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {['12 JUN', '13 JUN', '14 JUN', '15 JUN', '16 JUN'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`px-4 py-2 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                        selectedDay === day
                          ? 'bg-black text-white shadow-xs'
                          : 'bg-neutral-100 text-[#6F6F6F] hover:text-black'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Timeline moments */}
                {dayItinerary.length === 0 ? (
                  <div className="bg-[#FAF8F5] border border-[#E7E5E2] rounded-2xl p-10 text-center space-y-3">
                    <Clock className="w-6 h-6 text-neutral-400 mx-auto" />
                    <h4 className="font-instrument text-2xl text-black">No stops planned yet for {selectedDay}</h4>
                    <p className="text-xs text-[#6F6F6F] max-w-sm mx-auto font-inter">
                      {canEdit
                        ? 'Shape the day by adding coastal visits, culinary reservations, or landmark walks.'
                        : 'Your team has not yet scheduled events for this day.'}
                    </p>
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => setShowAddActivityModal(true)}
                        className="rounded-full px-6 py-2 bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        + Add First Activity
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="relative pl-6 sm:pl-8 border-l border-[#E7E5E2] space-y-6">
                    {dayItinerary.map((event) => (
                      <div key={event.id} className="relative group">
                        {/* Status Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleItineraryItem(event.id)}
                          disabled={!canEdit}
                          className={`absolute -left-[31px] sm:-left-[39px] top-1 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                            event.completed
                              ? 'bg-black border-black text-white'
                              : canEdit
                              ? 'bg-white border-neutral-400 group-hover:border-black cursor-pointer'
                              : 'bg-neutral-100 border-neutral-300 cursor-default'
                          }`}
                          title={canEdit ? 'Click to toggle status' : 'Read-only'}
                        >
                          {event.completed && <CheckCircle className="w-3.5 h-3.5" />}
                        </button>

                        <div className="bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] border border-[#E7E5E2] rounded-2xl p-4 sm:p-5 transition-colors">
                          <div className="flex items-center justify-between gap-3 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold text-black">
                                {event.time}
                              </span>
                              <span className="text-neutral-300">•</span>
                              <span className="text-[11px] font-mono uppercase text-[#6F6F6F] bg-white px-2 py-0.5 rounded border border-[#E7E5E2]">
                                {event.category}
                              </span>
                            </div>

                            {/* Contributor badge */}
                            {event.addedBy && (
                              <span className="text-[10px] font-mono text-neutral-500">
                                Added by {event.addedBy} {event.updatedAt && `• ${event.updatedAt}`}
                              </span>
                            )}
                          </div>

                          <h4
                            className={`font-instrument text-2xl text-black ${
                              event.completed ? 'line-through opacity-50' : ''
                            }`}
                          >
                            {event.title}
                          </h4>

                          <div className="flex items-center gap-1.5 text-xs text-[#6F6F6F] mt-1 font-inter">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span>{event.location}</span>
                          </div>

                          {event.notes && (
                            <p className="text-xs text-[#6F6F6F] mt-2 italic font-inter pl-3 border-l-2 border-neutral-300">
                              "{event.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. BUDGET TAB */}
            {activeTab === 'budget' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-instrument text-3xl text-black">Shared Financial Ledger</h3>
                    <p className="text-xs text-[#6F6F6F] font-inter">
                      Target budget and per-traveler settlement architecture.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    Within Budget Limit
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#FAF8F5] border border-[#E7E5E2] rounded-2xl p-6">
                    <span className="text-xs font-mono uppercase text-[#6F6F6F] block">
                      Target Ceiling
                    </span>
                    <span className="font-instrument text-4xl text-black mt-1 block">
                      ₹{trip.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#E7E5E2] rounded-2xl p-6">
                    <span className="text-xs font-mono uppercase text-[#6F6F6F] block">
                      Per Traveler
                    </span>
                    <span className="font-instrument text-4xl text-black mt-1 block">
                      ₹{Math.round(trip.budget / Math.max(1, trip.travelers)).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#E7E5E2] rounded-2xl p-6">
                    <span className="text-xs font-mono uppercase text-[#6F6F6F] block">
                      Estimated Spent
                    </span>
                    <span className="font-instrument text-4xl text-emerald-800 mt-1 block">
                      ₹{Math.round(trip.budget * 0.91).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Collaborator Ledger Breakdown */}
                <div className="bg-white border border-[#E7E5E2] rounded-2xl p-6 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#6F6F6F] block">
                    Traveler Split Breakdown
                  </span>
                  <div className="divide-y divide-neutral-100">
                    {trip.collaborators.map((c) => (
                      <div key={c.userId} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-serif">
                            {c.initials}
                          </div>
                          <div>
                            <span className="font-medium text-black">{c.name}</span>
                            <span className="text-neutral-400 block text-[11px]">{c.role}</span>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="font-medium text-black">
                            ₹{Math.round(trip.budget / Math.max(1, trip.collaborators.length)).toLocaleString()}
                          </span>
                          <span className="text-emerald-700 block text-[10px]">Settled</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. ACTIVITY HISTORY TAB */}
            {activeTab === 'activity' && (
              <div className="bg-white border border-[#E7E5E2] rounded-3xl p-6 sm:p-8">
                <TripActivityFeed activities={trip.activities || []} limit={20} />
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-[#E7E5E2] flex items-center justify-between">
            <span className="text-xs text-[#6F6F6F] font-mono">
              Live collaboration synchronized with Aethera Studio
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-7 py-2 bg-black text-white text-xs sm:text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Remove Collaborator Confirmation Dialog */}
      <RemoveCollaboratorModal
        isOpen={!!collaboratorToRemove}
        collaborator={collaboratorToRemove}
        onClose={() => setCollaboratorToRemove(null)}
        onConfirmRemove={handleConfirmRemove}
      />

      {/* Add Itinerary Stop Modal */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-rise">
          <div
            className="w-full max-w-md bg-white border border-[#E7E5E2] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E2]">
              <div>
                <h4 className="font-instrument text-2xl text-black">Add Itinerary Stop</h4>
                <p className="text-xs text-[#6F6F6F] font-mono">{selectedDay} in {trip.destination}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddActivityModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddActivity} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono uppercase text-[#6F6F6F] mb-1">Stop Title</label>
                <input
                  type="text"
                  value={newActivityTitle}
                  onChange={(e) => setNewActivityTitle(e.target.value)}
                  placeholder="e.g. Assagao Heritage Villa & Lunch"
                  className="w-full border border-[#E7E5E2] rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-[#6F6F6F] mb-1">Time</label>
                  <input
                    type="text"
                    value={newActivityTime}
                    onChange={(e) => setNewActivityTime(e.target.value)}
                    placeholder="14:00"
                    className="w-full border border-[#E7E5E2] rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-[#6F6F6F] mb-1">Category</label>
                  <select
                    value={newActivityCategory}
                    onChange={(e) => setNewActivityCategory(e.target.value as any)}
                    className="w-full border border-[#E7E5E2] rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-black cursor-pointer"
                  >
                    <option value="Activity">Activity</option>
                    <option value="Dining">Dining</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Leisure">Leisure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-[#6F6F6F] mb-1">Location / Landmark</label>
                <input
                  type="text"
                  value={newActivityLocation}
                  onChange={(e) => setNewActivityLocation(e.target.value)}
                  placeholder="e.g. Badem Hilltop, Assagao"
                  className="w-full border border-[#E7E5E2] rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[#6F6F6F] mb-1">Editorial Notes (Optional)</label>
                <textarea
                  value={newActivityNotes}
                  onChange={(e) => setNewActivityNotes(e.target.value)}
                  rows={2}
                  placeholder="Reservations, dress recommendations, tickets..."
                  className="w-full border border-[#E7E5E2] rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="rounded-full px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full px-6 py-2.5 bg-black text-white font-medium hover:bg-neutral-800 transition-colors"
                >
                  Add Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
