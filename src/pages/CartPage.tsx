import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Tag,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { CartItem, calculateOrderTotals, FREE_SHIPPING_THRESHOLD } from '../utils/storeLogic.ts';
import { formatCurrency } from '../utils/storeLogic.ts';

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  appliedPromo: string;
  onApplyPromo: (code: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  appliedPromo,
  onApplyPromo,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<string | null>(null);

  const calc = calculateOrderTotals(items, appliedPromo);
  const { subtotal, shipping, total, amountNeededForFreeShipping } = calc;
  const discount = calc.bundleDiscount + calc.repeatDeliverySavings + calc.promoDiscount;
  const isFreeShipping = calc.freeShippingQualified;

  const totalCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    if (clean === 'LING20' || clean === 'VIP10' || clean === 'WELCOME15') {
      onApplyPromo(clean);
      setPromoMsg(`Promo code "${clean}" applied successfully!`);
      setPromoInput('');
    } else {
      setPromoMsg('Invalid promo code. Try "LING20" for 20% off.');
    }
    setTimeout(() => setPromoMsg(null), 3500);
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round(((FREE_SHIPPING_THRESHOLD - amountNeededForFreeShipping) / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2942] tracking-tight font-serif">
              Shopping Bag
            </h1>
            <p className="text-sm text-[#64748B] mt-1 font-light">
              Review your selected pet essentials before proceeding to checkout.
            </p>
          </div>
          <button
            onClick={onContinueShopping}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-[#E2E8F0] shadow-sm max-w-2xl mx-auto p-8">
            <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-2xl font-bold font-serif text-[#0F2942]">Your Bag is Empty</h2>
            <p className="text-sm text-[#64748B] mt-2 font-light">
              Looks like you haven't added any items to your shopping bag yet.
            </p>
            <button
              onClick={onContinueShopping}
              className="mt-6 px-8 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <span>Explore Essentials</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Items List */}
            <div className="lg:col-span-7 space-y-4">
              {/* Free Shipping Progress Meter */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-[#0F2942]">
                    <Truck size={15} className="text-[#2563EB]" />
                    {isFreeShipping ? (
                      <strong className="text-[#16A34A]">You unlocked FREE Nationwide US Shipping!</strong>
                    ) : (
                      <span>
                        Add <strong>{formatCurrency(amountNeededForFreeShipping)}</strong> more for FREE Shipping!
                      </span>
                    )}
                  </span>
                  <span className="text-[#64748B] font-bold">{freeShippingProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm divide-y divide-[#F1F5F9] overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F1F5F9] border border-[#E2E8F0] flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-[#0F2942] font-serif leading-snug">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#94A3B8] hover:text-[#EF4444] p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mt-1">
                        {item.size && <span>Size: <strong className="text-[#0F2942]">{item.size}</strong></span>}
                        {item.color && <span>Color: <strong className="text-[#0F2942]">{item.color}</strong></span>}

                      </div>

                      {/* Controls and Price */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border border-[#E2E8F0] rounded-full bg-[#F8FAFC]">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="px-3 py-1 text-[#64748B] hover:text-[#0F2942] font-bold cursor-pointer"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-[#0F2942]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="px-3 py-1 text-[#64748B] hover:text-[#0F2942] font-bold cursor-pointer"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <span className="text-base font-black text-[#0F2942]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input Box */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      placeholder="Promo code (try LING20)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F8FAFC] rounded-full border border-[#E2E8F0] focus:outline-hidden focus:border-[#2563EB] text-[#0F2942]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#0F2942] hover:bg-[#1E3A8A] text-white text-xs font-bold cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </form>
                {promoMsg && (
                  <p className="text-xs text-[#2563EB] font-semibold mt-2 pl-2">
                    {promoMsg}
                  </p>
                )}
                {appliedPromo && (
                  <p className="text-xs text-[#16A34A] font-semibold mt-2 pl-2 flex items-center gap-1">
                    <Check size={13} /> Promo code <strong>{appliedPromo}</strong> is active!
                  </p>
                )}
              </div>
            </div>

            {/* Right 5 Columns: Order Summary */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
                <h2 className="text-lg font-bold font-serif text-[#0F2942]">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs text-[#64748B] border-b border-[#F1F5F9] pb-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalCount} items)</span>
                    <span className="font-bold text-[#0F2942]">{formatCurrency(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-[#16A34A] font-semibold">
                      <span>Discount ({appliedPromo})</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated US Shipping</span>
                    <span className="font-bold text-[#0F2942]">
                      {shipping === 0 ? <strong className="text-[#16A34A]">FREE</strong> : formatCurrency(shipping)}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-base font-bold text-[#0F2942]">Total</span>
                  <span className="text-2xl font-black text-[#0F2942] tracking-tight">
                    {formatCurrency(total)}
                  </span>
                </div>

                {/* Big Checkout CTA Button */}
                <button
                  onClick={onProceedToCheckout}
                  className="w-full py-4 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-98 flex items-center justify-center gap-2"
                >
                  <Lock size={15} />
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={15} />
                </button>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-[#F1F5F9] space-y-2.5 text-xs text-[#64748B] font-light">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#2563EB] flex-shrink-0" />
                    <span>30-Day Risk-Free In-Home Trial Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-[#2563EB] flex-shrink-0" />
                    <span>Ships in 24h via USPS from regional US centers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw size={16} className="text-[#2563EB] flex-shrink-0" />
                    <span>Free prepaid US returns if your pet isn't thrilled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
