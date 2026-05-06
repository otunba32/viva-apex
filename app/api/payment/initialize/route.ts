import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(request: Request) {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: 'Paystack secret key not configured' },
        { status: 500 }
      )
    }

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Initialize with Paystack to get a reference
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        email: order.customerEmail,
        amount: Math.round(order.totalAmount * 100), // naira → kobo
        metadata: {
          order_id: orderId,
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
        },
      }),
    })

    const data = await response.json()

    if (!data.status) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to initialize payment' },
        { status: 400 }
      )
    }

    // ✅ Return what payment/page.tsx needs to open Paystack inline
    return NextResponse.json({
      success: true,
      data: {
        email: order.customerEmail,
        amount: order.totalAmount,          // naira — page converts to kobo
        reference: data.data.reference,    // Paystack-generated reference
      },
    })
  } catch (error) {
    console.error('[Payment Initialize API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}