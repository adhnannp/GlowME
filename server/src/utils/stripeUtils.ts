import { stripe } from '../config/stripe';

export interface StripeCheckoutSessionParams {
  title: string;
  coins: number;
  price: number;
  userId: string;
  planId: string;
}

export async function createStripeCheckoutSession(
  params: StripeCheckoutSessionParams
): Promise<string> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: params.title,
              description: `Purchase ${params.coins} Gcoins`,
            },
            unit_amount: params.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      metadata: {
        userId: params.userId,
        coinPlanId: params.planId,
        coins: params.coins.toString(),
      },
    });
    return session.id;
  } catch (error) {
    const err = error as Error;
    throw new Error(err.message);
  }
}