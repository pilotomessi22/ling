import { getSavedCoupons } from '../data/storeData.ts';

export interface CartItem {
  id: string;
  sku: string;
  name: string;
  price: number; // em USD
  quantity: number;
  size: string;
  color: string;
  isRepeatDelivery?: boolean;
  addOn?: {
    enabled: boolean;
    name: string;
    price: number;
  };
  image: string;
  supplierCost: number; // Custo do fornecedor para acompanhamento de margem
  stockCount?: number;
  inStock?: boolean;
  productId?: string;
}

export interface ShippingAddress {
  fullName: string;
  streetAddress: string;
  aptOrSuite?: string;
  city: string;
  state: string; // ex: "TX"
  zipCode: string; // ex: "78704"
  email: string;
  phone: string;
  deliveryMethod?: 'shipping';
}

/**
 * Format amount to US Dollar ($xx.xx)
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Free Shipping threshold for US orders ($45)
 */
export const FREE_SHIPPING_THRESHOLD = 45.0;
export const STANDARD_US_SHIPPING_FEE = 4.95;
export const EXPRESS_SHIPPING_FEE = 9.95;
export const REPEAT_DELIVERY_DISCOUNT_PERCENT = 0;

/**
 * Estratégia de desconto em lote (Comprar 3+ leva desconto sem prejuízo)
 * Buy 1: 0% off
 * Buy 2: 10% off
 * Buy 3+: 15% off
 */
export function getBundleDiscountPercent(itemQuantity: number): number {
  if (itemQuantity >= 3) return 15;
  if (itemQuantity >= 2) return 10;
  return 0;
}

/**
 * Calculate single item unit price including optional add-ons
 */
export function getItemUnitPrice(
  basePrice: number,
  quantity = 1,
  addOnPrice = 0,
  addOnEnabled = false,
  isRepeatDelivery = false
): number {
  if (isRepeatDelivery) {
    const discounted = basePrice * (1 - REPEAT_DELIVERY_DISCOUNT_PERCENT / 100);
    return Number((discounted + (addOnEnabled ? addOnPrice : 0)).toFixed(2));
  }
  const discountPercent = getBundleDiscountPercent(quantity);
  const discountedBase = basePrice * (1 - discountPercent / 100);
  const total = discountedBase + (addOnEnabled ? addOnPrice : 0);
  return Number(total.toFixed(2));
}

import { calculatePreciseShipping, ShippingRateCalculation } from './shippingCalculator.ts';

export interface OrderCalculationResult {
  subtotal: number;
  bundleDiscount: number;
  repeatDeliverySavings: number;
  promoDiscount: number;
  shipping: number;
  total: number;
  freeShippingQualified: boolean;
  amountNeededForFreeShipping: number;
  appliedPromo: string | null;
  totalEstimatedProfit: number;
  shippingDetails?: {
    zone: number;
    zoneName: string;
    groundFee: number;
    priorityFee: number;
    estimatedDays: string;
    isRemote: boolean;
    transitDescription: string;
  };
}

/**
 * Calculate complete order totals with dynamic coupons, precise customer address shipping, and anti-loss profit protection
 */
export function calculateOrderTotals(
  items: CartItem[],
  promoCode?: string | null,
  deliveryMethod?: string,
  stateCode: string = 'FL',
  zipCode: string = '',
  deliveryOption: 'usps_ground' | 'usps_priority' = 'usps_ground'
): OrderCalculationResult {
  let subtotal = 0;
  let bundleDiscount = 0;
  let repeatDeliverySavings = 0;
  let totalSupplierCost = 0;

  for (const item of items) {
    const rawTotal = item.price * item.quantity;
    const addOnTotal =
      item.addOn && item.addOn.enabled ? item.addOn.price * item.quantity : 0;

    subtotal += rawTotal + addOnTotal;
    totalSupplierCost += item.supplierCost * item.quantity;

    if (item.isRepeatDelivery) {
      repeatDeliverySavings += rawTotal * (REPEAT_DELIVERY_DISCOUNT_PERCENT / 100);
    } else {
      const discountPct = getBundleDiscountPercent(item.quantity);
      const itemDiscount = (item.price * (discountPct / 100)) * item.quantity;
      bundleDiscount += itemDiscount;
    }
  }

  const cleanPromo = (promoCode || '').trim().toUpperCase();
  let promoDiscount = 0;
  let appliedPromo: string | null = null;

  const discountedSubtotal = Math.max(0, subtotal - bundleDiscount - repeatDeliverySavings);

  // Dynamic coupon lookup
  const availableCoupons = getSavedCoupons();
  const matchedCoupon = availableCoupons.find(
    (c) => c.active && c.code.trim().toUpperCase() === cleanPromo
  );

  if (matchedCoupon) {
    const rawDiscount = (discountedSubtotal * (matchedCoupon.discountPercent / 100));
    promoDiscount = Number(rawDiscount.toFixed(2));
    appliedPromo = `${matchedCoupon.code} (${matchedCoupon.discountPercent}% OFF)`;
  } else if (cleanPromo === 'FREESHIP') {
    appliedPromo = 'FREESHIP (FRETE GRÁTIS)';
  }

  // Precise shipping calculation based on customer destination address (State & ZIP)
  const hasFreeShipCoupon = cleanPromo === 'FREESHIP';
  const shippingCalculation: ShippingRateCalculation = calculatePreciseShipping(
    stateCode,
    zipCode,
    discountedSubtotal,
    deliveryOption,
    hasFreeShipCoupon
  );

  const shipping = items.length === 0 ? 0 : shippingCalculation.effectiveFee;
  const freeShippingQualified = shippingCalculation.freeShippingQualified;

  // Supplier shipping cost tracking for financial margin safeguarding
  const totalItemQty = items.reduce((acc, i) => acc + i.quantity, 0);
  const estimatedSupplierShippingCost = totalItemQty > 0 ? 4.95 + Math.max(0, totalItemQty - 1) * 1.50 : 0;
  const totalBaseCostWithShipping = totalSupplierCost + estimatedSupplierShippingCost;

  // Margin protection lock
  const minSafeGoodsTotal = totalBaseCostWithShipping * 1.35;
  if (discountedSubtotal - promoDiscount < minSafeGoodsTotal && totalBaseCostWithShipping > 0) {
    const maxSafeDiscount = Math.max(0, discountedSubtotal - minSafeGoodsTotal);
    promoDiscount = Number(maxSafeDiscount.toFixed(2));
  }

  const effectiveGoodsTotal = Math.max(0, discountedSubtotal - promoDiscount);

  const amountNeededForFreeShipping = Math.max(
    0,
    Number((FREE_SHIPPING_THRESHOLD - discountedSubtotal).toFixed(2))
  );

  const total = Number((effectiveGoodsTotal + shipping).toFixed(2));
  const totalEstimatedProfit = Number(
    Math.max(0, effectiveGoodsTotal - totalBaseCostWithShipping).toFixed(2)
  );

  return {
    subtotal: Number(subtotal.toFixed(2)),
    bundleDiscount: Number(bundleDiscount.toFixed(2)),
    repeatDeliverySavings: Number(repeatDeliverySavings.toFixed(2)),
    promoDiscount,
    shipping,
    total,
    freeShippingQualified,
    amountNeededForFreeShipping,
    appliedPromo,
    totalEstimatedProfit,
    shippingDetails: {
      zone: shippingCalculation.zone,
      zoneName: shippingCalculation.zoneName,
      groundFee: shippingCalculation.groundFee,
      priorityFee: shippingCalculation.priorityFee,
      estimatedDays: shippingCalculation.estimatedDays,
      isRemote: shippingCalculation.isRemoteOrIslands,
      transitDescription: shippingCalculation.transitDescription,
    },
  };
}

/**
 * Filter products by search term across title, tags or category
 */
export function filterProducts<T extends { name: string; category?: string; brand?: string; tagline?: string; department?: string }>(
  products: T[],
  query: string
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(q);
    const matchCat = p.category ? p.category.toLowerCase().includes(q) : false;
    const matchDept = p.department ? p.department.toLowerCase().includes(q) : false;
    const matchBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
    const matchTag = p.tagline ? p.tagline.toLowerCase().includes(q) : false;
    return matchName || matchCat || matchDept || matchBrand || matchTag;
  });
}

/**
 * Format order into dropshipping supplier fulfillment format
 */
export function formatDropshippingOrderPayload(
  orderId: string,
  items: CartItem[],
  address: ShippingAddress
): string {
  const payload = {
    order_id: orderId,
    store: 'Ling Petshop (Official US Online Store)',
    carrier_requested: 'USPS Ground Advantage (3-5 Days Tracked Priority)',
    created_at: new Date().toISOString(),
    recipient: {
      name: address.fullName,
      street_1: address.streetAddress,
      street_2: address.aptOrSuite || '',
      city: address.city,
      state: address.state,
      zip: address.zipCode,
      country: 'US',
      phone: address.phone,
      email: address.email,
    },
    line_items: items.map((item) => ({
      sku: item.sku,
      title: item.name,
      variant: `${item.size} / ${item.color}`,
      order_type: item.isRepeatDelivery ? 'REPEAT_DELIVERY' : 'ONE_TIME',
      quantity: item.quantity,
      unit_price: item.price,
      supplier_target_cost: item.supplierCost,
    })),
  };

  return JSON.stringify(payload, null, 2);
}
