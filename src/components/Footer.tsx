import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Award,
  ChevronRight,
  ArrowRight,
  Layers,
} from 'lucide-react';

interface FooterProps {
  onOpenTracking: () => void;
  onOpenSupplierHub: () => void;
  onOpenAdmin?: () => void;
  onOpenPolicyModal?: (title: string, content: string) => void;
  onNavigate?: (page: string, category?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTracking,
  onOpenSupplierHub,
  onOpenAdmin,
  onOpenPolicyModal,
  onNavigate,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  const handlePolicy = (title: string, content: string) => {
    if (onOpenPolicyModal) {
      onOpenPolicyModal(title, content);
    }
  };

  return (
    <footer className="bg-[#0A192F] text-[#94A3B8] relative selection:bg-[#2563EB] selection:text-white border-t border-[#1E293B]">
      {/* 4 Trust & Guarantee Cards (American DTC Standard in Royal Navy Theme) */}
      <div className="border-b border-[#1E293B] bg-gradient-to-b from-[#0F2942] to-[#0A192F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-[#38BDF8] text-xs font-semibold tracking-wider uppercase mb-3">
              <ShieldCheck size={14} className="text-[#38BDF8]" />
              <span>Protected Shopping · Nationwide US Fulfillment</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
              Fast, Guaranteed Delivery Across All 50 US States
            </h3>
            <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
              Dispatched from strategic US distribution centers across East, Central, and West coasts with 256-bit bank encryption and full 30-day trial protection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Fast US Delivery */}
            <div className="bg-[#112240] hover:bg-[#1B2D4F] transition-all border border-[#233554] rounded-2xl p-6 flex flex-col justify-between shadow-lg group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white shadow-md">
                    <Truck size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#1E293B] text-[#38BDF8] border border-[#334155]">
                    USPS & FedEx
                  </span>
                </div>
                <h4 className="text-base font-bold text-white tracking-tight group-hover:text-[#38BDF8] transition-colors font-serif">
                  Nationwide Express Delivery
                </h4>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed font-light">
                  Orders process in 24h. Standard delivery in <strong>2 to 4 business days</strong> anywhere in the continental US, Florida, California, New York, and beyond.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#233554] flex items-center justify-between text-xs text-[#38BDF8]">
                <button
                  onClick={onOpenTracking}
                  className="font-bold flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Track live package</span>
                  <ChevronRight size={13} />
                </button>
                <span className="text-[10px] text-[#64748B]">USPS Ground</span>
              </div>
            </div>

            {/* 2. 30-Day Risk-Free Trial */}
            <div className="bg-[#112240] hover:bg-[#1B2D4F] transition-all border border-[#233554] rounded-2xl p-6 flex flex-col justify-between shadow-lg group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#059669] to-[#34D399] flex items-center justify-center text-white shadow-md">
                    <RotateCcw size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#064E3B] text-[#6EE7B7] border border-[#047857]">
                    30-Day Trial
                  </span>
                </div>
                <h4 className="text-base font-bold text-white tracking-tight group-hover:text-[#6EE7B7] transition-colors font-serif">
                  100% In-Home Trial Guarantee
                </h4>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed font-light">
                  Let your pet test their new bed, feeder, or harness at home for 30 days. If either of you doesn't love it, we issue a prompt, 100% full refund.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#233554] flex items-center justify-between text-xs text-[#6EE7B7]">
                <button
                  onClick={() =>
                    handlePolicy(
                      '30-Day In-Home Risk-Free Trial & Returns',
                      'You have 30 days from the date of delivery to test our pet essentials in your home. If your dog or cat is not thrilled, email support@lingpetshop.com with your order number. We will provide a prepaid US return shipping label and issue a 100% refund to your original payment method.'
                    )
                  }
                  className="font-bold flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Refund policy</span>
                  <ChevronRight size={13} />
                </button>
                <span className="text-[10px] text-[#64748B]">Zero Risk</span>
              </div>
            </div>

            {/* 3. 256-Bit SSL Stripe Security */}
            <div className="bg-[#112240] hover:bg-[#1B2D4F] transition-all border border-[#233554] rounded-2xl p-6 flex flex-col justify-between shadow-lg group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#818CF8] flex items-center justify-center text-white shadow-md">
                    <Lock size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#312E81] text-[#A5B4FC] border border-[#4338CA]">
                    256-Bit SSL
                  </span>
                </div>
                <h4 className="text-base font-bold text-white tracking-tight group-hover:text-[#A5B4FC] transition-colors font-serif">
                  Bank-Grade Encryption
                </h4>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed font-light">
                  Protected by Stripe PCI-DSS Level 1 compliance. We accept Visa, Mastercard, American Express, Apple Pay, and Google Pay with zero stored card numbers.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#233554] flex items-center justify-between text-xs text-[#A5B4FC]">
                <button
                  onClick={() =>
                    handlePolicy(
                      'Security & Payment Privacy Policy',
                      'All checkout transactions are tokenized via Stripe using 256-bit SSL encryption. Your financial data is never stored on our servers. All transactions comply with strict US PCI-DSS standards.'
                    )
                  }
                  className="font-bold flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Security details</span>
                  <ChevronRight size={13} />
                </button>
                <span className="text-[10px] text-[#64748B]">Stripe Verified</span>
              </div>
            </div>

            {/* 4. Non-Toxic & Vet-Approved Materials */}
            <div className="bg-[#112240] hover:bg-[#1B2D4F] transition-all border border-[#233554] rounded-2xl p-6 flex flex-col justify-between shadow-lg group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#D97706] to-[#FBBF24] flex items-center justify-center text-white shadow-md">
                    <Award size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#451A03] text-[#FDE68A] border border-[#78350F]">
                    Non-Toxic
                  </span>
                </div>
                <h4 className="text-base font-bold text-white tracking-tight group-hover:text-[#FDE68A] transition-colors font-serif">
                  Vet-Approved Standards
                </h4>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed font-light">
                  100% BPA-free and lead-free materials, 304 food-grade stainless steel basins, and orthopedic memory foam designed for long-term pet joint decompression.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#233554] flex items-center justify-between text-xs text-[#FDE68A]">
                <span className="font-bold">Safe for All Companions</span>
                <span className="text-[10px] text-[#64748B]">Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#1E293B]">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0F2942] text-white flex items-center justify-center font-bold shadow-xs border border-[#233554]">
                🐾
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight font-serif">
                  LING <span className="text-[#2563EB]">PETSHOP</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B]">
                  Nationwide US · Modern Pet Essentials
                </span>
              </div>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed pr-4 font-light">
              Elevated pet essentials designed for everyday living in modern American homes. Focused on orthopedic well-being, non-toxic materials, and coast-to-coast US delivery.
            </p>

            <div className="space-y-2 text-xs text-[#94A3B8] pt-1">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#38BDF8]" />
                <span>US Fulfillment Centers: New Jersey, California, Texas & Florida</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#38BDF8]" />
                <span>support@lingpetshop.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('shop', 'all')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shop All Essentials
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('shop', 'Walk & Travel')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Walk & Travel Gear
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('shop', 'Beds')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Orthopedic Calming Beds
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('shop', 'Toys')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Interactive Toys & Puzzles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('shop', 'Feeding')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Wireless Fountains & Feeders
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Brand & Help */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Company & Help
            </h4>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('shipping-faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Nationwide Shipping & FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('cart')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  View Shopping Bag
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracking}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Existing Order
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    handlePolicy(
                      '30-Day Return & Exchange Policy',
                      'We provide 30-day hassle-free returns. Simply contact support@lingpetshop.com with your order ID for a prepaid return label.'
                    )
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Returns & Exchanges
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Club */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Join the Ling Club
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed font-light">
              Receive 15% off your first US order, seasonal product releases, and veterinary care guides.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center bg-[#112240] rounded-full border border-[#233554] px-3.5 py-1.5 focus-within:border-[#2563EB]">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder:text-[#64748B] outline-none"
                  required
                />
                <button
                  type="submit"
                  className="p-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-all cursor-pointer flex-shrink-0"
                  aria-label="Subscribe"
                >
                  {subscribed ? <Check size={14} /> : <ArrowRight size={14} />}
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-[#34D399]">
                  ✓ Welcome! Check your inbox for your 15% OFF code.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} Ling Petshop USA. All rights reserved. Shipped nationwide via USPS & FedEx.</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#94A3B8]">Payment Partners:</span>
            <span className="font-bold text-white">Visa · Mastercard · Amex · Apple Pay · Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
