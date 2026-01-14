import type { Metadata } from 'next'
import './globals.css'
import CartButton from '@/components/features/CartButton'
import Link from 'next/link'
import { Store } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ShopHub - Premium Online Shopping',
  description: 'Discover quality products with fast shipping and great prices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
                <Store className="w-6 h-6 text-blue-600" />
                <span>ShopHub</span>
              </Link>
              
              <div className="flex items-center space-x-6">
                <Link
                  href="/products"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                >
                  Products
                </Link>
                <CartButton />
              </div>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="w-full border-t border-gray-200 dark:border-gray-800 mt-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-3">ShopHub</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your trusted online shopping destination for quality products.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/products" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Products</Link></li>
                  <li><Link href="/cart" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Cart</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Contact</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email: support@shophub.com<br />
                  Phone: (555) 123-4567
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>&copy; {new Date().getFullYear()} ShopHub. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

