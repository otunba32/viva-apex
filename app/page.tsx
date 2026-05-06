import { Suspense } from 'react'
import HeroSection from '@/components/HeroSection'
import CategoriesSection from '@/components/CategoriesSection'
import FeaturedProductsSection from '@/components/FeaturedProductsSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'

// Skeleton for featured products while they load
function FeaturedProductsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="h-8 w-48 rounded bg-gray-200 animate-pulse mb-8" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl bg-gray-200 h-72" />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HeroSection is static — renders instantly */}
      <HeroSection />
      <CategoriesSection />

      {/* FeaturedProducts fetches from DB — wrap in Suspense so rest of page doesn't wait */}
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProductsSection />
      </Suspense>

      <AboutSection />
      <ContactSection />
    </main>
  )
}