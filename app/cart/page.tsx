'use client'

import { motion } from 'framer-motion'
import { PageTransition } from '@/components/PageTransition'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pb-12 pt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/products" className="mt-4 block">
                    <Button variant="outline" className="border-gray-300 bg-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
                  </Link>

            
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg bg-white p-10 text-center shadow-md sm:p-12"
            >
              <p className="mb-6 text-lg text-gray-600">Your cart is empty</p>
              <Link href="/products">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  Start Shopping
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md sm:flex-row sm:gap-6 sm:p-6"
                    >
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={item.image}
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
                              updateQuantity(item.id, Math.max(1, item.quantity - 1))
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
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-6"
                >
                  <Button
                    type="button"
                    onClick={clearCart}
                    variant="ghost"
                    className="px-0 text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Clear Cart
                  </Button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-1"
              >
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

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/checkout">
                      <Button className="w-full bg-blue-600 py-3 text-lg text-white hover:bg-blue-700">
                        Proceed to Checkout
                      </Button>
                    </Link>
                  </motion.div>

                  {/*  */}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}