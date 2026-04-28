import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from './providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  display: 'swap', // prevent font blocking render
})

export const metadata: Metadata = {
  title: 'Viva Frozen Foods',
  description:
    'Order premium frozen foods online and get fast delivery to your doorstep',
  generator: 'Next.js',
  other: {
    'color-scheme': 'light',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains to reduce latency */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://api.paystack.co" />
      </head>
      <body className={`${geist.className} antialiased`}>
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>

        <Analytics />
      </body>
    </html>
  )
}