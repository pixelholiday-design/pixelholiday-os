import Stripe from "stripe";

// ─────────────────────────────────────────────────────────────────────────────
// Stripe — Web checkout + Terminal
// ─────────────────────────────────────────────────────────────────────────────

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export interface CreateCheckoutParams {
  galleryId:       string;
  token:           string;
  photoIds:        string[];
  totalAmount:     number; // in smallest currency unit (satang / cents)
  currency:        string;
  customerEmail?:  string;
  couponId?:       string;
  locale:          string;
  successUrl:      string;
  cancelUrl:       string;
}

/**
 * Create a Stripe Checkout Session for gallery photo purchase.
 */
export async function createGalleryCheckoutSession(
  params: CreateCheckoutParams
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    mode:               "payment",
    customer_email:     params.customerEmail,
    currency:           params.currency,
    locale:             params.locale as Stripe.Checkout.SessionCreateParams["locale"],
    success_url:        params.successUrl,
    cancel_url:         params.cancelUrl,
    discounts:          params.couponId ? [{ coupon: params.couponId }] : [],
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency:     params.currency,
          unit_amount:  params.totalAmount,
          product_data: {
            name:        "PixelHoliday Photo Package",
            description: `${params.photoIds.length} photo(s) from your holiday shoot`,
            images:      [],
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      galleryId: params.galleryId,
      token:     params.token,
      photoIds:  JSON.stringify(params.photoIds),
      source:    "web_checkout",
    },
    payment_intent_data: {
      metadata: {
        galleryId: params.galleryId,
        photoIds:  JSON.stringify(params.photoIds),
      },
    },
  });

  return session;
}

/**
 * Create a Stripe coupon for Sleep Money campaigns.
 * Coupons are named consistently so they can be reused.
 */
export async function getOrCreateCoupon(
  percentOff: number,
  durationDays: number
): Promise<string> {
  const couponId = `SLEEP_${percentOff}PCT_D${durationDays}`;

  try {
    const existing = await stripe.coupons.retrieve(couponId);
    return existing.id;
  } catch {
    // Coupon doesn't exist — create it
    const coupon = await stripe.coupons.create({
      id:          couponId,
      percent_off: percentOff,
      duration:    "once",
      name:        `${percentOff}% Holiday Discount (Day ${durationDays})`,
    });
    return coupon.id;
  }
}

/**
 * Verify a Stripe webhook signature and return the event.
 */
export function constructWebhookEvent(
  body:      string | Buffer,
  signature: string,
  secret:    string
): Stripe.Event {
  return stripe.webhooks.constructEvent(body, signature, secret);
}

/**
 * Create a Stripe Terminal connection token (for iPad POS kiosk).
 */
export async function createTerminalConnectionToken(): Promise<string> {
  const token = await stripe.terminal.connectionTokens.create();
  return token.secret;
}

/**
 * Create a Stripe Terminal PaymentIntent.
 */
export async function createTerminalPaymentIntent(
  amount:   number,
  currency: string,
  metadata: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: ["card_present"],
    capture_method:       "automatic",
    metadata,
  });
}
