import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const { orderId } = await searchParams

  if (!orderId) {
    return <p>No order ID provided</p>
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  })

  if (!order) {
    return <p>Order not found</p>
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you, {order.customerName}. Your payment was confirmed.
          </p>

          <p className="mb-6 font-mono text-sm">
            Order ID: {order.id}
          </p>

          <p className="text-2xl font-bold text-blue-600 mb-8">
            ₦{order.totalAmount.toLocaleString()}
          </p>

          <div className="flex gap-4">
            <Link href="/" className="flex-1">
              <Button className="w-full bg-blue-600 text-white">
                Back to Home
              </Button>
            </Link>

            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}