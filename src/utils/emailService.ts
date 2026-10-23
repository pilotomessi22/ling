import { Resend } from 'resend';

export interface OrderEmailItem {
  name: string;
  quantity: number;
  unitPrice: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface OrderEmailData {
  orderNumber: string;
  date?: string;
  customerName?: string;
  customerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };
  items: OrderEmailItem[];
  subtotalUsd?: number;
  discountUsd?: number;
  shippingUsd?: number;
  totalUsd: number;
  appliedPromo?: string;
  estimatedTransit?: string;
}

export interface TrackingEmailData {
  orderNumber: string;
  customerName?: string;
  customerEmail: string;
  trackingNumber: string;
  carrier?: string;
  trackingUrl?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };
  items?: {
    name: string;
    quantity: number;
    size?: string;
    color?: string;
  }[];
}

export interface EmailSendResult {
  success: boolean;
  status: 'sent' | 'skipped' | 'failed' | 'not_configured';
  messageId?: string;
  error?: string;
  recipient?: string;
  reason?: string;
}

export const EMAIL_CONFIG = {
  defaultFrom: 'Ling Petshop Support <support@lingpetshop.com>',
  supportEmail: 'support@lingpetshop.com',
  storeUrl: 'https://lingpetshop.com',
  orderTrackingBaseUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
};

/**
 * Generates official USPS tracking URL if not explicitly provided
 */
export function buildTrackingUrl(trackingNumber: string, carrier: string = 'USPS', explicitUrl?: string): string | undefined {
  if (explicitUrl && explicitUrl.trim().startsWith('http')) {
    return explicitUrl.trim();
  }
  const cleanCode = trackingNumber.replace(/[\s-]/g, '');
  if (carrier.toUpperCase().includes('USPS') || /^(94|92|93|82|03|70|23)[0-9]{18,24}$/.test(cleanCode)) {
    return `${EMAIL_CONFIG.orderTrackingBaseUrl}${encodeURIComponent(cleanCode)}`;
  }
  return undefined;
}

/**
 * Format currency in USD
 */
function fmt(val: number | undefined | null): string {
  const num = typeof val === 'number' && !isNaN(val) ? val : 0;
  return `$${num.toFixed(2)}`;
}

/**
 * Safe HTML string escaper
 */
function escapeHtml(str: string = ''): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Template 1: Order Confirmation HTML
 * 100% natural English, professional e-commerce styling, zero internal supplier/SKU leaks.
 */
export function generateOrderConfirmationHtml(data: OrderEmailData): string {
  const customerGreeting = data.customerName ? `Hi ${escapeHtml(data.customerName)},` : 'Hello,';
  const subtotal = data.subtotalUsd ?? data.items.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);
  const discount = data.discountUsd ?? 0;
  const shipping = data.shippingUsd ?? 0;
  const total = data.totalUsd;
  const transitEstimate = data.estimatedTransit || '3–4 Business Days via USPS Ground Advantage';

  const itemsHtml = data.items.map((item) => {
    const variantParts = [item.size ? `Size: ${item.size}` : null, item.color ? `Color: ${item.color}` : null].filter(Boolean);
    const variantDesc = variantParts.length > 0 ? variantParts.join(' · ') : '';
    const itemTotal = (item.unitPrice * item.quantity);

    return `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0;">
          <div style="font-weight: 700; color: #0F2942; font-size: 14px;">${escapeHtml(item.name)}</div>
          ${variantDesc ? `<div style="font-size: 12px; color: #64748B; margin-top: 2px;">${escapeHtml(variantDesc)}</div>` : ''}
          <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Qty: ${item.quantity} × ${fmt(item.unitPrice)}</div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E2E8F0; text-align: right; font-weight: 700; color: #0F2942; font-size: 14px; vertical-align: top;">
          ${fmt(itemTotal)}
        </td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Ling Petshop Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F2942; line-height: 1.5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0F2942; padding: 28px 32px; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">🐾 Ling Petshop</h1>
              <p style="margin: 4px 0 0 0; color: #94A3B8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Order Confirmation</p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="font-size: 16px; font-weight: 600; color: #0F2942; margin: 0 0 12px 0;">${customerGreeting}</p>
              <p style="font-size: 14px; color: #334155; margin: 0 0 24px 0; line-height: 1.6;">
                Thank you for shopping with Ling Petshop! We've received your payment and our fulfillment team is currently packing your order.
              </p>

              <!-- Order Info Pill -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <div style="font-size: 12px; font-weight: 700; color: #1E40AF; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</div>
                    <div style="font-size: 18px; font-weight: 800; color: #0F2942; margin-top: 2px;">#${escapeHtml(data.orderNumber)}</div>
                    <div style="font-size: 12px; color: #475569; margin-top: 6px;">
                      Status: <strong style="color: #16A34A;">Paid (Stripe Verified)</strong>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Items Ordered Section -->
              <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #64748B; margin: 0 0 12px 0;">Items in Your Order</h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                ${itemsHtml}
              </table>

              <!-- Totals Section -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px;">
                      <tr>
                        <td style="padding: 4px 0; color: #64748B;">Subtotal</td>
                        <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #0F2942;">${fmt(subtotal)}</td>
                      </tr>
                      ${discount > 0 ? `
                      <tr>
                        <td style="padding: 4px 0; color: #16A34A;">Discount ${data.appliedPromo ? `(${escapeHtml(data.appliedPromo)})` : ''}</td>
                        <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #16A34A;">-${fmt(discount)}</td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding: 4px 0; color: #64748B;">USPS Shipping</td>
                        <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #0F2942;">${shipping === 0 ? '<span style="color:#16A34A;">FREE</span>' : fmt(shipping)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0 4px 0; border-top: 1px solid #E2E8F0; font-size: 15px; font-weight: 800; color: #0F2942;">Total Paid (USD)</td>
                        <td style="padding: 10px 0 4px 0; border-top: 1px solid #E2E8F0; text-align: right; font-size: 16px; font-weight: 800; color: #0F2942;">${fmt(total)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Shipping Address & Delivery Section -->
              <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #64748B; margin: 0 0 12px 0;">Delivery Address</h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 16px 20px; font-size: 13px; color: #334155; line-height: 1.6;">
                    ${data.customerName ? `<strong>${escapeHtml(data.customerName)}</strong><br>` : ''}
                    ${escapeHtml(data.shippingAddress.street)}<br>
                    ${escapeHtml(data.shippingAddress.city)}, ${escapeHtml(data.shippingAddress.state)} ${escapeHtml(data.shippingAddress.zip)}<br>
                    ${escapeHtml(data.shippingAddress.country || 'United States')}
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B;">
                      📦 Estimated Delivery: <strong>${escapeHtml(transitEstimate)}</strong>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Next Steps Notice -->
              <p style="font-size: 13px; color: #64748B; margin: 0 0 24px 0; line-height: 1.6;">
                As soon as your package ships from our US fulfillment hub, we will send you a follow-up email with your official USPS tracking number.
              </p>

              <!-- Support Block -->
              <div style="padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B; text-align: center;">
                Need help or have questions? Email us at <a href="mailto:${EMAIL_CONFIG.supportEmail}" style="color: #2563EB; font-weight: 600; text-decoration: none;">${EMAIL_CONFIG.supportEmail}</a> or visit <a href="${EMAIL_CONFIG.storeUrl}" style="color: #2563EB; font-weight: 600; text-decoration: none;">lingpetshop.com</a>.
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F1F5F9; padding: 20px 32px; text-align: center; font-size: 11px; color: #94A3B8;">
              © ${new Date().getFullYear()} Ling Petshop. All rights reserved. 30-Day Risk-Free Guarantee on all orders.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Template 1: Order Confirmation Plain Text
 */
export function generateOrderConfirmationText(data: OrderEmailData): string {
  const customerGreeting = data.customerName ? `Hi ${data.customerName},` : 'Hello,';
  const subtotal = data.subtotalUsd ?? data.items.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);
  const discount = data.discountUsd ?? 0;
  const shipping = data.shippingUsd ?? 0;
  const total = data.totalUsd;
  const transitEstimate = data.estimatedTransit || '3–4 Business Days via USPS Ground Advantage';

  const itemsList = data.items.map((i) => {
    const variantParts = [i.size ? `Size: ${i.size}` : null, i.color ? `Color: ${i.color}` : null].filter(Boolean);
    const variantDesc = variantParts.length > 0 ? ` (${variantParts.join(' / ')})` : '';
    return `- ${i.quantity}x ${i.name}${variantDesc}: ${fmt(i.unitPrice * i.quantity)}`;
  }).join('\n');

  return `
YOUR LING PETSHOP ORDER CONFIRMATION

${customerGreeting}

Thank you for your order! We've received your payment and our fulfillment team is preparing your package for shipment.

Order Number: #${data.orderNumber}
Payment Status: Paid (Stripe Verified)

ITEMS ORDERED:
${itemsList}

SUMMARY:
Subtotal: ${fmt(subtotal)}
${discount > 0 ? `Discount: -${fmt(discount)}\n` : ''}USPS Shipping: ${shipping === 0 ? 'FREE' : fmt(shipping)}
Total Paid: ${fmt(total)} USD

DELIVERY ADDRESS:
${data.customerName ? `${data.customerName}\n` : ''}${data.shippingAddress.street}
${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}
${data.shippingAddress.country || 'United States'}

Estimated Delivery: ${transitEstimate}

We will email you the official tracking number as soon as your package ships.

Need help? Contact support@lingpetshop.com or visit https://lingpetshop.com.

© ${new Date().getFullYear()} Ling Petshop
`.trim();
}

/**
 * Template 2: Order Tracking / Shipping Notification HTML
 * 100% natural English, clear tracking button, carrier delay notice, support info.
 */
export function generateOrderTrackingHtml(data: TrackingEmailData): string {
  const customerGreeting = data.customerName ? `Hi ${escapeHtml(data.customerName)},` : 'Hello,';
  const carrierName = data.carrier || 'USPS Ground Advantage';
  const trackingCode = data.trackingNumber.trim();
  const trackingUrl = buildTrackingUrl(trackingCode, carrierName, data.trackingUrl);

  const itemsListHtml = (data.items && data.items.length > 0)
    ? `
      <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #64748B; margin: 24px 0 12px 0;">Items in This Shipment</h2>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; background-color: #F8FAFC;">
        ${data.items.map((item) => {
          const variantParts = [item.size ? `Size: ${item.size}` : null, item.color ? `Color: ${item.color}` : null].filter(Boolean);
          const variantDesc = variantParts.length > 0 ? ` · ${variantParts.join(' · ')}` : '';
          return `
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #E2E8F0; font-size: 13px; color: #0F2942;">
                <strong>${item.quantity}x</strong> ${escapeHtml(item.name)} <span style="color: #64748B; font-size: 12px;">${escapeHtml(variantDesc)}</span>
              </td>
            </tr>
          `;
        }).join('')}
      </table>
    `
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Ling Petshop Order Has Shipped!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F2942; line-height: 1.5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0F2942; padding: 28px 32px; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">🐾 Ling Petshop</h1>
              <p style="margin: 4px 0 0 0; color: #60A5FA; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Package On Its Way</p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="font-size: 16px; font-weight: 600; color: #0F2942; margin: 0 0 12px 0;">${customerGreeting}</p>
              <p style="font-size: 14px; color: #334155; margin: 0 0 24px 0; line-height: 1.6;">
                Great news! Your order <strong>#${escapeHtml(data.orderNumber)}</strong> has been packaged and handed over to the carrier for nationwide delivery.
              </p>

              <!-- Tracking Info Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 16px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <div style="font-size: 12px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">Carrier: ${escapeHtml(carrierName)}</div>
                    <div style="font-size: 18px; font-family: monospace; font-weight: 800; color: #0F2942; margin: 8px 0 16px 0; letter-spacing: 1px;">
                      ${escapeHtml(trackingCode)}
                    </div>
                    ${trackingUrl ? `
                    <a href="${escapeHtml(trackingUrl)}" style="display: inline-block; background-color: #2563EB; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 30px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
                      Track Your Order
                    </a>
                    ` : ''}
                  </td>
                </tr>
              </table>

              <!-- Notice on Carrier Updates -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 14px 18px; font-size: 12px; color: #64748B; line-height: 1.5;">
                    ℹ️ <strong>Tracking Updates Note:</strong> Please note that it may take 24–48 hours for the carrier's scanning system to update initial transit events after package pickup.
                  </td>
                </tr>
              </table>

              ${itemsListHtml}

              ${data.shippingAddress ? `
              <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #64748B; margin: 0 0 12px 0;">Destination Address</h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 14px 18px; font-size: 13px; color: #334155; line-height: 1.5;">
                    ${data.shippingAddress.street}<br>
                    ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}<br>
                    ${data.shippingAddress.country || 'United States'}
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Support Block -->
              <div style="padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B; text-align: center;">
                If you have any questions or concerns regarding your delivery, our support team is here to help at <a href="mailto:${EMAIL_CONFIG.supportEmail}" style="color: #2563EB; font-weight: 600; text-decoration: none;">${EMAIL_CONFIG.supportEmail}</a>.
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F1F5F9; padding: 20px 32px; text-align: center; font-size: 11px; color: #94A3B8;">
              © ${new Date().getFullYear()} Ling Petshop · Nationwide US Shipping · support@lingpetshop.com
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Template 2: Order Tracking Plain Text
 */
export function generateOrderTrackingText(data: TrackingEmailData): string {
  const customerGreeting = data.customerName ? `Hi ${data.customerName},` : 'Hello,';
  const carrierName = data.carrier || 'USPS Ground Advantage';
  const trackingCode = data.trackingNumber.trim();
  const trackingUrl = buildTrackingUrl(trackingCode, carrierName, data.trackingUrl);

  return `
YOUR LING PETSHOP ORDER HAS SHIPPED!

${customerGreeting}

Great news! Your order #${data.orderNumber} has been packaged and handed over to ${carrierName} for delivery.

Carrier: ${carrierName}
Tracking Number: ${trackingCode}
${trackingUrl ? `Tracking Link: ${trackingUrl}\n` : ''}
Note: It may take 24–48 hours for the carrier's system to display initial tracking scan updates.

Need help? Contact support@lingpetshop.com or visit https://lingpetshop.com.

© ${new Date().getFullYear()} Ling Petshop
`.trim();
}

/**
 * Sends order confirmation email via Resend with strict idempotency and error safeguarding.
 */
export async function sendOrderConfirmationEmail(
  order: any,
  options?: { apiKey?: string; fromEmail?: string; resendClient?: any }
): Promise<EmailSendResult> {
  // Idempotency check: never duplicate confirmation emails
  if (order.confirmationEmailSent === true) {
    return {
      success: true,
      status: 'skipped',
      messageId: order.confirmationEmailId,
      reason: 'Confirmation email already sent for this order.',
      recipient: order.customerEmail,
    };
  }

  if (process.env.NODE_ENV === 'test' || process.env.USE_ENV_TEST === 'true' || process.env.RESEND_API_KEY?.startsWith('re_test_')) {
    console.log(`[Test Mode Email Simulation] Bypassing real email send for order ${order.orderNumber || order.id}`);
    return {
      success: true,
      status: 'sent',
      messageId: `simulated_test_id_${Date.now()}`,
      recipient: order.customerEmail || 'test@lingpetshop.com',
    };
  }

  const recipient = (order.customerEmail || '').trim();
  if (!recipient || !recipient.includes('@')) {
    return {
      success: false,
      status: 'failed',
      error: 'Order does not have a valid customer email address.',
    };
  }

  // Ensure payment is actually confirmed
  const paymentStatus = (order.paymentStatus || '').toLowerCase();
  const isPaid = paymentStatus.includes('paid');
  if (!isPaid) {
    return {
      success: false,
      status: 'skipped',
      reason: `Order payment status is not paid (${order.paymentStatus}). Confirmation email withheld.`,
      recipient,
    };
  }

  const apiKey = (options?.apiKey || process.env.RESEND_API_KEY || '').trim();
  if (!apiKey && !options?.resendClient) {
    return {
      success: false,
      status: 'not_configured',
      error: 'RESEND_API_KEY is not configured in the environment variables.',
      recipient,
    };
  }

  const emailData: OrderEmailData = {
    orderNumber: order.orderNumber || order.id,
    date: order.date,
    customerName: order.customerName,
    customerEmail: recipient,
    shippingAddress: order.shippingAddress || {
      street: 'Standard US Address',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'United States',
    },
    items: Array.isArray(order.items) && order.items.length > 0
      ? order.items.map((i: any) => ({
          name: i.name || 'Pet Product',
          quantity: Number(i.quantity) || 1,
          unitPrice: Number(i.unitPrice) || Number(i.price) || 0,
          size: i.size,
          color: i.color,
          image: i.image,
        }))
      : [{ name: 'Ling Petshop Order', quantity: 1, unitPrice: order.totalUsd || 0 }],
    subtotalUsd: order.subtotalUsd,
    discountUsd: order.discountUsd,
    shippingUsd: order.shippingUsd,
    totalUsd: Number(order.totalUsd) || 0,
    appliedPromo: order.appliedPromo,
    estimatedTransit: order.shippingMethod || '3–4 Business Days via USPS Ground Advantage',
  };

  const html = generateOrderConfirmationHtml(emailData);
  const text = generateOrderConfirmationText(emailData);
  const from = options?.fromEmail || process.env.RESEND_FROM_EMAIL || EMAIL_CONFIG.defaultFrom;

  try {
    const resend = options?.resendClient || new Resend(apiKey);
    const response = await resend.emails.send({
      from,
      to: recipient,
      subject: 'Your Ling Petshop Order Confirmation',
      html,
      text,
    });

    if (response?.error) {
      return {
        success: false,
        status: 'failed',
        error: response.error.message || 'Resend API returned an error.',
        recipient,
      };
    }

    return {
      success: true,
      status: 'sent',
      messageId: response.data?.id,
      recipient,
    };
  } catch (err: any) {
    return {
      success: false,
      status: 'failed',
      error: err.message || 'Unexpected exception while sending email via Resend.',
      recipient,
    };
  }
}

/**
 * Sends order tracking notification email via Resend with strict idempotency and error safeguarding.
 */
export async function sendOrderTrackingEmail(
  order: any,
  trackingInfo: { trackingNumber: string; carrier?: string; trackingUrl?: string; forceResend?: boolean },
  options?: { apiKey?: string; fromEmail?: string; resendClient?: any }
): Promise<EmailSendResult> {
  const trackingNumber = (trackingInfo.trackingNumber || '').trim();
  if (!trackingNumber) {
    return {
      success: false,
      status: 'failed',
      error: 'Tracking number is required to send shipping notification.',
    };
  }

  if (process.env.NODE_ENV === 'test' || process.env.USE_ENV_TEST === 'true' || process.env.RESEND_API_KEY?.startsWith('re_test_')) {
    console.log(`[Test Mode Email Simulation] Bypassing real tracking email send for order ${order.orderNumber || order.id}`);
    return {
      success: true,
      status: 'sent',
      messageId: `simulated_test_id_${Date.now()}`,
      recipient: order.customerEmail || 'test@lingpetshop.com',
    };
  }

  const recipient = (order.customerEmail || '').trim();
  if (!recipient || !recipient.includes('@')) {
    return {
      success: false,
      status: 'failed',
      error: 'Order does not have a valid customer email address.',
    };
  }

  // Idempotency: if this exact tracking number was already notified, skip unless explicit forceResend
  if (
    order.trackingEmailSent === true &&
    order.trackingEmailCode === trackingNumber &&
    !trackingInfo.forceResend
  ) {
    return {
      success: true,
      status: 'skipped',
      reason: 'Shipping notification already sent for this tracking code.',
      recipient,
    };
  }

  const apiKey = (options?.apiKey || process.env.RESEND_API_KEY || '').trim();
  if (!apiKey && !options?.resendClient) {
    return {
      success: false,
      status: 'not_configured',
      error: 'RESEND_API_KEY is not configured in the environment variables.',
      recipient,
    };
  }

  const carrier = trackingInfo.carrier || order.carrier || 'USPS Ground Advantage';
  const trackingUrl = buildTrackingUrl(trackingNumber, carrier, trackingInfo.trackingUrl || order.trackingUrl);

  const emailData: TrackingEmailData = {
    orderNumber: order.orderNumber || order.id,
    customerName: order.customerName,
    customerEmail: recipient,
    trackingNumber,
    carrier,
    trackingUrl,
    shippingAddress: order.shippingAddress,
    items: Array.isArray(order.items)
      ? order.items.map((i: any) => ({
          name: i.name,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        }))
      : undefined,
  };

  const html = generateOrderTrackingHtml(emailData);
  const text = generateOrderTrackingText(emailData);
  const from = options?.fromEmail || process.env.RESEND_FROM_EMAIL || EMAIL_CONFIG.defaultFrom;

  try {
    const resend = options?.resendClient || new Resend(apiKey);
    const response = await resend.emails.send({
      from,
      to: recipient,
      subject: 'Your Ling Petshop Order Has Shipped!',
      html,
      text,
    });

    if (response?.error) {
      return {
        success: false,
        status: 'failed',
        error: response.error.message || 'Resend API returned an error.',
        recipient,
      };
    }

    return {
      success: true,
      status: 'sent',
      messageId: response.data?.id,
      recipient,
    };
  } catch (err: any) {
    return {
      success: false,
      status: 'failed',
      error: err.message || 'Unexpected exception while sending email via Resend.',
      recipient,
    };
  }
}

/**
 * Demo data for template preview & sandbox testing
 */
export function getDemoOrderConfirmationData(): OrderEmailData {
  return {
    orderNumber: 'LP-STRIPE-DEMO99',
    date: 'Today, just now',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sandbox-customer@lingpetshop.com',
    shippingAddress: {
      street: '742 Evergreen Terrace',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'United States',
    },
    items: [
      {
        name: 'Anti-Anxiety Calming Dog Bed',
        quantity: 1,
        unitPrice: 34.95,
        size: 'Large (36")',
        color: 'Plush Grey',
      },
      {
        name: 'Professional Magic Pet Grooming Brush',
        quantity: 2,
        unitPrice: 16.50,
        size: 'Standard',
        color: 'Teal',
      },
    ],
    subtotalUsd: 67.95,
    discountUsd: 13.59,
    shippingUsd: 0.00,
    totalUsd: 54.36,
    appliedPromo: 'LING20 (20% OFF)',
    estimatedTransit: '3–4 Business Days via USPS Ground Advantage',
  };
}

export function getDemoOrderTrackingData(): TrackingEmailData {
  return {
    orderNumber: 'LP-STRIPE-DEMO99',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sandbox-customer@lingpetshop.com',
    trackingNumber: '9400111899562483921045',
    carrier: 'USPS Ground Advantage',
    trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899562483921045',
    shippingAddress: {
      street: '742 Evergreen Terrace',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'United States',
    },
    items: [
      {
        name: 'Anti-Anxiety Calming Dog Bed',
        quantity: 1,
        size: 'Large (36")',
        color: 'Plush Grey',
      },
      {
        name: 'Professional Magic Pet Grooming Brush',
        quantity: 2,
        size: 'Standard',
        color: 'Teal',
      },
    ],
  };
}

/**
 * Sends a sandboxed test email using demo data directly to the specified recipient via Resend
 */
export async function sendTestEmailDirect(
  templateType: 'confirmation' | 'tracking',
  recipient: string,
  apiKey: string
): Promise<EmailSendResult> {
  const cleanKey = (apiKey || '').trim();
  const cleanRecipient = (recipient || '').trim();

  if (!cleanKey) {
    return {
      success: false,
      status: 'not_configured',
      error: 'Resend API Key is required. Please enter a valid key starting with "re_".',
    };
  }

  if (!cleanKey.startsWith('re_') || cleanKey.length < 10) {
    return {
      success: false,
      status: 'failed',
      error: 'Invalid Resend API Key format. A valid Resend API key must start with "re_" (e.g., re_12345678...).',
    };
  }

  if (!cleanRecipient || !cleanRecipient.includes('@')) {
    return {
      success: false,
      status: 'failed',
      error: 'Valid recipient email address is required.',
    };
  }

  let resend: Resend;
  try {
    resend = new Resend(cleanKey);
  } catch (err: any) {
    return {
      success: false,
      status: 'failed',
      error: `Invalid Resend API Key format: ${err.message?.includes('pattern') ? 'API key must start with "re_".' : err.message}`,
    };
  }

  if (templateType === 'confirmation') {
    const data = getDemoOrderConfirmationData();
    data.customerEmail = cleanRecipient;
    const html = generateOrderConfirmationHtml(data);
    const text = generateOrderConfirmationText(data);

    try {
      const response = await resend.emails.send({
        from: EMAIL_CONFIG.defaultFrom,
        to: cleanRecipient,
        subject: '[DEMO SANDBOX] Your Ling Petshop Order Confirmation',
        html,
        text,
      });

      if (response?.error) {
        return { success: false, status: 'failed', error: response.error.message };
      }
      return { success: true, status: 'sent', messageId: response.data?.id, recipient: cleanRecipient };
    } catch (err: any) {
      return { success: false, status: 'failed', error: err.message };
    }
  } else {
    const data = getDemoOrderTrackingData();
    data.customerEmail = cleanRecipient;
    const html = generateOrderTrackingHtml(data);
    const text = generateOrderTrackingText(data);

    try {
      const response = await resend.emails.send({
        from: EMAIL_CONFIG.defaultFrom,
        to: cleanRecipient,
        subject: '[DEMO SANDBOX] Your Ling Petshop Order Has Shipped!',
        html,
        text,
      });

      if (response?.error) {
        return { success: false, status: 'failed', error: response.error.message };
      }
      return { success: true, status: 'sent', messageId: response.data?.id, recipient: cleanRecipient };
    } catch (err: any) {
      return { success: false, status: 'failed', error: err.message };
    }
  }
}
