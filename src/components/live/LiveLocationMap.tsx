import { useState } from 'react';
import { MapPin, Navigation, ShieldCheck, Check } from 'lucide-react';

interface Waypoint {
  id: string;
  name: string;
  category: string;
  time: string;
  status: 'completed' | 'current' | 'upcoming';
  distance: string;
  eta: string;
  xPercent: number;
  yPercent: number;
}

const TODAY_WAYPOINTS: Waypoint[] = [
  {
    id: '1',
    name: 'Heritage Villa (Hotel)',
    category: 'Stay',
    time: '08:30',
    status: 'completed',
    distance: '2.1 km away',
    eta: 'Origin',
    xPercent: 24,
    yPercent: 70,
  },
  {
    id: '2',
    name: 'Baga Beach Catamaran',
    category: 'Activity',
    time: '10:30',
    status: 'completed',
    distance: '3.8 km away',
    eta: '12 min',
    xPercent: 38,
    yPercent: 46,
  },
  {
    id: '3',
    name: 'Fisherman’s Wharf (Lunch)',
    category: 'Dining',
    time: '13:00',
    status: 'completed',
    distance: '0.8 km away',
    eta: '3 min',
    xPercent: 50,
    yPercent: 62,
  },
  {
    id: '4',
    name: 'Fort Aguada Bastion',
    category: 'Heritage',
    time: '15:30',
    status: 'current',
    distance: '4.2 km away',
    eta: '14 min',
    xPercent: 68,
    yPercent: 38,
  },
  {
    id: '5',
    name: 'Anjuna Sunset Point',
    category: 'Leisure',
    time: '18:30',
    status: 'upcoming',
    distance: '7.8 km away',
    eta: '22 min',
    xPercent: 82,
    yPercent: 25,
  },
];

interface LiveLocationMapProps {
  onSelectDestination?: (name: string) => void;
}

export const LiveLocationMap = ({ onSelectDestination }: LiveLocationMapProps) => {
  const [showPermissionDialog, setShowPermissionDialog] = useState<boolean>(false);
  const [activeWaypoint, setActiveWaypoint] = useState<Waypoint>(TODAY_WAYPOINTS[3]); // Fort Aguada
  const [userLocationName, setUserLocationName] = useState<string>('Panaji Promenade, Goa');

  const handleGrantPermission = () => {
    setShowPermissionDialog(false);
  };

  const handleManualLocation = () => {
    const loc = prompt('Enter your current city or neighborhood:', 'Panaji, Goa');
    if (loc) {
      setUserLocationName(loc);
      setShowPermissionDialog(false);
    }
  };

  return (
    <section id="live-map" className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#6F6F6F] block mb-1">
            SPATIAL TRACKING
          </span>
          <h2 className="font-instrument text-3xl sm:text-4xl md:text-5xl text-[#000000] tracking-headline leading-none">
            Live Location & Today’s Waypoints
          </h2>
          <p className="text-xs sm:text-sm text-[#6F6F6F] font-inter mt-2">
            Real-time tracking of your current location and scheduled itinerary nodes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPermissionDialog(true)}
            className="flex items-center gap-1.5 text-xs text-[#6F6F6F] hover:text-[#000000] bg-white border border-[#E7E5E2] px-3.5 py-1.5 rounded-full transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Location Settings</span>
          </button>
        </div>
      </div>

      {/* Permission Request Modal Overlay if toggled */}
      {showPermissionDialog && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E5E2] rounded-3xl p-8 max-w-md w-full shadow-2xl text-center animate-fade-rise">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-[#000000]">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-instrument text-3xl text-[#000000] mb-2">Use Your Location</h3>
            <p className="text-xs sm:text-sm text-[#6F6F6F] font-inter leading-relaxed mb-6">
              Let Aethera show what’s nearby, estimate live travel times, and help you navigate your
              journey with zero guesswork.
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGrantPermission}
                className="w-full rounded-full py-3.5 bg-[#000000] text-white text-xs font-medium hover:bg-neutral-800 transition-all hover:scale-[1.02] cursor-pointer"
              >
                Allow Location Access
              </button>
              <button
                type="button"
                onClick={handleManualLocation}
                className="w-full rounded-full py-3 bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-[#000000] transition-colors cursor-pointer"
              >
                Enter Location Manually
              </button>
            </div>
            <span className="block text-[11px] text-neutral-400 font-inter mt-4">
              Only used actively while traveling. You can revoke this anytime.
            </span>
          </div>
        </div>
      )}

      {/* Large Minimal Map Canvas */}
      <div className="relative bg-[#FAF8F5] border border-[#E7E5E2] rounded-[32px] overflow-hidden p-6 sm:p-10 shadow-sm min-h-[480px] sm:min-h-[540px] flex flex-col justify-between">
        {/* Subtle Map Grid Backdrop */}
        <div
          className="absolute inset-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#000000 0.8px, transparent 0.8px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Top Floating Map Controls */}
        <div className="relative z-20 flex items-center justify-between gap-4">
          {/* User Current Location Indicator */}
          <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-[#E7E5E2] shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono text-xs text-[#000000] font-semibold">
              YOU ARE HERE:
            </span>
            <span className="font-inter text-xs text-[#6F6F6F]">{userLocationName}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase bg-white/80 px-3 py-1.5 rounded-full text-[#6F6F6F] border border-[#E7E5E2]">
              Route Progress: 3 of 5 Done
            </span>
          </div>
        </div>

        {/* Central Map Path & Nodes SVG */}
        <div className="relative w-full h-[280px] sm:h-[340px] my-4 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full text-neutral-300 pointer-events-none"
            viewBox="0 0 800 400"
            fill="none"
          >
            {/* Subtle shoreline / coastal curve */}
            <path
              d="M 120 380 Q 200 280 320 230 T 560 140 T 740 60"
              stroke="#E7E5E2"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Active route connecting the 5 stops */}
            <path
              d="M 192 280 L 304 184 L 400 248 L 544 152 L 656 100"
              stroke="#000000"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
            {/* User Pulse Circle */}
            <circle cx="430" cy="230" r="16" fill="rgba(16, 185, 129, 0.15)" />
            <circle cx="430" cy="230" r="6" fill="#10B981" />
          </svg>

          {/* User Location Marker */}
          <div
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-default"
            style={{ left: '54%', top: '58%' }}
          >
            <div className="flex flex-col items-center">
              <div className="px-2.5 py-1 rounded-full bg-[#000000] text-white text-[10px] font-mono tracking-wider shadow-lg mb-1 whitespace-nowrap flex items-center gap-1">
                <Navigation className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
                <span>CURRENT POSITION</span>
              </div>
            </div>
          </div>

          {/* Waypoint Markers */}
          {TODAY_WAYPOINTS.map((wp) => {
            const isSelected = activeWaypoint.id === wp.id;
            return (
              <div
                key={wp.id}
                style={{ left: `${wp.xPercent}%`, top: `${wp.yPercent}%` }}
                onClick={() => {
                  setActiveWaypoint(wp);
                  if (onSelectDestination) onSelectDestination(wp.name);
                }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#000000] text-white scale-125 shadow-xl ring-4 ring-black/10'
                      : wp.status === 'completed'
                      ? 'bg-neutral-200 text-neutral-600 border border-neutral-300'
                      : 'bg-white text-[#000000] border border-[#E7E5E2] hover:border-black hover:scale-110'
                  }`}
                >
                  {wp.status === 'completed' ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5" />
                  )}
                </div>

                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-[#000000] text-white font-medium shadow-sm'
                      : 'bg-white/90 text-[#6F6F6F] group-hover:text-black border border-[#E7E5E2]'
                  }`}
                >
                  {wp.time} · {wp.name.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Waypoint Dossier Card */}
        <div className="relative z-20 bg-white/95 backdrop-blur-md border border-[#E7E5E2] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#6F6F6F] mb-1">
              <span>{activeWaypoint.time} SCHEDULED STOP</span>
              <span>•</span>
              <span className="text-[#000000] font-semibold">{activeWaypoint.category}</span>
            </div>
            <h4 className="font-instrument text-2xl sm:text-3xl text-[#000000] leading-none">
              {activeWaypoint.name}
            </h4>
            <p className="text-xs text-[#6F6F6F] font-inter mt-1">
              {activeWaypoint.distance} · Estimated travel time {activeWaypoint.eta}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (onSelectDestination) onSelectDestination(activeWaypoint.name);
              }}
              className="flex items-center gap-1.5 rounded-full px-6 py-2.5 bg-[#000000] text-white text-xs font-medium hover:bg-neutral-800 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
