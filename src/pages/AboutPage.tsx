import React from 'react';
import { ShieldCheck, Leaf, Heart, Award, ArrowRight, Truck } from 'lucide-react';

interface AboutPageProps {
  onNavigateToShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToShop }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24">
      {/* Hero Section */}
      <div className="pt-16 pb-20 border-b border-[#E2E8F0] bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
            Our Story & Mission
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F2942] font-serif tracking-tight leading-[1.15]">
            Elevating everyday living with your four-legged family.
          </h1>
          <p className="text-base sm:text-xl text-[#64748B] font-light leading-relaxed max-w-2xl mx-auto">
            Ling Petshop was founded with one clear ambition: to design veterinarian-approved pet essentials that look right in modern American homes.
          </p>
        </div>
      </div>

      {/* Narrative Section with Lifestyle Photo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
              Why We Started
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2942] font-serif">
              Pet gear shouldn't be an eyesore or an afterthought.
            </h2>
            <p className="text-sm sm:text-base text-[#475569] font-light leading-relaxed">
              For decades, traditional big-box pet stores sold items manufactured from cheap, loud neon plastics, flimsy fabric that tears within weeks, and toxic dyes that irritate sensitive animal skin.
            </p>
            <p className="text-sm sm:text-base text-[#475569] font-light leading-relaxed">
              We took a radically different path: combining modern American interior aesthetics with veterinary ergonomics. Every curve of our donut beds cushions aching joints; every water fountain is built from food-grade stainless steel to eliminate feline chin acne; every harness uses zero-pull chest steering to protect delicate tracheas.
            </p>
            <div className="pt-2">
              <button
                onClick={onNavigateToShop}
                className="px-8 py-4 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer inline-flex items-center gap-2 shadow-md"
              >
                <span>Shop All Essentials</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl border border-[#E2E8F0]">
              <img
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=85"
                alt="Happy pet in modern home"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
              <Leaf size={22} />
            </div>
            <h3 className="text-xl font-bold font-serif text-[#0F2942]">Non-Toxic & Food-Grade</h3>
            <p className="text-xs text-[#64748B] leading-relaxed font-light">
              BPA-free silicone, 304 food-grade stainless steel, and natural organic catnip. Safe for curious chewers and tender noses.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] flex items-center justify-center text-[#059669]">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-xl font-bold font-serif text-[#0F2942]">30-Day Risk-Free Trial</h3>
            <p className="text-xs text-[#64748B] leading-relaxed font-light">
              We stand 100% behind our products. If your companion doesn't love their new bed, toy, or harness, we offer free returns and complete refunds.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
              <Truck size={22} />
            </div>
            <h3 className="text-xl font-bold font-serif text-[#0F2942]">Nationwide US Logistics</h3>
            <p className="text-xs text-[#64748B] leading-relaxed font-light">
              Dispatched quickly from our partner fulfillment hubs across the East Coast, West Coast, Florida, and Central US via USPS Ground Advantage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
