import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Copy,
  Check,
  Package,
  MapPin,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  CartItem,
  ShippingAddress,
  calculateOrderTotals,
  formatCurrency,
  formatDropshippingOrderPayload,
} from '../utils/storeLogic.ts';
import { getStateFromZip } from '../utils/shippingCalculator.ts';
import { US_STATES, PRODUCT_SUPPLIER_CATALOG } from '../data/storeData.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedPromo: string;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedPromo,
  onClearCart,
}) => {
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    streetAddress: '',
    aptOrSuite: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: '',
    deliveryMethod: 'shipping',
  });

  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'paypal'>('apple_pay');
  const [deliveryOption, setDeliveryOption] = useState<'usps_ground' | 'usps_priority'>('usps_ground');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copiedPayload, setCopiedPayload] = useState(false);

  if (!isOpen) return null;

  const hasOutOfStock = items.some((i) => i.stockCount === 0 || i.inStock === false);

  const baseCalculations = calculateOrderTotals(
    items,
    appliedPromo,
    'shipping',
    address.state,
    address.zipCode,
    deliveryOption
  );

  const shippingCost = baseCalculations.shipping;
  const finalTotal = baseCalculations.total;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasOutOfStock) {
      alert('Não é possível concluir o pedido: um ou mais itens no carrinho estão esgotados no fornecedor Zendrop.');
      return;
    }
    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerEmail: address.email,
          currency: 'usd',
          domainUrl: window.location.origin,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar sessão de checkout na Stripe.');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout da Stripe não retornada.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.message || 'Erro ao processar checkout com Stripe.');
    }
  };

  const supplierPayload = formatDropshippingOrderPayload(
    orderId || 'LP-PREVIEW',
    items,
    address
  );

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(supplierPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto my-6 border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close checkout"
        >
          <X size={20} />
        </button>

        {!orderComplete ? (
          <div>
            {/* Header */}
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#E31837] tracking-wider">
                <ShieldCheck size={16} />
                <span>256-Bit Encrypted US Checkout</span>
              </div>
              <h2 className="text-2xl font-black text-[#002855] tracking-tight mt-1">
                Express Checkout · Ling Petshop
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Official US Online Store · Fast Tracked USPS Shipping to All 50 States
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Delivery Preference */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-2">
                  1. Choose USPS Shipping Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setDeliveryOption('usps_ground')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      deliveryOption === 'usps_ground'
                        ? 'border-[#002855] bg-blue-50/50 ring-2 ring-[#002855]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <Truck size={14} className="text-[#002855]" />
                        USPS Ground Advantage
                      </span>
                      <span className="text-xs font-black text-emerald-700">
                        {baseCalculations.freeShippingQualified || shippingCost === 0
                          ? 'FREE'
                          : shippingCost !== null
                          ? formatCurrency(shippingCost)
                          : 'Enter ZIP'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      3 - 5 business days with live postal tracking
                    </p>
                  </div>

                  <div
                    onClick={() => setDeliveryOption('usps_priority')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      deliveryOption === 'usps_priority'
                        ? 'border-[#002855] bg-blue-50/50 ring-2 ring-[#002855]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <Truck size={14} className="text-[#E31837]" />
                        USPS Priority Express
                      </span>
                      <span className="text-xs font-black text-gray-900">$9.95</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      2 - 3 business days expedited priority queue
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address Inputs */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-2">
                  2. US Delivery Address
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-600 font-bold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#002855]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-600 font-bold mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={address.streetAddress}
                      onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                      placeholder="e.g. 1402 S Congress Ave"
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#002855]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-bold mb-1">
                      Apt / Suite / Unit (Optional)
                    </label>
                    <input
                      type="text"
                      value={address.aptOrSuite || ''}
                      onChange={(e) => setAddress({ ...address, aptOrSuite: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#002855]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-bold mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#002855]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-bold mb-1">State</label>
                    <select
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#002855]"
                    >
                      {US_STATES.map((st) => (
                        <option key={st.code} value={st.code}>
                          {st.code} - {st.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-600 font-bold mb-1">ZIP Code (5 Digits)</label>
                    <input
                      type="text"
                      required
                      pattern="[0-9]{5}"
                      value={address.zipCode}
                      onChange={(e) => {
                        const val = e.target.value;
                        const clean = val.replace(/[^0-9]/g, '');
                        const inferred = clean.length >= 3 ? getStateFromZip(clean) : null;
                        setAddress({
                          ...address,
                          zipCode: val,
                          ...(inferred ? { state: inferred } : {}),
                        });
                      }}
                      placeholder="78701"
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#002855]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#002855]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Phone (for Tracking SMS)</label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#002855]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-2">
                  3. Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'border-black bg-gray-50 text-black ring-2 ring-black'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                     Apple Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-[#0070BA] bg-blue-50 text-[#0070BA] ring-2 ring-[#0070BA]'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🅿 PayPal
                  </button>
                </div>
              </div>

              {/* Order Summary & Submit Button */}
              <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((a, c) => a + c.quantity, 0)} items)</span>
                  <span className="font-bold text-gray-900">{formatCurrency(baseCalculations.subtotal)}</span>
                </div>

                {baseCalculations.repeatDeliverySavings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Repeat Delivery (35% OFF)</span>
                    <span>-{formatCurrency(baseCalculations.repeatDeliverySavings)}</span>
                  </div>
                )}

                {baseCalculations.promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Promo ({baseCalculations.appliedPromo})</span>
                    <span>-{formatCurrency(baseCalculations.promoDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-900">
                    {baseCalculations.freeShippingQualified || shippingCost === 0
                      ? 'FREE'
                      : shippingCost !== null
                      ? formatCurrency(shippingCost)
                      : 'Calculated at checkout'}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="text-sm font-black text-gray-900">Total Charged</span>
                  <span className="text-xl font-black text-[#002855]">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={hasOutOfStock}
                className={`w-full font-black text-sm py-4 rounded-full shadow-lg transition-transform uppercase tracking-wider ${
                  hasOutOfStock
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-[#E31837] hover:bg-[#c9142e] text-white cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {hasOutOfStock ? 'Remova Itens Esgotados para Comprar' : `Place Order · ${formatCurrency(finalTotal)}`}
              </button>
            </form>
          </div>
        ) : (
          /* Order Complete Confirmation with Dropship Exporter */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                Order Confirmed · Payment Successful
              </span>
              <h2 className="text-2xl font-black text-[#002855] tracking-tight mt-2">
                Thank You, {address.fullName.split(' ')[0]}!
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Confirmation #{orderId} has been sent to <strong>{address.email}</strong>.
              </p>
            </div>

            {/* US Postal Warehouse Dispatch Summary */}
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#002855] font-bold">
                <Truck size={16} className="text-[#E31837]" />
                <span>
                  {deliveryOption === 'usps_priority'
                    ? 'Dispatching via USPS Priority Express (2-3 Business Days)'
                    : 'Dispatching via USPS Ground Advantage from US Fulfillment Center'}
                </span>
              </div>
              <p className="text-gray-600">
                Estimated Delivery: <strong>2 - 4 Business Days</strong>. Live USPS postal tracking number will be sent via SMS to {address.phone} and email to {address.email}.
              </p>
            </div>

            {/* 30-Day Guarantee & Customer Care */}
            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-800 font-bold">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>30-Day In-Home Risk-Free Trial</span>
              </div>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                If your pup or kitty isn&apos;t completely thrilled with your order, email <strong className="text-gray-700">support@lingpetshop.com</strong> within 30 days for an immediate prepaid return label and 100% full refund.
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full sm:w-auto bg-[#002855] hover:bg-[#001e44] text-white font-bold text-xs px-8 py-3.5 rounded-full transition-colors cursor-pointer shadow-md"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
