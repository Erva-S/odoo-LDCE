import { useState } from 'react';
import { Sparkles, TrendingDown } from 'lucide-react';

interface ExpenseCategory {
  name: string;
  amount: number;
  sharePercent: number;
  note: string;
}

const EXPENSES: ExpenseCategory[] = [
  { name: 'Hotels & Villas', amount: 21000, sharePercent: 38, note: '3 heritage boutique stays' },
  { name: 'Transport & Rail', amount: 12500, sharePercent: 23, note: 'Flights, train & private transfers' },
  { name: 'Food & Dining', amount: 9500, sharePercent: 17, note: 'Fine dining & beach shacks' },
  { name: 'Activities & Tours', amount: 7200, sharePercent: 13, note: 'Catamaran, fort pass & guide' },
  { name: 'Other / Buffer', amount: 4600, sharePercent: 9, note: 'Souvenirs & local tips' },
];

export const TravelBudget = () => {
  const [showOptimization, setShowOptimization] = useState(false);
  const totalBudget = 60000;
  const estimatedCost = 54800;
  const remainingBudget = totalBudget - estimatedCost;
  const percentageUsed = Math.round((estimatedCost / totalBudget) * 100);

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
            Monochrome, transparent tracking with zero noise or distracting pie charts.
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
            <div style={{ width: '38%' }} className="h-full bg-neutral-900 rounded-sm" title="Hotels: 38%" />
            <div style={{ width: '23%' }} className="h-full bg-neutral-700 rounded-sm" title="Transport: 23%" />
            <div style={{ width: '17%' }} className="h-full bg-neutral-500 rounded-sm" title="Food: 17%" />
            <div style={{ width: '13%' }} className="h-full bg-neutral-400 rounded-sm" title="Activities: 13%" />
            <div style={{ width: '9%' }} className="h-full bg-neutral-300 rounded-sm" title="Other: 9%" />
          </div>
        </div>

        {/* Category Breakdown Rows */}
        <div className="space-y-4 pt-2">
          {EXPENSES.map((item, idx) => (
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
                <span className="text-[11px] font-mono text-[#6F6F6F]">{item.sharePercent}% share</span>
              </div>
            </div>
          ))}
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
