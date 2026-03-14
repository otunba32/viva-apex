'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { brand, categories, container, item } from '@/lib/home-data'

export default function CategoriesSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: brand.orange }}>
            Product Categories
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Everything you need in one place
          </h2>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={container} className="grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <motion.div key={category.title} variants={item}>
              <Link href={category.href} className="group block overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-72 overflow-hidden">
                  <Image src={category.image} alt={category.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="mb-2 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
                      {category.subtitle}
                    </p>
                    <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}