'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartIcon() {
  const { totalItems } = useCart()

  return (
    <Link href="/cart" className="relative inline-flex">
      <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-red-600 transition" />

      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
          {totalItems}
        </span>
      )}
    </Link>
  )
}