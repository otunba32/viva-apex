'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string | null
  slug: string
  stock: number
  index?: number
}

export function ProductCard({
  id,
  name,
  price,
  image,
  slug,
  stock,
}: ProductCardProps) {
  const { addItem } = useCart()

  const safeImage = image || '/products/full-chicken.jpg'
  const isOutOfStock = stock === 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()

    addItem({
      id,
      name,
      price,
      image: safeImage,
      slug,
      quantity: 1,
    })
  }

  return (
    <div className="h-full">
      <Link href={`/products/${slug}`}>
        <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg">
          <div className="relative h-48 w-full overflow-hidden bg-gray-100">
            <img
              src={safeImage}
              alt={name}
              className="h-full w-full object-cover"
            />

            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="font-semibold text-white">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          <div className="flex grow flex-col p-4">
            <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">
              {name}
            </h3>

            <p className="mb-4 grow text-sm text-gray-500">
              {isOutOfStock ? 'Out of stock' : `${stock} in stock`}
            </p>

            <span className="text-xl font-bold text-green-600">
              ₦{price.toLocaleString()}
              <span className="text-sm font-normal text-gray-500">
                /kg
              </span>
            </span>
          </div>

          <div className="px-4 pb-4">
            <Button
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="w-full bg-[#D62828] text-white hover:bg-[#A61E1E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </Link>
    </div>
  )
}