/**
 * Frete pelo endereço exato (server-side).
 * Cota a tarifa real da USPS para o endereço completo do cliente via EasyPost.
 * Sem EASYPOST_API_KEY configurada, quem decide é a tabela de zonas por estado (shippingCalculator.ts).
 *
 * Variáveis de ambiente:
 *   EASYPOST_API_KEY          chave da EasyPost (https://www.easypost.com) — cotação é grátis
 *   SHIP_FROM_ZIP             ZIP do armazém de onde sai o pacote (obrigatório para cotar)
 *   SHIP_FROM_STATE / SHIP_FROM_CITY / SHIP_FROM_STREET   endereço do armazém (opcionais, melhoram a cotação)
 *   DEFAULT_ITEM_WEIGHT_OZ    peso usado quando o produto não tem peso cadastrado (padrão 16 oz = 1 lb)
 */
import type { CartItem } from './storeLogic.ts';
import type { Product } from '../data/storeData.ts';
import type { CheckoutAddress } from './checkoutPricing.ts';

export interface LiveShippingQuote {
  fee: number;
  service: string;
  estimatedDays: string;
  weightOz: number;
  weightIsEstimated: boolean;
}

const OZ_PER_UNIT: Record<string, number> = { oz: 1, lb: 16, lbs: 16, g: 0.035274, kg: 35.274 };

/** Lê "1.2 lbs", "8 oz", "500 g"... da ficha do produto. Retorna null se não tiver peso de verdade. */
export function parseWeightOz(text: string | undefined | null): number | null {
  const m = String(text || '').toLowerCase().match(/(\d+(?:\.\d+)?)\s*(oz|lbs?|kg|g)\b/);
  if (!m) return null;
  const oz = Number(m[1]) * OZ_PER_UNIT[m[2]];
  return Number.isFinite(oz) && oz > 0 ? oz : null;
}

export function getCartWeightOz(cart: CartItem[], catalog: Product[]): { weightOz: number; estimated: boolean } {
  const fallback = Number(process.env.DEFAULT_ITEM_WEIGHT_OZ) || 16;
  let estimated = false;
  const weightOz = cart.reduce((acc, item) => {
    const product = catalog.find((p) => p.id === item.productId);
    const oz = parseWeightOz(product?.specifications?.weight);
    if (oz === null) estimated = true;
    return acc + (oz ?? fallback) * item.quantity;
  }, 0);
  return { weightOz: Math.max(1, Math.round(weightOz * 10) / 10), estimated };
}

const SERVICE_BY_OPTION = { usps_ground: 'GroundAdvantage', usps_priority: 'Priority' } as const;

const quoteCache = new Map<string, { at: number; quote: LiveShippingQuote }>();
const CACHE_MS = 30 * 60 * 1000;

export function isLiveShippingEnabled(): boolean {
  return Boolean(process.env.EASYPOST_API_KEY && process.env.SHIP_FROM_ZIP);
}

/**
 * Cota o frete real. Retorna null quando a cotação não está configurada ou falha
 * (o checkout então usa a tabela de zonas, como antes).
 */
export async function quoteLiveShipping(
  address: CheckoutAddress,
  cart: CartItem[],
  catalog: Product[],
  deliveryOption: 'usps_ground' | 'usps_priority'
): Promise<LiveShippingQuote | null> {
  if (!isLiveShippingEnabled()) return null;

  const { weightOz, estimated } = getCartWeightOz(cart, catalog);
  const cacheKey = [address.line1, address.city, address.state, address.zip, weightOz, deliveryOption].join('|').toLowerCase();
  const cached = quoteCache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.quote;

  try {
    const res = await fetch('https://api.easypost.com/v2/shipments', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.EASYPOST_API_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shipment: {
          to_address: {
            name: address.name,
            street1: address.line1,
            street2: address.line2 || undefined,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: 'US',
          },
          from_address: {
            street1: process.env.SHIP_FROM_STREET || undefined,
            city: process.env.SHIP_FROM_CITY || undefined,
            state: process.env.SHIP_FROM_STATE || undefined,
            zip: process.env.SHIP_FROM_ZIP,
            country: 'US',
          },
          parcel: { weight: weightOz },
        },
      }),
      signal: AbortSignal.timeout(8000),
    });
    const data: any = await res.json().catch(() => null);
    if (!res.ok || !Array.isArray(data?.rates)) {
      console.warn('[Shipping] EasyPost quote failed:', res.status, data?.error?.message);
      return null;
    }

    const wanted = SERVICE_BY_OPTION[deliveryOption];
    const rate = data.rates.find((r: any) => r.carrier === 'USPS' && r.service === wanted);
    if (!rate) {
      console.warn(`[Shipping] EasyPost returned no USPS ${wanted} rate for ${address.zip}`);
      return null;
    }

    const quote: LiveShippingQuote = {
      fee: Math.round(Number(rate.rate) * 100) / 100,
      service: `USPS ${wanted === 'GroundAdvantage' ? 'Ground Advantage' : 'Priority Mail'}`,
      estimatedDays: rate.delivery_days ? `${rate.delivery_days} Business Days` : '',
      weightOz,
      weightIsEstimated: estimated,
    };
    if (estimated) {
      console.warn(`[Shipping] Peso estimado (produto sem peso cadastrado). Total usado: ${weightOz} oz`);
    }
    quoteCache.set(cacheKey, { at: Date.now(), quote });
    return quote;
  } catch (err: any) {
    console.warn('[Shipping] EasyPost quote error:', err?.message);
    return null;
  }
}
