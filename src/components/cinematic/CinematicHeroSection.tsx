import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

interface CinematicHeroSectionProps {
  onStartPlanning?: () => void;
  onNavigateTab?: (tab: string) => void;
}

const VIDEOS = [
  {
    id: 0,
    title: 'MOUNTAINS',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_030107_874273ea-684a-4e90-bb96-8fdfde48d53d.mp4',
    accent: '#F598F2',
  },
  {
    id: 1,
    title: 'CITY',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4',
    accent: '#FFFFFF',
  },
  {
    id: 2,
    title: 'COASTLINE',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4',
    accent: '#FFFFFF',
  },
];

const NAV_ITEMS = [
  { index: '01', label: 'Explore', target: 'explore' },
  { index: '02', label: 'Plan', target: 'plan' },
  { index: '03', label: 'Collaborate', target: 'collaborate' },
  { index: '04', label: 'Contact', target: 'contact' },
];

export const CinematicHeroSection: React.FC<CinematicHeroSectionProps> = ({
  onStartPlanning,
  onNavigateTab,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [blobUrls, setBlobUrls] = useState<string[]>(VIDEOS.map((v) => v.url));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const heroRef = useRef<HTMLElement | null>(null);

  // Preload videos as blobs on mount for instant playback
  useEffect(() => {
    let isMounted = true;
    const loadVideos = async () => {
      const urls = await Promise.all(
        VIDEOS.map(async (vid) => {
          try {
            const res = await fetch(vid.url);
            if (!res.ok) throw new Error('Fetch failed');
            const blob = await res.blob();
            return URL.createObjectURL(blob);
          } catch {
            return vid.url; // fallback to remote URL
          }
        })
      );
      if (isMounted) {
        setBlobUrls(urls);
      }
    };
    loadVideos();

    return () => {
      isMounted = false;
      blobUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  // Live Clock (24h format, updates every second)
  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setCurrentTime(formatter.format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // IntersectionObserver for reveal animations (0.35 threshold)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        }
      },
      { threshold: 0.35 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const currentAccent = VIDEOS[activeIndex].accent;

  const handleSwitch = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-screen overflow-hidden bg-black text-white font-figtree selection:bg-[#F598F2] selection:text-black flex flex-col justify-between"
      style={{ '--btn-accent': currentAccent } as React.CSSProperties}
    >
      {/* 1. Fullscreen Video Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {VIDEOS.map((vid, idx) => (
          <video
            key={vid.id}
            src={blobUrls[idx] || vid.url}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
              activeIndex === idx ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {/* bg-black/10 Overlay above videos at z-[1] */}
        <div className="absolute inset-0 bg-black/20 z-[1] pointer-events-none" />
      </div>

      {/* 2. Absolute Navbar (z-10) */}
      <header className="absolute top-0 left-0 right-0 z-10 w-full flex justify-center">
        <div className="w-full max-w-[1340px] py-6 sm:py-[30px] lg:py-9 px-[15px] sm:px-[18px] flex items-center justify-between">
          {/* Left: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.index}
                type="button"
                onClick={() => onNavigateTab?.(item.target)}
                className="nav-link-underline text-left text-white group cursor-pointer focus:outline-none"
              >
                <span className="text-[8px] leading-3 tracking-[-0.08px] font-medium uppercase text-white/60 block">
                  {item.index} /
                </span>
                <span className="text-xs leading-4 tracking-[-0.12px] font-medium uppercase text-white">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Mobile Hamburger Toggle Button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Right: Tagline + Live 24h Clock */}
          <div className="flex items-center gap-6 text-xs leading-4 tracking-[-0.12px] font-medium uppercase text-white">
            <span className="hidden sm:inline opacity-80 lowercase">hello@aetheratrip.com</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <div className="flex items-center gap-2">
              <span className="opacity-90 font-mono">CUP {currentTime || '12:00:00'}</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel (CSS Grid Transition) */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/10 transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] grid ${
            isMobileMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden px-6 py-6 space-y-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.index}
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateTab?.(item.target);
                }}
                className="w-full text-left py-2 text-[28px] leading-8 tracking-[-0.84px] font-medium text-white hover:text-[#F598F2] transition-colors cursor-pointer flex items-baseline gap-3"
              >
                <span className="text-xs font-mono text-white/50">{item.index}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 3. Hero Content (z-[2]) */}
      <main
        className="relative z-[2] w-full max-w-[1340px] mx-auto h-full flex flex-col justify-end items-end gap-[72px] lg:gap-[150px] pt-[140px] lg:pt-[190px] px-[15px] sm:px-[18px] pb-11 sm:pb-[52px] lg:pb-[60px]"
      >
        {/* Section 1 — Destination Switcher + Live Status */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-7 sm:gap-6">
          {/* Left (flex-[4]): Three buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 flex-[4]">
            {VIDEOS.map((vid, idx) => (
              <button
                key={vid.id}
                type="button"
                onClick={() => handleSwitch(idx)}
                className={`text-left text-xs leading-4 tracking-[-0.12px] font-medium uppercase transition-all duration-300 cursor-pointer flex items-center gap-2 group hover:translate-x-1 ${
                  activeIndex === idx
                    ? 'opacity-100 font-semibold'
                    : 'opacity-55 hover:opacity-75'
                }`}
              >
                <span className="font-mono text-[10px] text-white/70">0{vid.id + 1} /</span>
                <span className="text-white">{vid.title}</span>
                {activeIndex === idx && (
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block ml-1"
                    style={{ backgroundColor: currentAccent }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right (flex-1): Pulsing Dot + Status */}
          <div className="flex items-center gap-3 flex-1 sm:justify-end">
            <span
              className="w-[7px] h-[7px] rounded-full animate-dot-pulse shrink-0"
              style={{
                backgroundColor: currentAccent,
                boxShadow: `0 0 12px ${currentAccent}`,
              }}
            />
            <span className="text-xs leading-4 tracking-[-0.12px] font-medium text-white/90 whitespace-nowrap">
              Planning made simple
            </span>
          </div>
        </div>

        {/* Section 2 — Headline + Subtext & CTA */}
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 lg:gap-0">
          {/* Left (flex-[2]): Giant Headline */}
          <div className={`flex-[2] ${isRevealed ? 'animate-reveal-up' : 'opacity-0'}`}>
            <h1
              className="font-figtree font-medium uppercase text-white select-none text-[clamp(68px,21vw,80px)] sm:text-[129.6px] lg:text-[200px] leading-[96px] sm:leading-[113.4px] lg:leading-[81%] tracking-[-4.8px] sm:tracking-[-7.7px] lg:tracking-[-6px]"
            >
              Wander<span style={{ color: currentAccent }}>.</span>
            </h1>
          </div>

          {/* Right (flex-1, pl-[50px] on desktop): Subtext + CTA */}
          <div
            className={`flex-1 lg:pl-[50px] space-y-6 max-w-[420px] lg:max-w-none ${
              isRevealed ? 'animate-reveal-right' : 'opacity-0'
            }`}
          >
            <p className="font-figtree text-sm sm:text-base leading-6 tracking-[-0.16px] font-medium text-white/90">
              Plan multi-city trips, split budgets with friends, and keep every itinerary, photo, and
              booking in one place.
            </p>

            <div>
              <button
                type="button"
                onClick={onStartPlanning}
                className="btn-fill-up border border-white rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:text-black transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>start planning</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};
