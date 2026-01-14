import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Product from '@/lib/db/models/Product'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const sortBy = searchParams.get('sortBy')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const inStockOnly = searchParams.get('inStockOnly') === 'true'

  try {
    await connectDB()

    // Build query
    let query: any = {}
    
    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ]
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice)
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice)
      }
    }

    // Stock filter
    if (inStockOnly) {
      query.inStock = true
      query.stockQuantity = { $gt: 0 }
    }

    // Build sort
    let sort: any = {}
    switch (sortBy) {
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

    const products = await Product.find(query).sort(sort).lean()
    const categories = await Product.distinct('category')

    // Convert MongoDB _id to id
    const formattedProducts = products.map((product: any) => ({
      ...product,
      id: product._id.toString(),
      _id: undefined,
    }))

    return NextResponse.json({
      products: formattedProducts,
      categories,
      count: formattedProducts.length,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

