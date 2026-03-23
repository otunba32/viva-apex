import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      name,
      slug,
      price,
      image,
      stock,
      category,
      weight,
      description,
      nutrients,
      storage,
    } = body

    if (!name || !slug || !price || !image || !stock || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price: Number(price),
        image,
        stock: Number(stock),
        category,
        weight,
        description,
        nutrients,
        storage,
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('[ADMIN_CREATE_PRODUCT]', error)

    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}