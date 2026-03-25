'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { PageTransition } from '@/components/PageTransition'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import ProductImageGallery from '@/components/ProductImageGallery'

interface Product {
  id: string
  name: string
  price: number
  description?: string | null
  image: string
  slug: string
  stock: number
  category: string
  weight?: string | null
  unit?: string | null
  nutrients?: string | null
  storage?: string | null
  images?: string[]
  available?: boolean
}

export default function ProductDetailsPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const slug = params.slug
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addedMessage, setAddedMessage] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products/${slug}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Product not found')
        }

        setProduct(data.data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred while fetching the product'
        )
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  useEffect(() => {
    if (!product || product.stock < 1) return

    setQuantity((prev) => {
      if (prev < 1) return 1
      if (prev > product.stock) return product.stock
      return prev
    })
  }, [product])

  const galleryImages = useMemo(() => {
    if (!product) return []

    return product.images && product.images.length > 0
      ? product.images
      : [product.image]
  }, [product])

  const isOutOfStock = !product || product.stock <= 0 || product.available === false
  const totalPrice = product ? product.price * quantity : 0

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
      quantity,
    })

    setAddedMessage(`${product.name} added to cart`)
    setTimeout(() => {
      router.push('/cart')
    }, 800)
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="h-12 w-12 rounded-full border-4 border-red-200 border-t-red-600"
          />
        </div>
      </PageTransition>
    )
  }

  if (error || !product) {
    return (
      <PageTransition>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
          <p className="mb-4 text-lg text-red-600">{error || 'Product not found'}</p>
          <Link href="/products">
            <Button className="bg-red-600 hover:bg-red-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pb-12 pt-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6">
            <Link href="/products">
              <Button variant="outline" className="border-gray-300 bg-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl bg-white p-6 shadow-md"
            >
              <ProductImageGallery images={galleryImages} alt={product.name} />

              <div className="rounded-2xl bg-white p-6 shadow-md mt-3">
                <h3 className="mb-4 text-xl font-semibold text-[#4d211b]">
                  Product Details
                </h3>

                <div className="space-y-4">
                  {product.weight && (
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium text-gray-900">{product.weight}</p>
                    </div>
                  )}

                  {product.unit && (
                    <div>
                      <p className="text-sm text-gray-500">Unit</p>
                      <p className="font-medium text-gray-900">{product.unit}</p>
                    </div>
                  )}

                  {product.nutrients && (
                    <div>
                      <p className="text-sm text-gray-500">Nutrients</p>
                      <p className="font-medium leading-7 text-gray-900">
                        {product.nutrients}
                      </p>
                    </div>
                  )}

                  {product.storage && (
                    <div>
                      <p className="text-sm text-gray-500">Storage</p>
                      <p className="font-medium leading-7 text-gray-900">
                        {product.storage}
                      </p>
                    </div>
                  )}

                  {!product.weight &&
                    !product.unit &&
                    !product.nutrients &&
                    !product.storage && (
                      <p className="text-gray-500">
                        More product details will be available soon.
                      </p>
                    )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="flex flex-col gap-6"
            >
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-600">
                  {product.category}
                </p>

                <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                  {product.name}
                </h1>

                {product.description ? (
                  <p className="text-base leading-7 text-gray-600">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-base leading-7 text-gray-500">
                    No product description available yet.
                  </p>
                )}
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-md">
                <div className="mb-5">
                  <p className="mb-2 text-sm text-gray-600">Price</p>
                  <p className="text-4xl font-bold text-green-600">
                    ₦{product.price.toLocaleString()}
                  </p>
                  {product.unit && (
                    <p className="mt-1 text-sm text-gray-500">Unit: {product.unit}</p>
                  )}
                </div>

                {product.weight && (
                  <div className="mb-5">
                    <p className="mb-2 text-sm text-gray-600">Weight</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {product.weight}
                    </p>
                  </div>
                )}

                <div className="mb-5">
                  <p className="mb-2 text-sm text-gray-600">Availability</p>
                  <p
                    className={`text-lg font-semibold ${
                      isOutOfStock ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}
                  </p>
                </div>

                {!isOutOfStock && (
                  <div className="mb-6">
                    <label className="mb-2 block text-sm text-gray-600">
                      Quantity
                    </label>

                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      >
                        −
                      </Button>

                      <span className="w-12 text-center text-2xl font-semibold">
                        {quantity}
                      </span>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setQuantity((prev) => Math.min(product.stock, prev + 1))
                        }
                      >
                        +
                      </Button>
                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                      Total: ₦{totalPrice.toLocaleString()}
                    </p>
                  </div>
                )}

                {addedMessage && (
                  <div className="mb-4 flex items-center rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {addedMessage}
                  </div>
                )}

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="w-full bg-red-600 py-3 text-lg text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </motion.div>
              </div>

              

              <div className="rounded-2xl bg-red-50 p-6">
                <h3 className="mb-4 font-semibold text-gray-900">Why Choose Us?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-3 font-bold text-red-600">✓</span>
                    Fast and reliable delivery
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold text-red-600">✓</span>
                    Premium quality frozen products
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold text-red-600">✓</span>
                    Secure and easy payment
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold text-red-600">✓</span>
                    Friendly customer support
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}