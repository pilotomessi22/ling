import React, { useState } from 'react';
import { X, Search, CheckCircle2, Truck, MapPin, Package } from 'lucide-react';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [trackingNumber, setTrackingNumber] = useState('940011189922384910');
  const [hasSearched, setHasSearched] = useState(true);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setHasSearched(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center">
            <Truck size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-stone-900">
              Track Your USPS Package
            </h3>
            <p className="text-xs text-stone-500">
              Official United States Postal Service real-time delivery status
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter USPS Tracking # (e.g. 9400 1118 9922...)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full text-xs px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#2D5A43] bg-stone-50/50"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2D5A43] hover:bg-[#234734] text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Search size={15} /> Track Delivery Status
          </button>
        </form>

        {hasSearched && (
          <div className="mt-6 pt-6 border-t border-stone-100 space-y-4">
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-black text-stone-900">
                  USPS Ground Advantage™
                </span>
                <span className="bg-[#2D5A43] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  IN TRANSIT
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Tracking #: <strong>{trackingNumber}</strong>
              </p>
              <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                Expected Delivery: <strong>Tomorrow by 4:00 PM</strong>
              </p>
            </div>

            {/* Stepper */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#2D5A43] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-black text-stone-900">Departed USPS Regional Facility</p>
                  <p className="text-[11px] text-stone-500">US Regional Distribution Hub · Today, 6:42 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package size={18} className="text-[#2D5A43] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-black text-stone-900">Arrived at USPS Facility</p>
                  <p className="text-[11px] text-stone-500">Origin US Fulfillment Center · Yesterday, 4:15 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3 opacity-50">
                <MapPin size={18} className="text-stone-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-stone-700">Out for Delivery</p>
                  <p className="text-[11px] text-stone-400">Your Local Mail Carrier</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
