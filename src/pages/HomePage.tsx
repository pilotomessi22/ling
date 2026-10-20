import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Leaf,
  ChevronRight,
  Award,
} from 'lucide-react';

interface HomePageProps {
  onNavigateToShop: (category?: string) => void;
  onOpenPromo?: (code: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToShop,
}) => {
  const collections = [
    {
      title: 'Dogs',
      tagline: 'Orthopedic beds, zero-pull harnesses & durable play toys',
      image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=1200&q=85',
      category: 'Dogs',
    },
    {
      title: 'Cats',
      tagline: 'Whisper-quiet water fountains, scratching lounges & kickers',
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=85',
      category: 'Cats',
    },
    {
      title: 'Essential Gear',
      tagline: 'Elevated dining feeders, travel protectors & daily care',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1200&q=85',
      category: 'all',
    },
  ];

  return (
    <div className="bg-white text-[#0F172A]">
      {/* 1. Clean, Objective Hero Section (Royal Navy & Cobalt Blue) */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#E2E8F0] bg-gradient-to-b from-[#F8FAFC] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider">
                <Leaf size={14} />
                <span>Nationwide US Delivery · 2–4 Business Days</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F2942] font-serif tracking-tight leading-[1.12]">
                Everyday essentials for happy, healthy pets.
              </h1>

              <p className="text-base sm:text-lg text-[#64748B] font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                Thoughtfully crafted pet goods designed to soothe anxiety, protect joints, and blend seamlessly into your home. Backed by our 30-day risk-free in-home trial.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <button
                  onClick={() => onNavigateToShop('all')}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>Shop All Essentials</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={() => onNavigateToShop('Dogs')}
                  className="w-full sm:w-auto px-6 py-4 rounded-full bg-white text-[#0F2942] border border-[#CBD5E1] hover:bg-[#F8FAFC] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  View Dog Gear
                </button>
              </div>

              {/* Trust Callout Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#2563EB]" />
                  <span>30-Day Risk-Free Trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#2563EB]" />
                  <span>Ships in 24h via USPS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-[#2563EB]" />
                  <span>Non-Toxic & Pet-Safe</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image (Real dog in modern bright living room) */}
            <div className="lg:col-span-6">
              <div className="relative aspect-4/3 sm:aspect-5/4 rounded-3xl overflow-hidden shadow-2xl border border-[#E2E8F0] bg-[#F1F5F9]">
                <img
                  src="https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=1200&q=85"
                  alt="Dog resting peacefully on calming bed"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Exactly 3 Clean Collection Blocks (Direct, uncluttered navigation) */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
            Explore Collections
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2942] font-serif mt-1">
            Shop by Companion
          </h2>
          <p className="text-sm text-[#64748B] mt-2 font-light">
            Select a collection to browse veterinarian-approved essentials in our full store.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((col, idx) => (
            <div
              key={idx}
              onClick={() => onNavigateToShop(col.category)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-[#F1F5F9]">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-serif text-[#0F2942] group-hover:text-[#2563EB] transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1.5 font-light leading-relaxed">
                    {col.tagline}
                  </p>
                </div>
                <div className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] group-hover:underline">
                  <span>Explore Collection</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Clean Trust Banner (American Standard: 30-Day Guarantee & US Warehouses) */}
      <section className="py-16 bg-[#F8FAFC] border-t border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-2 mx-auto md:mx-0">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold font-serif text-[#0F2942]">30-Day Risk-Free Trial</h3>
              <p className="text-xs text-[#64748B] font-light leading-relaxed">
                Test products at home for 30 days. If your dog or cat does not love it, we issue a 100% full refund with free US returns.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-2 mx-auto md:mx-0">
                <Truck size={20} />
              </div>
              <h3 className="text-base font-bold font-serif text-[#0F2942]">Coast-to-Coast US Shipping</h3>
              <p className="text-xs text-[#64748B] font-light leading-relaxed">
                Fulfillment centers located in New Jersey, California, Texas, and Florida for 2 to 4 business days USPS delivery.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-2 mx-auto md:mx-0">
                <Award size={20} />
              </div>
              <h3 className="text-base font-bold font-serif text-[#0F2942]">100% Non-Toxic & Pet-Safe</h3>
              <p className="text-xs text-[#64748B] font-light leading-relaxed">
                All materials are certified BPA-free, lead-free, and veterinary-approved for joint support and digestive health.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
