import type { Metadata } from 'next'
import './globals.css'
import CustomerLayout from '@/components/CustomerLayout'

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
        <CustomerLayout>{children}</CustomerLayout>
      </body>
    </html>
  )
}

