'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Fish, Snowflake } from 'lucide-react'
import { brand, container, item } from '@/lib/home-data'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  image: string
  category: string
}

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products?featured=true&limit=3')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProducts(data.data)
      })
      .catch(console.error)
  }, [])

  return (
    <section className="py-16" style={{ backgroundColor: brand.cream }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: brand.deepRed }}>
              Featured Products
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Customer favorites
            </h2>
          </div>
          <Link href="/products" className="hidden text-sm font-semibold text-slate-700 sm:inline-flex">
            View all products <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="grid gap-6 md:grid-cols-3"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={item}
              className="overflow-hidden rounded-[1.8rem] border border-orange-100 bg-white shadow-sm"
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                  {product.category === 'fish'
                    ? <Fish className="h-3.5 w-3.5" />
                    : <Snowflake className="h-3.5 w-3.5" />
                  }
                  <span className="capitalize">{product.category}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-2xl font-black" style={{ color: brand.deepRed }}>
                    ₦{product.price.toLocaleString()}
                  </p>
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white transition"
                    style={{ backgroundColor: brand.red }}
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}