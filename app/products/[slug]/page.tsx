'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { PageTransition } from '@/components/PageTransition'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import ProductImageGallery from '@/components/ProductImageGallery'

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  slug: string
  stock: number
  category: string
  weight?: string | null
  nutrients?: string | null
  storage?: string | null
  images?: string[]
}

export default function ProductDetailsPage() {
  const params = useParams()
  const slug = params.slug as string
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${slug}`)
        const data = await response.json()

        if (data.success) {
          setProduct(data.data)
        } else {
          setError('Product not found')
        }
      } catch (err) {
        setError('An error occurred while fetching the product')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
      quantity,
    })
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600"
          />
        </div>
      </PageTransition>
    )
  }

  if (error || !product) {
    return (
      <PageTransition>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
          <p className="mb-4 text-lg text-red-600">{error || 'Product not found'}</p>
          <Link href="/products">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </PageTransition>
    )
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image]

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-8 flex items-center space-x-2 text-sm text-gray-600"
          >
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-900">
              Products
            </Link>
            <span>/</span>
            <span>{product.name}</span>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl bg-white p-6 shadow-md"
            >
              <ProductImageGallery
                images={galleryImages}
                alt={product.name}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <div className="mb-6">
                <p className="mb-2 text-sm font-semibold capitalize text-blue-600">
                  {product.category}
                </p>
                <h1 className="mb-4 text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="mb-6 text-lg text-gray-600">
                  {product.description}
                </p>
              </div>

              <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
                <div className="mb-4">
                  <p className="mb-2 text-sm text-gray-600">Price</p>
                  <p className="text-4xl font-bold text-green-600">
                    ₦{product.price.toLocaleString()}
                  </p>
                </div>

                {product.weight && (
                  <div className="mb-4">
                    <p className="mb-2 text-sm text-gray-600">Weight</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {product.weight}
                    </p>
                  </div>
                )}

                <div className="mb-6">
                  <p className="mb-2 text-sm text-gray-600">Availability</p>
                  <p
                    className={`text-lg font-semibold ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                </div>

                {product.stock > 0 && (
                  <div className="mb-6">
                    <label className="mb-2 block text-sm text-gray-600">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        variant="outline"
                      >
                        −
                      </Button>
                      <span className="w-12 text-center text-2xl font-semibold">
                        {quantity}
                      </span>
                      <Button
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        variant="outline"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full bg-blue-600 py-3 text-lg text-white hover:bg-blue-700"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </motion.div>
              </div>

              <div className="rounded-2xl bg-blue-50 p-6">
                <h3 className="mb-4 font-semibold text-gray-900">Why Choose Us?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-3 font-bold text-blue-600">✓</span>
                    Fast and reliable delivery
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold text-blue-600">✓</span>
                    Premium quality frozen products
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold text-blue-600">✓</span>
                    Secure and easy payment
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold text-blue-600">✓</span>
                    24/7 customer support
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