'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { adminFetch } from '@/lib/adminFetch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  image: string
  stock: number
  category: string
  weight?: string | null
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Basic admin auth guard
  useEffect(() => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    const authed = sessionStorage.getItem('adminAuth')
    if (authed === adminPassword) return

    const input = prompt('Enter admin password:')
    if (input !== adminPassword) {
      router.push('/')
    } else {
      sessionStorage.setItem('adminAuth', input)
    }
  }, [router])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await adminFetch('/api/admin/products')
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch products')
      }
      setProducts(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      const response = await adminFetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete product')
      }
      setProducts((prev) => prev.filter((product) => product.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Products</h1>
            <p className="mt-2 text-slate-600">
              Manage your inventory, pricing and stock.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 p-6 text-red-700 shadow-sm">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">No products found.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b bg-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Product</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Category</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Price</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Stock</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Weight</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b last:border-b-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                            <Image
                              src={product.image || '/placeholder.png'}
                              alt={product.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{product.name}</p>
                            <p className="text-sm text-slate-500">{product.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold capitalize text-orange-700">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-900">
                        ₦{product.price.toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-semibold ${
                            product.stock > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {product.weight || '-'}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                type="button"
                                disabled={deletingId === product.id}
                                className="inline-flex items-center rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {deletingId === product.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete &quot;{product.name}&quot;?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. The product will be
                                  permanently removed from your inventory.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}