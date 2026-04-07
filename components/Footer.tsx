import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <p className="text-lg font-black text-slate-900">VIVA APEX FROZEN FOODS</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Premium frozen chicken, turkey and fish delivered with trust, speed and convenience.
            </p>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Quick Links</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <Link href="/">Home</Link>
              <Link href="/products">Products</Link>
              <a href="#about">About Us</a>
              <a href="#contact">Contact Us</a>
            </div>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Categories</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <Link href="/products?category=chicken">Chicken</Link>
              <Link href="/products?category=turkey">Turkey</Link>
              <Link href="/products?category=fish">Fish</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Contact</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <p>Morounranti Complex, Bodija, Ibadan</p>
              <p>08068052368</p>
              <p>08132555123</p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 px-4 py-5 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          © 2026 VIVA APEX FROZEN FOODS. All rights reserved.
        </div>
      </footer>
  )
}