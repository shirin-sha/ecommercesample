'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { CardContent, CardHeader } from '@/components/ui/Card'

interface ProductFormData {
  name: string
  description: string
  price: string
  originalPrice: string
  category: string
  image: string
  stockQuantity: string
  inStock: boolean
  slug: string
}

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    image: '',
    stockQuantity: '0',
    inStock: true,
    slug: '',
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }

      // Auto-generate slug from name
      if (name === 'name') {
        updated.slug = generateSlug(value)
      }

      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.image) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      // Validate price
      const price = parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        setError('Price must be a positive number')
        setLoading(false)
        return
      }

      // Validate original price if provided
      let originalPrice: number | undefined
      if (formData.originalPrice) {
        originalPrice = parseFloat(formData.originalPrice)
        if (isNaN(originalPrice) || originalPrice <= 0) {
          setError('Original price must be a positive number')
          setLoading(false)
          return
        }
        if (originalPrice <= price) {
          setError('Original price must be greater than current price')
          setLoading(false)
          return
        }
      }

      // Validate stock quantity
      const stockQuantity = parseInt(formData.stockQuantity)
      if (isNaN(stockQuantity) || stockQuantity < 0) {
        setError('Stock quantity must be a non-negative number')
        setLoading(false)
        return
      }

      // Validate slug
      if (!formData.slug) {
        setError('Slug is required')
        setLoading(false)
        return
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price,
        originalPrice: originalPrice || undefined,
        category: formData.category.trim(),
        image: formData.image.trim(),
        stockQuantity,
        inStock: formData.inStock,
        slug: formData.slug.trim(),
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create product')
      }

      // Redirect to products list
      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the product')
      console.error('Error creating product:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create a new product for your store
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Product Information
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Product Name */}
            <div>
              <Input
                label="Product Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Premium Wireless Headphones"
                required
                disabled={loading}
              />
            </div>

            {/* Slug */}
            <div>
              <Input
                label="Slug *"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g., premium-wireless-headphones"
                required
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                URL-friendly identifier (auto-generated from name)
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description (minimum 10 characters)"
                required
                disabled={loading}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
              />
            </div>

            {/* Category and Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Category *"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Electronics"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Input
                  label="Price (USD) *"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Original Price */}
            <div>
              <Input
                label="Original Price (USD)"
                name="originalPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="0.00 (optional, for discounts)"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Leave empty if not on sale
              </p>
            </div>

            {/* Image URL */}
            <div>
              <Input
                label="Image URL *"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                required
                disabled={loading}
              />
            </div>

            {/* Stock Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Stock Quantity *"
                  name="stockQuantity"
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stock Status
                </label>
                <div className="flex items-center gap-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">
                      In Stock
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={loading}
                disabled={loading}
              >
                Create Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
