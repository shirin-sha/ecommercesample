import { z } from 'zod'

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive().optional(),
  category: z.string().min(1, 'Category is required'),
  image: z.string().url('Must be a valid image URL'),
  images: z.array(z.string().url()).optional(),
  inStock: z.boolean(),
  stockQuantity: z.number().int().nonnegative(),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().int().nonnegative().optional(),
  tags: z.array(z.string()).optional(),
  slug: z.string().min(1),
})

export const cartItemSchema = z.object({
  product: productSchema,
  quantity: z.number().int().positive(),
})

export type ProductInput = z.infer<typeof productSchema>
export type CartItemInput = z.infer<typeof cartItemSchema>



