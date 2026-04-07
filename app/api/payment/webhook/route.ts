import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

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
    await prisma.order.update({
      where: { id: event.data.reference },
      data: {
        status: OrderStatus.PAID,          // ✅
        paystackRef: event.data.reference, // ✅
      },
    });
  }

  return new Response('OK', { status: 200 });
}