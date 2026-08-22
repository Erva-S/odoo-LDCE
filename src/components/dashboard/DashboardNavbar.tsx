import { useState, useEffect, useRef } from 'react';
import { Sparkles, Menu, X, ArrowLeft, Bell, Check, ChevronDown } from 'lucide-react';
import { DEMO_USERS, StoredNotification, UserProfile } from '../../types/collaboration';

interface DashboardNavbarProps {
  currentUser: UserProfile;
  notifications: StoredNotification[];
  onOpenAI: () => void;
  onGoToLanding?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  onSelectUser: (user: UserProfile) => void;
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onOpenNotificationTrip?: (tripId?: string, inviteToken?: string) => void;
}

export const DashboardNavbar = ({
  currentUser,
  notifications,
  onOpenAI,
  onGoToLanding,
  onNavigateSection,
  onSelectUser,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onOpenNotificationTrip,
}: DashboardNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Home', section: 'hero' },
    { label: 'Explore', section: 'discovery' },
    { label: 'My Journeys', section: 'journeys' },
    { label: 'AI Planner', section: 'ai-planner' },
    { label: 'Collaborate', section: 'travel-together' },
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
          ? 'bg-white/90 backdrop-blur-md border-b border-[#E7E5E2]/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
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

        {/* Right Actions: AI Assistant + Notifications + User Switcher */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* AI Assistant Pill */}
          <button
            type="button"
            onClick={onOpenAI}
            className="flex items-center gap-2 rounded-full px-3.5 py-2 text-xs sm:text-sm font-medium bg-neutral-100 hover:bg-neutral-200 text-[#000000] border border-[#E7E5E2] transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#000000]" />
            <span>✦ AI Assistant</span>
          </button>

          {/* Notifications Center */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-full text-black hover:bg-neutral-100 transition-colors border border-[#E7E5E2] cursor-pointer"
              title="Collaboration Notifications"
              aria-label="Collaboration Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] font-mono rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-[#E7E5E2] rounded-3xl shadow-2xl overflow-hidden z-50 animate-fade-rise text-xs font-inter">
                <div className="p-4 bg-[#FAF8F5] border-b border-[#E7E5E2] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono uppercase text-[11px] font-semibold text-black">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="bg-black text-white text-[10px] px-2 py-0.2 rounded-full font-mono">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={onMarkAllNotificationsRead}
                      className="text-[11px] text-[#6F6F6F] hover:text-black transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-neutral-400">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          onMarkNotificationRead(notif.id);
                          if (onOpenNotificationTrip) {
                            onOpenNotificationTrip(notif.tripId, notif.inviteToken);
                          }
                          setNotificationsOpen(false);
                        }}
                        className={`p-4 transition-colors cursor-pointer flex items-start gap-3 ${
                          notif.read ? 'bg-white hover:bg-neutral-50' : 'bg-neutral-50/80 hover:bg-neutral-100/80'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            notif.read ? 'bg-neutral-300' : 'bg-black'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-black text-xs">{notif.title}</h5>
                          <p className="text-[#6F6F6F] text-[11px] mt-0.5 leading-snug">
                            {notif.message}
                          </p>
                          <span className="text-[10px] font-mono text-neutral-400 mt-1 block">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Persona Switcher Pill */}
          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1.5 text-xs sm:text-sm font-medium bg-[#000000] text-white hover:opacity-90 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              title="Switch user perspective"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-neutral-700"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] text-white uppercase font-serif">
                  {currentUser.initials}
                </div>
              )}
              <span className="font-sans text-xs">{currentUser.name}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {/* Persona Switcher Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#E7E5E2] rounded-3xl shadow-2xl p-2 z-50 animate-fade-rise text-xs font-inter">
                <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6F6F6F] block">
                    Switch Test Persona
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Test Owner, Editor & Viewer roles
                  </span>
                </div>

                <div className="space-y-1">
                  {DEMO_USERS.map((user) => {
                    const isCurrent = user.id === currentUser.id;
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          onSelectUser(user);
                          setUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl transition-colors text-left cursor-pointer ${
                          isCurrent
                            ? 'bg-black text-white font-medium'
                            : 'text-neutral-800 hover:bg-neutral-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-neutral-700 text-white flex items-center justify-center text-[10px]">
                              {user.initials}
                            </div>
                          )}
                          <div>
                            <span className="block text-xs font-medium">{user.name}</span>
                            <span className={`text-[10px] block ${isCurrent ? 'text-neutral-300' : 'text-neutral-400'}`}>
                              {user.id === 'user_aravind' && 'Goa Owner'}
                              {user.id === 'user_naitri' && 'Goa Editor · Ladakh Owner'}
                              {user.id === 'user_shubham' && 'Goa Viewer'}
                              {user.id === 'user_meera' && 'Rajasthan Owner'}
                            </span>
                          </div>
                        </div>

                        {isCurrent && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
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
        <div className="md:hidden px-8 pt-2 pb-6 bg-white/95 backdrop-blur-md border-b border-[#E7E5E2] flex flex-col space-y-4 animate-fade-rise">
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
          <div className="pt-3 flex flex-col gap-2 border-t border-neutral-100">
            <span className="text-[10px] font-mono uppercase text-[#6F6F6F]">Switch Persona</span>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-xl text-xs flex items-center gap-2 border ${
                    user.id === currentUser.id ? 'bg-black text-white border-black' : 'border-[#E7E5E2]'
                  }`}
                >
                  <span className="truncate">{user.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
