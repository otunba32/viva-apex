import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(request: Request) {
  const body = await request.text()

  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex')

  const signature = request.headers.get('x-paystack-signature')

  if (hash !== signature) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.event === 'charge.success') {
    const paystackReference = event.data.reference
    // ✅ order_id was stored in metadata during initialize
    const orderId = event.data.metadata?.order_id

    if (!orderId) {
      console.error('[Webhook] No order_id in metadata for reference:', paystackReference)
      return new Response('OK', { status: 200 })
    }

    // ✅ Look up by orderId (DB primary key), not by Paystack reference
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    })

    // Guard: skip if already paid (prevents duplicate emails)
    if (existingOrder?.status === OrderStatus.PAID) {
      return new Response('OK', { status: 200 })
    }

    // ✅ Update by orderId, save the Paystack reference separately
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PAID,
        paystackRef: paystackReference,
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

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
      })
    } catch (emailError) {
      console.error('[Webhook] Email failed to send:', emailError)
    }
  }

  return new Response('OK', { status: 200 })
}