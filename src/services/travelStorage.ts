import { DestinationInfo } from './destinations';

export interface ActivityItem {
  id: string;
  name: string;
  startTime: string; // "HH:MM" e.g., "09:00"
  endTime: string;   // "HH:MM" e.g., "10:30"
  location: string;
  cost?: number;
  description?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string; // e.g. "12 Jun" or "Day 1"
  city: string;
  activities: ActivityItem[];
}

export interface StoredJourney {
  id: string;
  destination: string; // Comma or dot-separated string for compatibility, e.g. "MUMBAI · GOA · JAIPUR"
  budget: number; // For compatibility
  travelers: number; // For compatibility
  style: string; // For compatibility
  createdAt: string;
  status: 'Planning' | 'Upcoming' | 'Completed';
  
  // Expanded fields for the "Plan a New Journey" flow
  destinations?: DestinationInfo[];
  startDate?: string;
  endDate?: string;
  datesDecided?: boolean;
  travellersBreakdown?: {
    adults: number;
    children: number;
  };
  budgetValue?: {
    amount: number | null;
    label: string; // e.g. "₹50,000" or "I'll decide later"
  };
  interests?: string[];
  pace?: string;
  itinerary?: ItineraryDay[];
  coverImage?: string;
}

export interface StoredNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const JOURNEYS_KEY = 'aethera.journeys';
const NOTIFICATIONS_KEY = 'aethera.notifications';

const read = <T,>(key: string, fallback: T): T => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = <T>(key: string, value: T) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Trigger custom window event for instant same-tab reactive updates
    window.dispatchEvent(new CustomEvent('aethera_storage_updated', { detail: { key } }));
  } catch (err) {
    console.error('Failed to write to localStorage', err);
  }
};

const normalizeJourney = (j: StoredJourney): StoredJourney => {
  if (!j.itinerary) return j;
  return {
    ...j,
    itinerary: j.itinerary.map(day => ({
      ...day,
      activities: (day.activities || []).map((act: any) => {
        if (typeof act === 'string') {
          return {
            id: crypto.randomUUID(),
            name: act,
            startTime: '09:00',
            endTime: '10:30',
            location: day.city || '',
            description: '',
            cost: 0
          };
        }
        return {
          id: act.id || crypto.randomUUID(),
          name: act.name || '',
          startTime: act.startTime || '09:00',
          endTime: act.endTime || '10:30',
          location: act.location || day.city || '',
          description: act.description || '',
          cost: typeof act.cost === 'number' ? act.cost : 0
        };
      })
    }))
  };
};

export const travelStorage = {
  getJourneys: (): StoredJourney[] => {
    const raw = read<StoredJourney[]>(JOURNEYS_KEY, []);
    return raw.map(normalizeJourney);
  },
  saveJourney: (journey: StoredJourney) => {
    const journeys = travelStorage.getJourneys();
    write(JOURNEYS_KEY, [journey, ...journeys.filter((j) => j.id !== journey.id)]);
  },
  updateJourney: (journeyId: string, updater: (j: StoredJourney) => StoredJourney) => {
    const journeys = travelStorage.getJourneys();
    const index = journeys.findIndex((j) => j.id === journeyId);
    if (index !== -1) {
      journeys[index] = updater(journeys[index]);
      write(JOURNEYS_KEY, [...journeys]);
    }
  },
  deleteJourney: (journeyId: string) => {
    const journeys = travelStorage.getJourneys();
    write(
      JOURNEYS_KEY,
      journeys.filter((j) => j.id !== journeyId)
    );
  },

  // Collaborators
  addCollaborator: (tripId: string, collaborator: Collaborator) => {
    travelStorage.updateJourney(tripId, (journey) => {
      const existing = journey.collaborators.filter((c) => c.userId !== collaborator.userId && c.email !== collaborator.email);
      const updatedCollaborators = [...existing, collaborator];

      const activity: TripActivity = {
        id: crypto.randomUUID(),
        tripId,
        userId: collaborator.userId,
        userName: collaborator.name,
        userInitials: collaborator.initials,
        userAvatar: collaborator.avatar,
        action: `joined this journey as an ${collaborator.role}`,
        timestamp: new Date().toISOString(),
        relativeTime: 'Just now',
      };

      return {
        ...journey,
        collaborators: updatedCollaborators,
        activities: [activity, ...(journey.activities || [])],
      };
    });

    travelStorage.addNotification({
      id: crypto.randomUUID(),
      title: 'New Collaborator Joined',
      message: `${collaborator.name} joined your journey as an ${collaborator.role}.`,
      type: 'invite',
      tripId,
      createdAt: new Date().toISOString(),
      read: false,
    });
  },

  removeCollaborator: (tripId: string, userId: string, removedByUserName?: string) => {
    const journey = travelStorage.getJourneyById(tripId);
    if (!journey) return;
    const removedUser = journey.collaborators.find((c) => c.userId === userId);

    travelStorage.updateJourney(tripId, (j) => {
      const activity: TripActivity = {
        id: crypto.randomUUID(),
        tripId,
        userId: userId,
        userName: removedByUserName || 'Owner',
        userInitials: 'A',
        action: `removed ${removedUser?.name || 'a collaborator'} from this journey`,
        timestamp: new Date().toISOString(),
        relativeTime: 'Just now',
      };

      return {
        ...j,
        collaborators: j.collaborators.filter((c) => c.userId !== userId),
        activities: [activity, ...(j.activities || [])],
      };
    });
  },

  updateCollaboratorRole: (tripId: string, userId: string, newRole: CollaboratorRole) => {
    travelStorage.updateJourney(tripId, (journey) => {
      const targetUser = journey.collaborators.find((c) => c.userId === userId);
      const activity: TripActivity = {
        id: crypto.randomUUID(),
        tripId,
        userId: userId,
        userName: targetUser?.name || 'Collaborator',
        userInitials: targetUser?.initials || 'C',
        userAvatar: targetUser?.avatar,
        action: `role was updated to ${newRole}`,
        timestamp: new Date().toISOString(),
        relativeTime: 'Just now',
      };

      return {
        ...journey,
        collaborators: journey.collaborators.map((c) =>
          c.userId === userId ? { ...c, role: newRole } : c
        ),
        activities: [activity, ...(journey.activities || [])],
      };
    });
  },

  // Invitations
  createInvitation: (
    tripId: string,
    invitedEmailOrUser: string,
    role: CollaboratorRole
  ): TripInvitation => {
    const journey = travelStorage.getJourneyById(tripId);
    const currentUser = travelStorage.getCurrentUser();

    // Check if user is already a registered persona
    const matchedPersona = DEMO_USERS.find(
      (u) =>
        u.email.toLowerCase() === invitedEmailOrUser.toLowerCase() ||
        u.username.toLowerCase() === invitedEmailOrUser.toLowerCase() ||
        u.name.toLowerCase() === invitedEmailOrUser.toLowerCase()
    );

    const token = 'inv_' + Math.random().toString(36).substring(2, 12);
    const invitation: TripInvitation = {
      id: crypto.randomUUID(),
      tripId,
      tripTitle: journey?.title || journey?.destination || 'Aethera Journey',
      tripDestination: journey?.destination || 'Exclusive Voyage',
      tripDays: journey?.daysCount || 7,
      tripTravelers: journey?.travelers || 4,
      tripImage: journey?.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
      invitedBy: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      invitedEmailOrUser,
      role,
      token,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    };

    const invitations = read<TripInvitation[]>(INVITATIONS_KEY, []);
    write(INVITATIONS_KEY, [invitation, ...invitations]);

    // If matched demo user, also immediately create a notification for them
    travelStorage.addNotification({
      id: crypto.randomUUID(),
      title: 'Invitation to Collaborate',
      message: `${currentUser.name} invited you to collaborate as an ${role} on "${journey?.destination || 'Journey'}".`,
      type: 'invite',
      tripId,
      tripTitle: journey?.title || journey?.destination,
      inviteToken: token,
      createdAt: new Date().toISOString(),
      read: false,
    });

    // Log trip activity
    if (journey) {
      travelStorage.updateJourney(tripId, (j) => ({
        ...j,
        activities: [
          {
            id: crypto.randomUUID(),
            tripId,
            userId: currentUser.id,
            userName: currentUser.name,
            userInitials: currentUser.initials,
            userAvatar: currentUser.avatar,
            action: `invited ${matchedPersona?.name || invitedEmailOrUser} (${role})`,
            timestamp: new Date().toISOString(),
            relativeTime: 'Just now',
          },
          ...(j.activities || []),
        ],
      }));
    }

    return invitation;
  },

  getInvitationByToken: (token: string): TripInvitation | undefined => {
    const invitations = read<TripInvitation[]>(INVITATIONS_KEY, []);
    return invitations.find((inv) => inv.token === token);
  },

  acceptInvitation: (token: string, acceptingUser: UserProfile): StoredJourney | null => {
    const invitations = read<TripInvitation[]>(INVITATIONS_KEY, []);
    const invitation = invitations.find((inv) => inv.token === token);
    if (!invitation) return null;

    const journey = travelStorage.getJourneyById(invitation.tripId);
    if (!journey) return null;

    const newCollaborator: Collaborator = {
      userId: acceptingUser.id,
      name: acceptingUser.name,
      email: acceptingUser.email,
      role: invitation.role,
      avatar: acceptingUser.avatar,
      initials: acceptingUser.initials,
      isOnline: true,
      joinedAt: new Date().toISOString(),
    };

    travelStorage.addCollaborator(journey.id, newCollaborator);

    // Update invitation status
    write(
      INVITATIONS_KEY,
      invitations.map((inv) => (inv.token === token ? { ...inv, status: 'accepted' as const } : inv))
    );

    return travelStorage.getJourneyById(journey.id) || journey;
  },

  // Activity logging
  logActivity: (tripId: string, action: string) => {
    const currentUser = travelStorage.getCurrentUser();
    const activity: TripActivity = {
      id: crypto.randomUUID(),
      tripId,
      userId: currentUser.id,
      userName: currentUser.name,
      userInitials: currentUser.initials,
      userAvatar: currentUser.avatar,
      action,
      timestamp: new Date().toISOString(),
      relativeTime: 'Just now',
    };

    travelStorage.updateJourney(tripId, (j) => ({
      ...j,
      activities: [activity, ...(j.activities || [])],
    }));
  },

  // Notifications
  getNotifications: (): StoredNotification[] => {
    return read<StoredNotification[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
  },
  addNotification: (notification: StoredNotification) => {
    const notifications = travelStorage.getNotifications();
    write(NOTIFICATIONS_KEY, [notification, ...notifications]);
  },
  markNotificationRead: (id: string) => {
    const notifications = travelStorage.getNotifications();
    write(
      NOTIFICATIONS_KEY,
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  },
  markAllNotificationsRead: () => {
    const notifications = travelStorage.getNotifications();
    write(
      NOTIFICATIONS_KEY,
      notifications.map((n) => ({ ...n, read: true }))
    );
  },
};

export const parseBudget = (value: string | number) => {
  if (typeof value === 'number') return value;
  const parsed = Number(value.replace(/[^0-9]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};
