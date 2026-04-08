import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import { sendOrderConfirmationEmail } from '@/lib/email';

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

    // Guard: already paid — return early and skip email
    const existingOrder = await prisma.order.findUnique({
      where: { id: reference },
    });
    if (existingOrder?.status === OrderStatus.PAID) {
      return NextResponse.json({
        success: true,
        data: { status: 'success', order: existingOrder },
      });
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
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

    if (data.data.status === 'success') {
      // Update order and include items + product names for email
      const updatedOrder = await prisma.order.update({
        where: { id: reference },
        data: {
          status: OrderStatus.PAID,
          paystackRef: data.data.reference,
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // Send confirmation email (non-blocking — don't fail the request if email fails)
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
        // Log but don't fail the payment response
        console.error('[Payment Verify] Email failed to send:', emailError);
      }

      return NextResponse.json({
        success: true,
        data: { status: 'success', order: updatedOrder },
      });
    } else {
      await prisma.order.update({
        where: { id: reference },
        data: { status: OrderStatus.FAILED },
      });

      return NextResponse.json(
        { success: false, error: 'Payment was not successful' },
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