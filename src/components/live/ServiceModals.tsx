import { useState } from 'react';
import {
  X,
  MapPin,
  Car,
  Phone,
  ShieldAlert,
  Stethoscope,
  Pill,
  ExternalLink,
} from 'lucide-react';
import { ServiceCategory } from './QuickAssistanceGrid';

interface ServiceModalsProps {
  activeCategory: ServiceCategory | null;
  onClose: () => void;
  onRequestRide: (destination: string) => void;
}

export const ServiceModals = ({
  activeCategory,
  onClose,
  onRequestRide,
}: ServiceModalsProps) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('Uber');
  const [rideDestination, setRideDestination] = useState<string>('CityCare Hospital, Panaji');

  if (!activeCategory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-rise">
      <div className="bg-white border border-[#E7E5E2] rounded-[28px] max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E7E5E2] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#000000] text-white flex items-center justify-center text-sm">
              {activeCategory === 'hospitals' || activeCategory === 'unwell' ? (
                <Stethoscope className="w-5 h-5" />
              ) : activeCategory === 'pharmacies' ? (
                <Pill className="w-5 h-5" />
              ) : activeCategory === 'rides' ? (
                <Car className="w-5 h-5" />
              ) : activeCategory === 'emergency' ? (
                <ShieldAlert className="w-5 h-5 text-red-400" />
              ) : (
                <MapPin className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6F6F6F]">
                LOCATION SERVICES · PANAJI, GOA
              </span>
              <h3 className="font-instrument text-3xl text-[#000000] leading-tight">
                {activeCategory === 'unwell' && 'Medical & Health Support'}
                {activeCategory === 'hospitals' && 'Hospitals Near You'}
                {activeCategory === 'pharmacies' && 'Pharmacies Near You'}
                {activeCategory === 'rides' && 'Get a Ride'}
                {activeCategory === 'restaurants' && 'Curated Dining Near You'}
                {activeCategory === 'hotels' && 'Boutique Stays & Hotels'}
                {activeCategory === 'atms' && 'ATMs & Cash Points'}
                {activeCategory === 'fuel' && 'Fuel & EV Stations'}
                {activeCategory === 'emergency' && 'Emergency Assistance (24/7)'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* CATEGORY: "I'M NOT FEELING WELL" / UNWELL */}
          {activeCategory === 'unwell' && (
            <div className="space-y-6">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5">
                <h4 className="font-instrument text-2xl text-amber-950 mb-1">
                  How can we support you right now?
                </h4>
                <p className="text-xs text-amber-900/80 font-inter">
                  Aethera connects you directly with verified local medical care and immediate transit.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onRequestRide('CityCare Hospital, Panaji')}
                  className="p-4 rounded-2xl border border-[#E7E5E2] hover:border-black text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Stethoscope className="w-4 h-4 text-black" />
                    <span className="font-inter text-sm font-semibold text-black">
                      Find a nearby hospital
                    </span>
                  </div>
                  <span className="text-xs text-[#6F6F6F] font-inter">
                    CityCare Hospital is 1.8 km away (7 min).
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {}}
                  className="p-4 rounded-2xl border border-[#E7E5E2] hover:border-black text-left transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Pill className="w-4 h-4 text-black" />
                    <span className="font-inter text-sm font-semibold text-black">
                      Find a 24/7 pharmacy
                    </span>
                  </div>
                  <span className="text-xs text-[#6F6F6F] font-inter">
                    Apollo Pharmacy Panaji is 600m away.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onRequestRide('CityCare Hospital')}
                  className="p-4 rounded-2xl border border-[#E7E5E2] hover:border-black text-left transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Car className="w-4 h-4 text-black" />
                    <span className="font-inter text-sm font-semibold text-black">
                      Get a ride immediately
                    </span>
                  </div>
                  <span className="text-xs text-[#6F6F6F] font-inter">
                    Uber/Ola arriving in 3–5 min.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {}}
                  className="p-4 rounded-2xl border border-red-200 bg-red-50/30 hover:bg-red-50/60 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span className="font-inter text-sm font-semibold text-red-950">
                      Emergency 112 / 108
                    </span>
                  </div>
                  <span className="text-xs text-red-800/80 font-inter">
                    Direct ambulance & police dispatch.
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* CATEGORY: HOSPITALS */}
          {(activeCategory === 'hospitals' || activeCategory === 'unwell') && (
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <span className="text-xs font-mono uppercase text-[#6F6F6F] block">
                VERIFIED HOSPITALS NEAR PANAJI
              </span>

              {/* Hospital 1 */}
              <div className="p-5 rounded-2xl border border-[#E7E5E2] hover:border-black transition-colors bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-instrument text-2xl text-black">CityCare Hospital</h4>
                    <p className="text-xs text-[#6F6F6F] font-inter">
                      Rua de Ourém, Panaji, Goa · 1.8 km (7 min by car)
                    </p>
                  </div>
                  <span className="text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full self-start">
                    Open 24/7 · Emergency
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-neutral-100 mt-3">
                  <button
                    type="button"
                    onClick={() => onRequestRide('CityCare Hospital, Panaji')}
                    className="rounded-full px-4 py-2 bg-[#000000] text-white text-xs font-medium hover:bg-neutral-800 flex items-center gap-1.5"
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Get a Ride</span>
                  </button>
                  <a
                    href="tel:+918322224500"
                    className="rounded-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-medium flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call +91 832 222 4500</span>
                  </a>
                </div>
              </div>

              {/* Hospital 2 */}
              <div className="p-5 rounded-2xl border border-[#E7E5E2] hover:border-black transition-colors bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-instrument text-2xl text-black">Apollo Victor Hospital</h4>
                    <p className="text-xs text-[#6F6F6F] font-inter">
                      Malbhat / Panaji Extension · 3.2 km (12 min by car)
                    </p>
                  </div>
                  <span className="text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full self-start">
                    Open 24/7 · Multi-Specialty
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-neutral-100 mt-3">
                  <button
                    type="button"
                    onClick={() => onRequestRide('Apollo Victor Hospital')}
                    className="rounded-full px-4 py-2 bg-[#000000] text-white text-xs font-medium hover:bg-neutral-800 flex items-center gap-1.5"
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Get a Ride</span>
                  </button>
                  <a
                    href="tel:+918322730000"
                    className="rounded-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-medium flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call +91 832 273 0000</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY: GET A RIDE */}
          {activeCategory === 'rides' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#FAF8F5] border border-[#E7E5E2] rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-mono text-[#6F6F6F]">FROM:</span>
                  <span className="font-semibold text-black">Your Location (Panaji Promenade)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-black" />
                  <span className="font-mono text-[#6F6F6F]">TO:</span>
                  <input
                    type="text"
                    value={rideDestination}
                    onChange={(e) => setRideDestination(e.target.value)}
                    className="font-semibold text-black bg-transparent border-b border-neutral-300 focus:outline-none flex-1 pb-0.5"
                  />
                </div>
              </div>

              <span className="text-xs font-mono uppercase text-[#6F6F6F] block">
                AVAILABLE RIDE SERVICES
              </span>

              <div className="space-y-3">
                {[
                  { name: 'Uber Premier / Go', eta: '4 min', price: '₹180', note: 'Top rated sedan driver' },
                  { name: 'Ola Cab Prime', eta: '5 min', price: '₹165', note: 'Sedan nearby' },
                  { name: 'GoaMiles Local Taxi', eta: '3 min', price: '₹220', note: 'Official Goa tourism cab' },
                ].map((ride) => (
                  <label
                    key={ride.name}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedProvider === ride.name
                        ? 'border-black bg-[#FAF8F5] shadow-xs'
                        : 'border-[#E7E5E2] hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="rideProvider"
                        checked={selectedProvider === ride.name}
                        onChange={() => setSelectedProvider(ride.name)}
                        className="text-black focus:ring-0"
                      />
                      <div>
                        <span className="font-inter text-sm font-semibold text-black block">
                          {ride.name}
                        </span>
                        <span className="text-xs text-[#6F6F6F]">{ride.note}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-black block">
                        {ride.price}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-700">{ride.eta} away</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Connecting to ${selectedProvider} booking flow for ${rideDestination}...`);
                    onClose();
                  }}
                  className="w-full rounded-full py-4 bg-[#000000] text-white text-sm font-medium hover:bg-neutral-800 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Continue to {selectedProvider}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <span className="block text-[11px] text-center text-neutral-400 mt-2 font-inter">
                  Direct provider deep-link. No hidden Aethera surcharges.
                </span>
              </div>
            </div>
          )}

          {/* CATEGORY: PHARMACIES */}
          {activeCategory === 'pharmacies' && (
            <div className="space-y-4">
              {[
                { name: 'Apollo Pharmacy 24/7', dist: '600m away', addr: 'MG Road, Panaji', phone: '+91 832 242 1100' },
                { name: 'MedPlus Panaji Branch', dist: '1.1 km away', addr: '18th June Road', phone: '+91 832 223 8800' },
                { name: 'Wellness Forever Day & Night', dist: '2.3 km away', addr: 'Miramar Circle', phone: '+91 832 246 5500' },
              ].map((ph, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-[#E7E5E2] flex items-center justify-between">
                  <div>
                    <h4 className="font-instrument text-2xl text-black">{ph.name}</h4>
                    <p className="text-xs text-[#6F6F6F] font-inter">{ph.addr} · {ph.dist}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${ph.phone}`}
                      className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-medium flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CATEGORY: EMERGENCY */}
          {activeCategory === 'emergency' && (
            <div className="space-y-5">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <span className="text-[11px] font-mono uppercase text-red-800 font-semibold block mb-1">
                  CURRENT LOCATION COORDINATES
                </span>
                <p className="text-sm font-mono text-red-950 font-bold">
                  📍 15.4909° N, 73.8278° E — Panaji Waterfront Promenade, North Goa
                </p>
                <span className="text-xs text-red-800 font-inter mt-1 block">
                  Quote these coordinates to emergency dispatch operators for immediate triangulation.
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'National Emergency Response Helpline', num: '112', type: 'All-in-one Emergency Dispatch' },
                  { name: 'Ambulance & Medical Emergency', num: '108', type: 'Instant Medical Van Dispatch' },
                  { name: 'Tourist Police & Security Assistance', num: '100', type: 'North Goa Tourist Police Division' },
                  { name: 'Goa Medical College Emergency Room', num: '+91 832 245 8700', type: 'Bambolim 24/7 Trauma Center' },
                ].map((em, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                    <div>
                      <h4 className="font-inter text-sm font-semibold text-black">{em.name}</h4>
                      <p className="text-xs text-[#6F6F6F] font-inter">{em.type}</p>
                    </div>
                    <a
                      href={`tel:${em.num}`}
                      className="rounded-full px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call {em.num}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CATEGORY: RESTAURANTS, HOTELS, ATMS, FUEL */}
          {(activeCategory === 'restaurants' || activeCategory === 'hotels' || activeCategory === 'atms' || activeCategory === 'fuel') && (
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-[#6F6F6F] block">
                CURATED NEARBY PLACES
              </span>
              {[
                { name: 'The Black Sheep Bistro', tag: 'Contemporary Goan Fusion', dist: '750m away', rating: '4.8 ★' },
                { name: 'Mum’s Kitchen', tag: 'Traditional Goan Heritage Recipes', dist: '1.2 km away', rating: '4.7 ★' },
                { name: 'Viva Panjim', tag: 'Fontainhas Authentic Seafood & Bebinca', dist: '400m away', rating: '4.9 ★' },
              ].map((place, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-[#E7E5E2] flex items-center justify-between">
                  <div>
                    <h4 className="font-instrument text-2xl text-black">{place.name}</h4>
                    <p className="text-xs text-[#6F6F6F] font-inter">{place.tag} · {place.dist}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRequestRide(place.name)}
                    className="rounded-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-xs font-medium text-black flex items-center gap-1"
                  >
                    <span>Get Ride</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
