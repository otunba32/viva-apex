'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders?orderId=${orderId}`);
        const data = await response.json();

        if (data.success) {
          setOrder(data.data);
        } else {
          setError('Failed to fetch order details');
        }
      } catch (err) {
        setError('An error occurred while fetching order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const successVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  const checkmarkVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: {
        duration: 0.6,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-8 text-center"
            >
              <p className="text-red-600 text-lg mb-6">{error}</p>
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Back to Home
                </Button>
              </Link>
            </motion.div>
          ) : loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
              />
            </motion.div>
          ) : order ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Success Icon */}
              <motion.div
                variants={successVariants}
                initial="hidden"
                animate="visible"
                className="w-20 h-20 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center"
              >
                <motion.svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  variants={checkmarkVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                    variants={checkmarkVariants}
                    initial="hidden"
                    animate="visible"
                  />
                </motion.svg>
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Order Placed Successfully!
                </h1>
                <p className="text-lg text-gray-600">
                  Thank you for your purchase. Your order has been confirmed.
                </p>
              </motion.div>

              {/* Order Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-lg shadow-md p-8 mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order ID</p>
                      <p className="font-mono text-lg font-semibold text-gray-900">
                        {orderId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Delivery Information
                    </h3>
                    <div className="space-y-3 text-gray-700">
                      <p>
                        <span className="font-medium">Name:</span> {order.customerName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {order.customerEmail}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span> {order.address},
                        {order.city}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-gray-900">Total Amount</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₦{order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                      <p className="text-gray-700">
                        <span className="font-medium">Status:</span> Payment Confirmed
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-blue-50 rounded-lg p-8 mb-8"
              >
                <h3 className="font-semibold text-gray-900 mb-4">What`&apos;`s Next?</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-bold">1</span>
                    <span>A confirmation email has been sent to {order.customerEmail}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-bold">2</span>
                    <span>Your order will be processed and shipped within 24-48 hours</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 font-bold">3</span>
                    <span>
                      You will receive a tracking number via email once your order ships
                    </span>
                  </li>
                </ul>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-4 sm:space-y-0 sm:flex gap-4"
              >
                <Link href="/" className="flex-1">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Back to Home
                  </Button>
                </Link>
                <Link href="/products" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-900 hover:bg-gray-50"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </PageTransition>
  );
}
