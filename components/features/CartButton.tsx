'use client'

import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart-store'
import Button from '@/components/ui/Button'
import { useHydrated } from '@/lib/hooks/useHydrated'

export default function CartButton() {
  const hydrated = useHydrated()
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <Link href="/cart">
      <Button variant="outline" size="md" className="relative">
        <ShoppingCart className="w-5 h-5" />
        {hydrated && itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
        <span className="ml-2 hidden sm:inline">Cart</span>
      </Button>
    </Link>
  )
}

