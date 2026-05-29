'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'

type PaystackTransaction = {
  reference: string
}

type PaystackSetupOptions = {
  key: string
  email: string
  amount: number
  ref: string
  onClose: () => void
  callback: (transaction: PaystackTransaction) => void
}

type PaystackHandler = {
  openIframe: () => void
}

type PaystackPop = {
  setup: (options: PaystackSetupOptions) => PaystackHandler
}

declare global {
  interface Window {
    PaystackPop?: PaystackPop
  }
}

type InitializedPayment = {
  email: string
  amount: number
  reference: string
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()

  const orderId = searchParams.get('orderId')

  const initializedRef = useRef(false)
  const [paymentData, setPaymentData] = useState<InitializedPayment | null>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPaystackScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.PaystackPop) {
        resolve()
        return
      }

      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src="https://js.paystack.co/v1/inline.js"]',
      )

      if (existingScript) {
        existingScript.onload = () => resolve()
        existingScript.onerror = () => reject()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject()

      document.body.appendChild(script)
    })
  }

  const verifyPayment = async (reference: string) => {
    if (!orderId) return

    try {
      setVerifying(true)
      setError(null)

      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, orderId }),
      })

      const data = await res.json()

      if (data.success) {
        clearCart()
        router.replace(`/success?orderId=${encodeURIComponent(orderId)}`)
      } else {
        setError(data.error || 'Payment verification failed.')
      }
    } catch (err) {
      console.error(err)
      setError('Unable to verify payment. Please contact support if you were charged.')
    } finally {
      setVerifying(false)
    }
  }

  const pollOrderStatus = () => {
    if (!orderId) return

    let attempts = 0
    const maxAttempts = 20

    const interval = setInterval(async () => {
      attempts++

      try {
        const res = await fetch(`/api/orders/status?orderId=${orderId}`)
        const data = await res.json()

        if (data.success && data.data.status === 'PAID') {
          clearInterval(interval)
          clearCart()
          router.replace(`/success?orderId=${encodeURIComponent(orderId)}`)
          return
        }

        if (data.success && data.data.status === 'FAILED') {
          clearInterval(interval)
          setError('Payment failed. Please try again.')
          return
        }
      } catch (err) {
        console.error(err)
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval)
        setError(
          'Payment confirmation timed out. If you were charged, please contact support with your order ID.',
        )
      }
    }, 3000)
  }

  const openPayment = async (payment: InitializedPayment) => {
    const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

    if (!key) {
      setError('Paystack public key is missing.')
      return
    }

    try {
      await loadPaystackScript()

      if (!window.PaystackPop) {
        setError('Payment gateway failed to load.')
        return
      }

      const handler = window.PaystackPop.setup({
        key,
        email: payment.email,
        amount: Math.round(payment.amount * 100),
        ref: payment.reference,
        callback: (transaction) => {
          verifyPayment(transaction.reference)
        },
        onClose: () => {
          setVerifying(true)
          pollOrderStatus()
        },
      })

      handler.openIframe()
    } catch (err) {
      console.error(err)
      setError('Could not load payment gateway. Please try again.')
    }
  }

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided.')
      setLoading(false)
      return
    }

    if (initializedRef.current) return
    initializedRef.current = true

    const initializePayment = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('/api/payment/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        })

        const data = await res.json()

        if (!data.success) {
          setError(data.error || 'Failed to initialize payment.')
          return
        }

        setPaymentData(data.data)
        await openPayment(data.data)
      } catch (err) {
        console.error(err)
        setError('An error occurred while initializing payment.')
      } finally {
        setLoading(false)
      }
    }

    initializePayment()
  }, [orderId])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        {error ? (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-3xl">✕</span>
            </div>

            <h1 className="mb-3 text-2xl font-bold text-gray-900">
              Payment Not Completed
            </h1>

            <p className="mb-6 text-gray-600">{error}</p>

            <div className="space-y-3">
              {paymentData && (
                <Button
                  onClick={() => openPayment(paymentData)}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  Try Payment Again
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => router.push('/checkout')}
                className="w-full"
              >
                Back to Checkout
              </Button>
            </div>
          </>
        ) : loading || verifying ? (
          <>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              {verifying ? 'Verifying Payment' : 'Initializing Payment'}
            </h1>

            <p className="text-gray-600">
              Please do not close this page.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <span className="text-3xl">💳</span>
            </div>

            <h1 className="mb-3 text-2xl font-bold text-gray-900">
              Complete Payment
            </h1>

            <p className="mb-6 text-gray-600">
              If the payment window did not open, click below.
            </p>

            {paymentData && (
              <Button
                onClick={() => openPayment(paymentData)}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Open Payment
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}