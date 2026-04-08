import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAuthorized(request: Request) {
  const adminKey = request.headers.get('x-admin-key')
  return adminKey === process.env.ADMIN_SECRET_KEY
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    console.error('[ADMIN_PRODUCTS_GET]', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const {
      name,
      slug,
      price,
      image,
      images,
      stock,
      category,
      weight,
      unit,
      description,
      nutrients,
      featured,
      available,
    } = body

    if (!name || !slug || price == null || !image || stock == null || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingProduct = await prisma.product.findUnique({ where: { slug } })

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'A product with this slug already exists. Please change the product name or edit the slug.',
        },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price: Number(price),
        image,
        images: Array.isArray(images) && images.length > 0 ? images : [image],
        stock: Number(stock),
        category,
        weight: weight || null,
        unit: unit || null,
        description: description || null,
        nutrients: nutrients || null,
        featured: featured ?? false,
        available: available ?? true,
      },
    })

    return NextResponse.json({ success: true, data: product })
  } catch (error: unknown) {
    console.error('[ADMIN_PRODUCTS_POST_ERROR]', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create product',
      },
      { status: 500 }
    )
  }
}