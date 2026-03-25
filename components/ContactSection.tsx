import { brand } from '@/lib/home-data'
import { Button } from './ui/button'
import { Phone, MapPin } from 'lucide-react'

export default function ContactSection() {
  return (
    <section id="contact" className="px-4 pb-16 sm:px-6 lg:px-8">
      <div
        className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-12 text-white shadow-2xl sm:px-10 lg:grid lg:grid-cols-[1fr_0.9fr] lg:gap-10 lg:py-16"
        style={{
          background:
            'linear-gradient(135deg, #A61E1E 0%, #D62828 50%, #F77F00 100%)',
        }}
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
            Contact Us
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Ready to place an order?
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-8 text-white/85">
            Reach out for retail orders, bulk purchases, pricing enquiries and delivery support.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {/* Phone */}
            <div className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-white/80">
                <Phone className="h-4 w-4" />
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Phone
                </p>
              </div>

              <p className="mt-3 text-lg font-bold">08068052368</p>
              <p className="text-lg font-bold">08132555123</p>
            </div>

            {/* Address */}
            <div className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="h-4 w-4" />
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Address
                </p>
              </div>

              <p className="mt-3 text-lg font-bold">
                Morounranti Complex, Bodija, Ibadan
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[1.8rem] bg-white p-6 text-slate-900 lg:mt-0">
          <h3 className="text-2xl font-black">Send us a quick message</h3>

          <div className="mt-5 grid gap-4">
            <input
              type="text"
              placeholder="Your name"
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-red-400"
            />

            <input
              type="tel"
              placeholder="Phone number"
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-red-400"
            />

            <textarea
              placeholder="Tell us what you want to order"
              className="min-h-[130px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-400"
            />

            <Button
              className="inline-flex h-12 items-center justify-center rounded-2xl text-sm font-semibold text-white transition hover:opacity-95"
              style={{ backgroundColor: brand.red }}
            >
              Send Enquiry
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}