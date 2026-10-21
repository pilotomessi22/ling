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

    // Strict inventory verification: reject payment session if any item is out of stock (stockCount === 0)
    for (const item of items) {
      if (item.stockCount === 0 || item.inStock === false) {
        return res.status(400).json({
          error: `O produto "${item.name}" está sem estoque no fornecedor Zendrop (0 unidades disponíveis). Não é possível processar o pagamento para produtos indisponíveis.`,
          outOfStock: true,
          item: item.name,
        });
      }
      if (inventoryCache?.data && item.productId) {
        const cached = inventoryCache.data[String(item.productId)];
        if (cached && (cached.stockCount === 0 || !cached.inStock)) {
          return res.status(400).json({
            error: `O produto "${item.name}" está esgotado no armazém central Zendrop. Remova-o para continuar.`,
            outOfStock: true,
            item: item.name,
          });
        }
      }
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
