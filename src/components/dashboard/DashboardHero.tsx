import { ArrowUpRight, Plus } from 'lucide-react';

interface DashboardHeroProps {
  onPlanNew: () => void;
  onExplore: () => void;
}

export const DashboardHero = ({ onPlanNew, onExplore }: DashboardHeroProps) => {
  return (
    <section id="hero" className="relative z-10 w-full pt-8 sm:pt-14 pb-16 sm:pb-20 text-center px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Subtle greeting tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100/90 text-xs text-[#6F6F6F] font-inter mb-6 animate-fade-rise">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Good morning, Aravind</span>
          <span className="text-neutral-300">•</span>
          <span>Your next journey awaits</span>
        </div>

        {/* Headline */}
        <h1
          className="font-instrument font-normal text-5xl sm:text-7xl md:text-8xl text-[#000000] tracking-headline leading-headline max-w-4xl select-none animate-fade-rise"
          style={{ letterSpacing: '-2.46px', lineHeight: '0.95' }}
        >
          Where will your next journey take you?
        </h1>

        {/* Supporting description */}
        <p className="font-inter text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-[#6F6F6F] animate-fade-rise-delay">
          Plan unforgettable journeys, organize every detail, and experience the freedom
          of having everything in one place.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 animate-fade-rise-delay-2">
          <button
            type="button"
            onClick={onPlanNew}
            className="flex items-center justify-center gap-2 rounded-full px-9 sm:px-12 py-4 sm:py-4.5 text-sm sm:text-base font-medium bg-[#000000] text-white shadow-md shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Plan a New Journey</span>
          </button>

          <button
            type="button"
            onClick={onExplore}
            className="flex items-center gap-1.5 text-sm sm:text-base font-medium text-[#000000] hover:text-[#6F6F6F] px-4 py-2 transition-colors cursor-pointer group"
          >
            <span>Explore Destinations</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
