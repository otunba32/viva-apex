'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { PageTransition } from '@/components/PageTransition'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'

type PaystackTransaction = {
  reference: string
  status?: 'success' | 'failed'
  trans?: string
  trxref?: string
  message?: string
}

type PaystackSetupOptions = {
  key: string
  email: string
  amount: number
  ref: string
  onClose: () => void
  onSuccess: (transaction: PaystackTransaction) => void
}

type PaystackHandler = { openIframe: () => void }
type PaystackPop = { setup: (options: PaystackSetupOptions) => PaystackHandler }

declare global {
  interface Window { PaystackPop?: PaystackPop }
}

type InitializedPayment = {
  email: string
  amount: number
  reference: string
}

type InitializeResponse =
  | { success: true; data: InitializedPayment }
  | { success: false; error?: string }

type VerifyResponse =
  | { success: true }
  | { success: false; error?: string }

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const { clearCart } = useCart()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<InitializedPayment | null>(null)
  const [statusMessage, setStatusMessage] = useState('Please wait while we initialize your payment...')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load Paystack script once
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.paystack.co/v1/inline.js"]',
    )
    if (existing) return
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    document.body.appendChild(script)
    return () => { script.remove() }
  }, [])

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  // Initialize payment
  useEffect(() => {
    if (!orderId) { setError('No order ID provided'); return }

    const initializePayment = async () => {
      try {
        setError(null)
        setLoading(true)

        const res = await fetch('/api/payment/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        })

        const data = (await res.json()) as InitializeResponse

        if (data.success) {
          setPaymentData(data.data)
          setTimeout(() => startPayment(data.data), 300)
        } else {
          setError(data.error || 'Failed to initialize payment')
        }
      } catch (err) {
        console.error(err)
        setError('An error occurred while initializing payment')
      } finally {
        setLoading(false)
      }
    }

    initializePayment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  // ✅ Poll order status until PAID or timeout
  const startPolling = () => {
    if (!orderId) return
    setStatusMessage('Confirming your payment...')

    let attempts = 0
    const maxAttempts = 20 // 20 × 3s = 60s timeout

    pollRef.current = setInterval(async () => {
      attempts++
      try {
        const res = await fetch(`/api/orders/status?orderId=${orderId}`)
        const data = await res.json()

        if (data.success && data.data.status === 'PAID') {
          if (pollRef.current) clearInterval(pollRef.current)
          clearCart()
          router.push(`/success?orderId=${encodeURIComponent(orderId)}`)
          return
        }

        if (data.success && data.data.status === 'FAILED') {
          if (pollRef.current) clearInterval(pollRef.current)
          setError('Payment failed. Please try again.')
          return
        }
      } catch (err) {
        console.error('[Poll] Error:', err)
      }

      if (attempts >= maxAttempts) {
        if (pollRef.current) clearInterval(pollRef.current)
        setError('Payment confirmation timed out. If you were charged, please contact us with your order ID.')
      }
    }, 3000)
  }

  const startPayment = (payment: InitializedPayment) => {
    if (!orderId) { setError('No order ID provided'); return }

    const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
    if (!key) {
      setError('Paystack public key is missing.')
      return
    }
    if (!window.PaystackPop) {
      setError('Payment gateway not loaded. Please refresh and try again.')
      return
    }

    const handler = window.PaystackPop.setup({
      key,
      email: payment.email,
      amount: Math.round(payment.amount * 100), // naira → kobo
      ref: payment.reference,
      onClose: () => {
        // ✅ Start polling when popup closes — catches both success and webhook-confirmed payments
        startPolling()
      },
      onSuccess: (transaction) => {
        // ✅ Also verify directly if onSuccess fires
        verifyPayment(transaction.reference)
      },
    })

    handler.openIframe()
  }

  const verifyPayment = async (reference: string) => {
    if (!orderId) return

    try {
      setError(null)
      setLoading(true)
      setStatusMessage('Verifying your payment...')

      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, orderId }),
      })

      const data = (await res.json()) as VerifyResponse

      if (data.success) {
        clearCart()
        router.push(`/success?orderId=${encodeURIComponent(orderId)}`)
      } else {
        // Fall back to polling in case webhook already handled it
        startPolling()
      }
    } catch (err) {
      console.error(err)
      startPolling() // fallback to polling
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto px-4"
        >
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            {error ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">✕</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Try Again
                </Button>
              </>
            ) : loading || !paymentData ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' as const }}
                  className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
                <p className="text-gray-600">{statusMessage}</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">💳</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Payment</h2>
                <p className="text-gray-600 mb-6">
                  A payment window should have opened. If it didn&apos;t, click below.
                </p>
                <Button
                  onClick={() => startPayment(paymentData)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Open Payment
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}