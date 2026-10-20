import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Tag,
  Check,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  CartItem,
  calculateOrderTotals,
  formatCurrency,
  FREE_SHIPPING_THRESHOLD,
  REPEAT_DELIVERY_DISCOUNT_PERCENT,
} from '../utils/storeLogic.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  appliedPromo: string;
  onApplyPromo: (code: string) => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  appliedPromo,
  onApplyPromo,
  onOpenCheckout,
}) => {
  const [promoInput, setPromoInput] = useState(appliedPromo || 'LING20');

  if (!isOpen) return null;

  const totalCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const {
    subtotal,
    bundleDiscount,
    repeatDeliverySavings,
    promoDiscount,
    shipping,
    total,
    freeShippingQualified,
    amountNeededForFreeShipping,
    appliedPromo: activePromoLabel,
  } = calculateOrderTotals(items, appliedPromo);

  const progressPercent = Math.min(
    100,
    Math.round(((FREE_SHIPPING_THRESHOLD - amountNeededForFreeShipping) / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      onApplyPromo(promoInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#2C2724]/60 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Wix Studio Clean Header */}
          <div className="p-5 border-b border-[#E8E2D7] flex items-center justify-between bg-[#FAF7F2] text-[#2C2724]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EAE4DB] flex items-center justify-center text-[#2C2724]">
                <ShoppingBag size={17} />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight text-[#2C2724]">
                  Your Bag ({totalCount})
                </h2>
                <p className="text-[11px] text-[#8E867C] font-medium">Ling Petshop · Nationwide US Delivery</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#8E867C] hover:text-[#2C2724] hover:bg-[#EAE4DB] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Strip */}
          <div className="p-4 bg-white border-b border-[#F0EBE3]">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="flex items-center gap-1.5 text-[#2C2724]">
                <Truck size={14} className="text-[#C86446]" />
                {freeShippingQualified ? (
                  <span className="text-[#4E664D] font-bold">
                    You unlocked FREE Tracked US Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#C86446]">{formatCurrency(amountNeededForFreeShipping)}</strong> for Free Delivery
                  </span>
                )}
              </span>
              <span className="text-[11px] text-[#8E867C]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-[#F3EFEA] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  freeShippingQualified ? 'bg-[#4E664D]' : 'bg-[#C86446]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FAF7F2] border border-[#E8E2D7] flex items-center justify-center text-[#8E867C]">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-base font-bold text-[#2C2724]">Your bag is empty</h3>
                <p className="text-xs text-[#766E65] mt-1 max-w-xs mx-auto">
                  Explore our calming orthopedic beds, fountains, and natural chews.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 bg-[#C86446] hover:bg-[#B55539] text-white text-xs font-bold px-6 py-3 rounded-full cursor-pointer transition-all shadow-2xs"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemTotal =
                  (item.isRepeatDelivery
                    ? item.price * (1 - REPEAT_DELIVERY_DISCOUNT_PERCENT / 100)
                    : item.price) * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3.5 rounded-2xl border border-[#E8E2D7] bg-[#FAF7F2] hover:border-[#DFD8CC] transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-18 h-18 object-cover rounded-xl border border-[#EAE4DB] bg-white flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-[#2C2724] line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-[#8E867C] mt-0.5">
                            {item.size} · {item.color}
                          </p>

                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#A8A196] hover:text-[#C86446] transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#DFD8CC] rounded-full bg-white">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 px-2 text-[#766E65] hover:text-[#2C2724] transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-xs font-bold px-1.5 min-w-[20px] text-center text-[#2C2724]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 px-2 text-[#766E65] hover:text-[#2C2724] transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <span className="text-xs font-black text-[#2C2724] tabular-nums">
                          {formatCurrency(itemTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Area with Promo & Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E8E2D7] bg-[#FAF7F2] space-y-4">
              {/* Promo input */}
              <form onSubmit={handleApply} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. LING20)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full text-xs font-bold uppercase pl-8 pr-3 py-2.5 rounded-full border border-[#DFD8CC] focus:outline-none focus:border-[#C86446] bg-white shadow-2xs"
                  />
                  <Tag
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E867C]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#2C2724] hover:bg-black text-[#FAF7F2] font-semibold text-xs px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#686057]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2C2724] tabular-nums">
                    {formatCurrency(subtotal)}
                  </span>
                </div>



                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-[#4E664D] font-semibold">
                    <span>Bundle Discount</span>
                    <span className="tabular-nums">-{formatCurrency(bundleDiscount)}</span>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#4E664D] font-semibold">
                    <span>Promo Discount ({activePromoLabel})</span>
                    <span className="tabular-nums">-{formatCurrency(promoDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>US Tracked Shipping</span>
                  <span className="font-bold text-[#2C2724]">
                    {shipping === 0 ? (
                      <span className="text-[#4E664D] font-bold">FREE</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#E8E2D7] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#2C2724]">Total</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-[#2C2724] tabular-nums">
                      {formatCurrency(total)}
                    </span>
                    <span className="block text-[10px] text-[#8E867C] font-medium">
                      USPS Tracked Shipping included
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Action Button in Terracotta */}
              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full bg-[#C86446] hover:bg-[#B55539] text-white font-bold text-sm py-4 px-4 rounded-full shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>Checkout Now</span>
                <ArrowRight size={17} />
              </button>

              <div className="text-center text-[10px] text-[#766E65] flex items-center justify-center gap-1.5">
                <ShieldCheck size={13} className="text-[#4E664D]" />
                <span>256-Bit SSL Encrypted Checkout · Stripe Protected</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
