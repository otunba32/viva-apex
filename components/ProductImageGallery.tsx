'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { Button } from './ui/button'

interface ProductImageGalleryProps {
  images: string[]
  alt: string
}

export default function ProductImageGallery({
  images,
  alt,
}: ProductImageGalleryProps) {
  const safeImages = useMemo(() => images.filter(Boolean), [images])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: 'center center',
    transform: 'scale(1)',
  })

  const activeImage = safeImages[activeIndex] || '/products/full-chicken.jpg'

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1))
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)',
    })
  }

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)',
    })
  }

  return (
    <>
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div
            className="relative h-[360px] w-full cursor-zoom-in overflow-hidden bg-slate-100 sm:h-[460px] lg:h-[520px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsOpen(true)}
          >
            <Image
              src={activeImage}
              alt={alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-200 ease-out"
              style={zoomStyle}
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(true)
              }}
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-slate-800 shadow-md backdrop-blur transition hover:bg-white"
            >
              <ZoomIn className="h-4 w-4" />
              View
            </button>

            {safeImages.length > 1 && (
              <>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                  className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur transition hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                  className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur transition hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {safeImages.length > 1 && (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {safeImages.map((image, index) => {
              const isActive = index === activeIndex

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`relative overflow-hidden rounded-xl border transition ${
                    isActive
                      ? 'border-red-600 ring-2 ring-red-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="relative h-20 w-full bg-slate-100">
                    <Image
                      src={image}
                      alt={`${alt} ${index + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/85 p-4 backdrop-blur-sm">
          <div className="mx-auto flex h-full max-w-6xl flex-col">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-white/80">
                {activeIndex + 1} of {safeImages.length}
              </p>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden rounded-2xl bg-black">
              <div className="relative h-full w-full">
                <Image
                  src={activeImage}
                  alt={alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>

              {safeImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  <button
                    type="button"
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {safeImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
                {safeImages.map((image, index) => {
                  const isActive = index === activeIndex

                  return (
                    <button
                      key={`modal-${image}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`relative overflow-hidden rounded-xl border ${
                        isActive
                          ? 'border-white ring-2 ring-white/30'
                          : 'border-white/20'
                      }`}
                    >
                      <div className="relative h-16 w-full bg-slate-900">
                        <Image
                          src={image}
                          alt={`${alt} preview ${index + 1}`}
                          fill
                          sizes="100px"
                          className="object-cover"
                        />
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}