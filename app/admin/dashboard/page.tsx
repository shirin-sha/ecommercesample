'use client'

import { useAuthStore } from '@/lib/store/auth-store'
import Card from '@/components/ui/Card'
import { CardContent, CardHeader } from '@/components/ui/Card'
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminDashboardPage() {
  const { user } = useAuthStore()

  // Mock data - in production, fetch from API
  const stats = [
    {
      name: 'Total Products',
      value: '8',
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      name: 'Total Orders',
      value: '24',
      change: '+8%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      name: 'Total Customers',
      value: '156',
      change: '+23%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      name: 'Revenue',
      value: '$12,450',
      change: '-2%',
      trend: 'down',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.name || 'Admin'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown

          return (
            <Card key={stat.name} hover>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendIcon
                        className={cn(
                          'w-4 h-4',
                          stat.trend === 'up'
                            ? 'text-green-600'
                            : 'text-red-600'
                        )}
                      />
                      <span
                        className={cn(
                          'text-sm font-medium',
                          stat.trend === 'up'
                            ? 'text-green-600'
                            : 'text-red-600'
                        )}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500">vs last month</span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      stat.bgColor
                    )}
                  >
                    <Icon className={cn('w-6 h-6', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Order #{1000 + i}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Customer Name • {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${(Math.random() * 500 + 50).toFixed(2)}
                    </p>
                    <span className="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Top Products
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                'Premium Wireless Headphones',
                'Smart Watch Pro',
                'Designer Backpack',
                'Professional Camera',
                'Minimalist Sneakers',
              ].map((product, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.floor(Math.random() * 50 + 10)} sales
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${(Math.random() * 500 + 50).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

