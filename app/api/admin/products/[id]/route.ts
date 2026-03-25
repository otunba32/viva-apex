import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('[ADMIN_PRODUCT_GET]', error)

    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params
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
      storage,
      featured,
      available,
    } = body

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(price !== undefined && { price: Number(price) }),
        ...(image !== undefined && { image }),
        ...(images !== undefined && { images }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(category !== undefined && { category }),
        ...(weight !== undefined && { weight }),
        ...(unit !== undefined && { unit }),
        ...(description !== undefined && { description }),
        ...(nutrients !== undefined && { nutrients }),
        ...(storage !== undefined && { storage }),
        ...(featured !== undefined && { featured }),
        ...(available !== undefined && { available }),
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('[ADMIN_PRODUCT_PATCH]', error)

    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    console.error('[ADMIN_PRODUCT_DELETE]', error)

    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}