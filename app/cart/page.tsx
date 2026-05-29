'use client'

import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react'

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    total,
    clearCart,
    mounted,
  } = useCart()

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12 pt-2">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 mt-4 h-10 w-44 animate-pulse rounded-md bg-gray-200" />
          <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-2">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/products" className="mt-4 block">
            <Button variant="outline" className="border-gray-300 bg-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm sm:p-14">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">
              🛒
            </div>

            <h1 className="text-3xl font-black text-gray-900">
              Your cart is waiting
            </h1>

            <p className="mx-auto mt-3 max-w-md text-gray-600">
              Add chicken, turkey, fish, and other frozen foods to your cart before checkout.
            </p>

            <Link href="/products">
              <Button className="mt-8 rounded-full bg-[#D62828] px-8 py-3 text-white hover:bg-[#A61E1E]">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => {
                const safeImage = item.image || '/products/full-chicken.jpg'

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md sm:flex-row sm:gap-6 sm:p-6"
                  >
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={safeImage}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-grow">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                          {item.name}
                        </h3>
                      </Link>

                      <p className="mt-2 text-xl font-bold text-blue-600 sm:text-2xl">
                        ₦{item.price.toLocaleString()}
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        <Button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                          variant="outline"
                          className="h-9 w-9 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <span className="w-8 text-center text-lg font-semibold">
                          {item.quantity}
                        </span>

                        <Button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          variant="outline"
                          className="h-9 w-9 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-between">
                      <Button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>

                      <p className="text-lg font-bold text-gray-900 sm:text-xl">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              })}

              <div className="mt-6">
                <Button
                  type="button"
                  onClick={clearCart}
                  variant="ghost"
                  className="px-0 text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-6 text-xl font-bold text-gray-900">
                  Order Summary
                </h3>

                <div className="mb-4 flex justify-between border-b border-gray-200 pb-4">
                  <p className="text-gray-600">Items ({items.length})</p>
                  <p className="font-semibold text-gray-900">
                    ₦{total.toLocaleString()}
                  </p>
                </div>

                <div className="mb-4 flex justify-between border-b border-gray-200 pb-4">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-semibold text-gray-900">
                    ₦{total.toLocaleString()}
                  </p>
                </div>

                <div className="mb-6 flex justify-between border-b border-gray-200 pb-6">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-semibold text-gray-900">Free</p>
                </div>

                <div className="mb-8 flex justify-between">
                  <p className="text-lg font-bold text-gray-900">Total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ₦{total.toLocaleString()}
                  </p>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-blue-600 py-3 text-lg text-white hover:bg-blue-700">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}