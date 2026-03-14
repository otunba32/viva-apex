import { brand } from '@/lib/home-data'

export default function ContactSection() {
  return (
    <section id="contact" className="px-4 pb-16 sm:px-6 lg:px-8">
      <div
        className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-12 text-white shadow-2xl sm:px-10 lg:grid lg:grid-cols-[1fr_0.9fr] lg:gap-10 lg:py-16"
        style={{ background: 'linear-gradient(135deg, #A61E1E 0%, #D62828 50%, #F77F00 100%)' }}
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
            Contact Us
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Ready to place an order?
          </h2>
        </div>

        <div className="mt-10 rounded-[1.8rem] bg-white p-6 text-slate-900 lg:mt-0">
          <h3 className="text-2xl font-black">Send us a quick message</h3>
          <div className="mt-5 grid gap-4">
            <input type="text" placeholder="Your name" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-red-400" />
            <input type="tel" placeholder="Phone number" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-red-400" />
            <textarea placeholder="Tell us what you want to order" className="min-h-[130px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-400" />
            <button className="inline-flex h-12 items-center justify-center rounded-2xl text-sm font-semibold text-white transition hover:opacity-95" style={{ backgroundColor: brand.red }}>
              Send Enquiry
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}