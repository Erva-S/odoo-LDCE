import {
  Collaborator,
  CollaboratorRole,
  DEMO_USERS,
  StoredJourney,
  StoredNotification,
  TripActivity,
  TripInvitation,
  UserProfile,
} from '../types/collaboration';

export * from '../types/collaboration';

const JOURNEYS_KEY = 'aethera.journeys.v2';
const NOTIFICATIONS_KEY = 'aethera.notifications.v2';
const INVITATIONS_KEY = 'aethera.invitations.v2';
const CURRENT_USER_KEY = 'aethera.current_user.v2';

const INITIAL_JOURNEYS: StoredJourney[] = [
  {
    id: 'trip-goa-1',
    destination: 'GOA · MUMBAI · DELHI',
    title: 'Goa Coastal & Capital Circuit',
    dates: '12 JUN — 21 JUN 2026',
    daysCount: 10,
    citiesCount: 3,
    travelers: 4,
    budget: 60000,
    style: 'Coastal & Heritage',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600&auto=format&fit=crop',
    tagline: 'Coastal Portuguese architecture & sunset tides',
    status: 'Upcoming',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    ownerId: 'user_aravind',
    ownerName: 'Aravind S.',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    collaborators: [
      {
        userId: 'user_aravind',
        name: 'Aravind S.',
        email: 'aravind@aethera.travel',
        role: 'Owner',
        initials: 'AS',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        isOnline: true,
        joinedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
      {
        userId: 'user_naitri',
        name: 'Naitri',
        email: 'naitri@aethera.travel',
        role: 'Editor',
        initials: 'N',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
        isOnline: true,
        joinedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        userId: 'user_shubham',
        name: 'Shubham',
        email: 'shubham@aethera.travel',
        role: 'Viewer',
        initials: 'S',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        isOnline: false,
        joinedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        userId: 'user_meera',
        name: 'Meera K.',
        email: 'meera@aethera.travel',
        role: 'Editor',
        initials: 'MK',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
        isOnline: true,
        joinedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ],
    itinerary: {
      '14 JUN': [
        {
          id: 'ev-1',
          time: '09:00',
          title: 'Breakfast & Traditional Pastries',
          location: 'Confeitaria 31 de Janeiro, Fontainhas',
          category: 'Dining',
          completed: true,
          notes: 'Try warm Bebinca and artisanal pour-over coffee.',
          addedBy: 'Aravind S.',
        },
        {
          id: 'ev-2',
          time: '10:30',
          title: 'Baga Beach Coastal Walk & Catamaran',
          location: 'North Baga Shoreline',
          category: 'Activity',
          completed: false,
          notes: 'Charter skipper confirmed at Jetty 4.',
          addedBy: 'Naitri',
          updatedAt: '2 min ago',
        },
        {
          id: 'ev-3',
          time: '13:00',
          title: 'Coastal Seafood Lunch',
          location: "Fisherman's Wharf, Sal River",
          category: 'Dining',
          completed: false,
          notes: 'Reserved outdoor table with waterfront view.',
          addedBy: 'Meera K.',
        },
        {
          id: 'ev-4',
          time: '15:30',
          title: 'Fort Aguada & 17th-Century Lighthouse',
          location: 'Sinquerim Promontory',
          category: 'Heritage',
          completed: false,
          notes: 'Architectural walk through the Portuguese bastion.',
          addedBy: 'Shubham',
        },
        {
          id: 'ev-5',
          time: '18:30',
          title: 'Anjuna Sunset & Ambient Sounds',
          location: 'Curlys Cliff / Sunset Point',
          category: 'Leisure',
          completed: false,
          notes: 'Tide optimal for photography.',
          addedBy: 'Aravind S.',
        },
      ],
    },
    activities: [
      {
        id: 'act-1',
        tripId: 'trip-goa-1',
        userId: 'user_naitri',
        userName: 'Naitri',
        userInitials: 'N',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
        action: 'added "Baga Beach Coastal Walk"',
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        relativeTime: '2 min ago',
      },
      {
        id: 'act-2',
        tripId: 'trip-goa-1',
        userId: 'user_shubham',
        userName: 'Shubham',
        userInitials: 'S',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        action: 'updated Day 3 itinerary notes for Fort Aguada',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        relativeTime: '15 min ago',
      },
      {
        id: 'act-3',
        tripId: 'trip-goa-1',
        userId: 'user_aravind',
        userName: 'Aravind S.',
        userInitials: 'AS',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        action: 'confirmed the trip dates (12 JUN — 21 JUN)',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        relativeTime: '1 hour ago',
      },
      {
        id: 'act-4',
        tripId: 'trip-goa-1',
        userId: 'user_meera',
        userName: 'Meera K.',
        userInitials: 'MK',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
        action: 'joined as an Editor',
        timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
        relativeTime: '1 day ago',
      },
    ],
  },
  {
    id: 'trip-rajasthan-2',
    destination: 'RAJASTHAN',
    title: 'Rajasthan Royal Adventure',
    dates: '02 AUG — 11 AUG 2026',
    daysCount: 7,
    citiesCount: 5,
    travelers: 3,
    budget: 85000,
    style: 'Architectural & Art',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop',
    tagline: 'Fortresses, royal havelis & desert starscapes',
    status: 'Planning',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    ownerId: 'user_meera',
    ownerName: 'Meera K.',
    ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    collaborators: [
      {
        userId: 'user_meera',
        name: 'Meera K.',
        email: 'meera@aethera.travel',
        role: 'Owner',
        initials: 'MK',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
        isOnline: true,
        joinedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        userId: 'user_aravind',
        name: 'Aravind S.',
        email: 'aravind@aethera.travel',
        role: 'Editor',
        initials: 'AS',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        isOnline: true,
        joinedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        userId: 'user_shubham',
        name: 'Shubham',
        email: 'shubham@aethera.travel',
        role: 'Viewer',
        initials: 'S',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        isOnline: false,
        joinedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ],
    itinerary: {},
    activities: [
      {
        id: 'act-r1',
        tripId: 'trip-rajasthan-2',
        userId: 'user_aravind',
        userName: 'Aravind S.',
        userInitials: 'AS',
        action: 'added "Mehrangarh Fort Sunrise Tour"',
        timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
        relativeTime: '40 min ago',
      },
    ],
  },
  {
    id: 'trip-kerala-3',
    destination: 'KERALA',
    title: 'Kerala Backwater Sanctuary',
    dates: '18 SEP — 25 SEP 2026',
    daysCount: 5,
    citiesCount: 4,
    travelers: 2,
    budget: 45000,
    style: 'Slow Mountain Sanctuary',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop',
    tagline: 'Backwater houseboats & misted tea hills',
    status: 'Planning',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    ownerId: 'user_aravind',
    ownerName: 'Aravind S.',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    collaborators: [
      {
        userId: 'user_aravind',
        name: 'Aravind S.',
        email: 'aravind@aethera.travel',
        role: 'Owner',
        initials: 'AS',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        isOnline: true,
        joinedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      },
    ],
    itinerary: {},
    activities: [],
  },
  {
    id: 'trip-ladakh-4',
    destination: 'LADAKH',
    title: 'Ladakh High-Altitude Sanctuary',
    dates: '05 OCT — 14 OCT 2026',
    daysCount: 8,
    citiesCount: 2,
    travelers: 2,
    budget: 70000,
    style: 'Slow Mountain Sanctuary',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=800&auto=format&fit=crop',
    tagline: 'High-altitude monasteries & glacial valleys',
    status: 'Planning',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    ownerId: 'user_naitri',
    ownerName: 'Naitri',
    ownerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    collaborators: [
      {
        userId: 'user_naitri',
        name: 'Naitri',
        email: 'naitri@aethera.travel',
        role: 'Owner',
        initials: 'N',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
        isOnline: true,
        joinedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
      {
        userId: 'user_aravind',
        name: 'Aravind S.',
        email: 'aravind@aethera.travel',
        role: 'Viewer',
        initials: 'AS',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        isOnline: true,
        joinedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      },
    ],
    itinerary: {},
    activities: [],
  },
];

const INITIAL_NOTIFICATIONS: StoredNotification[] = [
  {
    id: 'notif-1',
    title: 'New Activity on Goa Getaway',
    message: 'Naitri added "Baga Beach Coastal Walk" to Day 3 itinerary.',
    type: 'activity',
    tripId: 'trip-goa-1',
    tripTitle: 'Goa Coastal & Capital Circuit',
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Trip Invitation Accepted',
    message: 'Meera K. accepted your invitation to collaborate on Goa Coastal & Capital Circuit.',
    type: 'invite',
    tripId: 'trip-goa-1',
    tripTitle: 'Goa Coastal & Capital Circuit',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Collaborative Invitation',
    message: 'Meera K. invited you to collaborate on "Rajasthan Royal Adventure".',
    type: 'invite',
    tripId: 'trip-rajasthan-2',
    tripTitle: 'Rajasthan Royal Adventure',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    read: true,
  },
];

const read = <T>(key: string, fallback: T): T => {
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

export const travelStorage = {
  // Current user persona management
  getCurrentUser: (): UserProfile => {
    return read<UserProfile>(CURRENT_USER_KEY, DEMO_USERS[0]);
  },
  setCurrentUser: (user: UserProfile) => {
    write(CURRENT_USER_KEY, user);
  },

  // Journeys
  getJourneys: (): StoredJourney[] => {
    return read<StoredJourney[]>(JOURNEYS_KEY, INITIAL_JOURNEYS);
  },
  getJourneyById: (id: string): StoredJourney | undefined => {
    const journeys = travelStorage.getJourneys();
    return journeys.find((j) => j.id === id);
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
