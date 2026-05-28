import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category')
    const featuredParam = searchParams.get('featured')
    const limitParam = searchParams.get('limit')
    const skipParam = searchParams.get('skip')

    const limit = limitParam ? Number(limitParam) : undefined
    const skip = skipParam ? Number(skipParam) : 0

    const where: {
      category?: string
      featured?: boolean
    } = {}

    if (category) where.category = category
    if (featuredParam === 'true') where.featured = true

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        limit: limit ?? total,
        skip,
        pages: limit ? Math.ceil(total / limit) : 1,
      },
    })
  } catch (error) {
    console.error('[Products API] Full Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}