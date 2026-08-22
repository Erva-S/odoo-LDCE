export interface StoredJourney {
  id: string;
  destination: string;
  budget: number;
  travelers: number;
  style: string;
  createdAt: string;
  status: 'Planning' | 'Upcoming' | 'Completed';
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

export const travelStorage = {
  getJourneys: (): StoredJourney[] => read<StoredJourney[]>(JOURNEYS_KEY, []),
  saveJourney: (journey: StoredJourney) => {
    const journeys = travelStorage.getJourneys();
    write(JOURNEYS_KEY, [journey, ...journeys]);
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
