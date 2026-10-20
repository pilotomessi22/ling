import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Heart } from 'lucide-react';
import { RECENT_US_PURCHASES } from '../data/storeData.ts';

export const RecentSaleToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % RECENT_US_PURCHASES.length);
        setVisible(true);
      }, 1000);
    }, 12000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  const current = RECENT_US_PURCHASES[index];

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-xs sm:max-w-sm bg-white rounded-2xl shadow-xl border border-stone-200/90 p-3.5 transition-all animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2D5A43] flex items-center justify-center flex-shrink-0">
          <Heart size={18} className="fill-[#2D5A43]" />
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1 text-[11px] font-black text-stone-900">
            <CheckCircle size={12} className="text-emerald-600 flex-shrink-0" />
            <span className="truncate">{current.name} in {current.city}</span>
          </div>
          <p className="text-xs text-stone-600 truncate mt-0.5">
            Purchased {current.item}
          </p>
          <span className="text-[10px] text-stone-400 font-medium">
            Verified US Order · {current.timeAgo}
          </span>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="absolute top-2.5 right-2.5 text-stone-400 hover:text-stone-700 p-0.5"
          aria-label="Close alert"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
};
