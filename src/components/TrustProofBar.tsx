import React from 'react';
import { Truck, RotateCcw, ShieldCheck, MapPin, Sparkles, Leaf } from 'lucide-react';

export const TrustProofBar: React.FC = () => {
  const pillars = [
    {
      icon: <Truck size={22} className="text-[#C86446]" />,
      badge: 'Fast & Tracked',
      badgeClass: 'bg-[#F9EDE8] text-[#C86446] border-[#F2D7CD]',
      title: 'Free US Delivery $45+',
      desc: 'Dispatched via USPS Ground Advantage in 3–5 business days to all 50 states.',
    },
    {
      icon: <ShieldCheck size={22} className="text-[#4E664D]" />,
      badge: 'Zero Risk',
      badgeClass: 'bg-[#EDF3EC] text-[#4E664D] border-[#D5E4D4]',
      title: '30-Day Happiness Trial',
      desc: 'If your pet is not completely in love within 30 days, enjoy an effortless 100% refund.',
    },
    {
      icon: <RotateCcw size={22} className="text-[#8D6B4F]" />,
      badge: 'Save 35%',
      badgeClass: 'bg-[#F4EFEA] text-[#8D6B4F] border-[#E2D8CC]',
      title: 'Flexible Auto-Delivery',
      desc: '35% off your first subscription + 5% off recurring orders. Pause or cancel with 1 click.',
    },
    {
      icon: <MapPin size={22} className="text-[#B87333]" />,
      badge: 'Austin, TX',
      badgeClass: 'bg-[#FBF6EE] text-[#B87333] border-[#EDE0CC]',
      title: 'Fulfilled From the USA',
      desc: 'Stocked in American distribution hubs with strict veterinary wellness inspection.',
    },
  ];

  return (
    <section className="bg-[#F5F1EA] py-8 border-y border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#E8E2D7] shadow-2xs hover:shadow-md hover:border-[#D5CDC0] transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#EAE4DB] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                {p.icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${p.badgeClass}`}
                  >
                    {p.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#2C2724] tracking-tight">
                  {p.title}
                </h4>
                <p className="text-xs text-[#766E65] mt-1 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
