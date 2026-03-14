import Image from 'next/image'
import { brand } from '@/lib/home-data'

export default function AboutSection() {
  return (
    <section id="about" className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-3 shadow-xl">
          <div className="relative h-[420px] overflow-hidden rounded-[1.5rem] bg-slate-100">
            <Image src="/products/turkey-wings.jpg" alt="About Viva Apex Frozen Foods" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: brand.orange }}>
            About Us
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            A trusted frozen food brand serving Bodija and beyond
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            VIVA APEX FROZEN FOODS supplies quality frozen chicken, turkey and fish to homes,
            families, food vendors and businesses.
          </p>
        </div>
      </div>
    </section>
  )
}