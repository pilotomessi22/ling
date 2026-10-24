import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../data/storeData.ts';
import { buildServerCart, validateCheckoutAddress, CheckoutValidationError } from './checkoutPricing.ts';
import { calculateOrderTotals, getItemBundleDiscountPercent } from './storeLogic.ts';

const inStockProduct = PRODUCTS.find((p) => p.stockCount > 0 && (!p.variants || p.variants.some((v) => v.inventory > 0)))!;
const variant = inStockProduct.variants?.find((v) => v.inventory > 0);

const validAddressBody = {
  customerName: 'Jane Doe',
  customerEmail: 'jane@example.com',
  customerPhone: '+1 512 555 0100',
  shippingAddress: { line1: '100 Congress Ave', city: 'Austin', state: 'TX', zip: '78701', country: 'United States' },
};

test('Checkout: preço enviado pelo navegador é ignorado, vale o do catálogo', () => {
  const cart = buildServerCart([
    { productId: inStockProduct.id, sku: variant?.sku, quantity: 1, price: 0.01, supplierCost: 0, stockCount: 999 },
  ]);
  assert.equal(cart[0].price, inStockProduct.price);
  assert.equal(cart[0].supplierCost, inStockProduct.supplierCost);
});

test('Checkout: produto identificado pelo SKU da variante quando não vem productId', () => {
  if (!variant) return;
  const cart = buildServerCart([{ sku: variant.sku, quantity: 2 }]);
  assert.equal(cart[0].productId, inStockProduct.id);
  assert.equal(cart[0].quantity, 2);
});

test('Checkout: produto inexistente, quantidade inválida e carrinho vazio são recusados', () => {
  assert.throws(() => buildServerCart([{ productId: 'nao-existe', quantity: 1 }]), CheckoutValidationError);
  assert.throws(() => buildServerCart([{ productId: inStockProduct.id, quantity: 0 }]), CheckoutValidationError);
  assert.throws(() => buildServerCart([{ productId: inStockProduct.id, quantity: 1.5 }]), CheckoutValidationError);
  assert.throws(() => buildServerCart([{ productId: inStockProduct.id, quantity: 999 }]), CheckoutValidationError);
  assert.throws(() => buildServerCart([]), CheckoutValidationError);
});

test('Checkout: estoque ao vivo esgotado bloqueia mesmo com o navegador dizendo que tem', () => {
  assert.throws(
    () => buildServerCart([{ productId: inStockProduct.id, quantity: 1, inStock: true }], PRODUCTS, () => ({ inStock: false })),
    (err: any) => err instanceof CheckoutValidationError && err.outOfStock
  );
});

test('Checkout: adicional que o produto não oferece é recusado', () => {
  assert.throws(
    () => buildServerCart([{ productId: inStockProduct.id, quantity: 1, addOn: { enabled: true, name: 'Brinde falso' } }]),
    CheckoutValidationError
  );
});

test('Endereço: válido nos EUA passa e o estado vem normalizado', () => {
  const addr = validateCheckoutAddress({
    ...validAddressBody,
    shippingAddress: { ...validAddressBody.shippingAddress, state: 'Texas' },
  });
  assert.equal(addr.state, 'TX');
  assert.equal(addr.zip, '78701');
});

test('Endereço: ZIP de outro estado é recusado (não dá para cotar TX e receber na CA)', () => {
  assert.throws(
    () =>
      validateCheckoutAddress({
        ...validAddressBody,
        shippingAddress: { ...validAddressBody.shippingAddress, state: 'TX', zip: '90210' },
      }),
    CheckoutValidationError
  );
});

test('Endereço: fora dos EUA, e-mail inválido ou ZIP inválido são recusados', () => {
  assert.throws(
    () => validateCheckoutAddress({ ...validAddressBody, shippingAddress: { ...validAddressBody.shippingAddress, country: 'Brazil' } }),
    CheckoutValidationError
  );
  assert.throws(() => validateCheckoutAddress({ ...validAddressBody, customerEmail: 'nao-e-email' }), CheckoutValidationError);
  assert.throws(
    () => validateCheckoutAddress({ ...validAddressBody, shippingAddress: { ...validAddressBody.shippingAddress, zip: '7870' } }),
    CheckoutValidationError
  );
});

test('Desconto por quantidade segue a tabela do produto', () => {
  const volumeTiers = [
    { qty: 1, discountPercent: 0 },
    { qty: 2, discountPercent: 15 },
    { qty: 3, discountPercent: 25 },
  ];
  assert.equal(getItemBundleDiscountPercent({ quantity: 1, volumeTiers }), 0);
  assert.equal(getItemBundleDiscountPercent({ quantity: 2, volumeTiers }), 15);
  assert.equal(getItemBundleDiscountPercent({ quantity: 5, volumeTiers }), 25);
  // Sem tabela: regra geral (2 = 10%, 3+ = 15%)
  assert.equal(getItemBundleDiscountPercent({ quantity: 3 }), 15);
});

test('Cupom: no servidor só vale a lista passada (cupom removido no admin não dá desconto)', () => {
  const cart = buildServerCart([{ productId: inStockProduct.id, quantity: 1 }]);
  const withCoupon = calculateOrderTotals(cart, 'LING20', 'shipping', 'TX', '78701', 'usps_ground', [
    { id: 'x', code: 'LING20', discountPercent: 20, description: '', partnerName: '', active: true, usageCount: 0, createdAt: '' },
  ]);
  const withoutCoupon = calculateOrderTotals(cart, 'LING20', 'shipping', 'TX', '78701', 'usps_ground', []);
  assert.ok(withCoupon.promoDiscount > 0);
  assert.equal(withoutCoupon.promoDiscount, 0);
});
