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
      {/* 1. Hero Section with Attached Clean Artwork */}
      <section className="relative overflow-hidden w-full border-b border-[#E2E8F0] bg-gradient-to-b from-[#F8FAFC] via-[#F8FAFC] to-white pt-10 pb-12 sm:pt-16 sm:pb-20 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Real HTML Content */}
            <div className="lg:col-span-6 space-y-6 text-center sm:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider">
                <Leaf size={14} />
                <span>Nationwide US Delivery · 2–4 Business Days</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F2942] font-serif tracking-tight leading-[1.12]">
                Everyday essentials for happy, healthy pets.
              </h1>

              <p className="text-base sm:text-lg text-[#475569] font-light leading-relaxed max-w-xl mx-auto sm:mx-0">
                Thoughtfully crafted pet goods designed to soothe anxiety, protect joints, and blend seamlessly into your home. Backed by our 30-day risk-free in-home trial.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3.5">
                <button
                  onClick={() => onNavigateToShop('all')}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>Shop All Essentials</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={() => onNavigateToShop('Dogs')}
                  className="w-full sm:w-auto px-6 py-4 rounded-full bg-white text-[#0F2942] border border-[#CBD5E1] hover:bg-[#F8FAFC] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                >
                  View Dog Gear
                </button>
              </div>

              {/* Trust Callout Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs text-[#475569]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#2563EB]" />
                  <span className="font-medium">30-Day Risk-Free Trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#2563EB]" />
                  <span className="font-medium">Ships in 24h via USPS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-[#2563EB]" />
                  <span className="font-medium">Non-Toxic & Pet-Safe</span>
                </div>
              </div>
            </div>

            {/* Right Column: Complete Clean Artwork (Golden Retriever & Cat) */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center">
              <div className="relative w-full max-w-2xl overflow-hidden">
                <img
                  src="/assets/hero_pets_cozy_harmony.png"
                  alt="Golden retriever and companion cat in cozy home"
                  className="w-full h-auto object-contain object-right max-h-[460px] sm:max-h-[520px] lg:max-h-[580px] rounded-2xl sm:rounded-3xl"
                  loading="eager"
                  fetchPriority="high"
                />
                {/* Subtle soft white gradient blend on the left edge only */}
                <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/50 to-transparent pointer-events-none" />
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

                {/* 3 mini product image thumbnails */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div
                    onClick={() => onOpenCampaign?.()}
                    className="bg-white p-2 rounded-xl border border-[#E2E8F0] cursor-pointer hover:border-[#2563EB] transition-colors text-center"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5">
                      <img
                        src="/assets/campaign/grooming_gloves.png"
                        alt="Pet Grooming Gloves"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#0F2942] line-clamp-1 block">
                      1. Grooming Gloves
                    </span>
                  </div>

                  <div
                    onClick={() => onOpenCampaign?.()}
                    className="bg-white p-2 rounded-xl border border-[#E2E8F0] cursor-pointer hover:border-[#2563EB] transition-colors text-center"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5">
                      <img
                        src="/assets/campaign/zepetz_hair_remover.png"
                        alt="Zepetz Pet Hair Remover"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#0F2942] line-clamp-1 block">
                      2. Zepetz Hair Remover
                    </span>
                  </div>

                  <div
                    onClick={() => onOpenCampaign?.()}
                    className="bg-white p-2 rounded-xl border border-[#E2E8F0] cursor-pointer hover:border-[#2563EB] transition-colors text-center"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5">
                      <img
                        src="/assets/campaign/paw_cleaner.png"
                        alt="Pet Paw Cleaner"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#0F2942] line-clamp-1 block">
                      3. Pet Paw Cleaner
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

                <div className="space-y-2 pt-1 border-t border-[#F1F5F9]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F2942] block">
                    What's Included:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <span className="font-bold text-[#0F2942] block text-[11px]">1. Grooming Gloves</span>
                      <span className="text-[#64748B] text-[10px]">Gentle fur removal</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <span className="font-bold text-[#0F2942] block text-[11px]">2. Zepetz Remover</span>
                      <span className="text-[#64748B] text-[10px]">Reusable sofa tool</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <span className="font-bold text-[#0F2942] block text-[11px]">3. Paw Cleaner</span>
                      <span className="text-[#64748B] text-[10px]">Removes mud & dirt</span>
                    </div>
                  </div>
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
