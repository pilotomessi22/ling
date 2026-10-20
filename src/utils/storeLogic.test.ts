import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCurrency,
  getBundleDiscountPercent,
  getItemUnitPrice,
  calculateOrderTotals,
  filterProducts,
  formatDropshippingOrderPayload,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_US_SHIPPING_FEE,
} from './storeLogic.ts';
import type { CartItem, ShippingAddress } from './storeLogic.ts';

test('formatCurrency formats USD prices correctly', () => {
  assert.equal(formatCurrency(44.95), '$44.95');
  assert.equal(formatCurrency(0), '$0.00');
  assert.equal(formatCurrency(129), '$129.00');
});

test('getBundleDiscountPercent provides 0%, 15% and 25% discounts', () => {
  assert.equal(getBundleDiscountPercent(1), 0);
  assert.equal(getBundleDiscountPercent(2), 15);
  assert.equal(getBundleDiscountPercent(3), 25);
  assert.equal(getBundleDiscountPercent(5), 25);
});

test('getItemUnitPrice applies bundle discount and optional add-ons', () => {
  // 1 unit at $40 = $40
  assert.equal(getItemUnitPrice(40, 1), 40);
  // 2 units at $40 base: 15% off base = $34
  assert.equal(getItemUnitPrice(40, 2), 34);
  // 2 units with $5 add-on enabled = $39
  assert.equal(getItemUnitPrice(40, 2, 5, true), 39);
});

test('calculateOrderTotals applies free shipping on orders over threshold ($45)', () => {
  const itemsUnder: CartItem[] = [
    {
      id: 'item-1',
      sku: 'HARN-01',
      name: 'AirGlide Harness',
      price: 24.95,
      quantity: 1,
      size: 'Medium',
      color: 'Austin Sage',
      image: '',
      supplierCost: 5.8,
    },
  ];

  const resUnder = calculateOrderTotals(itemsUnder);
  assert.equal(resUnder.subtotal, 24.95);
  assert.equal(resUnder.shipping, STANDARD_US_SHIPPING_FEE);
  assert.equal(resUnder.freeShippingQualified, false);
  assert.equal(resUnder.amountNeededForFreeShipping, Number((FREE_SHIPPING_THRESHOLD - 24.95).toFixed(2)));

  // Add another item to cross $45
  const itemsOver: CartItem[] = [
    ...itemsUnder,
    {
      id: 'item-2',
      sku: 'BED-01',
      name: 'Cloud9 Bed',
      price: 44.95,
      quantity: 1,
      size: 'Large',
      color: 'Oatmeal Cream',
      image: '',
      supplierCost: 15.0,
    },
  ];

  const resOver = calculateOrderTotals(itemsOver);
  assert.equal(resOver.shipping, 0);
  assert.equal(resOver.freeShippingQualified, true);
  assert.equal(resOver.amountNeededForFreeShipping, 0);
});

test('calculateOrderTotals applies PAWLOVE15 promo code and calculates profit margin', () => {
  const items: CartItem[] = [
    {
      id: 'bed-1',
      sku: 'BED-01',
      name: 'Cloud9 Bed',
      price: 44.95,
      quantity: 1,
      size: 'Medium',
      color: 'Austin Sage',
      image: '',
      supplierCost: 14.5,
    },
  ];

  const res = calculateOrderTotals(items, 'PAWLOVE15');
  // $44.95 - 15% ($6.74) = $38.21. Total + shipping since under $45
  assert.equal(res.promoDiscount, 6.74);
  assert.equal(res.appliedPromo, 'PAWLOVE15 (15% OFF)');
  // Estimated profit = $38.21 - $14.50 = $23.71
  assert.equal(res.totalEstimatedProfit, 23.71);
});

test('formatDropshippingOrderPayload generates valid JSON for US dropshipping fulfillment', () => {
  const items: CartItem[] = [
    {
      id: 'bed-1',
      sku: 'BED-01',
      name: 'Cloud9 Bed',
      price: 44.95,
      quantity: 1,
      size: 'Large',
      color: 'Austin Sage',
      image: '',
      supplierCost: 15.0,
    },
  ];

  const address: ShippingAddress = {
    fullName: 'Sarah Miller',
    streetAddress: '2401 S Congress Ave',
    city: 'Austin',
    state: 'TX',
    zipCode: '78704',
    email: 'sarah.m@gmail.com',
    phone: '5125550192',
  };

  const payload = formatDropshippingOrderPayload('ORD-998822', items, address);
  const parsed = JSON.parse(payload);

  assert.equal(parsed.order_id, 'ORD-998822');
  assert.equal(parsed.recipient.state, 'TX');
  assert.equal(parsed.recipient.city, 'Austin');
  assert.equal(parsed.line_items[0].sku, 'BED-01');
});
