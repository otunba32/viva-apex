'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
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
  index = 0,
}: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({ id, name, price, image, slug, quantity: 1 })
  }

  const isOutOfStock = stock === 0

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, delay: index * 0.08 },
        },
      }}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="h-full"
    >
      <Link href={`/products/${slug}`}>
        <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg">

          {/* Image */}
          <div className="relative h-48 w-full overflow-hidden bg-gray-100">
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
              // Use eager for first 4 cards (above fold), lazy for the rest
              loading={index < 4 ? 'eager' : 'lazy'}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="font-semibold text-white">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex grow flex-col p-4">
            <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">{name}</h3>
            <p className="mb-4 grow text-sm text-gray-500">
              {isOutOfStock ? 'Out of stock' : `${stock} in stock`}
            </p>
            <span className="text-xl font-bold text-green-600">
              ₦{price.toLocaleString()}<span className="text-sm font-normal text-gray-500">/kg</span>
            </span>
          </div>

          {/* Add to Cart */}
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
    </motion.div>
  )
}