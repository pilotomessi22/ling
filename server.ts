import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import Stripe from 'stripe';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 3000;

// Stripe Webhook needs raw body (defined BEFORE express.json())
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn('STRIPE_WEBHOOK_SECRET is not configured.');
      return res.status(400).json({ error: 'STRIPE_WEBHOOK_SECRET is missing in environment variables.' });
    }

    try {
      const secretKey = process.env.STRIPE_SECRET_KEY;
      if (!secretKey) {
        return res.status(500).json({ error: 'STRIPE_SECRET_KEY is missing.' });
      }
      const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' as any });
      const event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const anySess = session as any;
        console.log(`[Stripe Webhook] Checkout Session Completed: ${session.id}, payment_status: ${session.payment_status}`);
        try {
          const orders = getStoredOrders();
          const idx = orders.findIndex((o: any) => o.sessionId === session.id || (session.id && o.orderNumber?.includes(session.id.slice(-6).toUpperCase())));
          if (idx >= 0) {
            orders[idx].paymentStatus = 'Paid (Stripe Verified)';
            orders[idx].fulfillmentStatus = 'Aguardando Despacho';
            orders[idx].totalUsd = session.amount_total ? session.amount_total / 100 : orders[idx].totalUsd;
            orders[idx].sessionId = session.id;
            saveStoredOrders(orders);
            console.log(`[Stripe Webhook] Order updated to Paid for session ${session.id}`);
          } else {
            const generatedId = `LP-STRIPE-${session.id.slice(-6).toUpperCase()}`;
            const newOrder = {
              id: `ord-${Date.now()}`,
              orderNumber: generatedId,
              date: 'Today, just now',
              customerName: anySess.customer_details?.name || session.customer_email || 'Stripe Customer',
              customerEmail: session.customer_email || 'customer@lingpetshop.com',
              customerPhone: anySess.customer_details?.phone || '+1 (555) 019-2831',
              shippingAddress: anySess.shipping_details?.address ? {
                street: [anySess.shipping_details.address.line1, anySess.shipping_details.address.line2].filter(Boolean).join(', '),
                city: anySess.shipping_details.address.city || 'Austin',
                state: anySess.shipping_details.address.state || 'TX',
                zip: anySess.shipping_details.address.postal_code || '78701',
                country: anySess.shipping_details.address.country || 'United States',
              } : {
                street: 'Verified Stripe Address',
                city: 'Austin',
                state: 'TX',
                zip: '78701',
                country: 'United States',
              },
              items: [{ name: 'Ling Petshop Verified Order', quantity: 1, unitPrice: (session.amount_total || 1000) / 100, sku: 'LP-VERIFIED', supplier: 'Zendrop US', supplierSku: 'LP-VERIFIED' }],
              totalUsd: (session.amount_total || 1000) / 100,
              supplierCostUsd: 0,
              profitUsd: (session.amount_total || 1000) / 100,
              paymentGateway: 'Stripe (Credit Card / Apple Pay)',
              paymentStatus: 'Paid (Stripe Verified)',
              fulfillmentStatus: 'Aguardando Despacho',
              sessionId: session.id,
            };
            orders.unshift(newOrder);
            saveStoredOrders(orders);
            console.log(`[Stripe Webhook] Created new paid order from webhook session ${session.id}`);
          }
        } catch (e) {
          console.error('[Stripe Webhook] Error updating orders:', e);
        }
      }

      return res.json({ received: true });
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

app.use(express.json());

// Healthcheck endpoint for VPS monitoring & uptime checks
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    store: 'Ling Petshop Online Superstore',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
  });
});

// Endpoint to check live Stripe Account status
app.get('/api/stripe-status', async (_req: Request, res: Response) => {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey || stripeSecretKey.trim() === '') {
      return res.status(400).json({ active: false, error: 'STRIPE_SECRET_KEY não está configurada.' });
    }

    const stripeRes = await fetch('https://api.stripe.com/v1/account', {
      headers: {
        Authorization: `Bearer ${stripeSecretKey.trim()}`,
      },
    });

    const data = await stripeRes.json();
    if (!stripeRes.ok) {
      return res.status(stripeRes.status).json({ 
        active: false, 
        error: data.error?.message || 'Chave da Stripe inválida ou expirada. Por favor, atualize STRIPE_SECRET_KEY nos Segredos do Google AI Studio.',
        code: 'STRIPE_KEY_EXPIRED'
      });
    }

    const cardStatus = data.capabilities?.card_payments;
    const active = Boolean(data.charges_enabled && cardStatus === 'active');

    return res.json({
      active,
      charges_enabled: data.charges_enabled,
      payouts_enabled: data.payouts_enabled,
      card_payments: cardStatus,
      country: data.country,
      currency: data.default_currency,
      accountId: data.id,
    });
  } catch (err: any) {
    return res.status(500).json({ active: false, error: err.message });
  }
});

// Zendrop API Status Endpoint
app.post('/api/zendrop/status', async (req: Request, res: Response) => {
  try {
    const apiKey =
      req.body?.apiKey ||
      process.env.ZENDROP_API_KEY ||
      'UUUvotHLOYoGQopIgxXnfpIFjD4BoQfUW7EisDnPqI9KHQHl2aD8G72eKRiVRbqN';
    if (!apiKey || apiKey.trim() === '') {
      return res.json({
        connected: false,
        status: 'disconnected',
        message: 'Nenhuma chave API do Zendrop foi informada. Insira sua Zendrop API Key no painel admin para ativar a sincronização real.',
      });
    }

    // Call Zendrop API endpoint to verify key
    const zendropRes = await fetch('https://api.zendrop.com/v1/user', {
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
    });

    if (zendropRes.ok) {
      const userData = await zendropRes.json().catch(() => ({}));
      return res.json({
        connected: true,
        status: 'active',
        message: 'Conexão com a API do Zendrop estabelecida e autenticada com sucesso!',
        user: userData,
      });
    } else {
      return res.json({
        connected: false,
        status: 'invalid_key',
        message: `Chave API recusada pelo Zendrop (HTTP ${zendropRes.status}). Verifique se a chave gerada no painel do Zendrop está correta.`,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      connected: false,
      status: 'error',
      message: `Erro ao conectar com servidor do Zendrop: ${err.message}`,
    });
  }
});

// Zendrop Fetch Product Details & HD Images Endpoint
app.post('/api/zendrop/fetch-product', async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'ID ou link do produto é obrigatório.' });
    }

    const cleanId = String(productId).replace(/[^0-9]/g, '');
    if (!cleanId) {
      return res.status(400).json({ error: 'ID do produto Zendrop inválido.' });
    }

    // Direct extraction from Zendrop public catalog API (no API key required)
    const zendropRes = await fetch('https://app.zendrop.com/api/get-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: JSON.stringify({ product_id: cleanId, id: parseInt(cleanId) })
    });

    const json = await zendropRes.json().catch(() => null);

    if (json?.status === 'success' && json?.data?.product) {
      const p = json.data.product;
      const images: string[] = [];

      const addImg = (url: string | undefined | null) => {
        if (!url) return;
        let fullUrl = url;
        if (!fullUrl.startsWith('http')) {
          fullUrl = 'https://file.zendrop.com/' + fullUrl.replace(/^\//, '');
        }
        if (!images.includes(fullUrl)) {
          images.push(fullUrl);
        }
      };

      if (p.featuredProductImage) {
        if (p.featuredProductImage.urls?.original) addImg(p.featuredProductImage.urls.original);
        if (p.featuredProductImage.full_image) addImg(p.featuredProductImage.full_image);
      }

      if (Array.isArray(p.product_image)) {
        for (const imgObj of p.product_image) {
          if (imgObj.urls?.original) addImg(imgObj.urls.original);
          else if (imgObj.full_image) addImg(imgObj.full_image);
        }
      }

      if (Array.isArray(p.product_variant)) {
        for (const v of p.product_variant) {
          if (v.variant_image_info?.urls?.original) addImg(v.variant_image_info.urls.original);
          else if (v.variant_image_info?.variant_image_url) addImg(v.variant_image_info.variant_image_url);
        }
      }

      const variants = Array.isArray(p.product_variant) ? p.product_variant : [];
      const totalStock = variants.reduce(
        (sum: number, v: any) => sum + (Number(v.variant_inventory) || 0),
        0
      );

      return res.json({
        success: true,
        product: {
          id: cleanId,
          name: p.name,
          description: p.description,
          images: images.length > 0 ? images : ['https://file.zendrop.com/products/default.jpg'],
          heroImage: images[0] || null,
          secondaryImage: images[1] || images[0] || null,
          supplierCost: p.base_cost_price || p.display_price || 0,
          stock: totalStock,
          inStock: totalStock > 0,
          variantCount: variants.length,
        },
      });
    }

    return res.status(404).json({ error: `Produto ID ${cleanId} não encontrado no Zendrop.` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro interno ao consultar produto no Zendrop.' });
  }
});

// Real-time Single Product Zendrop Stock Endpoint
app.get('/api/zendrop/stock/:id', async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const cleanId = String(rawId).replace(/[^0-9]/g, '');
    if (!cleanId) {
      return res.status(400).json({ error: 'ID de produto Zendrop inválido.' });
    }

    const zendropRes = await fetch('https://app.zendrop.com/api/get-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      body: JSON.stringify({ product_id: cleanId, id: parseInt(cleanId) }),
    });

    const json = await zendropRes.json().catch(() => null);
    if (json?.status === 'success' && json?.data?.product) {
      const p = json.data.product;
      const variants = Array.isArray(p.product_variant) ? p.product_variant : [];
      const totalStock = variants.reduce(
        (sum: number, v: any) => sum + (Number(v.variant_inventory) || 0),
        0
      );

      return res.json({
        success: true,
        id: cleanId,
        name: p.name,
        stockCount: totalStock,
        inStock: totalStock > 0,
        variantCount: variants.length,
        variants: variants.map((v: any) => ({
          sku: v.variant_sku,
          color: v.variant_color,
          size: v.variant_size,
          inventory: Number(v.variant_inventory) || 0,
        })),
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(404).json({ error: `Produto ${cleanId} não encontrado no Zendrop.` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao consultar estoque no Zendrop.' });
  }
});

// Cache for inventory sync to prevent throttling
let inventoryCache: {
  timestamp: number;
  data: Record<string, { stockCount: number; inStock: boolean; name: string }>;
} | null = null;

// Real-time Batch Zendrop Stock Sync Endpoint
app.all(['/api/zendrop/sync-all-inventory', '/api/zendrop/sync-inventory'], async (req: Request, res: Response) => {
  try {
    const defaultProductIds = [
      '2000857', '2041862', '1603576', '2053714', '2058716', '2873973', '2632492', '2658755',
      '2689252', '2640918', '2650189', '2608657', '2631448', '2040471', '2699708', '2601227',
      '2626089', '2000777', '2042070', '2047664', '2051156', '2063694', '3090659', '2001114',
      '2070193', '2069888', '2044170', '2066498', '2073024', '2040754', '2072717', '2066233',
      '2001034', '2038976'
    ];

    const requestedIds: string[] = Array.isArray(req.body?.productIds)
      ? req.body.productIds.map((id: any) => String(id).replace(/[^0-9]/g, '')).filter(Boolean)
      : defaultProductIds;

    const force = Boolean(req.body?.force || req.query.force === 'true');
    const now = Date.now();

    // 60-second cache unless force is requested
    if (!force && inventoryCache && (now - inventoryCache.timestamp < 60000)) {
      const outOfStockList = Object.entries(inventoryCache.data)
        .filter(([_, item]) => !item.inStock)
        .map(([id, item]) => ({ id, name: item.name }));

      return res.json({
        success: true,
        cached: true,
        timestamp: new Date(inventoryCache.timestamp).toISOString(),
        syncedCount: Object.keys(inventoryCache.data).length,
        outOfStockCount: outOfStockList.length,
        outOfStockProducts: outOfStockList,
        stocks: inventoryCache.data,
      });
    }

    const results: Record<string, { stockCount: number; inStock: boolean; name: string }> = {};

    // Process in controlled batches of 6 concurrent requests to Zendrop
    const batchSize = 6;
    for (let i = 0; i < requestedIds.length; i += batchSize) {
      const chunk = requestedIds.slice(i, i + batchSize);
      await Promise.all(
        chunk.map(async (cleanId) => {
          try {
            const zRes = await fetch('https://app.zendrop.com/api/get-product', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
              },
              body: JSON.stringify({ product_id: cleanId, id: parseInt(cleanId) }),
            });
            const zJson = await zRes.json().catch(() => null);
            if (zJson?.status === 'success' && zJson?.data?.product) {
              const p = zJson.data.product;
              const variants = Array.isArray(p.product_variant) ? p.product_variant : [];
              const totalStock = variants.reduce(
                (sum: number, v: any) => sum + (Number(v.variant_inventory) || 0),
                0
              );
              results[cleanId] = {
                stockCount: totalStock,
                inStock: totalStock > 0,
                name: p.name || `Produto #${cleanId}`,
              };
            }
          } catch (e) {
            // keep existing or zero on error
          }
        })
      );
    }

    inventoryCache = {
      timestamp: now,
      data: results,
    };

    const outOfStockList = Object.entries(results)
      .filter(([_, item]) => !item.inStock)
      .map(([id, item]) => ({ id, name: item.name }));

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      syncedCount: Object.keys(results).length,
      outOfStockCount: outOfStockList.length,
      outOfStockProducts: outOfStockList,
      stocks: results,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao sincronizar estoque com Zendrop.' });
  }
});

// Official Stripe Checkout Session Creation & Management Endpoints
const getStripeInstance = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.trim() === '') {
    console.error('[Stripe Diagnostic] STRIPE_SECRET_KEY is missing or empty.');
    throw new Error('STRIPE_SECRET_KEY não está configurada nos Segredos do Google AI Studio.');
  }
  const trimmed = secretKey.trim();
  const keyType = trimmed.startsWith('sk_live_') ? 'live' : trimmed.startsWith('sk_test_') ? 'test' : 'unknown';
  console.log(`[Stripe Diagnostic] Initializing Stripe with ${keyType} key (length: ${trimmed.length}, prefix: ${trimmed.slice(0, 7)}...)`);
  return new Stripe(trimmed, { apiVersion: '2023-10-16' as any });
};

const handleCreateCheckoutSession = async (req: Request, res: Response) => {
  console.log('[Stripe Diagnostic] POST /api/checkout/create-session called');
  try {
    const { items, customerEmail, domainUrl, currency } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.warn('[Stripe Diagnostic] Cart items missing or empty');
      return res.status(400).json({ error: 'O carrinho está vazio.' });
    }

    // Strict inventory verification
    for (const item of items) {
      if (item.stockCount === 0 || item.inStock === false) {
        console.warn(`[Stripe Diagnostic] Item out of stock: ${item.name}`);
        return res.status(400).json({
          error: `O produto "${item.name}" está esgotado no fornecedor Zendrop (0 unidades).`,
          outOfStock: true,
          item: item.name,
        });
      }
    }

    // Sanitize domainUrl (in case frontend sends literal 'null' or 'undefined')
    let cleanDomain = domainUrl;
    if (!cleanDomain || cleanDomain === 'null' || cleanDomain === 'undefined' || typeof cleanDomain !== 'string' || cleanDomain.trim() === '') {
      cleanDomain = '';
    }

    let baseUrl = process.env.APP_URL || cleanDomain || req.headers.origin || `${req.protocol}://${req.get('host')}`;
    if (!baseUrl || typeof baseUrl !== 'string' || baseUrl.trim() === '' || baseUrl === 'null' || baseUrl === 'undefined') {
      baseUrl = 'https://lingpetshop.com';
    }
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `https://${baseUrl}`;
    }
    if (baseUrl.startsWith('http://') && !baseUrl.includes('localhost') && !baseUrl.includes('127.0.0.1')) {
      baseUrl = baseUrl.replace('http://', 'https://');
    }

    console.log(`[Stripe Diagnostic] Constructed base URL: ${baseUrl}`);

    let success_url: string;
    let cancel_url: string;
    try {
      const parsedBase = new URL(baseUrl);
      const successObj = new URL('/checkout', parsedBase.origin);
      successObj.searchParams.set('status', 'success');
      successObj.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');
      success_url = successObj.toString();

      const cancelObj = new URL('/checkout', parsedBase.origin);
      cancelObj.searchParams.set('status', 'cancelled');
      cancel_url = cancelObj.toString();
    } catch (urlErr: any) {
      console.error('[Stripe Diagnostic] URL construction exception:', urlErr.message, { baseUrl });
      const sanitizedBase = baseUrl.replace(/\/$/, '');
      success_url = `${sanitizedBase}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`;
      cancel_url = `${sanitizedBase}/checkout?status=cancelled`;
    }

    console.log(`[Stripe Diagnostic] success_url: ${success_url}`);
    console.log(`[Stripe Diagnostic] cancel_url: ${cancel_url}`);

    const selectedCurrency = (currency || 'usd').toLowerCase();

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: selectedCurrency,
        unit_amount: Math.round((Number(item.price) || 10) * 100),
        product_data: {
          name: item.name || 'Pet Product',
          images: item.image && typeof item.image === 'string' && item.image.startsWith('http') ? [item.image] : [],
        },
      },
      quantity: Number(item.quantity) || 1,
    }));

    let stripe;
    try {
      stripe = getStripeInstance();
    } catch (configErr: any) {
      console.error('[Stripe Diagnostic] Stripe configuration error:', configErr.message);
      return res.status(400).json({
        error: configErr.message,
        code: 'STRIPE_KEY_MISSING'
      });
    }

    console.log(`[Stripe Diagnostic] Creating Stripe Checkout session with ${lineItems.length} line items...`);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail || undefined,
      line_items: lineItems,
      success_url,
      cancel_url,
      shipping_address_collection: {
        allowed_countries: ['US', 'BR', 'CA', 'GB', 'AU', 'FR', 'DE', 'IT', 'ES'],
      },
      metadata: {
        itemsSummary: JSON.stringify(items.map((i: any) => ({ sku: i.sku || i.id, qty: i.quantity }))),
      },
    } as any);

    console.log(`[Stripe Diagnostic] Stripe session created successfully: ${session.id}, url: ${session.url}`);
    return res.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error('[Stripe Diagnostic] Error creating Stripe checkout session:', {
      message: err.message,
      type: err.type,
      code: err.code,
      statusCode: err.statusCode,
    });

    if (err?.type === 'StripeAuthenticationError' || err?.message?.includes('API Key') || err?.message?.includes('expired') || err?.message?.includes('invalid')) {
      return res.status(400).json({
        error: `A chave secreta da Stripe fornecida expirou ou é inválida (${err.message}). Por favor, gere uma nova chave ativa no dashboard da Stripe e atualize a variável STRIPE_SECRET_KEY nas configurações de Segredos do Google AI Studio.`,
        code: 'STRIPE_KEY_EXPIRED'
      });
    }

    if (err?.message?.includes('URL') || err?.message?.includes('valid URL')) {
      return res.status(400).json({
        error: `Erro de URL inválida no checkout: ${err.message}.`,
        code: 'INVALID_URL'
      });
    }

    return res.status(500).json({ error: err.message || 'Erro interno ao criar sessão de checkout.' });
  }
};

app.post('/api/checkout/create-session', handleCreateCheckoutSession);
app.post('/api/create-checkout-session', handleCreateCheckoutSession);

app.get('/api/checkout/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const stripe = getStripeInstance();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['shipping_details', 'customer_details', 'line_items'],
    });
    const anySess = session as any;
    return res.json({
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_email || anySess.customer_details?.email,
      customer_name: anySess.customer_details?.name || anySess.shipping_details?.name,
      customer_phone: anySess.customer_details?.phone || anySess.shipping_details?.phone,
      shipping_details: anySess.shipping_details,
      customer_details: anySess.customer_details,
      amount_total: session.amount_total ? session.amount_total / 100 : 0,
      metadata: session.metadata,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Server-side persistent orders storage
import fs from 'fs';
const ORDERS_FILE = path.join(__dirname, 'orders.json');

const getStoredOrders = () => {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading orders.json:', e);
  }
  return [];
};

const saveStoredOrders = (orders: any[]) => {
  try {
    const tempFile = `${ORDERS_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(orders, null, 2), 'utf8');
    fs.renameSync(tempFile, ORDERS_FILE);
  } catch (e) {
    console.error('Error writing orders.json atomically:', e);
    try {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
    } catch (innerE) {
      console.error('Error writing orders.json directly:', innerE);
    }
  }
};

app.get('/api/orders', (_req: Request, res: Response) => {
  const orders = getStoredOrders();
  res.json({ success: true, orders });
});

app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const newOrder = req.body;
    if (!newOrder || !newOrder.id) {
      return res.status(400).json({ success: false, error: 'Invalid order data.' });
    }
    const orders = getStoredOrders();
    const existingIdx = orders.findIndex((o: any) => o.id === newOrder.id || o.orderNumber === newOrder.orderNumber);
    if (existingIdx >= 0) {
      orders[existingIdx] = { ...orders[existingIdx], ...newOrder };
    } else {
      orders.unshift(newOrder);
    }
    saveStoredOrders(orders);
    return res.json({ success: true, order: newOrder });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/orders/update-status', (req: Request, res: Response) => {
  try {
    const { orderId, fulfillmentStatus, trackingNumber, carrier } = req.body;
    const orders = getStoredOrders();
    const idx = orders.findIndex((o: any) => o.id === orderId || o.orderNumber === orderId);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }
    orders[idx].fulfillmentStatus = fulfillmentStatus || orders[idx].fulfillmentStatus;
    if (trackingNumber) orders[idx].trackingNumber = trackingNumber;
    if (carrier) orders[idx].carrier = carrier;
    if (fulfillmentStatus === 'Despachado') {
      orders[idx].dispatchedAt = new Date().toISOString();
    }
    saveStoredOrders(orders);
    return res.json({ success: true, order: orders[idx] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Resend Email Sending Endpoint for support@lingpetshop.com
app.post('/api/send-email', async (req: Request, res: Response) => {
  try {
    const { to, subject, html, text, fromName, resendApiKey } = req.body;
    const apiKey = resendApiKey || process.env.RESEND_API_KEY || 're_aNjipU2c_DDU5j6EJ823rfmwpAdBNEuCN';

    if (!apiKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'RESEND_API_KEY não configurada. Configure a variável de ambiente RESEND_API_KEY ou insira sua chave da Resend no painel admin.' 
      });
    }

    const resend = new Resend(apiKey);

    const response = await resend.emails.send({
      from: `${fromName || 'Ling Petshop Support'} <support@lingpetshop.com>`,
      to: to || 'support@lingpetshop.com',
      subject: subject || 'Nova mensagem - Ling Petshop',
      html: html || '<p>Nova mensagem enviada pelo site Ling Petshop.</p>',
      text: text,
    });

    return res.json({ success: true, data: response });
  } catch (err: any) {
    console.error('Erro ao enviar e-mail com Resend:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve compiled static assets from dist folder
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    // Fallback to index.html for client-side routing
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Ling Petshop server running on port ${PORT}`);
  });
}

startServer();
