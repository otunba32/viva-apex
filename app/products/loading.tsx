// app/products/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-white pt-6 pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse rounded-[2rem] bg-gray-200 h-52 mb-8" />
        <div className="flex gap-3 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-24 rounded-full bg-gray-200 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-gray-200 h-72" />
          ))}
        </div>
      </div>
    </div>
  )
}