import { useState } from 'react';
import { Sparkles, X, Send, Navigation, Car, Stethoscope, Pill } from 'lucide-react';

interface LiveTravelCompanionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onRequestRide: (destination: string) => void;
  onOpenCategory: (category: 'hospitals' | 'pharmacies' | 'unwell') => void;
}

interface CompanionMessage {
  sender: 'user' | 'ai';
  text: string;
  actions?: {
    label: string;
    action: () => void;
    icon?: typeof Navigation;
  }[];
}

const QUICK_ACTIONS = [
  "What's near me?",
  "I'm not feeling well",
  "Get me to my hotel",
  "Plan the rest of today",
  "Find a pharmacy",
  "Get a ride",
];

export const LiveTravelCompanionDrawer = ({
  isOpen,
  onClose,
  onOpen,
  onRequestRide,
  onOpenCategory,
}: LiveTravelCompanionDrawerProps) => {
  const [messages, setMessages] = useState<CompanionMessage[]>([
    {
      sender: 'ai',
      text: 'Good afternoon, Aravind. You are in Panaji on Day 4. Your next stop is Fort Aguada at 15:30 (4.2 km away). How can I assist you right now?',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const updatedMsgs: CompanionMessage[] = [...messages, { sender: 'user', text }];
    setMessages(updatedMsgs);
    setInputText('');

    setTimeout(() => {
      let aiResponse: CompanionMessage;
      const lower = text.toLowerCase();

      if (lower.includes('near') || lower.includes('what') || lower.includes('around')) {
        aiResponse = {
          sender: 'ai',
          text: 'You are near the Mandovi promenade in Panaji. Within 2.5 km, I found:\n• 3 Hospitals (CityCare is nearest at 1.8 km)\n• 7 Pharmacies (Apollo 24/7 is 600m away)\n• 14 Curated dining spots (Viva Panjim is 400m)\n• 2 ATMs within 500m.',
          actions: [
            {
              label: 'View Hospitals',
              action: () => onOpenCategory('hospitals'),
              icon: Stethoscope,
            },
            {
              label: 'Find 24/7 Pharmacy',
              action: () => onOpenCategory('pharmacies'),
              icon: Pill,
            },
          ],
        };
      } else if (lower.includes('unwell') || lower.includes('sick') || lower.includes('health') || lower.includes('doctor')) {
        aiResponse = {
          sender: 'ai',
          text: 'I am sorry you are feeling unwell. I have located CityCare Hospital 1.8 km away (approx. 7 min by car) with 24/7 Emergency Care, and Apollo Pharmacy 600m away.',
          actions: [
            {
              label: 'Hospital Details & Directions',
              action: () => onOpenCategory('hospitals'),
              icon: Stethoscope,
            },
            {
              label: 'Book Ride to Hospital (₹180)',
              action: () => onRequestRide('CityCare Hospital, Panaji'),
              icon: Car,
            },
          ],
        };
      } else if (lower.includes('hotel') || lower.includes('stay')) {
        aiResponse = {
          sender: 'ai',
          text: 'Your stay at Heritage Villa Panaji is 2.1 km away. Estimated ride time is 8 minutes via Dayanand Bandodkar Marg.',
          actions: [
            {
              label: 'Request Ride to Hotel',
              action: () => onRequestRide('Heritage Villa Hotel, Panaji'),
              icon: Car,
            },
          ],
        };
      } else if (lower.includes('ride') || lower.includes('cab') || lower.includes('taxi')) {
        aiResponse = {
          sender: 'ai',
          text: 'Ride options around Panaji are operating with an average pickup time of 3–5 minutes. Where would you like to travel?',
          actions: [
            {
              label: 'Ride to Fort Aguada (Next Stop)',
              action: () => onRequestRide('Fort Aguada, Candolim'),
              icon: Car,
            },
            {
              label: 'Ride to Hotel (2.1 km)',
              action: () => onRequestRide('Heritage Villa Panaji'),
              icon: Car,
            },
          ],
        };
      } else if (lower.includes('pharmacy')) {
        aiResponse = {
          sender: 'ai',
          text: 'Apollo Pharmacy on MG Road is 600m away and open 24/7 with English-speaking pharmacists.',
          actions: [
            {
              label: 'View Pharmacy Dossier',
              action: () => onOpenCategory('pharmacies'),
              icon: Pill,
            },
          ],
        };
      } else {
        aiResponse = {
          sender: 'ai',
          text: `Understood for "${text}". I have cross-referenced with your Goa day 4 itinerary, local weather (28°C), and group location of your 3 companions.`,
          actions: [
            {
              label: 'Navigate to Fort Aguada',
              action: () => onRequestRide('Fort Aguada'),
              icon: Navigation,
            },
          ],
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
    }, 850);
  };

  return (
    <>
      {/* Floating Travel Companion Trigger */}
      {!isOpen && (
        <button
          type="button"
          onClick={onOpen}
          className="fixed bottom-7 right-7 z-50 flex items-center gap-2.5 rounded-full pl-4 pr-5 py-3.5 bg-[#000000] text-white shadow-2xl hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 ai-pulse-button cursor-pointer"
          aria-label="Open Live Travel Companion"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="font-medium text-xs sm:text-sm font-sans tracking-wide">
            ✦ Travel Companion
          </span>
        </button>
      )}

      {/* Floating Conversational Modal */}
      {isOpen && (
        <div className="fixed bottom-7 right-4 sm:right-7 z-50 w-[calc(100vw-32px)] sm:w-[440px] max-h-[620px] h-[85vh] bg-white border border-[#E7E5E2] rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-fade-rise">
          {/* Header */}
          <div className="p-5 border-b border-[#E7E5E2] bg-[#FAF8F5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#000000] text-white flex items-center justify-center text-xs">
                ✦
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-instrument text-2xl text-[#000000] leading-none">
                    Aethera Travel Companion
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[11px] text-[#6F6F6F] font-inter mt-0.5">
                  Goa · Day 4 · Panaji Active Zone
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#6F6F6F] hover:text-[#000000] hover:bg-neutral-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2.5 bg-white border-b border-neutral-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_ACTIONS.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(action)}
                className="text-[11px] text-[#6F6F6F] hover:text-[#000000] bg-neutral-100 hover:bg-neutral-200 px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Chat Transcript */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 font-inter text-xs sm:text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-[#000000] text-white rounded-br-none'
                      : 'bg-[#FAF8F5] border border-[#E7E5E2] text-[#000000] rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>

                {/* Optional Action Buttons */}
                {m.actions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.actions.map((act, actIdx) => {
                      const Icon = act.icon || Navigation;
                      return (
                        <button
                          key={actIdx}
                          type="button"
                          onClick={act.action}
                          className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-medium transition-all hover:scale-[1.02] cursor-pointer"
                        >
                          <Icon className="w-3 h-3" />
                          <span>{act.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#FAF8F5] border-t border-[#E7E5E2] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about your live journey..."
              className="flex-1 bg-white border border-[#E7E5E2] rounded-full px-4 py-2.5 text-xs sm:text-sm text-[#000000] placeholder:text-neutral-400 focus:outline-none focus:border-black"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-[#000000] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
