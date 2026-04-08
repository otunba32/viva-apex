import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  const body = await request.text();
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex');

  const signature = request.headers.get('x-paystack-signature');

  if (hash !== signature) {
    return new Response('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === 'charge.success') {
    // Guard: skip if already paid (prevents duplicate emails)
    const existingOrder = await prisma.order.findUnique({
      where: { id: event.data.reference },
    });

    if (existingOrder?.status === OrderStatus.PAID) {
      return new Response('OK', { status: 200 });
    }

    // Update order and fetch items for email
    const updatedOrder = await prisma.order.update({
      where: { id: event.data.reference },
      data: {
        status: OrderStatus.PAID,
        paystackRef: event.data.reference,
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // Send confirmation email (non-blocking)
    try {
      await sendOrderConfirmationEmail({
        customerName: updatedOrder.customerName,
        customerEmail: updatedOrder.customerEmail,
        customerPhone: updatedOrder.customerPhone,
        orderId: updatedOrder.id,
        totalAmount: updatedOrder.totalAmount,
        address: updatedOrder.address,
        city: updatedOrder.city,
        items: updatedOrder.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });
    } catch (emailError) {
      console.error('[Webhook] Email failed to send:', emailError);
    }
  }

  return new Response('OK', { status: 200 });
}