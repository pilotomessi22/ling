import React, { useState } from 'react';
import { Sparkles, Truck, Check } from 'lucide-react';

interface TopAnnouncementBarProps {
  onApplyPromo: (code: string) => void;
  onOpenTracking?: () => void;
}

export const TopAnnouncementBar: React.FC<TopAnnouncementBarProps> = ({
  onApplyPromo,
  onOpenTracking,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (code: string) => {
    onApplyPromo(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-[#0A192F] text-[#E2E8F0] border-b border-[#1E293B] relative z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-2 text-xs">
        {/* Left: Free delivery badge */}
        <div className="flex items-center gap-1.5 text-[#CBD5E1] text-[10px] sm:text-xs truncate">
          <Truck size={13} className="text-[#38BDF8] flex-shrink-0" />
          <span className="font-semibold text-white truncate">
            Free US Shipping $45+
          </span>
          <span className="text-[#475569] hidden md:inline">•</span>
          <span className="hidden md:inline text-[#94A3B8]">
            Dispatched in 24h via USPS
          </span>
        </div>

        {/* Right: Clean Promo Pill & Tracking */}
        <div className="flex items-center gap-2 flex-shrink-0 text-[10px] sm:text-xs">
          <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-[#1E293B] px-2 sm:px-2.5 py-0.5 rounded-full border border-[#334155]">
            <Sparkles size={10} className="text-[#38BDF8] hidden xs:inline" />
            <span className="text-[#CBD5E1] hidden sm:inline">Code:</span>
            <button
              onClick={() => handleCopyCode('LING20')}
              className="font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-1.5 sm:px-2 py-0.5 rounded-full transition-transform active:scale-95 cursor-pointer text-[9px] sm:text-[10px] tracking-wide"
              title="Click to apply promo code"
            >
              {copied ? 'COPIED!' : 'LING20'}
            </button>
            <span className="text-[#38BDF8] font-bold text-[9px] sm:text-[11px]">-20% OFF</span>
          </div>

          {onOpenTracking && (
            <button
              onClick={onOpenTracking}
              className="text-[#94A3B8] hover:text-white transition-colors text-[10px] sm:text-[11px] font-medium underline underline-offset-2 cursor-pointer hidden sm:inline"
            >
              Track Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
