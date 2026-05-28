import { useQuery } from '@tanstack/react-query'
import {
  getFeaturedProducts,
  getProducts,
} from '@/services/products.service'

export function useFeaturedProducts(limit = 3) {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => getFeaturedProducts(limit),
  })
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })
}