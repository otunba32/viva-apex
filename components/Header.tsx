'use client'

import Link from 'next/link'
import { brand } from '@/lib/home-data'
import { CartIcon } from './CartIcon'
import { useRouter } from 'next/navigation'



export default function Header() {

  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-black text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #A61E1E 0%, #D62828 55%, #F77F00 100%)' }}
          >
            VA
          </div>
          <div>
            <p className="text-sm font-black leading-none text-slate-900 sm:text-base">
              VIVA APEX
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Frozen Foods
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          <Link href="/" className="text-md font-semibold text-slate-700 transition hover:text-slate-900">
            Home
          </Link>
          <Link href="/products" className="text-md font-semibold text-slate-700 transition hover:text-slate-900">
            Products
          </Link>
          <a href="#about" className="text-md font-semibold text-slate-700 transition hover:text-slate-900">
            About Us
          </a>
          <a href="#contact" className="text-md font-semibold text-slate-700 transition hover:text-slate-900">
            Contact Us
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 md:flex">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-slate-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m1.85-4.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
            </svg>
            <input
              type="text"
              placeholder="Search chicken, turkey, fish..."
              className="w-56 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  router.push(`/products?search=${e.currentTarget.value}`)
                }
              }}
            />
          </div>

          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
            style={{ backgroundColor: brand.red }}
          >
            Shop Now
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <CartIcon />
        </div>
      </div>
    </header>
  )
}