import { useMemo, useState } from 'react';
import { Sparkles, TrendingDown } from 'lucide-react';

export const TravelBudget = () => {
  const [showOptimization, setShowOptimization] = useState(false);
  const [totalBudget, setTotalBudget] = useState(60000);
  const [travelers, setTravelers] = useState(4);
  const [duration, setDuration] = useState(10);
  const [accommodation, setAccommodation] = useState(1);
  const [food, setFood] = useState(1);
  const [transport, setTransport] = useState(1);
  const [activities, setActivities] = useState(1);
  const expenses = useMemo(() => {
    const multiplier = Math.max(1, travelers / 4) * Math.max(1, duration / 10);
    return [
      { name: 'Hotels & Villas', amount: Math.round(21000 * multiplier * accommodation), note: 'Accommodation level and trip duration' },
      { name: 'Transport & Rail', amount: Math.round(12500 * multiplier * transport), note: 'Flights, train and local transfers' },
      { name: 'Food & Dining', amount: Math.round(9500 * multiplier * food), note: 'Daily meals and dining preference' },
      { name: 'Activities & Tours', amount: Math.round(7200 * multiplier * activities), note: 'Tours, tickets and experiences' },
      { name: 'Other / Buffer', amount: Math.round(4600 * multiplier), note: 'Souvenirs, fees and contingency' },
    ];
  }, [activities, accommodation, duration, food, transport, travelers]);
  const estimatedCost = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = totalBudget - estimatedCost;
  const percentageUsed = Math.round((estimatedCost / Math.max(1, totalBudget)) * 100);

  return (
    <section id="budget" className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-[#E7E5E2]">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#6F6F6F] block mb-2">
            FINANCIAL ARCHITECTURE
          </span>
          <h2 className="font-instrument text-4xl sm:text-5xl md:text-6xl text-[#000000] tracking-headline leading-none">
            Your journey, at a glance.
          </h2>
          <p className="font-inter text-sm sm:text-base text-[#6F6F6F] mt-4 max-w-lg">
            Shape the estimate around your group, pace, and comfort level before you commit.
          </p>
        </div>

        {/* AI Optimization Trigger */}
        <button
          type="button"
          onClick={() => setShowOptimization(!showOptimization)}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-[#000000] border border-[#E7E5E2] transition-all cursor-pointer self-start lg:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{showOptimization ? 'Hide AI Suggestions' : 'Optimize with AI →'}</span>
        </button>
      </div>

      {/* Main Budget Card */}
      <div className="bg-white border border-[#E7E5E2] rounded-3xl p-8 sm:p-10 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pb-8 border-b border-[#E7E5E2]">
          <label className="text-[11px] font-mono text-[#6F6F6F] uppercase">Budget
            <input type="number" min="0" value={totalBudget} onChange={(event) => setTotalBudget(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-[#E7E5E2] px-3 py-2 text-sm text-black" />
          </label>
          <label className="text-[11px] font-mono text-[#6F6F6F] uppercase">Travelers
            <input type="number" min="1" value={travelers} onChange={(event) => setTravelers(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-[#E7E5E2] px-3 py-2 text-sm text-black" />
          </label>
          <label className="text-[11px] font-mono text-[#6F6F6F] uppercase">Days
            <input type="number" min="1" value={duration} onChange={(event) => setDuration(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-[#E7E5E2] px-3 py-2 text-sm text-black" />
          </label>
          {[
            ['Stay', accommodation, setAccommodation],
            ['Food', food, setFood],
            ['Transit', transport, setTransport],
            ['Activities', activities, setActivities],
          ].map(([label, value, setter]) => (
            <label key={label as string} className="text-[11px] font-mono text-[#6F6F6F] uppercase">{label as string}
              <select value={value as number} onChange={(event) => (setter as React.Dispatch<React.SetStateAction<number>>)(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-[#E7E5E2] px-2 py-2 text-sm text-black">
                <option value="0.75">Value</option><option value="1">Balanced</option><option value="1.35">Premium</option>
              </select>
            </label>
          ))}
        </div>
        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-8 border-b border-[#E7E5E2]">
          <div>
            <span className="block text-xs font-mono text-[#6F6F6F] uppercase tracking-wider">
              TOTAL BUDGET
            </span>
            <span className="font-instrument text-4xl sm:text-5xl text-[#000000] tracking-tight mt-1 block">
              ₹{totalBudget.toLocaleString()}
            </span>
            <span className="text-xs text-[#6F6F6F] font-inter">Locked target ceiling</span>
          </div>

          <div>
            <span className="block text-xs font-mono text-[#6F6F6F] uppercase tracking-wider">
              ESTIMATED
            </span>
            <span className="font-instrument text-4xl sm:text-5xl text-[#000000] tracking-tight mt-1 block">
              ₹{estimatedCost.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-500 font-inter">{percentageUsed}% allocated</span>
          </div>

          <div>
            <span className="block text-xs font-mono text-[#6F6F6F] uppercase tracking-wider">
              REMAINING
            </span>
            <span className="font-instrument text-4xl sm:text-5xl text-emerald-800 tracking-tight mt-1 block">
              ₹{remainingBudget.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-700 font-inter">₹1,300 per traveler reserve</span>
          </div>
        </div>

        {/* Thin Horizontal Spending Bar */}
        <div className="py-8">
          <div className="flex items-center justify-between text-xs font-mono text-[#6F6F6F] mb-3">
            <span>BUDGET ALLOCATION BAR</span>
            <span>{percentageUsed}% OF ₹{totalBudget.toLocaleString()}</span>
          </div>
          <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden flex p-0.5 gap-1 border border-[#E7E5E2]">
            {expenses.map((item, index) => (
              <div
                key={item.name}
                style={{ width: `${(item.amount / Math.max(1, estimatedCost)) * 100}%` }}
                className={`h-full rounded-sm ${['bg-neutral-900', 'bg-neutral-700', 'bg-neutral-500', 'bg-neutral-400', 'bg-neutral-300'][index]}`}
                title={`${item.name}: ${Math.round((item.amount / Math.max(1, estimatedCost)) * 100)}%`}
              />
            ))}
          </div>
        </div>

        {/* Category Breakdown Rows */}
        <div className="space-y-4 pt-2">
          {expenses.map((item, idx) => {
            const sharePercent = Math.round((item.amount / estimatedCost) * 100);
            return (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-neutral-800" />
                <div>
                  <span className="font-inter text-sm font-medium text-[#000000] block">
                    {item.name}
                  </span>
                  <span className="text-xs text-[#6F6F6F]">{item.note}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-sm font-medium text-[#000000] block">
                  ₹{item.amount.toLocaleString()}
                </span>
                <span className="text-[11px] font-mono text-[#6F6F6F]">{sharePercent}% share</span>
              </div>
            </div>
            );
          })}
        </div>

        <div className={`mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono ${remainingBudget < 0 ? 'text-red-700' : 'text-emerald-800'}`}>
          <span>PER PERSON: ₹{Math.round(estimatedCost / Math.max(1, travelers)).toLocaleString()}</span>
          <span>PER DAY: ₹{Math.round(estimatedCost / Math.max(1, duration)).toLocaleString()}</span>
          <span>{remainingBudget < 0 ? `OVER BUDGET BY ₹${Math.abs(remainingBudget).toLocaleString()}` : `WITHIN BUDGET BY ₹${remainingBudget.toLocaleString()}`}</span>
        </div>

        {/* AI Suggestions Box when toggled */}
        {showOptimization && (
          <div className="mt-8 p-6 bg-[#FAF8F5] border border-[#E7E5E2] rounded-2xl animate-fade-rise">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#000000] mb-3">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              <span>AI Budget Recommendations</span>
            </div>
            <p className="text-xs sm:text-sm text-[#6F6F6F] font-inter leading-relaxed mb-4">
              "We identified that booking the Vande Bharat Express between Goa and Mumbai saves ₹3,200
              compared to peak domestic flights without sacrificing scenic daylight views."
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full px-5 py-2 bg-[#000000] text-white text-xs font-medium hover:bg-neutral-800 transition-all hover:scale-[1.02]"
              >
                Apply Savings (-₹3,200)
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
