import { api } from '@/lib/axios'

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  image: string | null
  category: string
  description: string | null
  featured: boolean
  stock?: number
}

interface ProductsResponse {
  success: boolean
  data: Product[]
}

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  const response = await api.get<ProductsResponse>(
    `/api/products?featured=true&limit=${limit}`
  )

  if (!response.data.success) {
    throw new Error('Failed to fetch featured products')
  }

  return response.data.data
}

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<ProductsResponse>('/api/products')

  if (!response.data.success) {
    throw new Error('Failed to fetch products')
  }

  return response.data.data
}