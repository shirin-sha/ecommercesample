'use client'

import { useState, useMemo, useTransition, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProductCard from '@/components/features/ProductCard'
import { fetchProducts } from '@/lib/api/products'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Search, Filter, X } from 'lucide-react'
import type { ProductFilters, Product } from '@/lib/types'

interface ProductsClientPageProps {
  initialProducts: Product[]
  initialCategories: string[]
}

export default function ProductsClientPage({ 
  initialProducts, 
  initialCategories 
}: ProductsClientPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  // Initialize state from URL params or defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    searchParams.get('category') || undefined
  )
  const [sortBy, setSortBy] = useState<ProductFilters['sortBy']>(
    (searchParams.get('sortBy') as ProductFilters['sortBy']) || 'price-asc'
  )
  const [showFilters, setShowFilters] = useState(false)
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [inStockOnly, setInStockOnly] = useState(
    searchParams.get('inStockOnly') === 'true'
  )

  // Use initial data, update when filters change
  const [products, setProducts] = useState(initialProducts)
  const [categories] = useState(initialCategories)
  const [error, setError] = useState<string | null>(null)

  // Build filters object
  const filters: ProductFilters = useMemo(() => ({
    search: searchQuery || undefined,
    category: selectedCategory,
    sortBy,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    inStockOnly,
  }), [searchQuery, selectedCategory, sortBy, minPrice, maxPrice, inStockOnly])

  // Update URL and fetch when filters change
  const updateFilters = useRef(async (newFilters: ProductFilters) => {
    const params = new URLSearchParams()
    if (newFilters.category) params.set('category', newFilters.category)
    if (newFilters.search) params.set('search', newFilters.search)
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy)
    if (newFilters.minPrice !== undefined) params.set('minPrice', newFilters.minPrice.toString())
    if (newFilters.maxPrice !== undefined) params.set('maxPrice', newFilters.maxPrice.toString())
    if (newFilters.inStockOnly) params.set('inStockOnly', 'true')

    startTransition(() => {
      router.push(`/products?${params.toString()}`, { scroll: false })
    })

    try {
      setError(null)
      const data = await fetchProducts(newFilters)
      setProducts(data.products)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    }
  })

  // Track if this is the initial mount
  const isInitialMount = useRef(true)

  // Update products when filters change (debounced for search)
  useEffect(() => {
    // Skip on initial mount since we already have initial data
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const timeoutId = setTimeout(() => {
      updateFilters.current(filters)
    }, searchQuery ? 300 : 0) // Debounce only for search, immediate for other filters

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, sortBy, minPrice, maxPrice, inStockOnly])

  const loading = isPending

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategory(undefined)
    setMinPrice('')
    setMaxPrice('')
    setInStockOnly(false)
    setSortBy('price-asc')
    router.push('/products', { scroll: false })
    updateFilters.current({
      sortBy: 'price-asc',
    })
  }

  const hasActiveFilters = selectedCategory || searchQuery || minPrice || maxPrice || inStockOnly

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Products</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {loading ? 'Loading products...' : `Discover our collection of ${products.length} premium products`}
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Min Price</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Price</label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">In Stock Only</span>
                </label>
              </div>
            </div>

            {/* Sort */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as ProductFilters['sortBy'])}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name A-Z</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters} className="gap-2">
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={!selectedCategory ? 'default' : 'info'}
            className={`cursor-pointer transition-colors ${
              !selectedCategory ? 'bg-blue-600 text-white' : ''
            }`}
            onClick={() => setSelectedCategory(undefined)}
          >
            All Products ({products.length})
          </Badge>
          {categories.map((category) => {
            const count = products.filter(p => p.category === category).length
            return (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'info'}
                className={`cursor-pointer transition-colors ${
                  selectedCategory === category ? 'bg-blue-600 text-white' : ''
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category} ({count})
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Loading State - Show skeleton while loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-full flex flex-col border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="p-4 flex-1 flex flex-col gap-3">
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your filters or search query
          </p>
          {hasActiveFilters && (
            <Button onClick={handleClearFilters}>Clear Filters</Button>
          )}
        </div>
      )}
    </div>
  )
}


