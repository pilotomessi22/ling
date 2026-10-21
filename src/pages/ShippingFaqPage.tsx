import React, { useState } from 'react';
import { Truck, ShieldCheck, RotateCcw, Package, HelpCircle, ChevronDown, ChevronUp, Mail } from 'lucide-react';

interface ShippingFaqPageProps {
  onOpenTracking: () => void;
  onNavigateToShop: () => void;
}

export const ShippingFaqPage: React.FC<ShippingFaqPageProps> = ({
  onOpenTracking,
  onNavigateToShop,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Where do you ship within the United States?',
      a: 'We ship to all 50 US states (including Florida, California, New York, Texas, Washington, Illinois, and beyond), as well as Alaska, Hawaii, and Puerto Rico. Orders are automatically routed to the nearest regional US warehouse for rapid fulfillment.',
    },
    {
      q: 'How fast is order processing and shipping delivery?',
      a: 'All orders are processed and dispatched within 24 business hours from our US distribution centers. Standard shipping via USPS Ground Advantage or FedEx typically delivers within 2 to 4 business days directly to your doorstep.',
    },
    {
      q: 'Do you offer free shipping?',
      a: 'Yes! We offer 100% Free Nationwide US Shipping on all orders of $45 or more. For orders under $45, a low flat-rate standard fee of $4.95 is applied at checkout.',
    },
    {
      q: 'How does the 30-Day Risk-Free In-Home Trial work?',
      a: 'We want you and your pet to be completely happy. You have 30 days from the day your package arrives to test our beds, harnesses, toys, or bowls in your home. If your dog or cat does not love it, simply contact our support team for a prepaid return label and a 100% full refund.',
    },
    {
      q: 'How do I track my package once shipped?',
      a: 'As soon as your order is dispatched, you will receive an email and SMS confirmation containing your official USPS tracking code. You can also click the "Track Order" button in our top menu anytime to check live delivery milestones.',
    },
    {
      q: 'Are your materials safe and certified for pets?',
      a: 'Yes, 100%. All plastics used in our toys and feeders are independently certified BPA-free, lead-free, and phthalate-free. Our water fountains and bowls use 304 food-grade stainless steel, and our beds feature orthopedic memory foam with removable, hypoallergenic covers.',
    },
    {
      q: 'What is Subscribe & Save (Auto-Ship)?',
      a: 'Our Auto-Ship program gives you an instant 35% discount on eligible essentials (like calming chews, replacement carbon filters, and dental rings). You can adjust frequency, pause, or cancel anytime with one click in your account with zero penalty fees.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24">
      {/* Header */}
      <div className="pt-16 pb-20 border-b border-[#E2E8F0] bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
            Transparent US Logistics
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F2942] font-serif tracking-tight leading-[1.15]">
            Nationwide Shipping & FAQ
          </h1>
          <p className="text-base sm:text-lg text-[#64748B] font-light max-w-2xl mx-auto">
            Everything you need to know about our coast-to-coast US distribution network, 2–4 day delivery, and 30-day risk-free in-home trial.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={onOpenTracking}
              className="px-6 py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2 shadow-md"
            >
              <Package size={15} />
              <span>Track Existing Order</span>
            </button>
            <button
              onClick={onNavigateToShop}
              className="px-6 py-3 rounded-full bg-white text-[#0F2942] border border-[#CBD5E1] text-xs font-bold uppercase tracking-wider hover:bg-[#F8FAFC] transition-all cursor-pointer"
            >
              Shop Essentials
            </button>
          </div>
        </div>
      </div>

      {/* 3 Pillars Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] space-y-2 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] mb-3">
              <Truck size={22} />
            </div>
            <h3 className="text-lg font-bold font-serif text-[#0F2942]">2–4 Business Days Delivery</h3>
            <p className="text-xs text-[#64748B] font-light leading-relaxed">
              Dispatched within 24h via USPS Priority and Ground Advantage from our Central Warehouse.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] space-y-2 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] flex items-center justify-center text-[#059669] mb-3">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-lg font-bold font-serif text-[#0F2942]">30-Day Risk-Free Trial</h3>
            <p className="text-xs text-[#64748B] font-light leading-relaxed">
              Test products at home. If your pet isn't thrilled, return them within 30 days for an effortless, 100% full refund.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] space-y-2 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] mb-3">
              <RotateCcw size={22} />
            </div>
            <h3 className="text-lg font-bold font-serif text-[#0F2942]">Prepaid US Return Labels</h3>
            <p className="text-xs text-[#64748B] font-light leading-relaxed">
              No restocking fees or return shipping costs. Simply email our US support team and we issue a printable prepaid USPS label.
            </p>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold font-serif text-[#0F2942] text-center mb-6">
            Frequently Asked Questions
          </h2>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-[#0F2942] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-[#2563EB] flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown size={18} className="text-[#94A3B8] flex-shrink-0 ml-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-[#475569] leading-relaxed border-t border-[#F1F5F9]">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-16 max-w-xl mx-auto p-8 rounded-3xl bg-white border border-[#E2E8F0] text-center shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto">
            <Mail size={18} />
          </div>
          <h4 className="text-base font-bold text-[#0F2942] font-serif">Have questions about your order?</h4>
          <p className="text-xs text-[#64748B] font-light leading-relaxed">
            Our US-based support team responds within 2-4 hours Monday through Saturday.
          </p>
          <a
            href="mailto:support@lingpetshop.com"
            className="inline-block mt-2 text-xs font-bold text-[#2563EB] hover:underline"
          >
            support@lingpetshop.com
          </a>
        </div>
      </div>
    </div>
  );
};
