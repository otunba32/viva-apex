'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageTransition } from '@/components/PageTransition'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DELIVERY_ZONES, type DeliveryZone } from '@/lib/delivery'

interface CheckoutFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  city: string
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
  })
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deliveryFee = selectedZone?.fee ?? 0
  const grandTotal = total + deliveryFee

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 pt-15 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/cart" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Link>
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
              <Link href="/products">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedZone) {
      setError('Please select a delivery zone')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalAmount: grandTotal,
          deliveryFee,
          deliveryZone: selectedZone.name,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        }),
      })

      const data = await response.json()

      if (data.success) {
        window.location.href = `/payment?orderId=${data.data.id}`
      } else {
        setError(data.error || 'Failed to create order')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pt-5 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/cart">
              <Button variant="outline" className="border-gray-300 bg-white mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 space-y-6"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Delivery Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ibadan"
                      />
                    </div>

                    {/* Delivery Zone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Zone *
                      </label>
                      <select
                        value={selectedZone?.name ?? ''}
                        onChange={(e) => {
                          const zone = DELIVERY_ZONES.find((z) => z.name === e.target.value) ?? null
                          setSelectedZone(zone)
                        }}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select your delivery zone</option>
                        {DELIVERY_ZONES.map((zone) => (
                          <option key={zone.name} value={zone.name}>
                            {zone.name} — ₦{zone.fee.toLocaleString()}
                          </option>
                        ))}
                      </select>
                      {selectedZone && (
                        <p className="mt-2 text-sm text-green-700 font-medium">
                          Delivery fee: ₦{selectedZone.fee.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={loading || !selectedZone}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                  >
                    {loading ? 'Processing...' : 'Continue to Payment'}
                  </Button>
                </motion.div>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-28">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                {/* Items */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="text-gray-700 font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-green-600">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-semibold text-green-600">₦{total.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Delivery</p>
                    <p className="font-semibold">
                      {selectedZone
                        ? `₦${deliveryFee.toLocaleString()}`
                        : <span className="text-slate-400 text-sm">Select zone</span>
                      }
                    </p>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <p className="font-bold text-gray-900">Total</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₦{grandTotal.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 text-center text-sm text-gray-700">
                  <p className="font-semibold mb-1">Secure Checkout</p>
                  <p className="text-xs">Powered by Paystack</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}