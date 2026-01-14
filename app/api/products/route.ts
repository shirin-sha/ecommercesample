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

export async function POST(request: Request) {
  try {
    await connectDB()

    const body = await request.json()
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      image,
      images,
      stockQuantity,
      inStock,
      slug,
      rating,
      reviews,
      tags,
    } = body

    // Validate required fields
    if (!name || !description || !price || !category || !image || slug === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug })
    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      )
    }

    // Create new product
    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      category: category.trim(),
      image: image.trim(),
      images: images || [],
      stockQuantity: parseInt(stockQuantity) || 0,
      inStock: inStock !== undefined ? inStock : true,
      slug: slug.trim().toLowerCase(),
      rating: rating ? parseFloat(rating) : undefined,
      reviews: reviews ? parseInt(reviews) : undefined,
      tags: tags || [],
    })

    await product.save()

    // Convert MongoDB _id to id
    const formattedProduct = {
      ...product.toObject(),
      id: product._id.toString(),
      _id: undefined,
    }

    return NextResponse.json(
      { product: formattedProduct, message: 'Product created successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating product:', error)
    
    // Handle duplicate key error (slug)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      )
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

