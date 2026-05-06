import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'
import { sendOrderConfirmationEmail } from '@/lib/email'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(request: Request) {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: 'Paystack secret key not configured' },
        { status: 500 }
      )
    }

    const { reference, orderId } = await request.json()

    if (!reference || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Reference and orderId are required' },
        { status: 400 }
      )
    }

    // ✅ Look up by orderId (the DB primary key), not by reference
    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } })

    if (existingOrder?.status === OrderStatus.PAID) {
      return NextResponse.json({ success: true, data: { status: 'success', order: existingOrder } })
    }

    // Verify with Paystack using the Paystack reference
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
      }
    )

    const data = await response.json()

    if (!data.status) {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    if (data.data.status === 'success') {
      // ✅ Update order by orderId, store the Paystack reference
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PAID,
          paystackRef: data.data.reference,
        },
        include: {
          items: { include: { product: true } },
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
        console.error('[Payment Verify] Email failed:', emailError)
      }

      return NextResponse.json({ success: true, data: { status: 'success', order: updatedOrder } })
    } else {
      // ✅ Also update by orderId
      await prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.FAILED },
      })

      return NextResponse.json(
        { success: false, error: 'Payment was not successful' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('[Payment Verify API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}