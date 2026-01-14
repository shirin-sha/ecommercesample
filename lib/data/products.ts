import type { Product } from '@/lib/types'

// Mock product data - In production, this would come from a database
export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop'
    ],
    inStock: true,
    stockQuantity: 45,
    rating: 4.5,
    reviews: 128,
    tags: ['wireless', 'audio', 'premium'],
    slug: 'premium-wireless-headphones',
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking, heart rate monitoring, and seamless smartphone integration.',
    price: 449.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
    inStock: true,
    stockQuantity: 32,
    rating: 4.7,
    reviews: 89,
    tags: ['smartwatch', 'fitness', 'tech'],
    slug: 'smart-watch-pro',
  },
  {
    id: '3',
    name: 'Designer Backpack',
    description: 'Stylish and functional backpack with laptop compartment and water-resistant material.',
    price: 89.99,
    originalPrice: 129.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
    inStock: true,
    stockQuantity: 67,
    rating: 4.3,
    reviews: 45,
    tags: ['backpack', 'fashion', 'travel'],
    slug: 'designer-backpack',
  },
  {
    id: '4',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable, sustainable t-shirt made from 100% organic cotton. Available in multiple colors.',
    price: 29.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
    inStock: true,
    stockQuantity: 150,
    rating: 4.6,
    reviews: 234,
    tags: ['organic', 'clothing', 'sustainable'],
    slug: 'organic-cotton-tshirt',
  },
  {
    id: '5',
    name: 'Professional Camera',
    description: '24MP mirrorless camera with 4K video recording and interchangeable lenses.',
    price: 1299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop',
    inStock: true,
    stockQuantity: 12,
    rating: 4.9,
    reviews: 67,
    tags: ['camera', 'photography', 'professional'],
    slug: 'professional-camera',
  },
  {
    id: '6',
    name: 'Minimalist Sneakers',
    description: 'Clean design, premium materials, and all-day comfort. Perfect for casual wear.',
    price: 119.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
    inStock: true,
    stockQuantity: 88,
    rating: 4.4,
    reviews: 156,
    tags: ['sneakers', 'shoes', 'minimalist'],
    slug: 'minimalist-sneakers',
  },
  {
    id: '7',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 360° sound and 12-hour battery life.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
    inStock: true,
    stockQuantity: 94,
    rating: 4.2,
    reviews: 78,
    tags: ['speaker', 'bluetooth', 'portable'],
    slug: 'portable-bluetooth-speaker',
  },
  {
    id: '8',
    name: 'Leather Wallet',
    description: 'Handcrafted genuine leather wallet with RFID protection and minimalist design.',
    price: 49.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop',
    inStock: true,
    stockQuantity: 120,
    rating: 4.5,
    reviews: 92,
    tags: ['wallet', 'leather', 'accessories'],
    slug: 'leather-wallet',
  },
]

// Helper functions for data fetching
export function getAllProducts(): Product[] {
  return products
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category)
}

export function getCategories(): string[] {
  return Array.from(new Set(products.map((product) => product.category)))
}



