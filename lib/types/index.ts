// Core Product Types
export interface Product {
  id: string
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
}

// Cart Types
export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// Order Types
export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
  customerEmail: string
  shippingAddress: Address
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

// Filter Types
export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  search?: string
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'rating'
}



