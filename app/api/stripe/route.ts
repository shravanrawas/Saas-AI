import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'USD',
            product_data: {
              name: 'Pro Plan Subscription',
              description: 'Get access to all pro features',
            },
            unit_amount: 2000, 
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
