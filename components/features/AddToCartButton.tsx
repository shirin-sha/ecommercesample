'use client'

import { useState } from 'react'
import { ShoppingCart, Minus, Plus } from 'lucide-react'
import type { Product } from '@/lib/types'
import Button from '@/components/ui/Button'
import { useCartStore } from '@/lib/store/cart-store'

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const increment = () => {
    if (quantity < product.stockQuantity) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
          <button
            onClick={decrement}
            disabled={quantity <= 1}
            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-6 py-2 font-semibold border-x border-gray-300 dark:border-gray-600">
            {quantity}
          </span>
          <button
            onClick={increment}
            disabled={quantity >= product.stockQuantity}
            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {product.stockQuantity} available
        </span>
      </div>

      <Button
        size="lg"
        onClick={handleAddToCart}
        disabled={!product.inStock}
        className="w-full gap-2"
      >
        <ShoppingCart className="w-5 h-5" />
        {added ? 'Added to Cart!' : 'Add to Cart'}
      </Button>
    </div>
  )
}



