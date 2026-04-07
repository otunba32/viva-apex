import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: 'Paystack secret key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Initialize payment with Paystack
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        email: order.customerEmail,
        // totalAmount is stored in Naira in the DB
        // Paystack requires kobo, so multiply by 100
        amount: Math.round(order.totalAmount * 100), // Paystack uses kobo (1 Naira = 100 kobo)    
        metadata: {
          order_id: orderId,
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
        },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to initialize payment' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
        reference: data.data.reference,
      },
    });
  } catch (error) {
    console.error('[Payment Initialize API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
