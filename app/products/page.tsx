'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Fish, Drumstick, Beef, Search, SlidersHorizontal } from 'lucide-react'
import { PageTransition } from '@/components/PageTransition'
import { StaggerContainer, StaggerItem } from '@/components/StaggerContainer'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  price: number
  image: string
  slug: string
  stock: number
  category: string
  weight?: string | null
  description?: string | null
}

type FilterKey = 'all' | 'chicken' | 'turkey' | 'fish'

const FILTERS: {
  key: FilterKey
  label: string
  icon?: React.ComponentType<{ className?: string }>
}[] = [
  { key: 'all', label: 'All' },
  { key: 'chicken', label: 'Chicken', icon: Drumstick },
  { key: 'turkey', label: 'Turkey', icon: Beef },
  { key: 'fish', label: 'Fish', icon: Fish },
]

const brand = {
  red: '#D62828',
  deepRed: '#A61E1E',
  orange: '#F77F00',
  cream: '#FFF7ED',
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()

        if (data.success) {
          setProducts(data.data)
        } else {
          setError('Failed to fetch products')
        }
      } catch (err) {
        setError('An error occurred while fetching products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let result = products

    if (activeFilter !== 'all') {
      result = result.filter((product) => product.category === activeFilter)
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase()
      result = result.filter((product) =>
        [
          product.name,
          product.category,
          product.description ?? '',
          product.weight ?? '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(query),
      )
    }

    return result
  }, [products, activeFilter, searchTerm])

  const counts = useMemo(
    () => ({
      all: products.length,
      chicken: products.filter((p) => p.category === 'chicken').length,
      turkey: products.filter((p) => p.category === 'turkey').length,
      fish: products.filter((p) => p.category === 'fish').length,
    }),
    [products],
  )

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-white pt-6 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-sm"
          >
            <div
              className="absolute inset-0 opacity-100"
              style={{
                background:
                  'linear-gradient(135deg, rgba(214,40,40,0.06) 0%, rgba(247,127,0,0.08) 100%)',
              }}
            />
            <div className="relative px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
              <div className="max-w-3xl">
                <p
                  className="mb-3 text-sm font-semibold uppercase tracking-[0.25em]"
                  style={{ color: brand.orange }}
                >
                  All Products
                </p>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                  Fresh frozen food for every kitchen
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  Browse our complete selection of chicken, turkey and fish.
                  Shop for family meals, events, food prep and bulk supply with
                  a cleaner, modern buying experience.
                </p>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                  <Search className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                  <SlidersHorizontal className="h-4 w-4" />
                  {filteredProducts.length} product
                  {filteredProducts.length === 1 ? '' : 's'} found
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.key
              const Icon = filter.icon

              return (
                <Button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  style={
                    isActive
                      ? {
                          background:
                            'linear-gradient(135deg, #A61E1E 0%, #D62828 60%, #F77F00 100%)',
                        }
                      : undefined
                  }
                >
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  {filter.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {counts[filter.key]}
                  </span>
                </Button>
              ) 
            })}
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                className="h-12 w-12 rounded-full border-4 border-orange-200 border-t-red-600"
              />
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <div className="mx-auto max-w-xl rounded-[1.5rem] border border-red-100 bg-red-50 px-6 py-8">
                <p className="text-lg font-semibold text-red-700">{error}</p>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="mt-10">
              <StaggerContainer>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {filteredProducts.map((product, index) => (
                    <StaggerItem key={product.id}>
                      <ProductCard {...product} index={index} />
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="mx-auto max-w-xl rounded-[1.5rem] border border-orange-100 bg-orange-50/60 px-6 py-10">
                <h3 className="text-2xl font-bold text-slate-900">
                  No products found
                </h3>
                <p className="mt-3 text-slate-600">
                  Try switching categories or searching with a different name.
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    setActiveFilter('all')
                    setSearchTerm('')
                  }}
                  className="mt-6 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                  style={{ backgroundColor: brand.red }}
                >
                  Reset filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}