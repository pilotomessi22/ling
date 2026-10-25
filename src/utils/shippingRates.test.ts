import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../data/storeData.ts';
import { buildServerCart, type CheckoutAddress } from './checkoutPricing.ts';
import { parseWeightOz, getCartWeightOz, quoteLiveShipping } from './shippingRates.ts';

const address: CheckoutAddress = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '',
  line1: '100 Congress Ave',
  line2: '',
  city: 'Austin',
  state: 'TX',
  zip: '78701',
};
const product = PRODUCTS.find((p) => p.stockCount > 0)!;

test('Peso: lê lbs, oz, g e kg da ficha do produto', () => {
  assert.equal(parseWeightOz('1.2 lbs (Total 3-Piece Kit)'), 19.2);
  assert.equal(parseWeightOz('8 oz'), 8);
  assert.ok(Math.abs((parseWeightOz('500 g') ?? 0) - 17.637) < 0.01);
  assert.equal(parseWeightOz('Fitted Weight'), null);
});

test('Peso do carrinho usa o peso padrão quando o produto não tem peso cadastrado', () => {
  process.env.DEFAULT_ITEM_WEIGHT_OZ = '10';
  const noWeight = PRODUCTS.find((p) => parseWeightOz(p.specifications?.weight) === null && p.stockCount > 0)!;
  const cart = buildServerCart([{ productId: noWeight.id, quantity: 3 }]);
  const { weightOz, estimated } = getCartWeightOz(cart, PRODUCTS);
  assert.equal(weightOz, 30);
  assert.equal(estimated, true);
  delete process.env.DEFAULT_ITEM_WEIGHT_OZ;
});

test('Sem EASYPOST_API_KEY a cotação não roda (checkout usa a tabela de zonas)', async () => {
  delete process.env.EASYPOST_API_KEY;
  const cart = buildServerCart([{ productId: product.id, quantity: 1 }]);
  assert.equal(await quoteLiveShipping(address, cart, PRODUCTS, 'usps_ground'), null);
});

test('Com EasyPost configurada, usa a tarifa USPS do serviço escolhido para o endereço', async () => {
  process.env.EASYPOST_API_KEY = 'EZTK_test';
  process.env.SHIP_FROM_ZIP = '64101';
  const originalFetch = globalThis.fetch;
  let sentBody: any = null;
  globalThis.fetch = (async (_url: any, init: any) => {
    sentBody = JSON.parse(init.body);
    return new Response(
      JSON.stringify({
        rates: [
          { carrier: 'USPS', service: 'Priority', rate: '11.40', delivery_days: 2 },
          { carrier: 'USPS', service: 'GroundAdvantage', rate: '6.83', delivery_days: 4 },
        ],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }) as typeof fetch;
  try {
    const cart = buildServerCart([{ productId: product.id, quantity: 2 }]);
    const ground = await quoteLiveShipping({ ...address, line1: '1 Test St' }, cart, PRODUCTS, 'usps_ground');
    assert.equal(ground?.fee, 6.83);
    assert.equal(sentBody.shipment.to_address.zip, '78701');
    assert.equal(sentBody.shipment.to_address.street1, '1 Test St');
    assert.equal(sentBody.shipment.from_address.zip, '64101');

    const priority = await quoteLiveShipping({ ...address, line1: '2 Test St' }, cart, PRODUCTS, 'usps_priority');
    assert.equal(priority?.fee, 11.4);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.EASYPOST_API_KEY;
    delete process.env.SHIP_FROM_ZIP;
  }
});

test('Se a EasyPost falhar, a cotação volta null (sem travar o checkout)', async () => {
  process.env.EASYPOST_API_KEY = 'EZTK_test';
  process.env.SHIP_FROM_ZIP = '64101';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response('{"error":{"message":"bad"}}', { status: 422 })) as typeof fetch;
  try {
    const cart = buildServerCart([{ productId: product.id, quantity: 1 }]);
    assert.equal(await quoteLiveShipping({ ...address, line1: '3 Fail St' }, cart, PRODUCTS, 'usps_ground'), null);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.EASYPOST_API_KEY;
    delete process.env.SHIP_FROM_ZIP;
  }
});
