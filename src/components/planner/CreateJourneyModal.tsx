import React, { useEffect } from 'react';
import { X, ArrowRight, Compass, Globe } from 'lucide-react';

interface CreateJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'national' | 'international') => void;
}

export const CreateJourneyModal: React.FC<CreateJourneyModalProps> = ({
  isOpen,
  onClose,
  onSelectType,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 overflow-y-auto">
      {/* Click outside to close backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Main Modal Window */}
      <div className="relative w-full max-w-2xl bg-white border border-[#E7E5E2] rounded-[32px] p-6 sm:p-10 shadow-2xl overflow-hidden my-auto">
        {/* Top Close / ESC Button */}
        <div className="flex items-center justify-between pb-5 border-b border-[#E7E5E2] mb-6">
          <div className="flex items-center gap-2">
            <span className="font-instrument text-2xl tracking-tight text-[#000000]">Aethera</span>
            <sup className="text-xs font-sans ml-0.5 relative -top-2">°</sup>
            <span className="text-xs font-mono text-[#6F6F6F] ml-2">/ JOURNEY TYPE</span>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-[#6F6F6F] hover:text-[#000000] bg-neutral-100 border border-[#E7E5E2] hover:border-black transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <span>ESC</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Heading */}
        <div className="text-center max-w-lg mx-auto mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#6F6F6F] block mb-2">
            INITIATE VOYAGE
          </span>
          <h2 className="font-instrument text-4xl sm:text-5xl text-[#000000] tracking-headline leading-none">
            Where are you going?
          </h2>
          <p className="font-inter text-sm sm:text-base text-[#6F6F6F] mt-3">
            Choose the kind of journey you want to create.
          </p>
        </div>

        {/* Two Large Minimal Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* NATIONAL OPTION */}
          <button
            type="button"
            onClick={() => onSelectType('national')}
            className="group relative bg-[#FAF8F5] border border-[#E7E5E2] hover:border-black rounded-3xl p-6 sm:p-7 text-left transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-lg flex flex-col justify-between h-[200px] cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-white border border-[#E7E5E2] group-hover:bg-black group-hover:text-white flex items-center justify-center text-black transition-colors mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#6F6F6F] block mb-0.5">
                DOMESTIC
              </span>
              <h3 className="font-instrument text-3xl text-[#000000] leading-none">
                NATIONAL
              </h3>
            </div>

            <div className="flex items-end justify-between pt-3 border-t border-[#E7E5E2]">
              <p className="text-xs text-[#6F6F6F] font-inter max-w-[170px] leading-relaxed">
                Explore destinations closer to home.
              </p>
              <div className="w-8 h-8 rounded-full bg-white border border-[#E7E5E2] group-hover:bg-black group-hover:text-white flex items-center justify-center text-black transition-all group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>

          {/* INTERNATIONAL OPTION */}
          <button
            type="button"
            onClick={() => onSelectType('international')}
            className="group relative bg-[#FAF8F5] border border-[#E7E5E2] hover:border-black rounded-3xl p-6 sm:p-7 text-left transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-lg flex flex-col justify-between h-[200px] cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-white border border-[#E7E5E2] group-hover:bg-black group-hover:text-white flex items-center justify-center text-black transition-colors mb-3">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#6F6F6F] block mb-0.5">
                GLOBAL
              </span>
              <h3 className="font-instrument text-3xl text-[#000000] leading-none">
                INTERNATIONAL
              </h3>
            </div>

            <div className="flex items-end justify-between pt-3 border-t border-[#E7E5E2]">
              <p className="text-xs text-[#6F6F6F] font-inter max-w-[170px] leading-relaxed">
                Cross borders and discover somewhere new.
              </p>
              <div className="w-8 h-8 rounded-full bg-white border border-[#E7E5E2] group-hover:bg-black group-hover:text-white flex items-center justify-center text-black transition-all group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
