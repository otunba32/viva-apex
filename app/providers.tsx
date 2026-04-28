'use client'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { CartProvider } from '@/context/CartContext'
import { Suspense } from 'react'

// Lazy load framer-motion — it's heavy and not needed on first paint
const MotionWrapper = dynamic(() => import('./MotionWrapper'), { ssr: false })

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <CartProvider>
      <Suspense fallback={<div style={{ minHeight: '100%', flex: 1 }}>{children}</div>}>
        <MotionWrapper pathname={pathname}>
          {children}
        </MotionWrapper>
      </Suspense>
    </CartProvider>
  )
}