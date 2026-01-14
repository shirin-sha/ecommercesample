import mongoose, { Schema, Model, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  images?: string[]
  inStock: boolean
  stockQuantity: number
  rating?: number
  reviews?: number
  tags?: string[]
  slug: string
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock quantity cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviews: {
      type: Number,
      min: [0, 'Reviews count cannot be negative'],
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes for better query performance
// Note: slug index is already created by unique: true, so we don't need to add it again
productSchema.index({ category: 1 })
productSchema.index({ price: 1 })
productSchema.index({ inStock: 1 })

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema)

export default Product

