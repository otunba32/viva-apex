import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params

    const product = await prisma.product.findUnique({
      where: { slug },
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
    console.error('[Product Details API] Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}