import { useState } from 'react';
import { ArrowRight, MapPin, CheckCircle, Plus } from 'lucide-react';
import { AddItineraryStopModal } from './AddItineraryStopModal';

interface ItineraryEvent {
  time: string;
  title: string;
  location: string;
  category: string;
  completed?: boolean;
  notes?: string;
  addedBy?: string;
  updatedAt?: string;
}

interface UpcomingItineraryProps {
  onOpenJourney?: (id: string) => void;
}

const ITINERARY_EVENTS: ItineraryEvent[] = [
  {
    time: '09:00',
    title: 'Breakfast & Traditional Pastries',
    location: 'Confeitaria 31 de Janeiro, Fontainhas',
    category: 'Dining',
    completed: true,
    notes: 'Try warm Bebinca and artisanal pour-over coffee.',
    addedBy: 'Aravind S.',
  },
  {
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
    time: '13:00',
    title: 'Coastal Seafood Lunch',
    location: "Fisherman's Wharf, Sal River",
    category: 'Dining',
    completed: false,
    notes: 'Reserved outdoor table with waterfront view.',
    addedBy: 'Meera K.',
  },
  {
    time: '15:30',
    title: 'Fort Aguada & 17th-Century Lighthouse',
    location: 'Sinquerim Promontory',
    category: 'Heritage',
    completed: false,
    notes: 'Architectural walk through the Portuguese bastion.',
    addedBy: 'Shubham',
  },
  {
    time: '18:30',
    title: 'Anjuna Sunset & Ambient Sounds',
    location: 'Curlys Cliff / Sunset Point',
    category: 'Leisure',
    completed: false,
    notes: 'Tide optimal for photography.',
    addedBy: 'Aravind S.',
  },
];

export const UpcomingItinerary = ({ onOpenJourney }: UpcomingItineraryProps) => {
  const [selectedDay, setSelectedDay] = useState('14 JUN');
  const [events, setEvents] = useState(ITINERARY_EVENTS);
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);

  const toggleEvent = (index: number) => {
    if (!canEdit) {
      if (onShowToast) onShowToast('You have Viewer access (Read-Only).', 'info');
      return;
    }
    const updated = [...events];
    updated[index].completed = !updated[index].completed;
    setEvents(updated);
    if (onShowToast) {
      onShowToast(
        `${updated[index].completed ? 'Marked as completed' : 'Marked as pending'}: ${updated[index].title}`,
        'success'
      );
    }
  };

  const handleAddQuickMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const newEv: ItineraryEvent = {
      time: quickTime,
      title: quickTitle.trim(),
      location: quickLocation.trim() || 'Goa Coastal Area',
      category: quickCategory,
      completed: false,
      addedBy: currentUser?.name || 'You',
      updatedAt: 'Just now',
    };

    setEvents((prev) => [...prev, newEv].sort((a, b) => a.time.localeCompare(b.time)));
    setQuickTitle('');
    setQuickLocation('');
    setShowAddQuick(false);
    if (onShowToast) {
      onShowToast(`Added "${newEv.title}" to ${selectedDay}!`, 'success');
    }
  };

  const handleAddStop = (newEvent: { time: string; title: string; location: string; category: string; notes?: string }) => {
    setEvents([...events, { ...newEvent, completed: false }]);
  };

  return (
    <section id="itinerary" className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-[#E7E5E2]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Heading & Date Picker */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest font-mono text-[#6F6F6F]">
                DAY-BY-DAY TIMELINE
              </span>
              <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 rounded-full text-neutral-800">
                Live Shared Schedule
              </span>
            </div>
            <h2 className="font-instrument text-4xl sm:text-5xl md:text-6xl text-[#000000] tracking-headline leading-none">
              What's next
            </h2>
            <p className="font-inter text-sm sm:text-base text-[#6F6F6F] mt-4 leading-relaxed max-w-md">
              A chronological flow of your day. Co-created with your fellow travelers for unhurried
              exploration.
            </p>

            {/* Date Segment Selector */}
            <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2">
              {['12 JUN', '13 JUN', '14 JUN', '15 JUN', '16 JUN'].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    selectedDay === day
                      ? 'bg-[#000000] text-white shadow-xs'
                      : 'bg-neutral-100 text-[#6F6F6F] hover:text-[#000000]'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Day Overview Badge */}
            <div className="mt-8 p-6 bg-[#FAF8F5] border border-[#E7E5E2] rounded-2xl">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#6F6F6F]">
                <span>Day 3 of 10</span>
                <span>{events.length} stops scheduled</span>
              </div>
              <h3 className="font-instrument text-3xl text-[#000000] mt-1">Goa · Coastal Heritage</h3>
              <p className="text-xs text-[#6F6F6F] mt-2 font-inter">
                {events.length} scheduled moments · 2 dining reservations · Estimated travel time 1 hr 20 min
              </p>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => onOpenJourney && onOpenJourney('1')}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#000000] hover:text-[#6F6F6F] transition-colors group cursor-pointer"
            >
              <span>Open full collaborative workspace</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Right Column: Clean Editorial Vertical Timeline */}
        <div className="lg:col-span-7">
          <div className="relative pl-6 sm:pl-8 border-l border-[#E7E5E2] space-y-8">
            {events.map((event, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node dot */}
                <button
                  onClick={() => toggleEvent(idx)}
                  disabled={!canEdit}
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                    event.completed
                      ? 'bg-[#000000] border-[#000000] text-white'
                      : canEdit
                      ? 'bg-white border-neutral-400 group-hover:border-black cursor-pointer'
                      : 'bg-neutral-100 border-neutral-300 cursor-default'
                  }`}
                  title={canEdit ? 'Click to toggle completed status' : 'Read-only'}
                >
                  {event.completed && <CheckCircle className="w-3.5 h-3.5" />}
                </button>

                {/* Event Header: Time, Category, and Attribution */}
                <div className="flex items-center justify-between gap-4 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold tracking-wider text-[#000000]">
                      {event.time}
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-[11px] font-mono uppercase text-[#6F6F6F] bg-neutral-100 px-2 py-0.5 rounded">
                      {event.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {event.addedBy && (
                      <span className="text-[10px] font-mono text-neutral-400">
                        Added by {event.addedBy} {event.updatedAt && `• ${event.updatedAt}`}
                      </span>
                    )}
                    {event.completed && (
                      <span className="text-[11px] text-emerald-700 font-mono">Done</span>
                    )}
                  </div>
                </div>

                {/* Event Details */}
                <h4
                  className={`font-instrument text-2xl text-[#000000] transition-opacity ${
                    event.completed ? 'opacity-50 line-through' : ''
                  }`}
                >
                  {event.title}
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-[#6F6F6F] mt-1 font-inter">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
                  <span>{event.location}</span>
                </div>

                {event.notes && (
                  <p className="text-xs text-[#6F6F6F] mt-2 italic font-inter pl-3 border-l border-neutral-200">
                    "{event.notes}"
                  </p>
                )}
              </div>
            ))}

            {/* Quick Add Moment */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsAddStopOpen(true)}
                className="flex items-center gap-2 text-xs font-medium text-[#6F6F6F] hover:text-[#000000] px-3 py-2 rounded-full border border-dashed border-[#E7E5E2] hover:border-black transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add custom stop to {selectedDay}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Stop Modal */}
      <AddItineraryStopModal
        isOpen={isAddStopOpen}
        onClose={() => setIsAddStopOpen(false)}
        dayLabel={selectedDay}
        onAddEvent={handleAddStop}
      />
    </section>
  );
};
