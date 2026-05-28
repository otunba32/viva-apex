import ProductsClient from './ProductsClient'
import { prisma } from '@/lib/prisma'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return <ProductsClient products={products} />
}