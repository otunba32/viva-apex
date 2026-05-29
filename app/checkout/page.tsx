'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
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
  const router = useRouter()
  const { items, total, mounted } = useCart()

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
        router.push(`/payment?orderId=${data.data.id}`)
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12 pt-5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 h-10 w-40 animate-pulse rounded bg-gray-200" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="h-96 animate-pulse rounded-lg bg-gray-100 lg:col-span-2" />
            <div className="h-80 animate-pulse rounded-lg bg-gray-100" />
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm sm:p-14">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
            📦
          </div>

          <h1 className="text-3xl font-black text-gray-900">
            Nothing to checkout yet
          </h1>

          <p className="mx-auto mt-3 max-w-md text-gray-600">
            Your checkout page is empty because no items are currently in your cart.
            Add some frozen foods first, then come back to complete your order.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/products">
              <Button className="rounded-full bg-[#D62828] px-8 py-3 text-white hover:bg-[#A61E1E]">
                Shop Products
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="outline" className="rounded-full px-8 py-3">
                Back to Cart
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/cart">
            <Button variant="outline" className="mb-6 border-gray-300 bg-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>
          </Link>

          <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                  {error}
                </div>
              )}

              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-6 text-lg font-bold text-gray-900">
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-6 text-lg font-bold text-gray-900">
                  Delivery Address
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="Ibadan"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Delivery Zone *
                    </label>
                    <select
                      value={selectedZone?.name ?? ''}
                      onChange={(e) => {
                        const zone =
                          DELIVERY_ZONES.find(
                            (z) => z.name === e.target.value,
                          ) ?? null

                        setSelectedZone(zone)
                      }}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select your delivery zone</option>
                      {DELIVERY_ZONES.map((zone) => (
                        <option key={zone.name} value={zone.name}>
                          {zone.name} — ₦{zone.fee.toLocaleString()}
                        </option>
                      ))}
                    </select>

                    {selectedZone && (
                      <p className="mt-2 text-sm font-medium text-green-700">
                        Delivery fee: ₦{selectedZone.fee.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !selectedZone}
                className="w-full bg-blue-600 py-3 text-lg text-white hover:bg-blue-700"
              >
                {loading ? 'Processing...' : 'Continue to Payment'}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                Order Summary
              </h3>

              <div className="mb-6 space-y-3 border-b border-gray-200 pb-6">
                {items.map((item) => {
                  const safeImage = item.image || '/products/full-chicken.jpg'

                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          src={safeImage}
                          alt={item.name}
                          fill
                          className="rounded-lg object-cover"
                          sizes="48px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-700">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="flex-shrink-0 font-semibold text-green-600">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-semibold text-green-600">
                    ₦{total.toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-600">Delivery</p>
                  <p className="font-semibold">
                    {selectedZone ? (
                      `₦${deliveryFee.toLocaleString()}`
                    ) : (
                      <span className="text-sm text-slate-400">
                        Select zone
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <p className="font-bold text-gray-900">Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₦{grandTotal.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-center text-sm text-gray-700">
                <p className="mb-1 font-semibold">Secure Checkout</p>
                <p className="text-xs">Powered by Paystack</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}