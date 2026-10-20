import React from 'react';
import { MapPin, Heart, ShieldCheck, Award, Sparkles, CheckCircle2, Leaf } from 'lucide-react';

export const AustinStorySection: React.FC = () => {
  return (
    <section id="story" className="py-16 sm:py-24 bg-[#FAF7F2] border-y border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story Narrative (Wix Studio Editorial Style) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#F9EDE8] text-[#C86446] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#F2D7CD]">
              <MapPin size={14} className="text-[#C86446]" />
              <span>Austin, Texas · Natural Design & Care</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2C2724] tracking-tight leading-[1.15]">
              Born in America’s Favorite Pet-Loving City.
            </h2>

            <p className="text-base text-[#686057] leading-relaxed">
              If you’ve ever walked along South Congress or jogged the Lady Bird Lake boardwalk on a Saturday morning, you know Austin doesn’t just tolerate pets—we adore them as full family members with high standards for health, materials, and happiness.
            </p>

            <p className="text-base text-[#686057] leading-relaxed">
              We founded <strong>Ling Petshop</strong> to bring the natural comfort, safety, and holistic care of a high-end Austin pet boutique directly to homes across all 50 US states. Every orthopedic bed, quiet water fountain, and ergonomic harness in our collection is vet-reviewed and shipped rapidly via USPS.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#E8E2D7]">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#2C2724] tabular-nums">
                  85,000+
                </p>
                <p className="text-xs text-[#8E867C] font-semibold mt-1">
                  Happy US Pets
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#C86446] tabular-nums">
                  4.9★
                </p>
                <p className="text-xs text-[#8E867C] font-semibold mt-1">
                  Average Rating
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#2C2724] tabular-nums">
                  2–4 Days
                </p>
                <p className="text-xs text-[#8E867C] font-semibold mt-1">
                  USPS Tracked
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual / Proof Card (Wix Floating Pill Card) */}
          <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-7 sm:p-9 border border-[#E8E2D7] shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C86446] to-[#A34E35] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Award size={28} className="text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#2C2724]">
                  The Ling Paw Promise
                </h4>
                <p className="text-xs font-semibold text-[#4E664D]">
                  100% Risk-Free 30-Day In-Home Trial
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#686057] leading-relaxed">
              Let your dog or cat test their new gear at home for 30 full days. If they don’t nap deeper, walk calmer, or drink more fresh water, we’ll refund your entire purchase. No restocking fees. No return shipping deductions.
            </p>

            <div className="space-y-3 pt-2 text-xs font-semibold text-[#4A443E]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-[#4E664D] flex-shrink-0" />
                <span>Fast dispatch from Texas, New Jersey & California hubs</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-[#4E664D] flex-shrink-0" />
                <span>Lab certified non-toxic, BPA-free, lead-free materials</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-[#4E664D] flex-shrink-0" />
                <span>2% of proceeds donated to Austin Animal Shelter & Rescues</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
