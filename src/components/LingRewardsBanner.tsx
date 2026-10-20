import React, { useState } from 'react';
import { Gift, Check, Sparkles, ArrowRight, Leaf } from 'lucide-react';

interface LingRewardsBannerProps {
  onJoinPerks?: () => void;
}

export const LingRewardsBanner: React.FC<LingRewardsBannerProps> = ({ onJoinPerks }) => {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setJoined(true);
    if (onJoinPerks) onJoinPerks();
  };

  return (
    <section className="bg-[#FAF7F2] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#2C2724] via-[#38322E] to-[#2C2724] border border-[#48413B] rounded-[2.5rem] p-8 sm:p-12 text-[#FAF7F2] shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Subtle warm glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#C86446]/20 to-[#E0A96D]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-1.5 bg-[#C86446] text-white font-semibold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider mb-4 shadow-2xs">
              <Leaf size={13} />
              <span>Ling VIP Pet Club · Free Membership</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-[#FAF7F2] tracking-tight leading-tight">
              Unlock $15 in Welcome Rewards & Free Delivery
            </h3>
            <p className="text-sm sm:text-base text-[#D7D0C5] mt-2 max-w-2xl leading-relaxed">
              Join 85,000+ pet parents choosing natural nutrition, calming orthopedic beds, and vet-reviewed wellness with fast USPS delivery across all 50 US states.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-[#C2BAAE]">
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-[#8FB78E]" /> Free instant sign-up
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-[#8FB78E]" /> $15 bonus voucher on $75+
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-[#8FB78E]" /> Extra 10% off auto-shipments
              </span>
            </div>
          </div>

          <div className="w-full lg:w-auto flex-shrink-0 z-10">
            {joined ? (
              <div className="bg-[#4E664D] text-white px-7 py-5 rounded-2xl flex items-center gap-3 shadow-lg">
                <div className="p-2 bg-white/20 rounded-full">
                  <Check size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Welcome to the Club!</p>
                  <p className="text-xs text-[#D8EADB]">Check your inbox for your $15 voucher code.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-md w-full">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full sm:w-72 bg-white/10 text-white placeholder-[#A8A196] border border-white/20 rounded-full px-5 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#C86446] focus:bg-white/15 transition-all"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#C86446] hover:bg-[#B55539] text-white font-bold text-xs px-6 py-3.5 rounded-full transition-transform active:scale-95 cursor-pointer whitespace-nowrap shadow-md flex items-center justify-center gap-2"
                >
                  <span>Claim $15</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
