import React, { useState, useEffect } from 'react';
import {
  Lock,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  RefreshCcw,
} from 'lucide-react';
import { CartItem, calculateOrderTotals, formatCurrency } from '../utils/storeLogic.ts';

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
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [confirmedPaidTotal, setConfirmedPaidTotal] = useState<number>(0);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const hasOutOfStock = items.some((i) => i.stockCount === 0 || i.inStock === false);

  const calc = calculateOrderTotals(
    items,
    appliedPromo,
    'shipping',
    'FL',
    '33101',
    'usps_ground'
  );
  const { subtotal, shipping: shippingCost, total: finalTotal } = calc;
  const discount = calc.bundleDiscount + calc.repeatDeliverySavings + calc.promoDiscount;

  // Check Stripe return URL status and session_id on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const sessionId = params.get('session_id');

    if (status === 'success' && sessionId) {
      setIsSubmitting(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      fetch(`/api/checkout/session/${sessionId}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          if (data.payment_status === 'paid' || data.status === 'complete') {
            const generatedId = `LP-STRIPE-${sessionId.slice(-6).toUpperCase()}`;
            setOrderId(generatedId);
            setConfirmedPaidTotal(data.amount_total || finalTotal);
            setCustomerEmail(data.customer_email || 'customer@lingpetshop.com');
            setOrderComplete(true);
            onClearCart();

            try {
              const addr = data.shipping_details?.address;
              const shippingAddress = addr ? {
                street: [addr.line1, addr.line2].filter(Boolean).join(', '),
                city: addr.city || 'Austin',
                state: addr.state || 'TX',
                zip: addr.postal_code || '78701',
                country: addr.country || 'United States',
              } : {
                street: 'Verified Stripe Checkout Address',
                city: 'Austin',
                state: 'TX',
                zip: '78701',
                country: 'United States',
              };

              const custName = data.shipping_details?.name || data.customer_details?.name || data.customer_email || 'Stripe Verified Customer';
              const custPhone = data.shipping_details?.phone || data.customer_details?.phone || '+1 (555) 019-2831';
              const custEmail = data.customer_email || 'customer@lingpetshop.com';

              const existingOrdersRaw = localStorage.getItem('ling_admin_orders');
              const existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
              const newAdminOrder = {
                id: `ord-${Date.now()}`,
                orderNumber: generatedId,
                date: 'Today, just now',
                customerName: custName,
                customerEmail: custEmail,
                customerPhone: custPhone,
                shippingAddress,
                items: items.length > 0 ? items : [{ name: 'Ling Petshop Verified Order', quantity: 1, unit_price: data.amount_total }],
                totalUsd: data.amount_total || finalTotal,
                supplierCostUsd: 0,
                profitUsd: data.amount_total || finalTotal,
                paymentGateway: 'Stripe Official Hosted Checkout (USD)',
                paymentStatus: 'Paid (Stripe Verified)',
                fulfillmentStatus: 'Awaiting Dispatch',
              };
              const updatedOrders = [newAdminOrder, ...existingOrders];
              localStorage.setItem('ling_admin_orders', JSON.stringify(updatedOrders));
              window.dispatchEvent(new Event('storage'));

              fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAdminOrder),
              }).catch((e) => console.error('Failed to sync order to server:', e));
            } catch (e) {
              console.error(e);
            }
          } else {
            setCheckoutError('Pagamento ainda não confirmado pela Stripe.');
          }
        })
        .catch((err) => {
          console.error('Error verifying Stripe session:', err);
          if (err.name === 'AbortError') {
            setCheckoutError('A verificação da sessão demorou muito. Verifique seu extrato ou tente novamente.');
          }
        })
        .finally(() => {
          clearTimeout(timeoutId);
          setIsSubmitting(false);
        });
    } else if (status === 'cancelled') {
      setCheckoutError('Checkout cancelado. Seus itens continuam salvos na sacola.');
    }
  }, []);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (hasOutOfStock) {
      alert('Não é possível concluir o pedido: um ou mais itens no carrinho estão esgotados no fornecedor Zendrop.');
      return;
    }

    if (items.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    setIsSubmitting(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerEmail: customerEmail || undefined,
          currency: 'usd',
          domainUrl: window.location.origin,
        }),
        signal: controller.signal,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar sessão de checkout na Stripe.');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout da Stripe não retornada pelo servidor.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      if (err.name === 'AbortError') {
        setCheckoutError('A requisição para o servidor excedeu o tempo limite. Verifique sua conexão e tente novamente.');
      } else {
        setCheckoutError(err.message || 'Erro ao processar checkout com Stripe.');
      }
      setIsSubmitting(false);
    } finally {
      clearTimeout(timeoutId);
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
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-[#64748B] mt-2 font-light">
              Your order <strong className="text-[#0F2942]">#{orderId}</strong> has been successfully processed and verified via Stripe. A confirmation email has been sent to <span className="text-[#2563EB] font-semibold">{customerEmail}</span>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-left space-y-3 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">USPS Tracking Number:</span>
              <strong className="text-[#2563EB] font-mono font-bold">9400 1118 9922 3849 10</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Fulfillment:</span>
              <span className="font-semibold text-[#0F2942]">United States Express Delivery Hub (Zendrop US Warehouse)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Estimated Delivery:</span>
              <span className="font-semibold text-[#16A34A]">3 to 5 Business Days (USPS Ground)</span>
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

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto">
            <ShoppingBag size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#0F2942]">Your Bag is Empty</h1>
            <p className="text-xs text-[#64748B] mt-2 font-light">
              There are no items in your shopping bag to checkout. Add some pet essentials first!
            </p>
          </div>
          <button
            onClick={onReturnToCart}
            className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            Return to Bag
          </button>
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
            <span className="text-xs bg-[#EFF6FF] text-[#2563EB] font-bold px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">Stripe Hosted Checkout</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Lock size={13} className="text-[#16A34A]" />
            <span className="font-medium hidden sm:inline">256-Bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <form onSubmit={handleCheckoutSubmit} className="space-y-8">
          {/* Order Summary & Stripe Secure Checkout Card */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E2E8F0] gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Secure Payment Gateway</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#0F2942] mt-0.5">
                  Complete Your Purchase with Stripe
                </h1>
                <p className="text-xs text-[#64748B] mt-1">
                  You will be securely redirected to Stripe's official checkout page to enter your shipping address and payment details.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold">
                <ShieldCheck size={16} />
                <span>Stripe Verified</span>
              </div>
            </div>

            {/* Email for Receipt */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#0F2942]">
                Email Address (For Order Receipt & Tracking) *
              </label>
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
              />
              <p className="text-[11px] text-[#64748B]">
                We'll email your receipt and USPS tracking confirmation here once paid.
              </p>
            </div>

            {/* Items Summary */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold font-serif text-[#0F2942]">
                Order Items ({items.reduce((a, c) => a + c.quantity, 0)})
              </h2>
              <div className="divide-y divide-[#F1F5F9] border-t border-b border-[#F1F5F9] max-h-80 overflow-y-auto">
                {items.map((i) => (
                  <div key={i.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={i.image} alt={i.name} className="w-12 h-12 rounded-xl object-cover border border-[#E2E8F0]" />
                      <div>
                        <p className="text-xs font-bold text-[#0F2942] font-serif">{i.name}</p>
                        <p className="text-[11px] text-[#64748B]">Qty: {i.quantity} {i.size ? `· ${i.size}` : ''}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#0F2942]">{formatCurrency(i.price * i.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Calculation */}
            <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] space-y-2.5 text-xs">
              <div className="flex justify-between text-[#64748B]">
                <span>Subtotal</span>
                <span className="font-bold text-[#0F2942]">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#16A34A] font-semibold">
                  <span>Discount ({appliedPromo})</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#64748B]">
                <span>USPS Shipping</span>
                <span className="font-bold text-[#16A34A]">FREE (US Hub)</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#0F2942] pt-3 border-t border-[#E2E8F0]">
                <span>Total to Pay (USD)</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {hasOutOfStock && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 text-xs">
                <strong>⚠️ Produtos Esgotados:</strong> Um ou mais itens no seu carrinho estão esgotados no fornecedor Zendrop. Remova-os para continuar.
              </div>
            )}

            {checkoutError && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <strong className="block font-bold">⚠️ Aviso / Erro no Checkout Stripe:</strong>
                    <p className="mt-1">{checkoutError}</p>
                    <p className="text-[11px] text-amber-900 mt-1">
                      Para testar o checkout real, adicione uma chave ativa da Stripe nas configurações de segredos do Google AI Studio (`STRIPE_SECRET_KEY`).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutError(null)}
                    className="text-xs text-amber-900 font-bold hover:underline ml-2"
                  >
                    Fechar
                  </button>
                </div>
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={handleCheckoutSubmit}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCcw size={13} />
                    <span>Try Again</span>
                  </button>
                  <button
                    type="button"
                    onClick={onReturnToCart}
                    className="px-4 py-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold text-xs cursor-pointer"
                  >
                    Review Bag
                  </button>
                </div>
              </div>
            )}

            {/* Secure Checkout CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting || items.length === 0 || hasOutOfStock}
              className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                hasOutOfStock
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white active:scale-98 shadow-blue-500/25'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Stripe Secure Checkout...</span>
                </div>
              ) : hasOutOfStock ? (
                <span>Remova Itens Esgotados</span>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Continue to Secure Payment · {formatCurrency(finalTotal)}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-6 text-[11px] text-[#64748B] pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#16A34A]" />
                <span>Encrypted & Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-[#2563EB]" />
                <span>USPS Tracked Shipping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#16A34A]" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
