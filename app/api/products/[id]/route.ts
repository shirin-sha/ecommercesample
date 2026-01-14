import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Product from '@/lib/db/models/Product'
import mongoose from 'mongoose'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    // Check if id is a valid MongoDB ObjectId or search by slug
    let product
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean()
    } else {
      product = await Product.findOne({ slug: id }).lean()
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Format product
    const formattedProduct = {
      ...product,
      id: product._id.toString(),
      _id: undefined,
    }

    return NextResponse.json({ product: formattedProduct })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Find product by ID
    let product
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id)
    } else {
      product = await Product.findOne({ slug: id })
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if slug is being changed and if new slug already exists
    if (slug && slug !== product.slug) {
      const existingProduct = await Product.findOne({ slug })
      if (existingProduct && existingProduct._id.toString() !== id) {
        return NextResponse.json(
          { error: 'A product with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Update product fields
    if (name !== undefined) product.name = name.trim()
    if (description !== undefined) product.description = description.trim()
    if (price !== undefined) product.price = parseFloat(price)
    if (originalPrice !== undefined) {
      product.originalPrice = originalPrice ? parseFloat(originalPrice) : undefined
    }
    if (category !== undefined) product.category = category.trim()
    if (image !== undefined) product.image = image.trim()
    if (images !== undefined) product.images = images
    if (stockQuantity !== undefined) product.stockQuantity = parseInt(stockQuantity) || 0
    if (inStock !== undefined) product.inStock = inStock
    if (slug !== undefined) product.slug = slug.trim().toLowerCase()
    if (rating !== undefined) product.rating = rating ? parseFloat(rating) : undefined
    if (reviews !== undefined) product.reviews = reviews ? parseInt(reviews) : undefined
    if (tags !== undefined) product.tags = tags

    await product.save()

    // Format product
    const formattedProduct = {
      ...product.toObject(),
      id: product._id.toString(),
      _id: undefined,
    }

    return NextResponse.json({
      product: formattedProduct,
      message: 'Product updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating product:', error)

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
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    // Find and delete product by ID
    let product
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findByIdAndDelete(id)
    } else {
      product = await Product.findOneAndDelete({ slug: id })
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Product deleted successfully',
      id: product._id.toString(),
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

