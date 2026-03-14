import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Reference is required' },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Check if payment was successful
    if (data.data.status === 'success') {
      // Update order status
      const updatedOrder = await prisma.order.update({
        where: { id: reference },
        data: {
          status: 'completed',
          paymentRef: data.data.reference,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          status: 'success',
          order: updatedOrder,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment was not successful',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('[Payment Verify API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
