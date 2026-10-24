import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'test' || process.env.ORDERS_FILE?.includes('test') || process.env.USE_ENV_TEST === 'true') {
  dotenv.config({ path: path.resolve(__dirname, '.env.test'), override: true });
} else {
  dotenv.config();
}

import express, { Request, Response } from 'express';
import fs from 'fs';
import crypto from 'crypto';
import { Resend } from 'resend';
import Stripe from 'stripe';
import { calculateOrderTotals } from './src/utils/storeLogic.ts';
import { DEFAULT_COUPONS, PRODUCTS, type Coupon, type Product } from './src/data/storeData.ts';
import { buildServerCart, validateCheckoutAddress, CheckoutValidationError } from './src/utils/checkoutPricing.ts';
import { 
  sendOrderConfirmationEmail, 
  sendOrderTrackingEmail, 
  getDemoOrderConfirmationData, 
  getDemoOrderTrackingData, 
  generateOrderConfirmationHtml, 
  generateOrderTrackingHtml, 
  sendTestEmailDirect 
} from './src/utils/emailService.ts';

const ORDERS_FILE = path.join(__dirname, process.env.ORDERS_FILE || 'orders.json');

function getStoredOrders(): any[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading orders.json:', e);
  }
  return [];
}

// Serializa leitura+escrita do orders.json: sem isso, duas requisições ao mesmo tempo
// (ex.: webhook e admin) leem a mesma versão e a última a salvar apaga a outra.
let ordersLock: Promise<unknown> = Promise.resolve();
function withOrdersLock<T>(fn: () => T | Promise<T>): Promise<T> {
  const run = ordersLock.then(fn, fn);
  ordersLock = run.catch(() => undefined);
  return run;
}

function saveStoredOrders(orders: any[]): void {
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
}

const COUPONS_FILE = path.join(__dirname, process.env.COUPONS_FILE || 'coupons.json');

function getServerCoupons(): Coupon[] {
  try {
    if (fs.existsSync(COUPONS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(COUPONS_FILE, 'utf8'));
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading coupons.json:', e);
  }
  return DEFAULT_COUPONS;
}

function saveServerCoupons(coupons: Coupon[]): void {
  const tempFile = `${COUPONS_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(coupons, null, 2), 'utf8');
  fs.renameSync(tempFile, COUPONS_FILE);
}

const app = express();
export { app };
// Só confia no X-Forwarded-For do nginx (1 salto). Com `true`, qualquer um forja o próprio IP.
app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS || 1));
app.disable('x-powered-by');
const PORT = process.env.PORT || 3000;

app.use((_req: Request, res: Response, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Stripe Webhook needs raw body (defined BEFORE express.json())
// É o ÚNICO lugar que marca um pedido como pago. O navegador nunca cria nem altera pedido.
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn('[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured.');
      return res.status(500).json({ error: 'Webhook not configured.' });
    }

    let event: Stripe.Event;
    try {
      event = getStripeInstance().webhooks.constructEvent(req.body, sig as string, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send('Webhook signature verification failed.');
    }

    try {
      if (
        event.type === 'checkout.session.completed' ||
        event.type === 'checkout.session.async_payment_succeeded'
      ) {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[Stripe Webhook] ${event.type}: ${session.id}, payment_status: ${session.payment_status}`);
        if (session.payment_status === 'paid') {
          await markOrderPaidFromSession(session);
        }
      } else if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
        const session = event.data.object as Stripe.Checkout.Session;
        await withOrdersLock(() => {
          const orders = getStoredOrders();
          const order = findOrderForSession(orders, session);
          if (order && !isOrderPaid(order)) {
            order.paymentStatus = event.type === 'checkout.session.expired' ? 'Checkout Expirado' : 'Pagamento Falhou';
            order.fulfillmentStatus = 'Cancelado (não pago)';
            saveStoredOrders(orders);
          }
        });
      }
      return res.json({ received: true });
    } catch (err: any) {
      // 500 faz a Stripe reenviar o evento mais tarde, em vez de perder o pedido
      console.error('[Stripe Webhook] Error processing event:', err);
      return res.status(500).json({ error: 'Webhook processing failed.' });
    }
  }
);

function isOrderPaid(order: any): boolean {
  const s = (order?.paymentStatus || '').toLowerCase();
  return s.includes('paid') || s.includes('verified');
}

function findOrderForSession(orders: any[], session: Stripe.Checkout.Session): any | undefined {
  const orderId = session.metadata?.orderId || session.client_reference_id;
  return (
    (orderId ? orders.find((o: any) => o.id === orderId) : undefined) ||
    orders.find((o: any) => o.sessionId === session.id)
  );
}

async function markOrderPaidFromSession(session: Stripe.Checkout.Session): Promise<void> {
  const anySess = session as any;
  const orderToEmail = await withOrdersLock(() => {
    const orders = getStoredOrders();
    let order = findOrderForSession(orders, session);

    if (!order) {
      // Sessão paga sem pedido no servidor (ex.: criada pela versão antiga do site). Registra para revisão manual.
      order = {
        id: `ord-${crypto.randomUUID()}`,
        orderNumber: `LP-${session.id.slice(-8).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        date: new Date().toISOString(),
        customerName: anySess.customer_details?.name || 'Customer',
        customerEmail: anySess.customer_details?.email || session.customer_email || '',
        customerPhone: anySess.customer_details?.phone || '',
        shippingAddress: null,
        items: [],
        totalUsd: (session.amount_total || 0) / 100,
        paymentGateway: 'Stripe',
        sessionId: session.id,
        needsReview: true,
        reviewReason: 'Pagamento recebido, mas o pedido não foi encontrado no servidor. Conferir na Stripe antes de despachar.',
      };
      orders.unshift(order);
    }

    if (isOrderPaid(order)) {
      // Evento repetido (a Stripe pode reenviar): nada a mudar
      return order.confirmationEmailSent ? null : { ...order };
    }

    order.paymentStatus = 'Paid (Stripe Verified)';
    order.paidAt = new Date().toISOString();
    order.sessionId = session.id;
    order.paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
    order.amountPaidCents = session.amount_total;

    // Confere se o valor cobrado é exatamente o que o servidor calculou
    const expected = order.expectedAmountCents;
    if (typeof expected === 'number' && (session.amount_total !== expected || session.currency !== 'usd')) {
      order.needsReview = true;
      order.reviewReason = `Valor pago (${session.amount_total} ${session.currency}) diferente do esperado (${expected} usd).`;
    }
    order.fulfillmentStatus = order.needsReview ? 'Revisar antes de despachar' : 'Aguardando Despacho';

    saveStoredOrders(orders);
    return order.customerEmail && !order.confirmationEmailSent ? { ...order } : null;
  });

  if (orderToEmail) {
    await sendConfirmationAndRecord(orderToEmail);
  }
}

async function sendConfirmationAndRecord(order: any): Promise<void> {
  let update: Record<string, any>;
  try {
    const emailResult = await sendOrderConfirmationEmail(order);
    update =
      emailResult.success && emailResult.status === 'sent'
        ? {
            confirmationEmailSent: true,
            confirmationEmailSentAt: new Date().toISOString(),
            confirmationEmailId: emailResult.messageId,
            confirmationEmailStatus: 'sent',
            confirmationEmailError: undefined,
          }
        : { confirmationEmailStatus: emailResult.status, confirmationEmailError: emailResult.error || emailResult.reason };
  } catch (emailErr: any) {
    update = { confirmationEmailStatus: 'failed', confirmationEmailError: emailErr.message };
  }
  await withOrdersLock(() => {
    const orders = getStoredOrders();
    const target = orders.find((o: any) => o.id === order.id);
    if (target) {
      Object.assign(target, update);
      saveStoredOrders(orders);
    }
  });
}

app.use(express.json({ limit: '200kb' }));

// Healthcheck endpoint for VPS monitoring & uptime checks
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    store: 'Ling Petshop Online Superstore',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
  });
});

// Secure Admin Sessions Map & Cookie Helper
const adminSessions = new Map<string, { expiresAt: number }>();

function getCookie(req: Request, name: string): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';');
  for (let cookie of cookies) {
    const parts = cookie.trim().split('=');
    if (parts[0] === name) {
      return decodeURIComponent(parts.slice(1).join('='));
    }
  }
  return null;
}

// Helper for secure admin authorization check (exclusively via ling_admin_session cookie)
function verifyAdminAuth(req: Request): boolean {
  const adminSecret = process.env.ADMIN_SECRET_TOKEN;
  if (!adminSecret || typeof adminSecret !== 'string' || adminSecret.trim() === '') {
    return false; // Deny by default if ADMIN_SECRET_TOKEN is missing or empty
  }

  const sessionId = getCookie(req, 'ling_admin_session');
  if (sessionId && typeof sessionId === 'string') {
    const session = adminSessions.get(sessionId.trim());
    if (session && Date.now() <= session.expiresAt) {
      return true;
    }
    if (session) {
      adminSessions.delete(sessionId.trim());
    }
  }

  return false;
}

function requireAdmin(req: Request, res: Response, next: () => void) {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Admin authentication required.' });
  }
  next();
}

// Limite de tentativas de login no SERVIDOR (o bloqueio antigo ficava no navegador e era só limpar o cache)
const LOGIN_MAX_FAILURES = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const loginFailures = new Map<string, { count: number; firstAt: number }>();

function isLoginBlocked(ip: string): boolean {
  const entry = loginFailures.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > LOGIN_WINDOW_MS) {
    loginFailures.delete(ip);
    return false;
  }
  return entry.count >= LOGIN_MAX_FAILURES;
}

function registerLoginFailure(ip: string): void {
  const entry = loginFailures.get(ip);
  if (!entry || Date.now() - entry.firstAt > LOGIN_WINDOW_MS) {
    loginFailures.set(ip, { count: 1, firstAt: Date.now() });
  } else {
    entry.count += 1;
  }
}

// Admin Password Verification & Session Generation Endpoint
app.post('/api/admin/verify', async (req: Request, res: Response) => {
  try {
    const ip = req.ip || 'unknown';
    if (isLoginBlocked(ip)) {
      return res.status(429).json({ success: false, error: 'Muitas tentativas. Tente novamente em 15 minutos.' });
    }

    const adminSecret = process.env.ADMIN_SECRET_TOKEN;
    if (!adminSecret || typeof adminSecret !== 'string' || adminSecret.trim() === '') {
      return res.status(401).json({ success: false, error: 'Unauthorized. ADMIN_SECRET_TOKEN is not configured on the server.' });
    }

    const { password } = req.body;
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ success: false, error: 'Password is required.' });
    }

    const secretBuffer = Buffer.from(adminSecret.trim());
    const passwordBuffer = Buffer.from(password.trim());
    let isValid = false;
    if (secretBuffer.length === passwordBuffer.length) {
      isValid = crypto.timingSafeEqual(secretBuffer, passwordBuffer);
    }

    if (!isValid) {
      registerLoginFailure(ip);
      return res.status(401).json({ success: false, error: 'Incorrect password.' });
    }
    loginFailures.delete(ip);

    // Generate secure session ID (NEVER return the password!)
    const sessionId = crypto.randomBytes(32).toString('hex');
    adminSessions.set(sessionId, { expiresAt: Date.now() + 2 * 60 * 60 * 1000 }); // 2 hours expiration

    const isProd = process.env.NODE_ENV === 'production';
    res.setHeader(
      'Set-Cookie',
      `ling_admin_session=${sessionId}; HttpOnly; Path=/; Max-Age=7200; SameSite=Lax${isProd ? '; Secure' : ''}`
    );

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Logout Endpoint
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const sessionId = getCookie(req, 'ling_admin_session') || req.headers['x-admin-session'];
  if (sessionId && typeof sessionId === 'string') {
    adminSessions.delete(sessionId.trim());
  }
  res.setHeader('Set-Cookie', 'ling_admin_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
  return res.json({ success: true });
});

// Admin Session Validation Endpoint
app.get('/api/admin/session', (req: Request, res: Response) => {
  if (verifyAdminAuth(req)) {
    return res.json({ authenticated: true });
  }
  return res.status(401).json({ authenticated: false, error: 'Unauthorized' });
});




// Endpoint to check live Stripe Account status
// A chave secreta fica SÓ no servidor; o painel admin consulta por aqui em vez de chamar a Stripe do navegador.
app.get('/api/stripe-status', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey || stripeSecretKey.trim() === '') {
      return res.status(400).json({ active: false, error: 'STRIPE_SECRET_KEY não está configurada.' });
    }

    const authHeaders = { Authorization: `Bearer ${stripeSecretKey.trim()}` };
    const [stripeRes, balanceRes] = await Promise.all([
      fetch('https://api.stripe.com/v1/account', { headers: authHeaders }),
      fetch('https://api.stripe.com/v1/balance', { headers: authHeaders }).catch(() => null),
    ]);

    const data = await stripeRes.json();
    const balance = balanceRes && balanceRes.ok ? await balanceRes.json() : null;
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
      email: data.email,
      livemode: stripeSecretKey.trim().startsWith('sk_live_'),
      requirementsDue: data.requirements?.currently_due || [],
      availableUsd: ((balance?.available || []).find((b: any) => b.currency === 'usd')?.amount || 0) / 100,
    });
  } catch (err: any) {
    return res.status(500).json({ active: false, error: err.message });
  }
});

// Zendrop API Status Endpoint
app.post('/api/zendrop/status', requireAdmin, async (req: Request, res: Response) => {
  try {
    const apiKey = String(req.body?.apiKey || process.env.ZENDROP_API_KEY || '');
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
app.post('/api/zendrop/fetch-product', requireAdmin, async (req: Request, res: Response) => {
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

const zendropIdOf = (product: Product) => product.id.replace('zendrop-', '');
const CATALOG_ZENDROP_IDS = new Set(PRODUCTS.map(zendropIdOf));

// Real-time Single Product Zendrop Stock Endpoint
app.get('/api/zendrop/stock/:id', async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const cleanId = String(rawId).replace(/[^0-9]/g, '');
    if (!cleanId) {
      return res.status(400).json({ error: 'ID de produto Zendrop inválido.' });
    }
    // Só consulta produtos da loja; antes qualquer ID virava uma requisição ao Zendrop (proxy aberto)
    if (!CATALOG_ZENDROP_IDS.has(cleanId)) {
      return res.status(404).json({ error: 'Produto não encontrado na loja.' });
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
// '/api/inventory/sync-all' é o caminho que o front (inventorySync.ts) chama; antes não existia no servidor
app.all(['/api/zendrop/sync-all-inventory', '/api/zendrop/sync-inventory', '/api/inventory/sync-all'], async (req: Request, res: Response) => {
  try {
    const defaultProductIds = [
      '2000857', '2041862', '1603576', '2053714', '2058716', '2873973', '2632492', '2658755',
      '2689252', '2640918', '2650189', '2608657', '2631448', '2040471', '2699708', '2601227',
      '2626089', '2000777', '2042070', '2047664', '2051156', '2063694', '3090659', '2001114',
      '2070193', '2069888', '2044170', '2066498', '2073024', '2040754', '2072717', '2066233',
      '2001034', '2038976'
    ];

    const requestedIds: string[] = Array.isArray(req.body?.productIds)
      ? req.body.productIds
          .map((id: any) => String(id).replace(/[^0-9]/g, ''))
          .filter((id: string) => CATALOG_ZENDROP_IDS.has(id))
      : defaultProductIds;

    // Forçar sincronização (ignorando o cache) só para o admin, senão qualquer um dispara dezenas de requisições
    const force = Boolean(req.body?.force || req.query.force === 'true') && verifyAdminAuth(req);
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
      data: { ...(inventoryCache?.data || {}), ...results },
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
    throw new Error('STRIPE_SECRET_KEY não está configurada.');
  }
  const trimmed = secretKey.trim();
  const isTestMode = process.env.NODE_ENV === 'test' || process.env.ORDERS_FILE?.includes('test') || process.env.USE_ENV_TEST === 'true';
  if (isTestMode && !trimmed.startsWith('sk_test_')) {
    const errorMsg = `[FATAL ERROR] Test environment violation! STRIPE_SECRET_KEY must start with 'sk_test_' in test mode. Live keys are prohibited in test environments.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  const keyType = trimmed.startsWith('sk_live_') ? 'live' : trimmed.startsWith('sk_test_') ? 'test' : 'unknown';
  console.log(`[Stripe Diagnostic] Initializing Stripe with ${keyType} key (length: ${trimmed.length}, prefix: ${trimmed.slice(0, 7)}...)`);
  return new Stripe(trimmed, { apiVersion: '2023-10-16' as any });
};

const LIVE_STOCK_MAX_AGE_MS = 10 * 60 * 1000;

function getPublicBaseUrl(req: Request): string {
  // Nunca usa URL enviada pelo navegador: isso permitia redirecionar o cliente para outro site depois de pagar
  const configured = (process.env.APP_URL || '').trim();
  if (configured && /^https?:\/\//.test(configured)) {
    return new URL(configured).origin;
  }
  return `${req.protocol}://${req.get('host')}`;
}

function liveStockFor(product: Product) {
  if (!inventoryCache || Date.now() - inventoryCache.timestamp > LIVE_STOCK_MAX_AGE_MS) return undefined;
  return inventoryCache.data[zendropIdOf(product)];
}

const handleCreateCheckoutSession = async (req: Request, res: Response) => {
  try {
    // 1. Carrinho montado com preços do catálogo do servidor (o preço enviado pelo navegador é ignorado)
    const cart = buildServerCart(req.body?.items, PRODUCTS, liveStockFor);
    // 2. Um endereço só: o que calcula o frete é o mesmo que vai para a Stripe e para o pedido
    const address = validateCheckoutAddress(req.body);
    const deliveryOption = req.body?.deliveryOption === 'usps_priority' ? 'usps_priority' : 'usps_ground';
    const promoCode = typeof req.body?.appliedPromo === 'string' ? req.body.appliedPromo.slice(0, 40) : '';

    const calc = calculateOrderTotals(
      cart,
      promoCode,
      'shipping',
      address.state,
      address.zip,
      deliveryOption,
      getServerCoupons()
    );
    const { subtotal, shipping: shippingCost, total: finalOrderTotal, isShippingCalculated } = calc;
    const discount = calc.bundleDiscount + calc.repeatDeliverySavings + calc.promoDiscount;

    if (!isShippingCalculated || shippingCost === null) {
      return res.status(400).json({ error: 'Não foi possível calcular o frete para este endereço.', requiresAddress: true });
    }

    // 3. Itens com o desconto distribuído; cada linha tem quantidade 1 com o valor total da linha,
    //    assim a soma na Stripe bate centavo por centavo com o total calculado aqui.
    const baseUrl = getPublicBaseUrl(req);
    const itemsTargetCents = Math.round(Math.max(0, subtotal - discount) * 100);
    const rawLineCents = cart.map((item) =>
      Math.round((item.price + (item.addOn?.enabled ? item.addOn.price : 0)) * item.quantity * 100)
    );
    const rawItemsTotalCents = rawLineCents.reduce((a, b) => a + b, 0);

    let allocatedCents = 0;
    const lineItems = cart.map((item, idx) => {
      const isLast = idx === cart.length - 1;
      const share = isLast
        ? itemsTargetCents - allocatedCents
        : Math.round(itemsTargetCents * (rawItemsTotalCents > 0 ? rawLineCents[idx] / rawItemsTotalCents : 0));
      allocatedCents += share;

      const variantDesc = [item.size ? `Size: ${item.size}` : null, item.color ? `Color: ${item.color}` : null]
        .filter(Boolean)
        .join(' / ');
      const imageUrl = item.image ? new URL(item.image, baseUrl).toString() : '';
      return {
        price_data: {
          currency: 'usd',
          unit_amount: Math.max(0, share),
          product_data: {
            name: `${item.name}${variantDesc ? ` (${variantDesc})` : ''} × ${item.quantity}`,
            images: imageUrl.startsWith('https://') ? [imageUrl] : [],
          },
        },
        quantity: 1,
      };
    });

    const shippingCents = Math.round(shippingCost * 100);
    if (shippingCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          unit_amount: shippingCents,
          product_data: { name: `USPS Shipping (${address.state} ${address.zip})`, images: [] },
        },
        quantity: 1,
      });
    }

    const expectedAmountCents = lineItems.reduce((acc, li) => acc + li.price_data.unit_amount, 0);
    if (expectedAmountCents < 50) {
      return res.status(400).json({ error: 'Valor do pedido abaixo do mínimo aceito pela Stripe.' });
    }

    let stripe: Stripe;
    try {
      stripe = getStripeInstance();
    } catch (configErr: any) {
      console.error('[Stripe] configuration error:', configErr.message);
      return res.status(500).json({ error: 'Pagamento indisponível no momento.', code: 'STRIPE_KEY_MISSING' });
    }

    // 4. Pedido pendente criado AQUI, pelo servidor, com os valores do servidor
    const orderId = `ord-${crypto.randomUUID()}`;
    const orderNumber = `LP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const order: any = {
      id: orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString(),
      customerName: address.name,
      customerEmail: address.email,
      customerPhone: address.phone,
      shippingAddress: {
        street: [address.line1, address.line2].filter(Boolean).join(', '),
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: 'United States',
      },
      items: cart.map((i) => ({
        productId: i.productId,
        sku: i.sku,
        name: i.name,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        unitPrice: i.price,
        addOn: i.addOn,
        supplierCost: i.supplierCost,
        supplier: 'Zendrop US Warehouse',
        supplierSku: i.sku,
      })),
      subtotalUsd: subtotal,
      discountUsd: Number(discount.toFixed(2)),
      shippingUsd: shippingCost,
      shippingMethod: deliveryOption,
      totalUsd: finalOrderTotal,
      expectedAmountCents,
      appliedPromo: calc.appliedPromo || '',
      supplierCostUsd: Number(cart.reduce((acc, i) => acc + i.supplierCost * i.quantity, 0).toFixed(2)),
      profitUsd: calc.totalEstimatedProfit,
      paymentGateway: 'Stripe (Credit Card / Apple Pay)',
      paymentStatus: 'Pending Payment',
      fulfillmentStatus: 'Aguardando Pagamento',
      confirmationEmailSent: false,
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: address.email,
      client_reference_id: orderId,
      line_items: lineItems,
      success_url: `${baseUrl}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?status=cancelled`,
      metadata: { orderId, orderNumber },
      payment_intent_data: {
        metadata: { orderId, orderNumber },
        shipping: {
          name: address.name,
          phone: address.phone || undefined,
          address: {
            line1: address.line1,
            line2: address.line2 || undefined,
            city: address.city,
            state: address.state,
            postal_code: address.zip,
            country: 'US',
          },
        },
      },
    });

    order.sessionId = session.id;
    await withOrdersLock(() => {
      const orders = getStoredOrders();
      orders.unshift(order);
      saveStoredOrders(orders);
    });

    return res.json({ url: session.url, sessionId: session.id, orderNumber });
  } catch (err: any) {
    if (err instanceof CheckoutValidationError) {
      return res.status(400).json({
        error: err.message,
        outOfStock: err.outOfStock || undefined,
        item: err.item,
        requiresAddress: err.requiresAddress || undefined,
      });
    }
    console.error('[Stripe] Error creating checkout session:', {
      message: err.message,
      type: err.type,
      code: err.code,
      statusCode: err.statusCode,
    });
    if (err?.type === 'StripeAuthenticationError') {
      return res.status(500).json({ error: 'Pagamento indisponível no momento.', code: 'STRIPE_KEY_EXPIRED' });
    }
    return res.status(500).json({ error: 'Erro ao iniciar o pagamento. Tente novamente.' });
  }
};

app.post('/api/checkout/create-session', handleCreateCheckoutSession);
app.post('/api/create-checkout-session', handleCreateCheckoutSession);

// Usado pela página de sucesso. Devolve só o necessário para mostrar a confirmação (sem endereço/telefone).
app.get('/api/checkout/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
      return res.status(400).json({ error: 'Sessão inválida.' });
    }
    const session = await getStripeInstance().checkout.sessions.retrieve(sessionId);
    const order = findOrderForSession(getStoredOrders(), session);
    return res.json({
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email || session.customer_email,
      amount_total: session.amount_total ? session.amount_total / 100 : 0,
      orderNumber: order?.orderNumber || session.metadata?.orderNumber || null,
    });
  } catch (err: any) {
    return res.status(404).json({ error: 'Sessão não encontrada.' });
  }
});

app.get('/api/orders', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, orders: getStoredOrders() });
});

// Cupons: a lista completa só para o admin; o público só consegue validar um código por vez
app.get('/api/admin/coupons', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, coupons: getServerCoupons() });
});

app.put('/api/admin/coupons', requireAdmin, (req: Request, res: Response) => {
  const list = req.body?.coupons;
  if (!Array.isArray(list) || list.length > 200) {
    return res.status(400).json({ success: false, error: 'Lista de cupons inválida.' });
  }
  const clean: Coupon[] = [];
  for (const c of list) {
    const code = String(c?.code || '').trim().toUpperCase();
    const pct = Number(c?.discountPercent);
    if (!/^[A-Z0-9_-]{2,40}$/.test(code) || !Number.isFinite(pct) || pct <= 0 || pct > 90) {
      return res.status(400).json({ success: false, error: `Cupom inválido: ${code || '(sem código)'}` });
    }
    clean.push({
      id: String(c.id || `cp-${crypto.randomUUID()}`),
      code,
      discountPercent: pct,
      description: String(c.description || '').slice(0, 200),
      partnerName: String(c.partnerName || '').slice(0, 120),
      active: Boolean(c.active),
      usageCount: Number(c.usageCount) || 0,
      createdAt: String(c.createdAt || new Date().toISOString().slice(0, 10)),
      maxUses: c.maxUses ? Number(c.maxUses) : undefined,
    });
  }
  saveServerCoupons(clean);
  res.json({ success: true, coupons: clean });
});

app.get('/api/coupons/:code', (req: Request, res: Response) => {
  const code = String(req.params.code || '').trim().toUpperCase();
  const coupon = getServerCoupons().find((c) => c.active && c.code.trim().toUpperCase() === code);
  if (!coupon) {
    return res.status(404).json({ valid: false });
  }
  return res.json({ valid: true, coupon: { id: coupon.id, code: coupon.code, discountPercent: coupon.discountPercent, active: true } });
});

app.post('/api/orders/update-status', requireAdmin, (req: Request, res: Response) =>
  // Lock: o envio de e-mail acontece entre ler e salvar o orders.json
  withOrdersLock(async () => {
    try {
      // Security check: Only authenticated admins can modify fulfillment & tracking
      if (!verifyAdminAuth(req)) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized. Valid ADMIN_SECRET_TOKEN credentials required.'
        });
      }

      const { orderId, fulfillmentStatus, trackingNumber, carrier, trackingUrl, sendEmail, forceResend } = req.body;
      const orders = getStoredOrders();
      const idx = orders.findIndex((o: any) => o.id === orderId || o.orderNumber === orderId);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Order not found.' });
      }

      const order = orders[idx];
      const payStatus = (order.paymentStatus || '').toLowerCase();
      const isPaid = payStatus.includes('paid') || payStatus.includes('verified');

      // Prevent dispatching unpaid or abandoned orders
      if (!isPaid && fulfillmentStatus === 'Despachado') {
        return res.status(400).json({
          success: false,
          error: 'Cannot dispatch an unpaid or abandoned order. Payment must be confirmed by Stripe.'
        });
      }

      // Pedido com valor pago diferente do calculado (ou sem pedido de origem) precisa ser conferido antes
      if (order.needsReview && fulfillmentStatus === 'Despachado' && !req.body?.reviewConfirmed) {
        return res.status(400).json({
          success: false,
          error: `Pedido marcado para revisão: ${order.reviewReason || 'conferir na Stripe'}. Confira antes de despachar.`,
          needsReview: true,
        });
      }

      order.fulfillmentStatus = fulfillmentStatus || order.fulfillmentStatus;

      let emailResult: any = null;
      const cleanTracking = (trackingNumber || '').trim();

      if (cleanTracking) {
        const isNewOrUpdatedCode = order.trackingNumber !== cleanTracking;
        order.trackingNumber = cleanTracking;
        if (carrier) order.carrier = carrier;
        if (trackingUrl) order.trackingUrl = trackingUrl;

        if (fulfillmentStatus === 'Despachado' || !order.dispatchedAt) {
          order.dispatchedAt = new Date().toISOString();
        }

        // Requirement 3: Automatically send tracking email in natural English after saving
        if (sendEmail !== false && order.customerEmail) {
          try {
            emailResult = await sendOrderTrackingEmail(
              order,
              {
                trackingNumber: cleanTracking,
                carrier: order.carrier || carrier || 'USPS Ground Advantage',
                trackingUrl: order.trackingUrl || trackingUrl,
                forceResend: Boolean(forceResend || (isNewOrUpdatedCode && order.trackingEmailCode !== cleanTracking)),
              }
            );

            if (emailResult.success && emailResult.status === 'sent') {
              order.trackingEmailSent = true;
              order.trackingEmailSentAt = new Date().toISOString();
              order.trackingEmailCode = cleanTracking;
              order.trackingEmailCarrier = order.carrier;
              order.trackingEmailStatus = 'sent';
              delete order.trackingEmailError;
            } else {
              order.trackingEmailStatus = emailResult.status;
              if (emailResult.error) {
                order.trackingEmailError = emailResult.error;
              }
            }
          } catch (emailErr: any) {
            order.trackingEmailStatus = 'failed';
            order.trackingEmailError = emailErr.message;
            emailResult = { success: false, status: 'failed', error: emailErr.message };
          }
        }
      }

      saveStoredOrders(orders);
      return res.json({ success: true, order, emailResult });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  })
);

// Resend tracking email endpoint for manual controlled retries
app.post('/api/orders/resend-tracking-email', requireAdmin, (req: Request, res: Response) =>
  // Lock: o envio de e-mail acontece entre ler e salvar o orders.json
  withOrdersLock(async () => {
    try {
      if (!verifyAdminAuth(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized.' });
      }

      const { orderId } = req.body;
      const orders = getStoredOrders();
      const idx = orders.findIndex((o: any) => o.id === orderId || o.orderNumber === orderId);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Order not found.' });
      }

      const order = orders[idx];
      if (!order.trackingNumber) {
        return res.status(400).json({ success: false, error: 'Order has no tracking number.' });
      }

      const emailResult = await sendOrderTrackingEmail(
        order,
        {
          trackingNumber: order.trackingNumber,
          carrier: order.carrier,
          trackingUrl: order.trackingUrl,
          forceResend: true,
        }
      );

      if (emailResult.success && emailResult.status === 'sent') {
        order.trackingEmailSent = true;
        order.trackingEmailSentAt = new Date().toISOString();
        order.trackingEmailCode = order.trackingNumber;
        order.trackingEmailStatus = 'sent';
        delete order.trackingEmailError;
      } else {
        order.trackingEmailStatus = emailResult.status;
        order.trackingEmailError = emailResult.error || emailResult.reason;
      }

      saveStoredOrders(orders);
      return res.json({ success: true, order, emailResult });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  })
);

// Resend Email Sending Endpoint for support@lingpetshop.com
// Só admin: aberta, qualquer um mandava e-mail (phishing) saindo de support@lingpetshop.com
app.post('/api/send-email', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { to, subject, html, text, fromName, resendApiKey } = req.body;
    const apiKey = (resendApiKey || process.env.RESEND_API_KEY || '').trim();

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

// Email Template Preview Endpoint (Requirement 1 & 2)
app.get('/api/email/preview/:template', (req: Request, res: Response) => {
  const { template } = req.params;
  if (template === 'confirmation' || template === 'order-confirmation') {
    const demoData = getDemoOrderConfirmationData();
    const html = generateOrderConfirmationHtml(demoData);
    return res.setHeader('Content-Type', 'text/html').send(html);
  } else if (template === 'tracking' || template === 'shipping') {
    const demoData = getDemoOrderTrackingData();
    const html = generateOrderTrackingHtml(demoData);
    return res.setHeader('Content-Type', 'text/html').send(html);
  }
  return res.status(404.0).send('Template not found. Use "confirmation" or "tracking".');
});

// Sandbox Test Email Endpoint (Requirement 3)
app.post('/api/email/send-sandbox', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { templateType, recipient, resendApiKey } = req.body;
    const apiKey = (resendApiKey || process.env.RESEND_API_KEY || '').trim();
    const targetRecipient = (recipient || '').trim();

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'Resend API Key is required. Please configure RESEND_API_KEY or enter your key in the admin panel.',
      });
    }

    if (!targetRecipient || !targetRecipient.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Valid recipient email address is required.',
      });
    }

    const result = await sendTestEmailDirect(
      templateType === 'tracking' ? 'tracking' : 'confirmation',
      targetRecipient,
      apiKey
    );

    return res.json(result);
  } catch (err: any) {
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
