import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Lock, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { travelStorage } from '../services/travelStorage';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToLanding,
}) => {
  const [email, setEmail] = useState('aravind@aethera.luxury');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const current = travelStorage.getProfile();
      travelStorage.saveProfile({
        ...current,
        name: 'Aravind S.',
        email: email || 'aravind@aethera.luxury',
      });
      window.localStorage.setItem('aethera.auth_token', 'token_' + Date.now());
      setIsLoading(false);
      onLoginSuccess();
    }, 500);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const current = travelStorage.getProfile();
      travelStorage.saveProfile({
        ...current,
        name: 'Aravind S.',
        email: 'aravind@aethera.luxury',
      });
      window.localStorage.setItem('aethera.auth_token', 'token_' + Date.now());
      setIsLoading(false);
      onLoginSuccess();
    }, 300);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#FAF8F5] text-black font-sans select-none animate-fade-rise">
      {/* Background Decorative Ambient Circles */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-neutral-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-black transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO HOME</span>
        </button>

        <span className="font-instrument italic text-2xl tracking-tight text-black">
          Aethera®
        </span>

        <div className="w-16" />
      </header>

      {/* Centered Login Card */}
      <div className="relative z-10 max-w-md w-full mx-auto px-6 py-8 my-auto">
        <div className="bg-white border border-[#E8E6E2] rounded-[32px] p-8 sm:p-10 shadow-xl shadow-black/5 space-y-6">
          {/* Tag & Heading */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E7E5E2] text-[10px] font-mono text-neutral-600 mb-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>MEMBER ACCESS</span>
            </div>
            <h1 className="font-instrument text-4xl sm:text-5xl text-black leading-tight">
              Welcome back.
            </h1>
            <p className="text-xs text-neutral-500 font-inter max-w-xs mx-auto">
              Sign in to synchronize your curated itineraries, train passes, and live journey hub.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-[11px] font-mono uppercase text-neutral-500 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#FAF8F5] border border-[#E7E5E2] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-black focus:outline-none focus:border-black font-inter"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase text-neutral-500">
                  Password
                </label>
                <span className="text-[10px] font-mono text-neutral-400 hover:text-black cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF8F5] border border-[#E7E5E2] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-black focus:outline-none focus:border-black font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 rounded-full py-3.5 bg-black text-white text-xs sm:text-sm font-medium hover:bg-neutral-800 transition-all hover:scale-[1.02] cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In & Begin Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="w-full border-t border-neutral-100" />
            <span className="bg-white px-3 text-[10px] font-mono uppercase text-neutral-400 absolute">
              OR
            </span>
          </div>

          {/* Quick 1-Click Guest Login */}
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full rounded-full py-3 bg-[#FAF8F5] border border-[#E7E5E2] hover:border-black text-black text-xs font-mono transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Continue as Guest (Aravind S.)</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-neutral-400 text-xs font-mono">
        <span>Aethera Travel Technologies © 2026 · Beyond silence, we build the eternal.</span>
      </footer>
    </main>
  );
};
