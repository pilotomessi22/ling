import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

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
    const stripeSecretKey =
      process.env.STRIPE_SECRET_KEY ||
      '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';

    const stripeRes = await fetch('https://api.stripe.com/v1/account', {
      headers: {
        Authorization: `Bearer ${stripeSecretKey.trim()}`,
      },
    });

    const data = await stripeRes.json();
    if (!stripeRes.ok) {
      return res.status(stripeRes.status).json({ active: false, error: data.error?.message });
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
    const { productId, apiKey: providedApiKey } = req.body;
    const apiKey =
      providedApiKey ||
      process.env.ZENDROP_API_KEY ||
      'UUUvotHLOYoGQopIgxXnfpIFjD4BoQfUW7EisDnPqI9KHQHl2aD8G72eKRiVRbqN';

    if (!productId) {
      return res.status(400).json({ error: 'ID do produto é obrigatório.' });
    }

    if (!apiKey) {
      return res.status(400).json({
        error: 'Chave API do Zendrop não configurada. Insira sua Zendrop API Key no painel admin para importar produtos e fotos originais.',
      });
    }

    const cleanId = String(productId).replace(/[^0-9]/g, '');
    const zendropRes = await fetch(`https://api.zendrop.com/v1/products/${cleanId}`, {
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await zendropRes.json().catch(() => null);

    if (!zendropRes.ok || !data) {
      return res.status(zendropRes.status || 404).json({
        error: data?.message || `Produto ID ${cleanId} não encontrado no Zendrop ou chave sem permissão.`,
      });
    }

    return res.json({
      success: true,
      product: {
        id: data.id || cleanId,
        name: data.title || data.name,
        description: data.description,
        images: data.images || (data.image ? [data.image] : []),
        variants: data.variants || [],
        stock: data.stock || data.total_quantity || 100,
        supplierCost: data.price || data.cost || 0,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro interno ao consultar produto no Zendrop.' });
  }
});

// Automatic Stripe Checkout Session Creation Endpoint
app.post('/api/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const { items, customerEmail, customStripeKey, domainUrl, currency } = req.body;
    const stripeSecretKey =
      customStripeKey ||
      process.env.STRIPE_SECRET_KEY ||
      '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';

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const host = domainUrl || `${req.protocol}://${req.get('host')}`;
    const selectedCurrency = (currency || 'usd').toLowerCase();

    // Construct x-www-form-urlencoded params for Stripe API v1/checkout/sessions
    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('success_url', `${host}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`);
    params.append('cancel_url', `${host}/checkout?status=cancelled`);

    if (customerEmail) {
      params.append('customer_email', customerEmail);
    }

    items.forEach((item: any, index: number) => {
      const unitAmount = Math.round((item.price || 10) * 100);
      params.append(`line_items[${index}][price_data][currency]`, selectedCurrency);
      params.append(`line_items[${index}][price_data][unit_amount]`, unitAmount.toString());
      params.append(`line_items[${index}][price_data][product_data][name]`, item.name || 'Pet Product');
      if (item.image) {
        params.append(`line_items[${index}][price_data][product_data][images][0]`, item.image);
      }
      params.append(`line_items[${index}][quantity]`, (item.quantity || 1).toString());
    });

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey.trim()}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error('Stripe API Error:', data);
      return res.status(stripeRes.status).json({
        error: data.error?.message || 'Failed to create Stripe checkout session',
        raw: data.error,
      });
    }

    return res.json({ url: data.url, sessionId: data.id });
  } catch (err: any) {
    console.error('Server error creating checkout session:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Serve compiled static assets from dist folder
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for client-side routing
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Ling Petshop server running on port ${PORT}`);
});
