import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Leaf,
  ChevronRight,
  Award,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface HomePageProps {
  onNavigateToShop: (category?: string) => void;
  onOpenPromo?: (code: string) => void;
  onOpenCampaign?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToShop,
  onOpenCampaign,
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
      {/* 1. Hero Section - Edge-to-Edge Full-Bleed Background Image */}
      <section className="relative overflow-hidden w-full min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] flex items-center border-b border-[#E2E8F0] bg-[#F8FAFC]">
        {/* Full-width Edge-to-Edge Background Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <img
            src="/assets/hero_pets_cozy_harmony.png"
            alt="Golden Retriever and Companion Cat"
            className="w-full h-full object-cover object-[82%_center] sm:object-[80%_center] lg:object-[78%_center]"
            loading="eager"
            fetchPriority="high"
          />
          {/* Smooth White-to-Transparent Gradient on Left Side Only for Crisp Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 via-55% to-transparent w-full sm:w-[70%] lg:w-[60%]" />
          {/* Subtle bottom gradient for a smooth section divider */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/80 to-transparent" />
        </div>

        {/* Foreground Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-xl lg:max-w-2xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF]/95 backdrop-blur-xs border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider shadow-xs">
              <Leaf size={14} />
              <span>Nationwide US Delivery · 2–4 Business Days</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F2942] font-serif tracking-tight leading-[1.12]">
              Everyday essentials for happy, healthy pets.
            </h1>

            <p className="text-base sm:text-lg text-[#334155] font-normal leading-relaxed max-w-xl">
              Thoughtfully crafted pet goods designed to soothe anxiety, protect joints, and blend seamlessly into your home. Backed by our 30-day risk-free in-home trial.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3.5">
              <button
                onClick={() => onNavigateToShop('all')}
                className="px-8 py-4 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Shop All Essentials</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => onNavigateToShop('Dogs')}
                className="px-6 py-4 rounded-full bg-white/90 hover:bg-white text-[#0F2942] border border-[#CBD5E1] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs backdrop-blur-xs flex items-center justify-center"
              >
                View Dog Gear
              </button>
            </div>

            {/* Trust Callout Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-start gap-6 text-xs text-[#334155] font-medium">
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
        </div>
      </section>

      {/* 2. Campaign Spotlight: The Ultimate Pet Cleanup Kit */}
      <section className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Image with badges */}
              <div className="lg:col-span-6">
                <div
                  onClick={() => onOpenCampaign?.()}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-[#E2E8F0] shadow-sm cursor-pointer group"
                >
                  <img
                    src="/assets/campaign/ultimate_cleanup_kit_cover.png"
                    alt="The Ultimate Pet Cleanup Kit"
                    className="w-full h-full object-contain p-2 group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <span className="bg-[#0F2942] text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      Special Campaign Bundle
                    </span>
                    <span className="bg-[#16A34A] text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      Save $27.20
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Copy & Order Action */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>The Ultimate Pet Cleanup Kit</span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F2942] font-serif leading-tight">
                    The Ultimate Pet Cleanup Kit – Grooming Gloves, Pet Hair Remover & Paw Cleaner
                  </h2>
                  <p className="text-sm sm:text-base font-semibold text-[#2563EB] mt-2">
                    Less Fur. Cleaner Paws. Happier Home.
                  </p>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
                    Keep your pets fresh and your home cleaner with three practical essentials for grooming, removing loose fur, and cleaning muddy paws.
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F1F5F9]">
                  <ul className="space-y-2 text-xs font-medium text-[#334155]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                      <strong className="text-[#0F2942]">Pet Grooming Gloves:</strong> Gentle fur removal & comforting massage
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                      <strong className="text-[#0F2942]">Zepetz Hair Remover:</strong> Reusable sofa & upholstery cleaner
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                      <strong className="text-[#0F2942]">Pet Paw Cleaner:</strong> Soft silicone bristles for muddy paws
                    </li>
                  </ul>
                </div>

                {/* Price & Purchase Actions */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                  <div>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-3xl font-black text-[#0F2942]">
                        $67.97
                      </span>
                      <span className="text-sm line-through text-[#94A3B8]">
                        $95.17
                      </span>
                      <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        29% Off Bundle
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B] block mt-0.5">
                      Includes all 3 essentials · Ships in 24h via USPS
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenCampaign?.()}
                    className="px-6 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <span>View Campaign Kit</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Exactly 3 Clean Collection Blocks (Direct, uncluttered navigation) */}
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
