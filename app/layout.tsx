import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AnimatePresence } from 'framer-motion'
import { Providers } from './providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Viva Frozen Foods',
  description:
    'Order premium frozen foods online and get fast delivery to your doorstep',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>
        <Providers>

          {/* Global Header */}
          <Header />

          {/* Page content */}
          <main className="min-h-screen">
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </main>

          {/* Global Footer */}
          <Footer />

        </Providers>

        <Analytics />
      </body>
    </html>
  )
}