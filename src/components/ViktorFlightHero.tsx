import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

interface ViktorFlightHeroProps {
  onProceedToFlights?: () => void;
  onEnterDashboard?: () => void;
  onNavigate?: (path: string) => void;
}

const VIDEO_URLS = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_030107_874273ea-684a-4e90-bb96-8fdfde48d53d.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4',
];

const VIDEO_LABELS = [
  { id: '01', title: 'WATER WAVE' },
  { id: '02', title: 'GRIDWAVE' },
  { id: '03', title: 'LIGHT TUNNEL' },
];

const NAV_ITEMS = [
  { num: '01', label: 'Works' },
  { num: '02', label: 'Services' },
  { num: '03', label: 'About' },
  { num: '04', label: 'Contact' },
];

export const ViktorFlightHero: React.FC<ViktorFlightHeroProps> = ({
  onProceedToFlights,
  onEnterDashboard,
  onNavigate,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoSources, setVideoSources] = useState<string[]>(VIDEO_URLS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  const heroRef = useRef<HTMLElement | null>(null);

  // Preload videos as object URLs on mount for instant smooth crossfade
  useEffect(() => {
    let isMounted = true;
    const blobUrls: string[] = [];

    const preloadVideos = async () => {
      try {
        const loadedUrls = await Promise.all(
          VIDEO_URLS.map(async (url) => {
            try {
              const res = await fetch(url);
              const blob = await res.blob();
              const objectUrl = URL.createObjectURL(blob);
              blobUrls.push(objectUrl);
              return objectUrl;
            } catch {
              return url; // fallback
            }
          })
        );
        if (isMounted) {
          setVideoSources(loadedUrls);
        }
      } catch {
        // use default fallback
      }
    };

    preloadVideos();

    return () => {
      isMounted = false;
      blobUrls.forEach((b) => URL.revokeObjectURL(b));
    };
  }, []);

  // Live 24h Clock: CUP HH:MM:SS
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

  // Reveal animation on mount / intersection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        }
      },
      { threshold: 0.2 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    } else {
      setIsRevealed(true);
    }

    return () => observer.disconnect();
  }, []);

  const handleAction = () => {
    if (onProceedToFlights) {
      onProceedToFlights();
    } else if (onEnterDashboard) {
      onEnterDashboard();
    } else if (onNavigate) {
      onNavigate('/');
    }
  };

  const isPinkAccent = activeIndex === 0;

  return (
    <main
      ref={heroRef}
      className="relative w-full min-h-screen bg-black text-white overflow-hidden select-none"
      style={{ fontFamily: "'Figtree', sans-serif" }}
    >
      {/* 1. Fullscreen Video Background Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {videoSources.map((src, idx) => (
          <video
            key={VIDEO_URLS[idx]}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
              activeIndex === idx ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none z-[1]" />

      {/* 2. Absolute Positioned Navbar (z-10) */}
      <header className="absolute top-0 left-0 right-0 z-10 w-full">
        <div className="max-w-[1340px] mx-auto py-6 sm:py-9 px-[15px] sm:px-[18px] flex items-center justify-between">
          {/* Desktop Left Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.num}
                type="button"
                onClick={handleAction}
                className="nav-link-underline text-white flex items-baseline gap-1.5 cursor-pointer py-1"
              >
                <span className="text-[8px] leading-3 tracking-[-0.08px] font-medium uppercase opacity-70">
                  {item.num} /
                </span>
                <span className="text-xs leading-4 tracking-[-0.12px] font-medium uppercase">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white text-xs font-medium uppercase tracking-wider py-2 px-3 border border-white/30 rounded-full flex items-center gap-2 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </>
              ) : (
                <>
                  <Menu className="w-3.5 h-3.5" />
                  <span>Menu</span>
                </>
              )}
            </button>
          </div>

          {/* Right Side: Email & Live Clock */}
          <div className="flex items-center gap-4 sm:gap-8 text-right">
            <a
              href="mailto:Davies@gmail.com"
              className="text-xs leading-4 tracking-[-0.12px] font-medium text-white/90 hover:text-white transition-colors"
            >
              Davies@gmail.com
            </a>
            <div className="text-xs leading-4 tracking-[-0.12px] font-mono font-medium text-white/70">
              CUP {currentTime || '12:00:00'}
            </div>
            <button
              type="button"
              onClick={handleAction}
              className="hidden sm:inline-flex text-[11px] font-mono text-white/80 hover:text-white underline underline-offset-4 cursor-pointer ml-2"
            >
              Flights Booking →
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel with Grid Rows Transition */}
        <div
          className={`md:hidden grid transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] bg-black/90 backdrop-blur-md px-[18px] ${
            mobileMenuOpen ? 'grid-rows-[1fr] py-6 border-b border-white/10' : 'grid-rows-[0fr] py-0'
          }`}
        >
          <div className="overflow-hidden space-y-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.num}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAction();
                }}
                className="block text-left text-white text-[28px] leading-8 tracking-[-0.84px] font-medium uppercase py-1 cursor-pointer"
              >
                <span className="text-xs text-white/50 mr-2">{item.num} /</span>
                <span>{item.label}</span>
              </button>
            ))}
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAction();
                }}
                className="w-full py-3 bg-white text-black font-medium text-xs uppercase tracking-wider rounded-full text-center"
              >
                Proceed to Flight Search →
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Hero Content Container (z-[2]) */}
      <section className="relative z-[2] max-w-[1340px] mx-auto min-h-screen flex flex-col justify-between pt-[140px] sm:pt-[190px] px-[15px] sm:px-[18px] pb-[44px] sm:pb-[60px]">
        {/* Upper Section: Video Switcher + Availability Status */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-7 sm:gap-12">
          {/* Left Column: 3 Video Switchers */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 flex-[4]">
            {VIDEO_LABELS.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`role-link text-left text-xs sm:text-sm font-medium tracking-[-0.14px] uppercase cursor-pointer flex items-baseline gap-1.5 py-1 ${
                    isActive
                      ? 'opacity-100 text-white font-semibold'
                      : 'opacity-55 text-white hover:opacity-75'
                  }`}
                >
                  <span className="text-[9px] font-mono">{item.id} /</span>
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Pulsing Dot + Availability */}
          <div className="flex items-center gap-2.5 flex-1 justify-start sm:justify-end shrink-0">
            <span
              className="w-[7px] h-[7px] rounded-full animate-dot-pulse inline-block"
              style={{
                backgroundColor: isPinkAccent ? '#F598F2' : '#FFFFFF',
                boxShadow: isPinkAccent
                  ? '0 0 10px #F598F2, 0 0 4px #F598F2'
                  : '0 0 10px rgba(255,255,255,0.8)',
              }}
            />
            <span className="text-xs sm:text-sm leading-4 tracking-[-0.12px] font-medium text-white/90">
              Available for work
            </span>
          </div>
        </div>

        {/* Lower Section: Name + Bio Paragraph + CTA Button */}
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 lg:gap-12 mt-auto">
          {/* Left: Giant Name "Viktor." */}
          <div
            className={`flex-[2] transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            <h1 className="text-[clamp(68px,17vw,200px)] leading-[81%] tracking-[-4.8px] sm:tracking-[-6px] font-medium uppercase text-white select-none">
              Viktor
              <span
                style={{
                  color: isPinkAccent ? '#F598F2' : '#FFFFFF',
                  transition: 'color 0.4s ease',
                }}
              >
                .
              </span>
            </h1>
          </div>

          {/* Right: Paragraph + CTA button */}
          <div
            className={`flex-1 lg:pl-[50px] max-w-[440px] space-y-6 transition-all duration-900 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-24'
            }`}
          >
            <p className="text-sm sm:text-base leading-6 tracking-[-0.16px] font-medium text-white/80">
              I craft bold brands and modern websites with purpose. Focused on creating memorable
              digital experiences through design and motion.
            </p>

            <div>
              <button
                type="button"
                onClick={handleAction}
                className="btn-fill-up border border-white text-white rounded-full px-8 py-3 text-xs sm:text-sm font-medium tracking-wide cursor-pointer inline-flex items-center gap-2"
              >
                <span>start a project</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
