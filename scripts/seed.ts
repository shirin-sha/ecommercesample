import mongoose from 'mongoose'
import Product from '../lib/db/models/Product'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set!')
  console.error('Please create a .env.local file with your MongoDB connection string.')
  process.exit(1)
}

const seedProducts = [
  {
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

async function seed() {
  try {
    console.log('🌱 Starting database seed...')
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined')
    }
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing products
    await Product.deleteMany({})
    console.log('🗑️  Cleared existing products')

    // Insert seed data
    const insertedProducts = await Product.insertMany(seedProducts)
    console.log(`✅ Inserted ${insertedProducts.length} products`)

    console.log('\n📦 Sample products:')
    insertedProducts.slice(0, 3).forEach((product) => {
      console.log(`  - ${product.name} ($${product.price})`)
    })

    console.log('\n✨ Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seed()


