import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Star, ShoppingCart, Package, Truck, Shield } from 'lucide-react'
import { getProductBySlug, getAllProducts } from '@/lib/db/services/productService'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import AddToCartButton from '@/components/features/AddToCartButton'

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: `${product.name} - ShopHub`,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {hasDiscount && (
              <div className="absolute top-4 right-4">
                <Badge variant="danger" className="text-base px-3 py-1">
                  {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <Badge variant="info">{product.category}</Badge>
          </div>

          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          {product.rating && (
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">{product.rating}</span>
              {product.reviews && (
                <span className="text-gray-600 dark:text-gray-400">
                  ({product.reviews} reviews)
                </span>
              )}
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold">${product.price}</span>
              {hasDiscount && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {product.inStock ? (
              <Badge variant="success">In Stock ({product.stockQuantity} available)</Badge>
            ) : (
              <Badge variant="danger">Out of Stock</Badge>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mb-8">
            <AddToCartButton product={product} />
          </div>

          {/* Features */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <h2 className="text-lg font-semibold mb-4">Why Buy From Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-sm">Free Shipping</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-medium text-sm">Secure Payment</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">100% protected</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-medium text-sm">Easy Returns</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">30-day guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

