'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useMounted } from '@/hooks/useMounted'

export function CartIcon() {
  const { items } = useCart()
  const mounted = useMounted()

  // ✅ Prevent hydration mismatch
  if (!mounted) return null

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center"
    >
      <ShoppingCart className="h-6 w-6 text-slate-700" />

      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
          {totalItems}
        </span>
      )}
    </Link>
  )
}