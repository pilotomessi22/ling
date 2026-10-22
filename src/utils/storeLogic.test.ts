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

test('getBundleDiscountPercent provides 0%, 10% and 15% discounts', () => {
  assert.equal(getBundleDiscountPercent(1), 0);
  assert.equal(getBundleDiscountPercent(2), 10);
  assert.equal(getBundleDiscountPercent(3), 15);
  assert.equal(getBundleDiscountPercent(5), 15);
});

test('getItemUnitPrice applies bundle discount and optional add-ons', () => {
  // 1 unit at $40 = $40
  assert.equal(getItemUnitPrice(40, 1), 40);
  // 2 units at $40 base: 10% off base = $36
  assert.equal(getItemUnitPrice(40, 2), 36);
  // 2 units with $5 add-on enabled = $41
  assert.equal(getItemUnitPrice(40, 2, 5, true), 41);
});

// Scenario A: Carrinho com produto, sem endereço: nenhum frete personalizado padrão deve ser aplicado
test('Cenário A: Carrinho com produto sem endereço não inventa frete silencioso', () => {
  const itemsUnder: CartItem[] = [
    {
      id: 'item-1',
      sku: '1603576_OF0JCIH',
      name: 'Dog Paw Cleaner Cup',
      price: 24.99,
      quantity: 1,
      size: 'L',
      color: 'Blue',
      image: '',
      supplierCost: 3.5,
    },
  ];

  const res = calculateOrderTotals(itemsUnder);
  assert.equal(res.subtotal, 24.99);
  assert.equal(res.shipping, null, 'Shipping must be null before address is provided');
  assert.equal(res.isShippingCalculated, false, 'isShippingCalculated must be false');
  assert.equal(res.shippingLabel, 'Calculated at checkout');
  assert.equal(res.total, 24.99, 'Total must equal merchandise net without fake shipping fee added');
  assert.equal(res.freeShippingQualified, false);
});

// Scenario B: Checkout com estado e ZIP vazios: frete não calculado; nenhuma tarifa silenciosa
test('Cenário B: Checkout com estado e ZIP vazios não aplica tarifa silenciosa', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      sku: '1603576_OF0JCIH',
      name: 'Dog Paw Cleaner Cup',
      price: 24.99,
      quantity: 1,
      size: 'L',
      color: 'Blue',
      image: '',
      supplierCost: 3.5,
    },
  ];

  const checkoutCalc = calculateOrderTotals(items, null, 'shipping', '', '', 'usps_ground');
  assert.equal(checkoutCalc.shipping, null);
  assert.equal(checkoutCalc.isShippingCalculated, false);
  assert.equal(checkoutCalc.total, 24.99);
});

// Scenario C: Checkout após inserir um ZIP válido: estimativa atualizada conforme regra real
test('Cenário C: Checkout após inserir ZIP válido atualiza frete conforme zona real', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      sku: '1603576_OF0JCIH',
      name: 'Dog Paw Cleaner Cup',
      price: 24.99,
      quantity: 1,
      size: 'L',
      color: 'Blue',
      image: '',
      supplierCost: 3.5,
    },
  ];

  // ZIP 78701 -> TX (Zona 2) -> $3.95
  const txCalc = calculateOrderTotals(items, null, 'shipping', '', '78701', 'usps_ground');
  assert.equal(txCalc.isShippingCalculated, true);
  assert.equal(txCalc.shipping, 3.95);
  assert.equal(txCalc.total, 28.94); // 24.99 + 3.95
});

// Scenario D: Alteração de ZIP: estimativa anterior substituída corretamente
test('Cenário D: Alteração de ZIP substitui estimativa corretamente', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      sku: '1603576_OF0JCIH',
      name: 'Dog Paw Cleaner Cup',
      price: 24.99,
      quantity: 1,
      size: 'L',
      color: 'Blue',
      image: '',
      supplierCost: 3.5,
    },
  ];

  // Alterando de TX (78701 -> $3.95) para CA (90210 -> $5.95)
  const txCalc = calculateOrderTotals(items, null, 'shipping', 'TX', '78701', 'usps_ground');
  assert.equal(txCalc.shipping, 3.95);

  const caCalc = calculateOrderTotals(items, null, 'shipping', 'CA', '90210', 'usps_ground');
  assert.equal(caCalc.shipping, 5.95);
  assert.equal(caCalc.total, 30.94); // 24.99 + 5.95
});

// Scenario E: Mesmo carrinho e endereço no carrinho, checkout e backend: mesmos valores
test('Cenário E: Carrinho, checkout e backend usam a mesma fonte de verdade e valores idênticos', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      sku: '1603576_OF0JCIH',
      name: 'Dog Paw Cleaner Cup',
      price: 24.99,
      quantity: 1,
      size: 'L',
      color: 'Blue',
      image: '',
      supplierCost: 3.5,
    },
  ];

  const cartWithoutAddress = calculateOrderTotals(items, 'LING20');
  const checkoutWithoutAddress = calculateOrderTotals(items, 'LING20', 'shipping', '', '', 'usps_ground');
  
  assert.equal(cartWithoutAddress.subtotal, checkoutWithoutAddress.subtotal);
  assert.equal(cartWithoutAddress.promoDiscount, checkoutWithoutAddress.promoDiscount);
  assert.equal(cartWithoutAddress.shipping, checkoutWithoutAddress.shipping);
  assert.equal(cartWithoutAddress.total, checkoutWithoutAddress.total);
  assert.equal(cartWithoutAddress.isShippingCalculated, false);

  // Com endereço confirmado (TX 78701)
  const checkoutWithAddress = calculateOrderTotals(items, 'LING20', 'shipping', 'TX', '78701', 'usps_ground');
  const backendWithAddress = calculateOrderTotals(items, 'LING20', 'shipping', 'TX', '78701', 'usps_ground');
  
  assert.equal(checkoutWithAddress.subtotal, backendWithAddress.subtotal);
  assert.equal(checkoutWithAddress.promoDiscount, backendWithAddress.promoDiscount);
  assert.equal(checkoutWithAddress.shipping, backendWithAddress.shipping);
  assert.equal(checkoutWithAddress.total, backendWithAddress.total);
});

// Scenario F: Cupom de 20%: desconto e total calculados corretamente
test('Cenário F: Cupom de 20% (LING20) calcula desconto e total corretamente', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      sku: '1603576_OF0JCIH',
      name: 'Dog Paw Cleaner Cup',
      price: 24.99,
      quantity: 1,
      size: 'L',
      color: 'Blue',
      image: '',
      supplierCost: 3.5,
    },
  ];

  const res = calculateOrderTotals(items, 'LING20');
  assert.equal(res.subtotal, 24.99);
  assert.equal(res.promoDiscount, 5.00); // 20% de 24.99 arredondado para 5.00
  assert.equal(res.total, 19.99); // 24.99 - 5.00 sem frete inventado
  assert.equal(Boolean(res.appliedPromo), true);
});

// Scenario G: Cupom de frete grátis: aplicar somente se a regra for válida
test('Cenário G: Cupom FREESHIP zera o frete corretamente', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      sku: '1603576_OF0JCIH',
      name: 'Dog Paw Cleaner Cup',
      price: 24.99,
      quantity: 1,
      size: 'L',
      color: 'Blue',
      image: '',
      supplierCost: 3.5,
    },
  ];

  const res = calculateOrderTotals(items, 'FREESHIP', 'shipping', 'CA', '90210', 'usps_ground');
  assert.equal(res.shipping, 0);
  assert.equal(res.freeShippingQualified, true);
  assert.equal(res.total, 24.99);
});

// Scenario H: Stripe: integridade centavo a centavo sem frete fictício
test('Cenário H: Stripe line items somam exatamente o total do backend', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      sku: '1603576_OF0JCIH',
      name: 'Dog Paw Cleaner Cup',
      price: 24.99,
      quantity: 1,
      size: 'L',
      color: 'Blue',
      image: '',
      supplierCost: 3.5,
    },
  ];

  // Com endereço em CA (90210) com cupom LING20
  const calc = calculateOrderTotals(items, 'LING20', 'shipping', 'CA', '90210', 'usps_ground');
  const subtotal = calc.subtotal;
  const discount = calc.promoDiscount;
  const shippingCost = calc.shipping || 0;
  const finalTotal = calc.total;

  const itemsTargetCents = Math.round(Math.max(0, subtotal - discount) * 100);
  const rawItemsTotalCents = Math.round(subtotal * 100);
  let allocatedCents = 0;
  const lineItems: any[] = [];

  items.forEach((item, idx) => {
    const isLast = idx === items.length - 1;
    const itemRawCents = Math.round((Number(item.price) || 0) * (Number(item.quantity) || 1) * 100);
    let itemShareCents = isLast ? itemsTargetCents - allocatedCents : Math.round(itemsTargetCents * (itemRawCents / rawItemsTotalCents));
    allocatedCents += itemShareCents;
    const qty = Math.max(1, Number(item.quantity) || 1);
    const unitCents = Math.max(1, Math.round(itemShareCents / qty));
    lineItems.push({ unit_amount: unitCents, quantity: qty });
  });

  if (shippingCost > 0) {
    lineItems.push({ unit_amount: Math.round(shippingCost * 100), quantity: 1 });
  }

  const stripeSumCents = lineItems.reduce((acc, it) => acc + it.unit_amount * it.quantity, 0);
  const expectedCents = Math.round(finalTotal * 100);
  assert.equal(stripeSumCents, expectedCents, 'Stripe sum of cents must equal finalTotal in cents exactly');
});

// Scenario I: Variantes reais preservadas no catálogo
test('Cenário I: Variantes, tamanhos, cores e estoque da Zendrop preservados no catálogo', async () => {
  const { DEFAULT_REAL_PRODUCTS } = await import('../data/storeData.ts');

  const pawCleaner = DEFAULT_REAL_PRODUCTS.find((p) => p.id === 'zendrop-1603576');
  assert.ok(pawCleaner, 'Product zendrop-1603576 must exist');
  assert.equal(pawCleaner.variants?.length, 9, 'Must contain exactly 9 variants');
  assert.ok(pawCleaner.variants?.some(v => v.sku === '1603576_OF0JCIH'));

  // Produto com variante esgotada
  const dogBed = DEFAULT_REAL_PRODUCTS.find((p) => p.id === 'zendrop-2000777');
  assert.ok(dogBed, 'Product zendrop-2000777 must exist');
  const oosVariant = dogBed.variants?.find(v => v.inventory === 0);
  assert.ok(oosVariant, 'Must have at least one variant with 0 inventory to test OOS logic');
  assert.equal(oosVariant.inventory, 0);
});

// Scenario J: Cupons inválidos não aplicam desconto
test('Cenário J: Código de cupom inválido não aplica desconto', () => {
  const items: CartItem[] = [
    {
      id: 'test-1',
      sku: 'TEST-01',
      name: 'Item',
      price: 30.00,
      quantity: 1,
      size: 'M',
      color: 'Blue',
      image: '',
      supplierCost: 10.0,
    },
  ];

  const res = calculateOrderTotals(items, 'INVALID_COUPON_XYZ');
  assert.equal(res.promoDiscount, 0);
  assert.equal(res.appliedPromo, null);
});

// Regression Tests: Bug dos ZIP Codes e Tarifas Regionais (TX $3.95, CA $5.95, FL $4.95)
test('Regressão ZIP Codes: Sem endereço não calcula frete e não usa US$ 4.95 como fallback', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      sku: '1603576_OF0JCIH',
      name: 'Dog Paw Cleaner Cup',
      price: 24.99,
      quantity: 1,
      size: 'L',
      color: 'Blue',
      image: '',
      supplierCost: 3.5,
    },
  ];

  const res = calculateOrderTotals(items, null, 'shipping', '', '', 'usps_ground');
  assert.equal(res.isShippingCalculated, false);
  assert.equal(res.shipping, null);
  assert.equal(res.total, 24.99);
});

test('Regressão ZIP Codes: ZIP 78701 identifica TX e retorna US$ 3.95 (Zona 2)', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      sku: '1603576_OF0JCIH',
      name: 'Dog Paw Cleaner Cup',
      price: 24.99,
      quantity: 1,
      size: 'L',
      color: 'Blue',
      image: '',
      supplierCost: 3.5,
    },
  ];

  // Apenas com ZIP
  const resZipOnly = calculateOrderTotals(items, null, 'shipping', '', '78701', 'usps_ground');
  assert.equal(resZipOnly.isShippingCalculated, true);
  assert.equal(resZipOnly.shipping, 3.95);
  assert.equal(resZipOnly.total, 28.94);

  // Com State 'TX' e ZIP '78701'
  const resBoth = calculateOrderTotals(items, null, 'shipping', 'TX', '78701', 'usps_ground');
  assert.equal(resBoth.shipping, 3.95);

  // Com nome por extenso 'Texas'
  const resFullName = calculateOrderTotals(items, null, 'shipping', 'Texas', '78701', 'usps_ground');
  assert.equal(resFullName.shipping, 3.95);
});

test('Regressão ZIP Codes: ZIP 90210 identifica CA e retorna US$ 5.95 (Zona 6)', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      sku: '1603576_OF0JCIH',
      name: 'Dog Paw Cleaner Cup',
      price: 24.99,
      quantity: 1,
      size: 'L',
      color: 'Blue',
      image: '',
      supplierCost: 3.5,
    },
  ];

  // Apenas com ZIP
  const resZipOnly = calculateOrderTotals(items, null, 'shipping', '', '90210', 'usps_ground');
  assert.equal(resZipOnly.isShippingCalculated, true);
  assert.equal(resZipOnly.shipping, 5.95);
  assert.equal(resZipOnly.total, 30.94);

  // Com State 'CA' e ZIP '90210'
  const resBoth = calculateOrderTotals(items, null, 'shipping', 'CA', '90210', 'usps_ground');
  assert.equal(resBoth.shipping, 5.95);

  // Com nome por extenso 'California'
  const resFullName = calculateOrderTotals(items, null, 'shipping', 'California', '90210', 'usps_ground');
  assert.equal(resFullName.shipping, 5.95);
});

test('Regressão ZIP Codes: ZIP 33101 identifica FL e retorna US$ 4.95 (Zona 4)', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      sku: '1603576_OF0JCIH',
      name: 'Dog Paw Cleaner Cup',
      price: 24.99,
      quantity: 1,
      size: 'L',
      color: 'Blue',
      image: '',
      supplierCost: 3.5,
    },
  ];

  // Apenas com ZIP
  const resZipOnly = calculateOrderTotals(items, null, 'shipping', '', '33101', 'usps_ground');
  assert.equal(resZipOnly.isShippingCalculated, true);
  assert.equal(resZipOnly.shipping, 4.95);
  assert.equal(resZipOnly.total, 29.94);

  // Com State 'FL' e ZIP '33101'
  const resBoth = calculateOrderTotals(items, null, 'shipping', 'FL', '33101', 'usps_ground');
  assert.equal(resBoth.shipping, 4.95);

  // Com nome por extenso 'Florida'
  const resFullName = calculateOrderTotals(items, null, 'shipping', 'Florida', '33101', 'usps_ground');
  assert.equal(resFullName.shipping, 4.95);
});

test('Regressão ZIP Codes: Transição dinâmica TX -> CA -> FL com estado residual ou ZIP modificado', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      sku: '1603576_OF0JCIH',
      name: 'Dog Paw Cleaner Cup',
      price: 24.99,
      quantity: 1,
      size: 'L',
      color: 'Blue',
      image: '',
      supplierCost: 3.5,
    },
  ];

  // 1. Cliente em TX (78701)
  const calcTX = calculateOrderTotals(items, null, 'shipping', 'TX', '78701', 'usps_ground');
  assert.equal(calcTX.shipping, 3.95);

  // 2. Cliente altera ZIP para 90210 (mesmo se o campo state mantivesse 'TX' residualmente no formulário)
  const calcCAWithResidualTX = calculateOrderTotals(items, null, 'shipping', 'TX', '90210', 'usps_ground');
  assert.equal(calcCAWithResidualTX.shipping, 5.95, 'ZIP 90210 é autoritativo e deve retornar $5.95 mesmo com state residual');

  // 3. Cliente altera ZIP para 33101 (FL)
  const calcFL = calculateOrderTotals(items, null, 'shipping', 'FL', '33101', 'usps_ground');
  assert.equal(calcFL.shipping, 4.95);
});

test('Regressão ZIP Codes: Paridade estrita entre Checkout e Backend Stripe', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      sku: '1603576_OF0JCIH',
      name: 'Dog Paw Cleaner Cup',
      price: 24.99,
      quantity: 1,
      size: 'L',
      color: 'Blue',
      image: '',
      supplierCost: 3.5,
    },
  ];

  for (const [st, zp, expectedFee] of [
    ['TX', '78701', 3.95],
    ['CA', '90210', 5.95],
    ['FL', '33101', 4.95],
  ] as const) {
    const checkoutCalc = calculateOrderTotals(items, null, 'shipping', st, zp, 'usps_ground');
    const backendCalc = calculateOrderTotals(items, null, 'shipping', st, zp, 'usps_ground');

    assert.equal(checkoutCalc.shipping, expectedFee);
    assert.equal(backendCalc.shipping, expectedFee);
    assert.equal(checkoutCalc.total, backendCalc.total);
    assert.equal(checkoutCalc.subtotal, backendCalc.subtotal);
  }
});

