import connectDB from '@/lib/db/mongodb'
import Product, { IProduct } from '@/lib/db/models/Product'
import type { Product as ProductType } from '@/lib/types'

/**
 * Convert MongoDB product to app Product type
 */
function formatProduct(product: any): ProductType {
  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice,
    category: product.category,
    image: product.image,
    images: product.images || [],
    inStock: product.inStock,
    stockQuantity: product.stockQuantity,
    rating: product.rating,
    reviews: product.reviews,
    tags: product.tags || [],
    slug: product.slug,
  }
}

/**
 * Get all products
 */
export async function getAllProducts(): Promise<ProductType[]> {
  try {
    await connectDB()
    const products = await Product.find({}).sort({ createdAt: -1 }).lean()
    return products.map(formatProduct)
  } catch (error) {
    console.error('Error fetching all products:', error)
    return []
  }
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<ProductType | null> {
  try {
    await connectDB()
    const product = await Product.findById(id).lean()
    return product ? formatProduct(product) : null
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    return null
  }
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<ProductType | null> {
  try {
    await connectDB()
    const product = await Product.findOne({ slug }).lean()
    return product ? formatProduct(product) : null
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return null
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<ProductType[]> {
  try {
    await connectDB()
    const products = await Product.find({ category }).sort({ createdAt: -1 }).lean()
    return products.map(formatProduct)
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<string[]> {
  try {
    await connectDB()
    const categories = await Product.distinct('category')
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<ProductType[]> {
  try {
    await connectDB()
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    }).lean()
    return products.map(formatProduct)
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}

/**
 * Get products with filters (server-side)
 */
export async function getProductsWithFilters(filters?: {
  category?: string
  search?: string
  sortBy?: string
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
}): Promise<{ products: ProductType[]; categories: string[] }> {
  try {
    await connectDB()

    // Build query
    let query: any = {}
    
    if (filters?.category) {
      query.category = filters.category
    }

    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { tags: { $in: [new RegExp(filters.search, 'i')] } },
      ]
    }

    // Price range filter
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      query.price = {}
      if (filters?.minPrice !== undefined) {
        query.price.$gte = filters.minPrice
      }
      if (filters?.maxPrice !== undefined) {
        query.price.$lte = filters.maxPrice
      }
    }

    // Stock filter
    if (filters?.inStockOnly) {
      query.inStock = true
      query.stockQuantity = { $gt: 0 }
    }

    // Build sort
    let sort: any = {}
    switch (filters?.sortBy) {
      case 'price-asc':
        sort = { price: 1 }
        break
      case 'price-desc':
        sort = { price: -1 }
        break
      case 'name':
        sort = { name: 1 }
        break
      case 'rating':
        sort = { rating: -1 }
        break
      default:
        sort = { createdAt: -1 }
    }

    // Parse pagination
    const page = 1 // Server-side default
    const limit = 24 // Default 24 products per page
    const skip = 0

    // Optimize query: only fetch needed fields
    // Fetch products, count, and categories in parallel for better performance
    const [products, totalCount, categories] = await Promise.all([
      Product.find(query)
        .select('name description price originalPrice category image images inStock stockQuantity rating reviews tags slug createdAt')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Product.countDocuments(query).exec(),
      Product.distinct('category').exec()
    ])

    return {
      products: products.map(formatProduct),
      categories,
      totalCount,
    }
  } catch (error) {
    console.error('Error fetching products with filters:', error)
    return { products: [], categories: [] }
  }
}



