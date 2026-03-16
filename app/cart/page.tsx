'use client';

import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

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
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          </motion.div>

          {items.length === 0 ? (
            // Empty Cart
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-12 text-center"
            >
              <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
              <Link href="/products">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Shopping
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
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
                      className="bg-white rounded-lg shadow-md p-6 flex gap-6"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {/* <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        /> */}
                        <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        priority
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-cover"
                                      />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <Link href={`/products/${item.slug}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-2xl font-bold text-blue-600 mt-2">
                          ₦{item.price.toLocaleString()}
                        </p>

                        {/* Quantity Control */}
                        <div className="flex items-center space-x-3 mt-4">
                          <Button
                            onClick={() =>
                              updateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            className="p-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-lg font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                        <p className="text-xl font-bold text-gray-900">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Clear Cart Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-6"
                >
                  <Button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 font-semibold text-sm"
                  >
                    Clear Cart
                  </Button>
                </motion.div>
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-28">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                  {/* Items Count */}
                  <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                    <p className="text-gray-600">Items ({items.length})</p>
                    <p className="font-semibold text-gray-900">
                      ₦{total.toLocaleString()}
                    </p>
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-semibold text-gray-900">
                      ₦{total.toLocaleString()}
                    </p>
                  </div>

                  {/* Shipping (Placeholder) */}
                  <div className="flex justify-between mb-6 pb-6 border-b border-gray-200">
                    <p className="text-gray-600">Shipping</p>
                    <p className="font-semibold text-gray-900">Free</p>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between mb-8">
                    <p className="text-lg font-bold text-gray-900">Total</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₦{total.toLocaleString()}
                    </p>
                  </div>

                  {/* Checkout Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href="/checkout">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                        Proceed to Checkout
                      </Button>
                    </Link>
                  </motion.div>

                  {/* Continue Shopping */}
                  <Link href="/products" className="mt-4 block">
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-900 hover:bg-gray-50"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
