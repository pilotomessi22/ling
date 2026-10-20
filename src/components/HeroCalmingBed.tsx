import React, { useState } from 'react';
import { Star, ShieldCheck, Truck, Check, Sparkles, Heart } from 'lucide-react';
import { PRODUCTS } from '../data/storeData.ts';
import { formatCurrency, getItemUnitPrice } from '../utils/storeLogic.ts';

interface HeroCalmingBedProps {
  onAddToCart: (item: {
    sku: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
    supplierCost: number;
    addOn?: {
      enabled: boolean;
      name: string;
      price: number;
    };
  }) => void;
}

export const HeroCalmingBed: React.FC<HeroCalmingBedProps> = ({
  onAddToCart,
}) => {
  const bed = PRODUCTS[0]; // The Cloud9 Calming Bed
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(1); // Medium default
  const [selectedColorIndex, setSelectedColorIndex] = useState(0); // Austin Sage default
  const [bundleTier, setBundleTier] = useState<1 | 2 | 3>(2); // 2-pack default (high AOV!)
  const [includeSpareCover, setIncludeSpareCover] = useState(false);
  const [added, setAdded] = useState(false);

  const selectedSize = bed.sizes![selectedSizeIndex];
  const selectedColor = bed.colors![selectedColorIndex];

  // Pricing calculations
  const baseUnitPrice = bed.price;
  const unitPrice = getItemUnitPrice(baseUnitPrice, bundleTier);
  const bundleTotalPrice = unitPrice * bundleTier;
  const addOnTotal = includeSpareCover ? 14.95 * bundleTier : 0;
  const finalOrderTotal = Number((bundleTotalPrice + addOnTotal).toFixed(2));
  const rawCompareTotal = bed.compareAt * bundleTier;
  const totalSavings = Number((rawCompareTotal - finalOrderTotal).toFixed(2));

  const handleBuy = () => {
    onAddToCart({
      sku: `${bed.sku}-${selectedSize.name.slice(0, 1)}-${selectedColor.name.replace(/\s+/g, '')}`,
      name: bed.name,
      price: baseUnitPrice,
      quantity: bundleTier,
      size: selectedSize.name,
      color: selectedColor.name,
      image: bed.heroImage,
      supplierCost: bed.supplierCost,
      addOn: includeSpareCover
        ? {
            enabled: true,
            name: 'Spare Waterproof Quick-Zip Cover',
            price: 14.95,
          }
        : undefined,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <section className="bg-gradient-to-b from-[#FBF9F5] via-white to-[#FBF9F5] py-10 sm:py-14 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Visual Showcase & Pet Social Proof */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Hero Photo Container with Fallback */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 shadow-md border border-stone-200/80 group">
              <img
                src={bed.heroImage}
                alt={bed.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                loading="eager"
                onError={(e) => {
                  // Resilient styled fallback
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = document.getElementById('hero-img-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />

              <div
                id="hero-img-fallback"
                className="hidden absolute inset-0 bg-[#E8F0EC] items-center justify-center p-8 text-center flex-col"
              >
                <div className="w-20 h-20 rounded-full bg-[#2D5A43] text-white flex items-center justify-center mb-3">
                  <Heart size={36} />
                </div>
                <h3 className="text-xl font-bold text-stone-900">{bed.name}</h3>
                <p className="text-xs text-stone-600 max-w-sm mt-1">
                  Engineered with raised orthopedic bolsters for joint relief and deep sleep.
                </p>
              </div>
            </div>

            {/* Social Proof & Rating Bar Cleanly Below Photo */}
            <div className="bg-white rounded-xl p-3 shadow-xs border border-stone-200/80 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 stroke-amber-500" />
                  ))}
                </div>
                <span className="text-xs font-extrabold text-stone-800">
                  4.9 / 5.0
                </span>
                <span className="text-xs text-stone-500 hidden sm:inline">
                  (14,800+ Verified US Pet Parents)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                  ✓ Vet Approved
                </span>
                <span className="text-[11px] font-bold text-[#2D5A43] bg-emerald-50/50 border border-emerald-100 px-2 py-0.5 rounded-full hidden md:inline">
                  #1 Ranked in Texas
                </span>
              </div>
            </div>

            {/* Benefit Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-stone-700 font-semibold pt-1">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center flex flex-col items-center">
                <span className="text-base mb-0.5">🧠</span>
                <span>Relieves Anxiety</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center flex flex-col items-center">
                <span className="text-base mb-0.5">🦴</span>
                <span>Joint Decompression</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center flex flex-col items-center">
                <span className="text-base mb-0.5">🧼</span>
                <span>Machine Washable</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center flex flex-col items-center">
                <span className="text-base mb-0.5">🚚</span>
                <span>Ships in 24 Hours</span>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Purchase & Multi-Pack Bundle Engine */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span className="font-bold text-[#2D5A43] uppercase tracking-wider text-[11px]">
                  Austin, TX Signature Series
                </span>
                <span className="text-amber-700 bg-amber-50 font-bold px-2 py-0.5 rounded-full text-[10px]">
                  ⚡ Low Stock: 8 Beds Remaining
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                {bed.name}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                {bed.tagline}
              </p>
            </div>

            {/* 1. Size Selection with US Pet Weight Guidelines */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 flex justify-between">
                <span>Select Size:</span>
                <span className="text-[#2D5A43] font-black">
                  {selectedSize.name} — {selectedSize.weightLabel}
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {bed.sizes!.map((s, idx) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSizeIndex(idx)}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                      selectedSizeIndex === idx
                        ? 'border-[#2D5A43] bg-emerald-50/50 ring-2 ring-[#2D5A43]/20'
                        : 'border-stone-200 hover:border-stone-400 bg-stone-50/40'
                    }`}
                  >
                    <p className="font-extrabold text-stone-900">{s.name}</p>
                    <p className="text-[10px] text-stone-500 truncate">{s.weightLabel}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Color Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 flex justify-between">
                <span>Select Color:</span>
                <span className="font-extrabold text-[#2D5A43]">
                  {selectedColor.name}
                </span>
              </label>
              <div className="flex items-center gap-3">
                {bed.colors!.map((c, idx) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                      selectedColorIndex === idx
                        ? 'border-[#2D5A43] bg-stone-100 ring-2 ring-[#2D5A43]/20 text-stone-900'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full ${c.class} border border-stone-300`}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Tiered Bundle & Save Selector (US High-Converting Marketing Hook) */}
            <div className="space-y-2.5 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-stone-900 uppercase tracking-wide">
                  Bundle & Save (Multi-Pet Savings)
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-md">
                  Most US Families Buy 2+
                </span>
              </div>

              <div className="space-y-2">
                {/* 1 Bed */}
                <button
                  type="button"
                  onClick={() => setBundleTier(1)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                    bundleTier === 1
                      ? 'border-[#2D5A43] bg-emerald-50/40 ring-2 ring-[#2D5A43]/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-stone-900">
                      Buy 1 Bed (Standard)
                    </span>
                    <span className="block text-[11px] text-stone-500">
                      Great for single-pet rooms
                    </span>
                  </div>
                  <span className="text-sm font-black text-stone-900">
                    $44.95
                  </span>
                </button>

                {/* 2 Beds - 15% OFF */}
                <button
                  type="button"
                  onClick={() => setBundleTier(2)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all relative ${
                    bundleTier === 2
                      ? 'border-[#2D5A43] bg-emerald-50/60 ring-2 ring-[#2D5A43]/30 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="absolute -top-2 right-4 bg-[#2D5A43] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                    Most Popular · Save 15%
                  </span>
                  <div>
                    <span className="text-xs font-bold text-stone-900">
                      Buy 2 Beds (Bedroom + Living Room)
                    </span>
                    <span className="block text-[11px] text-emerald-700 font-semibold">
                      Only $37.95 each (You save $14.00!)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#2D5A43]">
                      $75.90
                    </span>
                    <span className="block text-[10px] text-stone-400 line-through">
                      $89.90
                    </span>
                  </div>
                </button>

                {/* 3 Beds - 25% OFF */}
                <button
                  type="button"
                  onClick={() => setBundleTier(3)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all relative ${
                    bundleTier === 3
                      ? 'border-[#2D5A43] bg-emerald-50/60 ring-2 ring-[#2D5A43]/30 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="absolute -top-2 right-4 bg-amber-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                    Best Value · Save 25%
                  </span>
                  <div>
                    <span className="text-xs font-bold text-stone-900">
                      Buy 3 Beds (Whole Home Sanctuary)
                    </span>
                    <span className="block text-[11px] text-emerald-700 font-semibold">
                      Only $32.95 each (You save $36.00!)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#2D5A43]">
                      $98.85
                    </span>
                    <span className="block text-[10px] text-stone-400 line-through">
                      $134.85
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Optional Add-on Checkbox */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="spare-cover"
                checked={includeSpareCover}
                onChange={(e) => setIncludeSpareCover(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#2D5A43] rounded border-stone-300 focus:ring-[#2D5A43]"
              />
              <label htmlFor="spare-cover" className="text-xs text-stone-700 cursor-pointer flex-1">
                <span className="font-bold text-stone-900">
                  Add Waterproof Quick-Zip Spare Cover (+ $14.95/ea)
                </span>
                <span className="block text-[11px] text-stone-500 mt-0.5">
                  Never leave your dog without a bed while one cover is in the wash.
                </span>
              </label>
            </div>

            {/* Price & Primary CTA */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-stone-500 font-bold block">
                    Total Investment:
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#2D5A43] tracking-tight">
                      {formatCurrency(finalOrderTotal)}
                    </span>
                    <span className="text-xs text-stone-400 line-through font-semibold">
                      {formatCurrency(rawCompareTotal)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-emerald-100 text-[#2D5A43] font-black text-[11px] px-2.5 py-1 rounded-md">
                    Total Savings: {formatCurrency(totalSavings)}
                  </span>
                  <span className="block text-[10px] text-stone-500 font-medium mt-1">
                    🇺🇸 Free Tracked US Delivery Included
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleBuy}
                className="w-full bg-[#2D5A43] hover:bg-[#234734] text-white font-extrabold text-base py-4 px-6 rounded-2xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {added ? (
                  <>
                    <Check size={20} className="stroke-[3]" /> Added to Your Bag!
                  </>
                ) : (
                  <>Add to Bag & Claim Savings</>
                )}
              </button>

              <div className="text-center text-[11px] text-stone-500 flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="text-[#2D5A43]" />
                <span>30-Day "Happy Tail" 100% Risk-Free Paw Promise</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
