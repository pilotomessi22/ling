/**
 * Server-side cart & address validation for checkout.
 * O navegador só informa QUAL produto e QUANTOS. Preço, custo e estoque vêm do catálogo do servidor.
 */
import { PRODUCTS, type Product } from '../data/storeData.ts';
import type { CartItem } from './storeLogic.ts';
import { getStateFromZip, normalizeStateCode } from './shippingCalculator.ts';

export const MAX_CART_LINES = 30;
export const MAX_QTY_PER_LINE = 20;

export class CheckoutValidationError extends Error {
  outOfStock: boolean;
  item?: string;
  requiresAddress: boolean;

  constructor(message: string, opts: { outOfStock?: boolean; item?: string; requiresAddress?: boolean } = {}) {
    super(message);
    this.name = 'CheckoutValidationError';
    this.outOfStock = Boolean(opts.outOfStock);
    this.item = opts.item;
    this.requiresAddress = Boolean(opts.requiresAddress);
  }
}

export interface ClientCartItem {
  productId?: unknown;
  sku?: unknown;
  size?: unknown;
  color?: unknown;
  quantity?: unknown;
  isRepeatDelivery?: unknown;
  addOn?: { enabled?: unknown; name?: unknown } | null;
}

/** Live stock lookup (Zendrop cache). Returns undefined when there is no live data for the product. */
export type LiveStockLookup = (product: Product) => { inStock: boolean } | undefined;

const str = (v: unknown, max = 200): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function findCatalogProduct(item: ClientCartItem, catalog: Product[] = PRODUCTS): Product | undefined {
  const productId = str(item.productId);
  if (productId) {
    const byId = catalog.find((p) => p.id === productId);
    if (byId) return byId;
  }
  const sku = str(item.sku);
  if (!sku) return undefined;
  return catalog.find((p) => p.sku === sku || p.variants?.some((v) => v.sku === sku));
}

export function buildServerCart(
  rawItems: unknown,
  catalog: Product[] = PRODUCTS,
  liveStock?: LiveStockLookup
): CartItem[] {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new CheckoutValidationError('O carrinho está vazio.');
  }
  if (rawItems.length > MAX_CART_LINES) {
    throw new CheckoutValidationError('Carrinho com itens demais.');
  }

  return rawItems.map((raw) => {
    const item = (raw && typeof raw === 'object' ? raw : {}) as ClientCartItem;
    const product = findCatalogProduct(item, catalog);
    if (!product) {
      throw new CheckoutValidationError(
        'Um produto do carrinho não existe mais no catálogo. Atualize a página e adicione o produto de novo.'
      );
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY_PER_LINE) {
      throw new CheckoutValidationError(`Quantidade inválida para "${product.name}".`);
    }

    const size = str(item.size, 80);
    const color = str(item.color, 80);
    const sku = str(item.sku);
    const variant =
      product.variants?.find((v) => v.sku === sku) ||
      product.variants?.find((v) => (v.size || '') === size && (v.color || '') === color);

    const live = liveStock?.(product);
    const inStock = live ? live.inStock : (variant ? variant.inventory : product.stockCount) > 0;
    if (!inStock) {
      throw new CheckoutValidationError(`O produto "${product.name}" está esgotado no fornecedor.`, {
        outOfStock: true,
        item: product.name,
      });
    }

    let addOn: CartItem['addOn'];
    if (item.addOn && item.addOn.enabled) {
      const def = product.addOns?.find((a) => a.name === str(item.addOn?.name));
      if (!def) {
        throw new CheckoutValidationError(`Adicional inválido para "${product.name}".`);
      }
      addOn = { enabled: true, name: def.name, price: def.price };
    }

    return {
      id: product.id,
      productId: product.id,
      sku: variant?.sku || product.sku,
      name: product.name,
      price: product.price,
      quantity,
      size: variant?.size || size,
      color: variant?.color || color,
      isRepeatDelivery: Boolean(item.isRepeatDelivery) && product.repeatDeliveryEligible,
      addOn,
      image: product.heroImage,
      supplierCost: product.supplierCost,
      stockCount: variant ? variant.inventory : product.stockCount,
      inStock: true,
      volumeTiers: product.volumeTiers?.map((t) => ({ qty: t.qty, discountPercent: t.discountPercent })),
    };
  });
}

export interface CheckoutAddress {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;

/**
 * Valida o endereço de entrega. É ESTE endereço que define o frete e que vai para a Stripe,
 * então o cliente não consegue cotar frete para um lugar e receber em outro.
 */
export function validateCheckoutAddress(body: any): CheckoutAddress {
  const addr = body?.shippingAddress || {};
  const name = str(body?.customerName, 120);
  const email = str(body?.customerEmail, 200).toLowerCase();
  const phone = str(body?.customerPhone, 40);
  const line1 = str(addr.line1 ?? addr.street, 200);
  const line2 = str(addr.line2, 200);
  const city = str(addr.city, 100);
  const zip = str(addr.zip, 10);
  const country = str(addr.country, 60).toUpperCase();

  if (country && !['US', 'USA', 'UNITED STATES'].includes(country)) {
    throw new CheckoutValidationError('No momento entregamos apenas nos Estados Unidos.', { requiresAddress: true });
  }
  if (!EMAIL_RE.test(email)) {
    throw new CheckoutValidationError('Informe um e-mail válido.', { requiresAddress: true });
  }
  if (!name || !line1 || !city) {
    throw new CheckoutValidationError('Preencha nome, endereço e cidade para calcular o frete.', { requiresAddress: true });
  }
  if (!ZIP_RE.test(zip)) {
    throw new CheckoutValidationError('Informe um ZIP code americano válido (5 dígitos).', { requiresAddress: true });
  }

  const zipState = getStateFromZip(zip);
  const state = normalizeStateCode(str(addr.state, 40)) || zipState || '';
  if (!zipState || !state) {
    throw new CheckoutValidationError('ZIP code não reconhecido.', { requiresAddress: true });
  }
  if (zipState !== state) {
    throw new CheckoutValidationError(`O ZIP ${zip} não pertence ao estado ${state}. Confira o endereço.`, {
      requiresAddress: true,
    });
  }

  return { name, email, phone, line1, line2, city, state, zip };
}
