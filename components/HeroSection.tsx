'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Phone, Truck } from 'lucide-react'
import { brand, container, item, stats } from '@/lib/home-data'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #A61E1E 0%, #D62828 45%, #F77F00 100%)',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_30%)]" />

      <div className="relative mx-auto grid min-h-[92vh] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <motion.div initial="hidden" animate="visible" variants={container} className="max-w-2xl text-white">
          <motion.h1 variants={item} className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Premium frozen foods for homes, events and businesses.
          </motion.h1>

          <motion.p variants={item} className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
            Shop fresh frozen chicken, turkey and fish from a trusted brand.
            Order easily, buy in units or bulk, and enjoy a clean, more modern way to restock.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold shadow-lg transition hover:opacity-95"
              style={{ color: brand.deepRed }}
            >
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              Contact Us
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-5 text-sm text-white/85">
            <div className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Bodija, Ibadan
            </div>
            <div className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Fast delivery available
            </div>
            <div className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Retail & bulk orders
            </div>
          </motion.div>

          <motion.div variants={item} className="mt-10 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-white/75">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative"
        >
          <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -right-8 bottom-10 h-28 w-28 rounded-full bg-orange-200/40 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/95 p-3 shadow-2xl">
            <div className="relative h-[520px] overflow-hidden rounded-[1.6rem] bg-slate-100">
              <Image
                src="/products/full-chicken.jpg"
                alt="Viva Apex frozen foods"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}