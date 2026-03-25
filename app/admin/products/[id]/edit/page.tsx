'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type FormState = {
  name: string
  slug: string
  price: string
  image: string
  stock: string
  category: string
  weight: string
  unit: string
  description: string
  nutrients: string
  storage: string
  featured: boolean
  available: boolean
}

const initialState: FormState = {
  name: '',
  slug: '',
  price: '',
  image: '',
  stock: '',
  category: 'chicken',
  weight: '',
  unit: '',
  description: '',
  nutrients: '',
  storage: '',
  featured: false,
  available: true,
}

export default function EditProductPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const productId = params.id

  const [form, setForm] = useState<FormState>(initialState)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const updateField = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }))
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`/api/admin/products/${productId}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch product')
        }

        const product = data.data

        setForm({
          name: product.name || '',
          slug: product.slug || '',
          price: String(product.price ?? ''),
          image: product.image || '',
          stock: String(product.stock ?? ''),
          category: product.category || 'chicken',
          weight: product.weight || '',
          unit: product.unit || '',
          description: product.description || '',
          nutrients: product.nutrients || '',
          storage: product.storage || '',
          featured: product.featured ?? false,
          available: product.available ?? true,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    try {
      setUploading(true)
      setError('')
      setSuccess('')

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      setForm((prev) => ({
        ...prev,
        image: data.url,
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (
      !form.name.trim() ||
      !form.slug.trim() ||
      !form.price.trim() ||
      !form.image.trim() ||
      !form.stock.trim() ||
      !form.category.trim()
    ) {
      setError('Please fill in all required fields and upload an image')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.image ? [form.image] : [],
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log('PATCH RESPONSE:', data)

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update product')
      }

      setSuccess('Product updated successfully')

      setTimeout(() => {
        router.push('/admin/products')
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-slate-600">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
        <p className="mt-2 text-slate-600">
          Update your product information.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Product Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Price
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Stock
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => updateField('stock', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              >
                <option value="chicken">Chicken</option>
                <option value="turkey">Turkey</option>
                <option value="fish">Fish</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Weight
              </label>
              <input
                type="text"
                value={form.weight}
                onChange={(e) => updateField('weight', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Unit
              </label>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => updateField('unit', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <input
                id="featured"
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                Featured product
              </label>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <input
                id="available"
                type="checkbox"
                checked={form.available}
                onChange={(e) => updateField('available', e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="available" className="text-sm font-medium text-slate-700">
                Available for sale
              </label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Upload Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />

            {uploading && (
              <p className="mt-2 text-sm text-slate-500">Uploading image...</p>
            )}

            {form.image && (
              <img
                src={form.image}
                alt="Uploaded preview"
                className="mt-4 h-40 w-40 rounded-xl object-cover"
              />
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="min-h-[120px] w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nutrients
            </label>
            <input
              type="text"
              value={form.nutrients}
              onChange={(e) => updateField('nutrients', e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Storage
            </label>
            <input
              type="text"
              value={form.storage}
              onChange={(e) => updateField('storage', e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <Button
            type="submit"
            disabled={saving || uploading}
            className="rounded-xl bg-red-600 px-6 py-3 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Updating...' : uploading ? 'Uploading...' : 'Update Product'}
          </Button>
        </form>
      </div>
    </div>
  )
}