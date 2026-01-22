import { Suspense } from 'react'
import ProductsClientPage from './client/page'
import { getProductsWithFilters } from '@/lib/db/services/productService'
import type { ProductFilters } from '@/lib/types'

export const metadata = {
  title: 'Products - ShopHub',
  description: 'Browse our collection of quality products',
}

// Revalidate every 5 minutes for base products, 1 minute for filtered
export const revalidate = 300

interface ProductsPageProps {
  searchParams: {
    category?: string
    search?: string
    sortBy?: string
    minPrice?: string
    maxPrice?: string
    inStockOnly?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Parse filters from URL search params
  const filters: ProductFilters = {
    category: searchParams.category,
    search: searchParams.search,
    sortBy: searchParams.sortBy as ProductFilters['sortBy'],
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    inStockOnly: searchParams.inStockOnly === 'true',
  }

  // Fetch initial data on the server for faster load
  const { products, categories } = await getProductsWithFilters(filters)

  return (
    <Suspense fallback={<ProductsLoadingSkeleton />}>
      <ProductsClientPage initialProducts={products} initialCategories={categories} />
    </Suspense>
  )
}

// Loading skeleton component
function ProductsLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
        <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="mb-6">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Categories Skeleton */}
      <div className="mb-8">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-full flex flex-col border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="p-4 flex-1 flex flex-col gap-3">
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="flex items-center justify-between mt-auto">
                <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
