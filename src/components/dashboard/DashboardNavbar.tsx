import { useState, useEffect } from 'react';
import { Sparkles, User, Menu, X, ArrowLeft } from 'lucide-react';

interface DashboardNavbarProps {
  onOpenAI: () => void;
  onGoToLanding?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const DashboardNavbar = ({
  onOpenAI,
  onGoToLanding,
  onNavigateSection,
}: DashboardNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', section: 'hero' },
    { label: 'Explore', section: 'discovery' },
    { label: 'My Journeys', section: 'journeys' },
    { label: 'AI Planner', section: 'ai-planner' },
    { label: 'Journal', section: 'itinerary' },
  ];

  const handleItemClick = (label: string, section: string) => {
    setActiveItem(label);
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(section);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-[#E7E5E2]/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          {onGoToLanding && (
            <button
              onClick={onGoToLanding}
              className="text-[#6F6F6F] hover:text-[#000000] p-1.5 -ml-2 rounded-full hover:bg-neutral-100 transition-colors"
              title="Return to Main Landing"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick('Home', 'hero');
            }}
            className="font-instrument text-2xl sm:text-3xl tracking-tight text-[#000000] select-none hover:opacity-80 transition-opacity inline-flex items-baseline"
          >
            <span>Aethera</span>
            <sup className="text-xs font-sans ml-0.5 relative -top-3">°</sup>
          </a>
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item.label, item.section)}
              className={`text-sm tracking-wide transition-colors duration-200 cursor-pointer ${
                activeItem === item.label
                  ? 'text-[#000000] font-medium'
                  : 'text-[#6F6F6F] hover:text-[#000000]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions: AI Assistant Pill + Profile */}
        <div className="hidden sm:flex items-center space-x-4">
          <button
            type="button"
            onClick={onOpenAI}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium bg-neutral-100 hover:bg-neutral-200 text-[#000000] border border-[#E7E5E2] transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#000000]" />
            <span>✦ AI Assistant</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1.5 text-xs sm:text-sm font-medium bg-[#000000] text-white hover:opacity-90 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] text-white uppercase font-serif">
              A
            </div>
            <span className="hidden lg:inline font-sans text-xs">Aravind S.</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={onOpenAI}
            className="p-2 rounded-full bg-neutral-100 text-[#000000] border border-[#E7E5E2]"
            aria-label="Open AI Assistant"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#000000]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-8 pt-2 pb-6 bg-white/95 backdrop-blur-md border-b border-[#E7E5E2] flex flex-col space-y-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item.label, item.section)}
              className={`text-left text-base py-1 transition-colors ${
                activeItem === item.label ? 'text-[#000000] font-medium' : 'text-[#6F6F6F]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
            <div className="flex items-center gap-2 text-sm text-[#000000]">
              <User className="w-4 h-4 text-[#6F6F6F]" />
              <span>Aravind S.</span>
            </div>
            {onGoToLanding && (
              <button
                onClick={onGoToLanding}
                className="text-xs text-[#6F6F6F] underline"
              >
                Back to Landing
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
