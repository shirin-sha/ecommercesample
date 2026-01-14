'use client'

import { useState, useMemo } from 'react'
import ProductCard from '@/components/features/ProductCard'
import { useProducts } from '@/lib/hooks/useProducts'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Search, Filter, X } from 'lucide-react'
import type { ProductFilters } from '@/lib/types'

export default function ProductsClientPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [sortBy, setSortBy] = useState<ProductFilters['sortBy']>('price-asc')
  const [showFilters, setShowFilters] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)

  // Build filters object
  const filters: ProductFilters = useMemo(() => ({
    search: searchQuery || undefined,
    category: selectedCategory,
    sortBy,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    inStockOnly,
  }), [searchQuery, selectedCategory, sortBy, minPrice, maxPrice, inStockOnly])

  const { products, categories, loading, error } = useProducts(filters)

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategory(undefined)
    setMinPrice('')
    setMaxPrice('')
    setInStockOnly(false)
    setSortBy('price-asc')
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
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


