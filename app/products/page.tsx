'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PageTransition } from '@/components/PageTransition'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

type Product = {
    id: string
    name: string
    slug: string
    price: number
    image: string | null
    description: string | null
    featured: boolean
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const { addItem } = useCart()

    useEffect(() => {
        fetch('/api/products')
            .then((r) => r.json())
            .then((data) => {
                setProducts(data.data ?? data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50 pt-8 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-10"
                    >
                        <h1 className="text-4xl font-bold text-gray-900">Our Products</h1>
                        <p className="mt-2 text-gray-500">Fresh frozen foods delivered to your door</p>
                    </motion.div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                                    <div className="h-48 bg-gray-200" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-24 text-gray-500">No products found.</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <Link href={`/products/${product.slug}`}>
                                        <div className="relative h-48 w-full bg-gray-100">
                                            <Image
                                                src={product.image ?? '/placeholder.png'}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                priority={index === 0}
                                            />
                                            {product.featured && (
                                                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="p-4">
                                        <Link href={`/products/${product.slug}`}>
                                            <h2 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug hover:text-blue-600 transition-colors line-clamp-2">
                                                {product.name}
                                            </h2>
                                        </Link>
                                        {product.description && (
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                                        )}
                                        <div className="mt-3 flex items-center justify-between gap-2">
                                            <span className="text-green-600 font-bold text-sm sm:text-base">
                                                ₦{product.price.toLocaleString()}
                                            </span>
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    addItem({
                                                        id: product.id,
                                                        name: product.name,
                                                        price: product.price,
                                                        image: product.image ?? '/placeholder.png',
                                                        slug: product.slug,
                                                        quantity: 1,
                                                    })
                                                }
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3"
                                            >
                                                <ShoppingCart className="w-3 h-3 mr-1" />
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    )
}