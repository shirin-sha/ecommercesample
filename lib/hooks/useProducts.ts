'use client'

import { useState, useEffect } from 'react'
import { fetchProducts, fetchProduct, fetchCategories } from '@/lib/api/products'
import type { Product, ProductFilters } from '@/lib/types'

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProducts(filters)
        setProducts(data.products)
        setCategories(data.categories)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [filters?.category, filters?.search, filters?.sortBy, filters?.minPrice, filters?.maxPrice, filters?.inStockOnly])

  return { products, categories, loading, error, refetch: () => fetchProducts(filters).then(data => {
    setProducts(data.products)
    setCategories(data.categories)
  }) }
}

export function useProduct(idOrSlug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProduct(idOrSlug)
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (idOrSlug) {
      loadProduct()
    }
  }, [idOrSlug])

  return { product, loading, error }
}

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchCategories()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  return { categories, loading, error }
}
