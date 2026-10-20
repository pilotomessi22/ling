import React from 'react';
import { ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';

export const TrustBenefits: React.FC = () => {
  const benefits = [
    {
      icon: <ShieldCheck size={36} className="text-[#00a84e]" />,
      title: 'Secure Checkout',
      description: 'Bank-grade 256-bit encrypted card processing',
    },
    {
      icon: <Truck size={36} className="text-[#00a84e]" />,
      title: 'Fast Tracked US Shipping',
      description: 'Dispatched within 24h with official USPS tracking',
    },
    {
      icon: <Headphones size={36} className="text-[#00a84e]" />,
      title: '24/7 Dedicated Support',
      description: 'US-based pet care team ready to help anytime',
    },
    {
      icon: <RotateCcw size={36} className="text-[#00a84e]" />,
      title: '30-Day In-Home Trial',
      description: 'Love it or return it for a 100% full refund',
    },
  ];

  return (
    <section className="py-12 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50/70 border border-zinc-100 hover:border-zinc-200 transition-colors"
            >
              <div className="flex-shrink-0 p-2.5 bg-white rounded-lg shadow-sm border border-zinc-100">
                {b.icon}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-zinc-900 tracking-tight">
                  {b.title}
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-snug">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
