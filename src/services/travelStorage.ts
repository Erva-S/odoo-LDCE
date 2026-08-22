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

const write = <T,>(key: string, value: T) => {
  window.localStorage.setItem(key, JSON.stringify(value));
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
    // Check if journey already exists (for editing)
    const existsIndex = journeys.findIndex(j => j.id === journey.id);
    if (existsIndex > -1) {
      journeys[existsIndex] = journey;
      write(JOURNEYS_KEY, journeys);
    } else {
      write(JOURNEYS_KEY, [journey, ...journeys]);
    }
  },
  getNotifications: (): StoredNotification[] => read<StoredNotification[]>(NOTIFICATIONS_KEY, []),
  addNotification: (notification: StoredNotification) => {
    const notifications = travelStorage.getNotifications();
    write(NOTIFICATIONS_KEY, [notification, ...notifications]);
  },
};

export const parseBudget = (value: string) => {
  const parsed = Number(value.replace(/[^0-9]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};
