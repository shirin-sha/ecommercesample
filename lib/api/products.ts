import type { Product, ProductFilters } from '@/lib/types'

export interface ProductsResponse {
  products: Product[]
  categories: string[]
  count: number
}

export interface ProductResponse {
  product: Product
}

/**
 * Fetch all products with optional filters
 */
export async function fetchProducts(
  filters?: ProductFilters
): Promise<ProductsResponse> {
  const params = new URLSearchParams()

  if (filters?.category) {
    params.append('category', filters.category)
  }
  if (filters?.search) {
    params.append('search', filters.search)
  }
  if (filters?.sortBy) {
    params.append('sortBy', filters.sortBy)
  }
  if (filters?.minPrice !== undefined) {
    params.append('minPrice', filters.minPrice.toString())
  }
  if (filters?.maxPrice !== undefined) {
    params.append('maxPrice', filters.maxPrice.toString())
  }
  if (filters?.inStockOnly) {
    params.append('inStockOnly', 'true')
  }

  const queryString = params.toString()
  const url = `/api/products${queryString ? `?${queryString}` : ''}`

  const response = await fetch(url, {
    cache: 'no-store', // Always fetch fresh data
  })

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  return response.json()
}

/**
 * Fetch a single product by ID or slug
 */
export async function fetchProduct(idOrSlug: string): Promise<Product> {
  const response = await fetch(`/api/products/${idOrSlug}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found')
    }
    throw new Error('Failed to fetch product')
  }

  const data: ProductResponse = await response.json()
  return data.product
}

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<string[]> {
  const response = await fetch('/api/products', {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }

  const data: ProductsResponse = await response.json()
  return data.categories || []
}


