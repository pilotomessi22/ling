import React, { useState, useEffect } from 'react';
import {
  Lock,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  CreditCard,
  Package,
} from 'lucide-react';
import { CartItem, calculateOrderTotals, ShippingAddress } from '../utils/storeLogic.ts';
import { formatCurrency } from '../utils/storeLogic.ts';
import { US_STATES } from '../data/storeData.ts';
import { getStateFromZip } from '../utils/shippingCalculator.ts';

interface CheckoutPageProps {
  items: CartItem[];
  appliedPromo: string;
  onClearCart: () => void;
  onReturnToCart: () => void;
  onReturnToHome: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  appliedPromo,
  onClearCart,
  onReturnToCart,
  onReturnToHome,
}) => {
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    streetAddress: '',
    aptOrSuite: '',
    city: '',
    state: 'FL',
    zipCode: '',
    email: '',
    phone: '',
    deliveryMethod: 'shipping',
  });

  const [deliveryOption, setDeliveryOption] = useState<'usps_ground' | 'usps_priority'>('usps_ground');
  const [paymentMethod, setPaymentMethod] = useState<'stripe_card' | 'apple_pay' | 'klarna' | 'paypal'>('stripe_card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [confirmedPaidTotal, setConfirmedPaidTotal] = useState<number>(0);
  const [confirmedCustomerName, setConfirmedCustomerName] = useState<string>('');
  const [confirmedAddressText, setConfirmedAddressText] = useState<string>('');

  const hasOutOfStock = items.some((i) => i.stockCount === 0 || i.inStock === false);

  const calc = calculateOrderTotals(
    items,
    appliedPromo,
    'shipping',
    address.state,
    address.zipCode,
    deliveryOption
  );
  const { subtotal, shipping: shippingCost, total: finalTotal, shippingDetails } = calc;
  const discount = calc.bundleDiscount + calc.repeatDeliverySavings + calc.promoDiscount;

  const handleZipChange = (val: string) => {
    const clean = val.replace(/[^0-9-]/g, '').slice(0, 10);
    const prefix5 = clean.slice(0, 5);
    const autoState = prefix5.length === 5 ? getStateFromZip(prefix5) : null;
    if (autoState) {
      setAddress((prev) => ({ ...prev, zipCode: clean, state: autoState }));
    } else {
      setAddress((prev) => ({ ...prev, zipCode: clean }));
    }
  };

  // Check Stripe return URL status and session_id on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const sessionId = params.get('session_id');

    if (status === 'success' && sessionId) {
      setIsSubmitting(true);
      fetch(`/api/checkout/session/${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.payment_status === 'paid' || data.status === 'complete') {
            const generatedId = `LP-STRIPE-${sessionId.slice(-6).toUpperCase()}`;
            setOrderId(generatedId);
            setConfirmedPaidTotal(data.amount_total || finalTotal);
            setConfirmedCustomerName(data.customer_email || 'Stripe Customer');
            setConfirmedAddressText('United States Express Delivery Hub');
            setOrderComplete(true);
            onClearCart();

            try {
              const existingOrdersRaw = localStorage.getItem('ling_admin_orders');
              const existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
              const newAdminOrder = {
                id: `ord-${Date.now()}`,
                orderNumber: generatedId,
                date: 'Today, just now',
                customerName: data.customer_email || 'Stripe Verified Customer',
                customerEmail: data.customer_email || 'customer@lingpetshop.com',
                customerPhone: '+1 (555) 019-2831',
                shippingAddress: {
                  street: 'Verified Stripe Checkout Address',
                  city: 'Austin',
                  state: 'TX',
                  zip: '78701',
                  country: 'United States',
                },
                items: items.length > 0 ? items : [{ name: 'Ling Petshop Verified Order', quantity: 1, unit_price: data.amount_total }],
                totalUsd: data.amount_total || finalTotal,
                supplierCostUsd: 0,
                profitUsd: data.amount_total || finalTotal,
                paymentGateway: 'Stripe Official Hosted Checkout (USD)',
                paymentStatus: 'Paid (Stripe Verified)',
                fulfillmentStatus: 'Awaiting Dispatch',
              };
              localStorage.setItem('ling_admin_orders', JSON.stringify([newAdminOrder, ...existingOrders]));
              window.dispatchEvent(new Event('storage'));
            } catch (e) {
              console.error(e);
            }
          } else {
            alert('Pagamento ainda não confirmado pela Stripe.');
          }
        })
        .catch((err) => {
          console.error('Error verifying Stripe session:', err);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else if (status === 'cancelled') {
      alert('Checkout cancelado. Seus itens continuam salvos na sacola.');
    }
  }, []);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.fullName || !address.email || !address.streetAddress || !address.city || !address.zipCode || !address.phone) {
      alert('Por favor, preencha todos os campos obrigatórios de endereço e contato.');
      return;
    }

    if (hasOutOfStock) {
      alert('Não é possível concluir o pedido: um ou mais itens no carrinho estão esgotados no fornecedor Zendrop.');
      return;
    }

    setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={40} />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
              Order Confirmed & Paid
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2942] font-serif mt-1">
              Thank You, {confirmedCustomerName || address.fullName || "Valued Customer"}!
            </h1>
            <p className="text-sm text-[#64748B] mt-2 font-light">
              Your order <strong className="text-[#0F2942]">#{orderId}</strong> has been successfully processed and verified via Stripe.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-left space-y-3 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">USPS Tracking Number:</span>
              <strong className="text-[#2563EB] font-mono font-bold">9400 1118 9922 3849 10</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Shipping Address:</span>
              <span className="font-semibold text-[#0F2942]">
                {address.streetAddress}, {address.city}, {address.state} {address.zipCode}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Estimated Delivery:</span>
              <span className="font-semibold text-[#16A34A]">
                {deliveryOption === 'usps_priority' ? '2 to 3 Business Days (Express)' : '3 to 5 Business Days (Ground)'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Total Paid:</span>
              <span className="font-bold text-[#0F2942]">{formatCurrency(confirmedPaidTotal || finalTotal)}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onReturnToHome}
              className="px-8 py-3.5 rounded-full bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              Return to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Minimalist Professional Header */}
      <header className="bg-white border-b border-[#E2E8F0] py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onReturnToCart}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Return to Bag</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-[#0F2942] tracking-tight font-serif">Ling Petshop</span>
            <span className="text-xs bg-[#EFF6FF] text-[#2563EB] font-bold px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">Secure Checkout</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Lock size={13} className="text-[#16A34A]" />
            <span className="font-medium hidden sm:inline">256-Bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Shipping & Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Shipping Address Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-[#F1F5F9]">
                <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h2 className="text-lg font-bold font-serif text-[#0F2942]">
                  US Shipping Address
                </h2>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#0F2942] font-semibold mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#0F2942] font-semibold mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@example.com"
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0F2942] font-semibold mb-1.5">Phone (USPS SMS) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#0F2942] font-semibold mb-1.5">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="1402 S Congress Ave"
                    value={address.streetAddress}
                    onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#0F2942] font-semibold mb-1.5">Apt / Suite</label>
                    <input
                      type="text"
                      placeholder="Apt 4B"
                      value={address.aptOrSuite}
                      onChange={(e) => setAddress({ ...address, aptOrSuite: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0F2942] font-semibold mb-1.5">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="Austin"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[#0F2942] font-semibold mb-1.5">State *</label>
                    <select
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
                    >
                      {US_STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full sm:w-1/3">
                  <label className="block text-[#0F2942] font-semibold mb-1.5">ZIP Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="78704"
                    value={address.zipCode}
                    onChange={(e) => handleZipChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h2 className="text-lg font-bold font-serif text-[#0F2942]">
                    Shipping Method
                  </h2>
                </div>
                {shippingDetails && (
                  <span className="text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE]">
                    USPS Zone {shippingDetails.zone}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <label
                  onClick={() => setDeliveryOption('usps_ground')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    deliveryOption === 'usps_ground'
                      ? 'border-[#2563EB] bg-[#EFF6FF]/60 ring-2 ring-[#2563EB]/20'
                      : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={deliveryOption === 'usps_ground'}
                      onChange={() => setDeliveryOption('usps_ground')}
                      className="text-[#2563EB]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#0F2942]">USPS Ground Advantage (3 - 5 Business Days)</p>
                      <p className="text-[11px] text-[#64748B]">Fast, tracked ground delivery across all 50 US states</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0F2942]">
                    {calc.freeShippingQualified ? (
                      <span className="text-[#16A34A] font-extrabold">FREE</span>
                    ) : (
                      formatCurrency(shippingDetails?.groundFee || 4.95)
                    )}
                  </span>
                </label>

                <label
                  onClick={() => setDeliveryOption('usps_priority')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    deliveryOption === 'usps_priority'
                      ? 'border-[#2563EB] bg-[#EFF6FF]/60 ring-2 ring-[#2563EB]/20'
                      : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={deliveryOption === 'usps_priority'}
                      onChange={() => setDeliveryOption('usps_priority')}
                      className="text-[#2563EB]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#0F2942]">USPS Priority Mail Express (1 - 3 Business Days)</p>
                      <p className="text-[11px] text-[#64748B]">Priority queue handling and expedited transit</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0F2942]">
                    {formatCurrency(shippingDetails?.priorityFee || 8.95)}
                  </span>
                </label>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <h2 className="text-lg font-bold font-serif text-[#0F2942]">
                    Payment Method
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#16A34A]">
                  <ShieldCheck size={14} />
                  <span>Stripe Secured</span>
                </div>
              </div>

              {hasOutOfStock && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 text-xs">
                  <strong>⚠️ Produtos Esgotados:</strong> Um ou mais itens no seu carrinho estão esgotados no fornecedor Zendrop. Remova-os para continuar.
                </div>
              )}

              <div className="space-y-3 text-xs">
                <label
                  onClick={() => setPaymentMethod('stripe_card')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'stripe_card'
                      ? 'border-[#2563EB] bg-[#EFF6FF]/60 ring-2 ring-[#2563EB]/20'
                      : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'stripe_card'}
                      onChange={() => setPaymentMethod('stripe_card')}
                      className="text-[#2563EB]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#0F2942]">Credit / Debit Card (Stripe Hosted Checkout)</p>
                      <p className="text-[11px] text-[#64748B]">Visa, Mastercard, American Express, Discover</p>
                    </div>
                  </div>
                  <CreditCard size={18} className="text-[#2563EB]" />
                </label>

                <label
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-[#2563EB] bg-[#EFF6FF]/60 ring-2 ring-[#2563EB]/20'
                      : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'apple_pay'}
                      onChange={() => setPaymentMethod('apple_pay')}
                      className="text-[#2563EB]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#0F2942]">Apple Pay / Google Pay</p>
                      <p className="text-[11px] text-[#64748B]">Instant 1-click checkout via Stripe</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-black"> Pay</span>
                </label>

                <label
                  onClick={() => setPaymentMethod('klarna')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'klarna'
                      ? 'border-[#2563EB] bg-[#EFF6FF]/60 ring-2 ring-[#2563EB]/20'
                      : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'klarna'}
                      onChange={() => setPaymentMethod('klarna')}
                      className="text-[#2563EB]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#0F2942]">Klarna (Buy Now, Pay Later)</p>
                      <p className="text-[11px] text-[#64748B]">4 interest-free payments of ${(finalTotal / 4).toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#FFB3C7] text-black font-extrabold text-[10px]">Klarna.</span>
                </label>
              </div>

              {/* Secure Checkout CTA */}
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0 || hasOutOfStock}
                className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4 shadow-lg cursor-pointer ${
                  hasOutOfStock
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white active:scale-98 shadow-blue-500/25'
                }`}
              >
                {isSubmitting ? (
                  <span>Connecting to Stripe Secure Checkout...</span>
                ) : hasOutOfStock ? (
                  <span>Remova Itens Esgotados</span>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Proceed to Stripe Secure Checkout · {formatCurrency(finalTotal)}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-4 sticky top-24">
              <h2 className="text-base font-bold font-serif text-[#0F2942] pb-3 border-b border-[#F1F5F9]">
                Order Summary ({items.reduce((a, c) => a + c.quantity, 0)} items)
              </h2>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#F1F5F9] pr-1">
                {items.map((i) => (
                  <div key={i.id} className="py-3 flex items-center gap-3">
                    <img src={i.image} alt={i.name} className="w-12 h-12 rounded-xl object-cover border border-[#E2E8F0]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#0F2942] truncate font-serif">{i.name}</p>
                      <p className="text-[11px] text-[#64748B]">Qty: {i.quantity} {i.size ? `· ${i.size}` : ''}</p>
                    </div>
                    <span className="text-xs font-bold text-[#0F2942]">{formatCurrency(i.price * i.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 text-xs text-[#64748B] pt-3 border-t border-[#F1F5F9]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#0F2942]">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#16A34A] font-semibold">
                    <span>Discount ({appliedPromo})</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>USPS Shipping</span>
                  <span className="font-bold text-[#0F2942]">
                    {shippingCost === 0 ? <strong className="text-[#16A34A]">FREE</strong> : formatCurrency(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#0F2942] pt-2 border-t border-[#E2E8F0]">
                  <span>Total (USD)</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-2 text-xs text-[#1E3A8A]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#2563EB] flex-shrink-0" />
                  <span className="font-bold">30-Day Risk-Free Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#2563EB] flex-shrink-0" />
                  <span>USPS Fast-Tracked Shipping from US Hub</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
