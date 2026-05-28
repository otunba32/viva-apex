'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { CartProvider } from '@/context/CartContext'
import { Suspense, useState } from 'react'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Lazy load framer-motion — it's heavy and not needed on first paint
const MotionWrapper = dynamic(() => import('./MotionWrapper'), {
  ssr: false,
})

export function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Suspense
          fallback={
            <div style={{ minHeight: '100%', flex: 1 }}>
              {children}
            </div>
          }
        >
          <MotionWrapper pathname={pathname}>
            {children}
          </MotionWrapper>
        </Suspense>
      </CartProvider>
    </QueryClientProvider>
  )
}