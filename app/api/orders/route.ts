import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';        // ✅ use shared instance
import { OrderStatus } from '@prisma/client';  // ✅ use enum

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,  
      address,
      city,
      totalAmount,
      items,
    } = body;

    // Validate required fields (only fields that exist in your schema)
    if (
      !customerName ||
      !customerEmail ||
      !address ||
      !city ||
      !totalAmount ||
      !items
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
  data: {
    customerName,
    customerEmail,
    customerPhone,
    address,
    city,
    totalAmount,
    status: OrderStatus.PENDING,
    items: {
      create: items.map((item: { productId: string; quantity: number; unitPrice: number }) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    },
  },
  include: { items: true },
});

    return NextResponse.json({ success: true, data: order });

  } catch (error) {
    console.error('[Orders API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ success: true, data: order });

  } catch (error) {
    console.error('[Orders API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}