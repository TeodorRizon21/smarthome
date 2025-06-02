import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendAdminNotification, sendOrderConfirmation } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  console.log('=== WEBHOOK STARTED ===');
  console.log('Environment variables:');
  console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not set');
  console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? 'Set' : 'Not set');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Not set');
  console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'Not set');

  const body = await req.text();
  const sig = headers().get('stripe-signature') as string;
  console.log('Headers:', Object.fromEntries(headers().entries()));
  console.log('Stripe signature:', sig);
  console.log('Webhook secret:', endpointSecret);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log('Stripe webhook received event:', event?.type);
    console.log('Event data:', JSON.stringify(event.data, null, 2));
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    console.error('Full error:', err);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('=== CHECKOUT SESSION COMPLETED ===');
    console.log('Session ID:', session.id);
    console.log('Session metadata:', session.metadata);
    console.log('Session customer email:', session.customer_email);
    console.log('Session amount total:', session.amount_total);

    try {
      const { userId, detailsId, items, regularItems, bundleItems } = session.metadata as any;
      console.log('Parsed metadata:', { userId, detailsId, items, regularItems, bundleItems });

      if (!detailsId) {
        console.error('Webhook ERROR: detailsId missing from metadata!');
        return NextResponse.json({ error: 'detailsId missing from metadata' }, { status: 400 });
      }

      let parsedItems = [];
      if (items) {
        parsedItems = JSON.parse(items);
      } else if (regularItems || bundleItems) {
        const reg = regularItems ? JSON.parse(regularItems) : [];
        const bun = bundleItems ? JSON.parse(bundleItems) : [];
        parsedItems = [...reg, ...bun];
      } else {
        console.error('Webhook ERROR: No items, regularItems sau bundleItems in metadata!');
        return NextResponse.json({ error: 'No items, regularItems sau bundleItems in metadata' }, { status: 400 });
      }

      console.log('Parsed items:', parsedItems);

      if (!parsedItems.length) {
        console.error('Webhook ERROR: parsedItems este gol!');
        return NextResponse.json({ error: 'parsedItems este gol' }, { status: 400 });
      }

      // Verifică dacă comanda există deja
      const existingOrder = await prisma.order.findFirst({
        where: {
          paymentType: 'card',
          paymentStatus: 'COMPLETED',
          detailsId: detailsId,
          createdAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000) // Ultimele 5 minute
          }
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          details: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (existingOrder) {
        console.log('Order already exists:', existingOrder.id);
        return NextResponse.json({ message: 'Order already exists' });
      }

      // Verifică dacă detailsId există
      const orderDetails = await prisma.orderDetails.findUnique({
        where: { id: detailsId }
      });

      if (!orderDetails) {
        console.error('Webhook ERROR: Order details not found!');
        return NextResponse.json({ error: 'Order details not found' }, { status: 400 });
      }

      console.log('Creating new order...');
      const order = await prisma.order.create({
        data: {
          userId: userId || null,
          total: session.amount_total! / 100,
          paymentStatus: 'COMPLETED',
          orderStatus: 'Comanda este in curs de procesare',
          paymentType: 'card',
          details: { connect: { id: detailsId } },
          items: {
            create: parsedItems.map((item: any) => ({
              productId: item.productId || item.bundleId,
              quantity: item.quantity,
              size: item.size,
              price: item.price,
            }))
          }
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          details: true,
        },
      });

      console.log('Order created successfully:', order);

      try {
        console.log('Updating stock...');
        for (const item of parsedItems) {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
          });
          
          if (product) {
            await prisma.sizeVariant.updateMany({
              where: {
                productId: item.productId,
                size: item.size
              },
              data: {
                stock: {
                  decrement: item.quantity
                }
              }
            });
          }
        }
        console.log('Stock updated successfully');
      } catch (stockError) {
        console.error('Error updating stock:', stockError);
      }

      console.log('Sending emails...');
      try {
        console.log('Sending confirmation email to:', order.details.email);
        const [confirmationResult, adminResult] = await Promise.all([
          sendOrderConfirmation(order),
          sendAdminNotification(order)
        ]);
        console.log('Email results:', { confirmationResult, adminResult });
      } catch (error) {
        console.error('Error sending emails:', error);
        console.error('Full error:', error);
      }

      console.log('=== WEBHOOK COMPLETED SUCCESSFULLY ===');
      return NextResponse.json({ success: true, orderId: order.id });
    } catch (error) {
      console.error('Error in webhook processing:', error);
      console.error('Full error:', error);
      return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
    }
  }

  console.log('=== WEBHOOK COMPLETED (NO ACTION) ===');
  return NextResponse.json({ received: true });
}

