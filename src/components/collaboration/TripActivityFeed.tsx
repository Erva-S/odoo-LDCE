import { TripActivity } from '../../types/collaboration';
import { Activity } from 'lucide-react';

interface TripActivityFeedProps {
  activities: TripActivity[];
  limit?: number;
}

export const TripActivityFeed = ({ activities, limit = 5 }: TripActivityFeedProps) => {
  const displayActivities = limit ? activities.slice(0, limit) : activities;

  if (activities.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-[#6F6F6F] font-inter">
        No recent activity logged yet. Contributions will appear here in real-time.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[#E7E5E2]">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6F6F6F] flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" /> Recent Activity
        </span>
        <span className="text-[11px] font-mono text-neutral-400">Live feed</span>
      </div>

      <div className="space-y-3">
        {displayActivities.map((act) => (
          <div
            key={act.id}
            className="flex items-start gap-3 py-1 text-xs font-inter text-neutral-700 group"
          >
            {/* Small avatar */}
            {act.userAvatar ? (
              <img
                src={act.userAvatar}
                alt={act.userName}
                className="w-6 h-6 rounded-full object-cover border border-[#E7E5E2] shrink-0 mt-0.5"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[9px] font-serif shrink-0 mt-0.5">
                {act.userInitials || act.userName.slice(0, 2).toUpperCase()}
              </div>
            )}

            {/* Activity line */}
            <div className="flex-1 min-w-0 leading-relaxed">
              <span className="font-medium text-black mr-1">{act.userName}</span>
              <span className="text-[#6F6F6F]">{act.action}</span>
            </div>

            {/* Timestamp */}
            <span className="text-[11px] font-mono text-neutral-400 shrink-0 whitespace-nowrap">
              {act.relativeTime || 'Recently'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
