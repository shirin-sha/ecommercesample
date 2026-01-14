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

